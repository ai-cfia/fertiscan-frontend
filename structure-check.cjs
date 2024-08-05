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
  };
}

function isReactComponent(path) {
  let isComponent = false;
  let isMainComponent = false;

  if (path.isFunctionDeclaration() && /^[A-Z]/.test(path.get('id').node.name)) {
    // Recognizes function App() { ... }
    isComponent = true;
  } else if (path.isFunctionExpression() || path.isArrowFunctionExpression()) {
    const declarator = path.findParent(p => p.isVariableDeclarator());
    const assignment = path.findParent(p => p.isAssignmentExpression());
    const isDefaultExported = path.findParent(p => p.isExportDefaultDeclaration());
    if ((declarator && /^[A-Z]/.test(declarator.get('id').node.name)) ||
        (assignment && /^[A-Z]/.test(assignment.get('left').node.name)) ||
        isDefaultExported) {
      // Recognizes const App = function() { ... } or const App = () => { ... }
      // or export default function App() { ... } or export default () => { ... }
      isComponent = true;
    }
  }

  if (isComponent) {
    // Check for preceding comment // main component
    const leadingComments = path.node.leadingComments;
    isMainComponent = leadingComments && leadingComments.some(
      comment => comment.type === "CommentLine" && comment.value.trim() === "main component"
    );
  }

  return {
    isComponent,
    isMainComponent,
    path: isComponent ? path : null,
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

function isMainComponentByExport(path, state) {
  // The original function for checking the naming convention is no longer needed
  // Instead, we check if there's an export statement explicitly relating to the current component
  const isExported = path.findParent((p) => p.isExportDefaultDeclaration() || p.isExportNamedDeclaration());
  const isFunctionDeclarationExported = isExported && path.isFunctionDeclaration();
  const isFunctionExpressionExported = isExported && (path.isFunctionExpression() || path.isArrowFunctionExpression());

  // We need to handle differently based on the kind of declaration
  if (isFunctionDeclarationExported) {
    // Directly export function declarations like: export default function MyComponent() {}
    return true;
  } else if (isFunctionExpressionExported) {
    // Variables that are exported: export { MyComponent as default };
    // or export default MyComponent; where MyComponent is a function expression or arrow function
    const declaration = path.parentPath.parentPath.node.declaration;
    if (declaration && (declaration.type === 'Identifier' || declaration.type === 'ObjectExpression')) {
      const identifiers = path.scope.bindings[declaration.name];
      return identifiers && identifiers.path === path;
    }
  }
  return false;
}

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


function handleImportDeclaration(path, state, filePath) {
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

function handleTSEnumDeclaration(path, state, filePath) {
  if (state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent) {
    const errorMessage = generateErrorMessage("Enums",state, filePath);
    if (errorMessage) {
      reportError(path.node, errorMessage);
    }
  }
  state.hasEnums = true;
}
function handleCustomHookDeclaration(path, state, filePath) {
  // Check if the function is a custom hook by its naming convention
  const functionName = path.node.id && path.node.id.name;
  if (isCustomHook(functionName)) {
    console.log(`Custom hook detected: ${functionName}`);
    // Ensure custom hooks are declared in the right order
    if (state.hasHelperFunctions  || state.hasReactComponent){
      const errorMessage = generateErrorMessage("Custom Hooks",state, filePath);
      if (errorMessage) {
        reportError(path.node, errorMessage);
      }
    } 
    state.hasCustomHooks = true;
  }
}
function handleConstanteDeclaration(path, state, filePath) {
  // Check if we are inside the main React component function
  if (isInMainComponent(path, state)) {
    // Constants should be declared after the import statements and any custom hook definitions,
    // and before any hook calls (like useState, useEffect, etc.), handler functions, and before rendering logic and JSX.
    if (state.hasImports && !state.hasStateHooks && !state.hasContextHooks && !state.hasEffectHooks && !state.hasHandlerFunctions && !state.hasConditionalRenderLogic) {
      state.hasConstants = true; // Set the flag indicating that component-specific constants are declared
    } else {
      // If constants are not in the correct order, report an error
      reportError(path.node, 'Component-specific constants must be declared at the beginning of the component, after imports and before state/context/effect hooks and render logic.', filePath);
    }
  }
  // If the variable declaration is not within a component, check if it's a global constant instead
  else if (path.scope.path.type === 'Program') {
    handleGlobalConstantsDeclaration(path, state, filePath); // Assuming you've defined this function
  }
}


function handleTypeAliasDeclaration(path, state) {
  if (state.hasInterfaces || state.hasEnums || state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent) {
    reportError(path.node, 'Type aliases must be declared after import statements and before interfaces, enums, and functions.');
  }
  state.hasTypes = true;
}
function handleTSTypeAliasDeclaration(path, state, filePath) {
  if (state.hasInterfaces || state.hasEnums || state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent) {
    reportError(path.node, 'Type aliases must be declared after import statements and before interfaces, enums, and functions.', filePath);
  }
  state.hasTypes = true;
}
function handleTSInterfaceDeclaration(path, state, filePath) {
  if (state.hasEnums || state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent) {
    reportError(path.node, 'Interfaces must be declared after type aliases and before enums, functions, and the React component.', filePath);
  }
  state.hasInterfaces = true;
}


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


function handleFunctionTypeDeclarations(path, state, filePath) {
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

// This function can be called inside FunctionDeclaration or arrow function expression
// which might represent a React component.
function handleReactComponentFunction(path, state, filePath) {
  // Check if `path` is a React component
  if (isReactComponent(path)) {
    path.traverse({
      'FunctionExpression|ArrowFunctionExpression': function(innerPath) {
        handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);
      },
      // Add handlers for other relevant node types, such as JSXElement, ReturnStatement, etc.
    });
  }
}
function handleMainReactComponent(path, state, filePath) {
  // Check if we're encountering the first React component, which we designate as the main component
  if (!state.hasReactComponent && isReactComponent(path)) {
    state.hasReactComponent = true; // Mark that we've found the main React component
    state.mainComponentPath = path;
    enterReactComponent(state);
    
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
}

function handleExportDeclarations(path, state, filePath) {
  state.hasExports = true;
}

function setupTraverse(state, filePath) {
  return {
    ImportDeclaration(path) {
      handleImportDeclaration(path, state, filePath);
    },
    VariableDeclaration(path) {
      // Check for custom hooks first, because they might as well be in the global scope
      path.node.declarations.forEach(declarator => {
        if (declarator.init && (isFunctionExpression(declarator.init) || isArrowFunctionExpression(declarator.init))) {
          if (isCustomHook(declarator.id.name)) {
            // It's a custom hook, handle accordingly
            handleCustomHookDeclaration(path, state, filePath);
          }
        }
      });
      // Use your logic for handling global constants here if applicable
      if (path.parentPath.type === 'Program') {
        handleGlobalConstanteDeclaration(path, state, filePath);
      } else if (path.scope.path.type !== 'Program') {
        // Handle non-global constant declaration here
        handleConstanteDeclaration(path, state, filePath);
      }
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
    'FunctionDeclaration|ArrowFunctionExpression|FunctionExpression|VariableDeclaration'(path) {
      const componentCheck = isReactComponent(path);
      if (componentCheck.isComponent) {
        // The first React component encountered is considered the main component.
        if (!state.hasReactComponent && componentCheck.isMainComponent) {
          handleMainReactComponent(componentCheck.path, state, filePath);
          state.mainComponentPath = componentCheck.path; // Keep a reference to the main component
          state.hasReactComponent = true;
        } else {
          // If there's already a main component, handle as nested or other type of function.
          handleFunctionTypeDeclarations(componentCheck.path, state, filePath);
        }
      }
    },
    'ExportNamedDeclaration|ExportDefaultDeclaration'(path) {
      handleExportDeclarations(path, state, filePath);
    },
    // ...rest of your AST node type handlers...
  };
}
// You can add more handlers here based on other specific AST node types and logic you have in your original code

async function checkFile(filePath) {
  console.log(`Reading file: ${filePath}`);
  const content = readFileSync(filePath, 'utf-8');
  const ast = parseFile(content);  
  let state = createStateTracker();

  traverse(ast, setupTraverse(state, filePath));

  console.log(`File ${filePath} checked.`);
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