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
    hasExports: false,
    hasConstants: false,
    hasTypes: false,
    hasInterfaces: false,
    hasEnums: false,
    hasHelperFunctions: false,
    hasCustomHooks: false,
    hasReactComponent: false,
    insideReactComponent: false,
    hasPropTypes: false,
    hasDefaultProps: false,
    hasReturnInSameComponent: false,
  };
}

function isReactComponent(path) {
  if (path.isFunctionDeclaration() && /^[A-Z]/.test(path.get('id').node.name)) {
    // Recognizes function App() { ... }
    return true;
  }
  if (path.isFunctionExpression() || path.isArrowFunctionExpression()) {
    const variableDeclarator = path.findParent(p => p.isVariableDeclarator());
    if (variableDeclarator && /^[A-Z]/.test(variableDeclarator.get('id').node.name)) {
      // Recognizes const App = function() { ... } or const App = () => { ... }
      return true;
    }
    const assignmentExpression = path.findParent(p => p.isAssignmentExpression());
    if (assignmentExpression && /^[A-Z]/.test(assignmentExpression.get('left').node.name)) {
      // Recognizes App = function() { ... } or App = () => { ... }
      return true;
    }
    const exportDefaultDeclaration = path.findParent(p => p.isExportDefaultDeclaration());
    if (exportDefaultDeclaration) {
      // Recognizes export default function() { ... } or export default () => { ... }
      // Assuming these are un-named function expressions that are being exported directly as a React component.
      return true;
    }
  }
  return false;
}

function handleImportDeclaration(path, state) {
  if (state.hasConstants || state.hasTypes || state.hasInterfaces || state.hasEnums || state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent) {
    reportError(path.node, 'Import declarations should come first.');
  }
  state.hasImports = true;
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

function handleTSEnumDeclaration(path, state, filePath) {
  if (state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent) {
    reportError(path.node, 'Enums must be declared after type aliases, interfaces, and before functions and the React component.', filePath);
  }
  state.hasEnums = true;
}

function handleFunctionTypeDeclarations(path, state, filePath) {
  // Initialize variables to determine if this is a component function
  const isFunctionDeclaration = path.isFunctionDeclaration();
  const isFunctionExpression = path.isFunctionExpression() && path.parentPath.isVariableDeclarator();
  const isVariableDeclaration = path.isVariableDeclaration();
  let isComponentFunction = false;
  
  // Check for component function
  if (isFunctionDeclaration) {
    isComponentFunction = /^[A-Z]/.test(path.node.id.name);
  } else if (isFunctionExpression || isVariableDeclaration) {
    // Check the name of the variable declarator to determine if it's a component
    const declarator = isVariableDeclaration ? path.node.declarations.find(decl => decl.init && decl.init.type === 'FunctionExpression') : path.parentPath;
    const functionName = declarator && declarator.get('id').node.name;
    isComponentFunction = functionName && /^[A-Z]/.test(functionName);
  }

  // If it's a component function and we're not already inside a component, set the appropriate flags
  if (isComponentFunction && !state.insideReactComponent) {
    if (state.hasReactComponent || state.hasExports) {
      reportError(path.node, 'Only one main React component should be declared per file.', filePath);
    } else {
      state.hasReactComponent = true;
      enterReactComponent(state);
    }

    // Start the component-specific traversal
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
      exit(innerPath) {
        if (innerPath === path) {
          performExitChecks(innerPath, state, filePath);
          exitReactComponent(state);
          state.hasHooks = false; // Reset state to track new component
          state.hasHandlers = false;
          state.hasConditionalRender = false;
        }
      },
    });
  }
}

function handleExportDeclarations(path, state, filePath) {
  state.hasExports = true;
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

function setupTraverse(state, filePath) {
  return {
    ImportDeclaration(path) {
      handleImportDeclaration(path, state, filePath);
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
      handleFunctionTypeDeclarations(path, state, filePath);
      
      if (isReactComponent(path)) {
        state.insideReactComponent = true;

        // Start the component-specific traversal
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
          // Here you would add any additional handlers needed for other AST node types.
          // ...
          // This exit function will run after traversing all children
          exit(innerPath) {
            if (innerPath === path) {
              performExitChecks(innerPath, state, filePath);
              // Reset the state since we are leaving the React component
              state.insideReactComponent = false;
              state.hasHooks = false; // Ensure you set these flags appropriately according to your logic
              state.hasHandlers = false;
              state.hasConditionalRender = false;
              state.hasReturn = false;
            }
          },
        });
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