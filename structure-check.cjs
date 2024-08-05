const fs = require('fs');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fsPromises = fs.promises;
const path = require('path');

const { readdir, stat } = fsPromises;
const readFileSync = fs.readFileSync;

// Recursive function to find files that match the given pattern
async function findFilesRecursive(dir, pattern, fileList = []) {
  const files = await readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const fileStat = await stat(fullPath);

    if (fileStat.isDirectory()) {
      await findFilesRecursive(fullPath, pattern, fileList); // recurse into subdirectories
    } else if (pattern.test(file)) {
      fileList.push(fullPath); // add to list if file matches pattern
    }
  }

  return fileList;
}

const projectPath = 'src';
const filePattern = /\.(ts|tsx)$/; // Use a regex pattern for matching file extensions

async function checkProjectStructure() {
  try {
    console.log('Recherche des fichiers .ts et .tsx dans le projet...');
    
    const files = await findFilesRecursive(projectPath, filePattern);

    if (files.length === 0) {
      console.log(`Aucun fichier correspondant trouvé avec le motif "${filePattern}".`);
    } else {
      console.log(`Fichiers trouvés pour la vérification de structure:`, files);
      for (const filePath of files) {
        await checkFile(filePath); // assuming checkFile could potentially be async
      }
    }
  } catch (err) {
    console.error('Erreur lors de la recherche de fichiers:', err);
  }

  console.log('Vérification de la structure du projet React terminée.');
}

function reportError(node, message, filePath) {
  const location = node.loc.start;
  // Adjust the format to suit your editor if necessary; the following should work for VSCode and compatible terminals:
  console.error(`Error in ${filePath}:${location.line}:${location.column} - ${message}`);
}

function parseFile(content) {
  return parse(content, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'typescript',
      'classProperties',
      'decorators-legacy',
      'dynamicImport',
    ],
  });
}

function createStateTracker() {
  return {
    hasImports: false,
    hasGlobalConstants: false,
    hasHelperFunctions: false,
    hasCustomHooks: false,
    hasConstants: false,
    hasTypes: false,
    hasInterfaces: false,
    hasEnums: false,
    hasReactComponent: false,
    insideReactComponent: false,
    hasPropTypes: false,
    hasDefaultProps: false,
    hasReturnInSameComponent: false,
    hasExports: false,
    hasMainComponent: false,
    mainComponentPath: null,
  };
}

function isReactComponent(path) {
  let isComponent = false;
  let isMainComponent = false;
  let componentName = "";
  
  // Check for function declarations and variable declarations
  if (path.isFunctionDeclaration() || path.isVariableDeclaration()) {
    let name;
    let typeAnnotation;

    if (path.isFunctionDeclaration()) {
      name = path.get('id').node.name;
      typeAnnotation = path.get('returnType').node;
    } else if (path.isVariableDeclaration()) {
      const declarator = path.get('declarations')[0];
      if (declarator.isVariableDeclarator()) {
        const id = declarator.get('id');
        if (id.isIdentifier()) {
          name = id.node.name;
          typeAnnotation = id.getTypeAnnotation().typeAnnotation;
        }
      }
    }

    // Check if the name starts with a capital letter and if there's a React.FC type annotation
    if (name && /^[A-Z]/.test(name) && typeAnnotation) {
      const typeName = typeAnnotation.typeName || typeAnnotation.id;
      if (
        typeName &&
        (typeName.name === 'FC' || typeName.name === 'FunctionComponent')
      ) {
        isComponent = true;
        componentName = name;
      }
    }
  }

  // Check for proceeding comments that indicate a main component
  if (isComponent) {
    const leadingComments = path.node.leadingComments;
    isMainComponent = leadingComments && leadingComments.some(
      comment => comment.type === "CommentLine" && comment.value.includes("main component")
    );
  }

  return {
    isComponent,
    isMainComponent,
    path: isComponent ? path : null,
    componentName
  };
}

function isCustomHook(name) {
  return /^use[A-Z]/.test(name);
}

function isFunctionExpression(node) {
  return node.type === 'FunctionExpression';
}

function isArrowFunctionExpression(node) {
  return node.type === 'ArrowFunctionExpression';
}

// For reconising the main by export at the end of the file
function isFunctionExportedWithName(path, functionName) {
  // Get the ExportNamedDeclaration paths that are siblings of the function declaration
  const exportPaths = path.container.filter(p => (p.type === 'ExportNamedDeclaration'));

  // Check if any of the exports contain the function name
  return exportPaths.some(exportPath => {
    // If the export has a specifiers property, it's a named export and may look like:
    // export { myFunction };
    // export { myFunction as differentName };
    if (exportPath.specifiers) {
      return exportPath.specifiers.some(specifier => {
        const exportedName = specifier.exported.name;
        const localName = specifier.local.name;
        return exportedName === functionName || localName === functionName;
      });
    }

    // If the export has a declaration property, it's a direct export which may look like:
    // export function myFunction() {}
    if (exportPath.declaration) {
      if (exportPath.declaration.id) {
        return exportPath.declaration.id.name === functionName;
      }
      // Check if it's a variable being exported directly 
      // (though this case should be covered by the outer function's logic)
      if (exportPath.declaration.declarations) {
        return exportPath.declaration.declarations.some(declaration => {
          return declaration.id.name === functionName;
        });
      }
    }
    
    return false;
  });
}

function isInFunctionScope(path) {
  // Check if path is inside a function by finding its parent function, if any
  const functionParent = path.findParent(p =>
    p.isFunctionDeclaration() || p.isFunctionExpression() || p.isArrowFunctionExpression()
  );
  return Boolean(functionParent);
}

// TODO: make it work
function isMainComponentByExport(path) {
  if (path.isFunctionDeclaration()) {
    // Directly exported function declarations like: `export default function MyComponent() {}`
    return true;
  } else if (path.isFunctionExpression() || path.isArrowFunctionExpression()) {
    // Arrow functions or function expressions could be variable declarators
    if (path.parentPath.isVariableDeclarator()) {
      // Here we should ensure that the declarator has an identifier
      const declarator = path.parentPath.node;
      if (declarator.id && declarator.id.name) {
        // We check if variable declarators are directly exported
        const parentExport = path.parentPath.parentPath.parentPath;
        if (isExportDeclarationWithName(parentExport, declarator.id.name)) {
          return true;  // This confirms the export contains the function
        }
      }
    }
  }
  return false;
}

// Is working as expected
function generateErrorMessage(description, state, filePath) {
  const messages = [];

  if (state.hasConstants) messages.push("global constants");
  if (state.hasTypes) messages.push("type aliases");
  if (state.hasInterfaces) messages.push("interfaces");
  if (state.hasEnums) messages.push("enums");
  if (state.hasHelperFunctions) messages.push("helper functions");
  if (state.hasCustomHooks) messages.push("custom hooks");
  if (state.hasReactComponent) messages.push("React component declarations");
  if (state.hasExports) messages.push("export statements");
  if (state.hasPropTypes) messages.push("PropTypes");
  if (state.hasDefaultProps) messages.push("default props");

  if (messages.length > 0) {
    const reasonString = messages.join(", ");
    return `${description} declarations should come before ${reasonString}.`;
  }

  return "";
}

// is Working as expected
function handleImportDeclaration(path, state, filePath) {
  console.log('Import statement detected:', path.node.type); 
  // Check for anything that should come after the imports
  if (state.hasConstants || state.hasTypes || state.hasInterfaces || state.hasEnums ||
      state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent ||
      state.hasExports || state.hasPropTypes || state.hasDefaultProps) {
      
    // Use the generateErrorMessage function to construct the error message
    const errorMessage = generateErrorMessage("imports",state, filePath);
    if (errorMessage) {
      reportError(path.node, errorMessage);
    }
  }
  state.hasImports = true;
}

// Not working as now
function handleGlobalConstanteDeclaration(path, state, filePath) {
  console.log('Global constant declaration detected:', path.node.type);
  // Check if certain conditions are met to set hasGlobalConstants state property
  if (state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent || state.hasEnums || state.hasTypes || state.hasInterfaces || state.hasExports) {
    const errorMessage = generateErrorMessage("Global constante", state, filePath);
    if (errorMessage) {
      reportError(path.node, errorMessage);
    }
  } else {
    if (path.scope.path.type === 'Program') {
      state.hasGlobalConstants = true;
    }
  }
}
//TODO: TEST
function handleTSEnumDeclaration(path, state, filePath) {
  console.log('Enum declaration detected:', path.node.type);
  if (state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent) {
    const errorMessage = generateErrorMessage("Enums",state, filePath);
    if (errorMessage) {
      reportError(path.node, errorMessage);
    }
  }
  state.hasEnums = true;
}
//TODO: TEST
function handleTSTypeAliasDeclaration(path, state, filePath) {
  console.log('Type alias declaration detected:', path.node.type);
  if (state.hasInterfaces || state.hasEnums || state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent) {
const errorMessage = generateErrorMessage("Type alias",state, filePath);
    if (errorMessage) {
      reportError(path.node, errorMessage);
    }
  } 
  state.hasTypes = true;
}
//TODO: TEST
function handleTSInterfaceDeclaration(path, state, filePath) {
  console.log('Interface declaration detected:', path.node.type);
  if (state.hasEnums || state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent) {
    const errorMessage = generateErrorMessage("Interface",state, filePath);
    if (errorMessage) {
      reportError(path.node, errorMessage);
    }
  }   
  state.hasInterfaces = true;
}
//TODO: is working as expected
function handleCustomHookDeclaration(path, state, filePath) {
  let functionName = "";
  // Check if the function is a custom hook by its naming convention
  if (path.node.type === 'VariableDeclaration') {
    path.node.declarations.forEach(declarator => {
      // Check if the initialization (`init`) is a function expression
      const initializer = declarator.init;
      if (initializer && (initializer.type === 'FunctionExpression' || initializer.type === 'ArrowFunctionExpression')) {
        // Now we have a function, so we can grab the `id` from `declarator`
        functionName = declarator.id.name;
      }
    });
  }
  if (isCustomHook(functionName)) {
    console.log('Custom hook declaration detected:', path.node.type, filePath);
    // Ensure custom hooks are declared in the right order
    if (state.hasHelperFunctions || state.hasReactComponent || state.hasEnums || 
      state.hasTypes || state.hasInterfaces || state.hasReactComponent || 
      state.hasExports || state.hasPropTypes || state.hasDefaultProps || 
      state.hasMainComponent){
      const errorMessage = generateErrorMessage("Custom Hooks",state, filePath);
      if (errorMessage) {
        reportError(path.node, errorMessage);
      }
    } 
    state.hasCustomHooks = true;
  }
}

function handleConstanteDeclaration(path, state, filePath) {
  console.log('Constant declaration detected:', path.node.type);
  // Check if we are inside any function or component
  if (path.scope.path.type !== 'Program') {
    // Constants should be declared after the import statements and any custom hook definitions,
    // and before any hook calls (like useState, useEffect, etc.), handler functions, and before rendering logic and JSX.

    if (state.hasStateHooks || state.hasContextHooks || state.hasEffectHooks || state.hasHandlerFunctions) {
      const errorMessage = generateErrorMessage("Constante", state, filePath);
      if (errorMessage) {
        reportError(path.node, errorMessage);
      }
    }
    state.hasConstants = true;
  }
  // If the variable declaration is not within a function, consider it as a global constant
  else if (path.scope.path.type === 'Program') {
    handleGlobalConstanteDeclaration(path, state, filePath); // Assumes you've defined this function
  }
}

// Rest of your helper functions and script logic...

function handleMainReactComponent(path, state, filePath) {
  console.log('Main React component detected:', path.node.id.name);
  // Check if we're encountering the first React component, which we designate as the main component
  if (!state.hasReactComponent && isReactComponent(path)) {
    state.hasReactComponent = true; // Mark that we've found the React component
    state.hasMainComponent = true; // Mark that this is the main component
    state.mainComponentPath = path;
    enterReactComponent(state);
    

    // TODO: Add traversal logic for the main component
    path.traverse({
      ReturnStatement(innerPath) {
        handleReturnStatement(innerPath, state, filePath); // Only handle the main return statement
      },
      FunctionExpression(innerPath) {
        handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);
      },
      ArrowFunctionExpression(innerPath) {
        handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);
      },
      // Here you can traverse other node types as needed specifically for the main component
      // ...
      exit(innerPath) {
        if (innerPath === path) { // Exit from the main component
          exitReactComponent(state);
        }
      },
    });
  }
  state.hasMainComponent = true;
}


// TODO: Not working (Not implemented)
function handleHelperFunctionDeclaration(path, state, filePath) {
    // Function declarations could be either helper functions, or the main component itself.
    const functionName = path.node.id && path.node.id.name;

    if (!isCustomHook(functionName)) { // It's not a custom hook, could be a helper or component
      if (state.hasReactComponent) {
        // Helper functions must not come after the main React component.
        reportError(path.node, 'Helper functions must be declared before React component.', filePath);
      } else {
        // If we haven't encountered a React component yet, it's allowed
        state.hasHelperFunctions = true;
      }
    }
    if(state.hasConstants || state.hasTypes || state.hasCustomHooks || state.hasReactComponent|| state.hasExports|| state.hasPropTypes|| state.hasDefaultProps) {
      reportError(path.node, 'Helper functions must be declared before React component.', filePath);
    }
  }

// Is working as expected
function handleFunctionTypeDeclarations(path, state, filePath) {
  console.log('Function declaration detected:', path.node.type);
  const componentCheck = isReactComponent(path);
  
  if (componentCheck.isComponent && !state.insideReactComponent) {
    const isDeclaredAsMainComponent = isMainComponentByExport(path, state);

    if (isDeclaredAsMainComponent) {
      if (state.hasMainComponent) {
        // Report an error since we found another declaration considered as "main"
        reportError(path.node, 'Multiple main React component declarations found in a single file.', filePath);
      } else {
        // Mark this function/component as the main one
        state.hasMainComponent = true;
      }
    }
    // Enter the React component's scope
    enterReactComponent(state);

    // Component-specific traversal
    path.traverse({
      ReturnStatement(innerPath) {
        handleReturnStatement(innerPath, state, filePath);
      },
      FunctionExpression(innerPath) {
        handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);
      },
      ArrowFunctionExpression(innerPath) {
        handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);
      },
      // You might have additional handlers based on your specific needs
      // ...
      
      // Exiting the component's scope
      exit(innerPath) {
        if (innerPath === path) {
          performExitChecks(innerPath, state, filePath);
          // Reset component-specific flags
          exitReactComponent(state);
          state.hasHooks = false;
          state.hasHandlers = false;
          state.hasConditionalRender = false;
          state.hasReturn = false;
          state.hasReturnInSameComponent = false;
        }
      },
    });
  }
}


function handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath) {
 console.log('Function expression detected:', innerPath.node.type);
  const functionName = innerPath.node.id && innerPath.node.id.name;
  if (functionName && /^use[A-Z]/.test(functionName)) {
    // Detected a hook
    if (state.hasHandlers || state.hasConditionalRender || state.hasReturn) {
      reportError(innerPath.node, 'Hooks should be defined at the top of the component, before handlers and render logic.', filePath);
    }
    state.hasHooks = true; // Assumes state contains a hasHooks flag
  } else if (functionName && /^handle[A-Z]/.test(functionName)) {
    // Detected a handle function
    if (!state.hasHooks) {
      reportError(innerPath.node, 'Handlers should be defined after hooks.', filePath);
    } else if (state.hasConditionalRender || state.hasReturn) {
      reportError(innerPath.node, 'Handlers should be defined before render logic and return statement.', filePath);
    }
    state.hasHandlers = true; // Assumes state contains a hasHandlers flag
  }
}

function isExportDeclarationWithName(path, componentName) {
  if (path.isExportDefaultDeclaration() && path.has('declaration')) {
    const declaration = path.get('declaration');
    if (declaration.isIdentifier()) {
      return declaration.node.name === componentName;
    }
  } else if (path.isExportNamedDeclaration() && path.has('specifiers')) {
    return path.get('specifiers').some(specifier => {
      // We consider both normal named exports and exports with aliases
      return specifier.get('exported').node.name === componentName || 
             specifier.get('local').node.name === componentName;
    });
  }
  return false;
}

function handleExportDeclarations(path, state, filePath) {
  console.log('Export statement detected:', path.node.type);
  if (state.mainComponentName && isExportDeclarationWithName(path, state.mainComponentName)) {
    console.log(`Main component ${state.mainComponentName} is exported.`);
    state.hasExportedMainComponent = true;
  }
  state.hasExports = true;
}

function setupTraverse(state, filePath) {
  return {
    ImportDeclaration(path) {
      handleImportDeclaration(path, state, filePath);
    },
    VariableDeclaration(path) {
      path.node.declarations.forEach(declarator => {
        // Check if the variable is a function (should cover custom hooks)
        const isFunction = declarator.init && (isFunctionExpression(declarator.init) || isArrowFunctionExpression(declarator.init));
        if (isFunction) {
          const id = declarator.id ?? {};
          const name = id.name || "";
          if (isCustomHook(name)) {
            handleCustomHookDeclaration(path, state, filePath);
            return;  // Exit early since we've identified and handled this as a custom hook
          } else if (state.hasReactComponent && /^[A-Z]/.test(name)) {
            handleHelperFunctionDeclaration(path, state, filePath);
          } else {
            handleGlobalConstanteDeclaration(path, state, filePath);
          }
        } else {
          handleConstanteDeclaration(path, state, filePath);
        }
      });
    },
    TSTypeAliasDeclaration(path) {
      handleTSTypeAliasDeclaration(path, state, filePath);
    },
    TSInterfaceDeclaration(path) {
      handleTSInterfaceDeclaration(path, state, filePath);
    },
    TSEnumDeclaration(path) {
      handleTSEnumDeclaration(path, state, filePath);
    },
    FunctionDeclaration(path) {
      const componentCheck = isReactComponent(path);
      if (componentCheck.isComponent) {
        const isMain = isMainComponentByExport(path, state);
        if (isMain) {
          handleMainReactComponent(path, state, filePath);
          state.mainComponentName = componentCheck.componentName; // Similarly, use state.mainComponentName to keep track
          state.hasMainComponent = true; // Only set this to true if this is the main component
        } else {
          handleFunctionTypeDeclarations(path, state, filePath);
        }
      } else {
        handleHelperFunctionDeclaration(path, state, filePath);
      }
    },
    'ArrowFunctionExpression|FunctionExpression': {
      enter(path) {
        if (path.parentPath.isVariableDeclarator()) {
          const variableDeclarator = path.parentPath.node;
          const id = variableDeclarator.id ?? {};
          const name = id.name || "";
          const componentCheck = isReactComponent(path);

          if (componentCheck.isComponent && /^[A-Z]/.test(name)) {
            const isMain = isMainComponentByExport(path, state);
            if (isMain) {
              handleMainReactComponent(path, state, filePath);
              state.mainComponentName = componentCheck.componentName;
              state.hasMainComponent = true;
            } else {
              handleHelperFunctionDeclaration(path, state, filePath);
            }
          } else if (isCustomHook(name)) {
            handleCustomHookDeclaration(path, state, filePath);
          } else {
            handleHelperFunctionDeclaration(path, state, filePath);
          }
        }
      }
    },
    'ExportNamedDeclaration|ExportDefaultDeclaration'(path) {
      handleExportDeclarations(path, state, filePath);
    },
  };
}
async function checkFile(filePath) {
  console.log(`Reading file: ${filePath}`);
  const content = readFileSync(filePath, 'utf-8');
  const ast = parseFile(content);  
  let state = createStateTracker();

  traverse(ast, setupTraverse(state, filePath));

  console.log(`File ${filePath} checked.`);
  console.log("------------------------------------------------------------")
  console.log('\n');
}

function handleJSXElement(innerPath, state, filePath) {
  if (!state.hasReturn) {
    // This JSXElement appears in the render logic before the return statement
    state.hasConditionalRender = true;
  } else {
    // Error: JSXElement after return statement indicates a structural issue.
    reportError(innerPath.node, 'No additional JSX should be defined after the return statement.', filePath);
  }
}

function handleReturnStatement(innerPath, state, filePath) {
  if (!state.insideReactComponent) return;

  const functionPath = innerPath.findParent(p =>
    p.isFunctionDeclaration() || p.isFunctionExpression() || p.isArrowFunctionExpression()
  );

  if (functionPath && isReactComponent(functionPath) && !functionPath.findParent(p => p.isFunction())) {
    // Check if we're in the main component or a nested one
    const isMainComponent = state.hasReactComponent && functionPath === state.mainComponentPath;

    if (isMainComponent) {
        // Handling return for the main component
        if (state.hasReturn) {
            reportError(innerPath.node, 'Multiple return statements detected directly within the main component.', filePath);
        } else {
            state.hasReturn = true;
        }
    } else {
        // Handling return for nested components
        if (state.hasReturnInSameComponent) {
            reportError(innerPath.node, 'Multiple return statements detected directly within a nested component.', filePath);
        } else {
            state.hasReturnInSameComponent = true;
        }
    }
  }
}

function enterReactComponent(state) {
  state.insideReactComponent = true;
  state.hasReturnInSameComponent  = false; // Reset the flag when entering a new component
}

function exitReactComponent(state) {
  state.insideReactComponent = false;
}

// Perform exit checks when leaving the component function
function performExitChecks(innerPath, state, filePath) {
  if (!state.hasHooks) {
    console.warn(`Warning: No hooks found. If this component uses hooks, they should be defined before handlers and render logic.`);
  }
  if (!state.hasHandlers) {
    console.warn(`Warning: No handler functions found. It's possible this component does not contain event handlers.`);
  }
  if (!state.hasConditionalRender) {
    console.warn(`Warning: No render logic found. If this component produces JSX, it should contain render logic.`);
  }
  if (!state.hasReturn) {
    reportError(innerPath.node, 'No return statement found in the component.', filePath);
  }
}

// Call the async check function
checkProjectStructure();

console.log('React project structure check completed.');