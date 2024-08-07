const fs = require('fs');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fsPromises = fs.promises;
const path = require('path');
const t = require('@babel/types');

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
  console.error(`Error in ${filePath} :${location.line}:${location.column} - ${message}`);
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
    hasEncounteredOtherComponent : false,
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

    if (path.isVariableDeclaration()) {
      const declarator = path.get('declarations')[0];
      if (
        declarator.isVariableDeclarator()
        && t.isIdentifier(declarator.node.id)
        && /^[A-Z]/.test(declarator.node.id.name) // Component names must start with an Uppercase letter
        && declarator.node.init
        && t.isArrowFunctionExpression(declarator.node.init) // Ensure it's an Arrow function
        && declarator.node.init.returnType // Ensure it has a return type
      ) {
        componentName = declarator.node.id.name;
        const returnTypeNode = declarator.node.init.returnType;
        const typeAnnotation = returnTypeNode.typeAnnotation;
  
        if (
          t.isTSTypeReference(typeAnnotation)
          && (typeAnnotation.typeName.name === 'FC' || typeAnnotation.typeName.name === 'FunctionComponent')
        ) {
          isComponent = true;
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

// This is used to determine if the node represents a custom hook
function isCustomHook(path) {
  if (path.scope.block.type !== 'Program') {
    // Not top-level, thus not a custom hook
    return false;
  }
  // Custom hooks must not be nested inside another function or component
  if (path.findParent(p => p.isFunctionDeclaration() || p.isFunctionExpression() || p.isArrowFunctionExpression())) {
    return false;
  }
  
  let functionName = '';

  if (path.isVariableDeclarator()) {
    const declarator = path.node;
    const initializer = declarator.init;
    if (initializer && (isFunctionExpression(initializer) || isArrowFunctionExpression(initializer))) {
      functionName = declarator.id.name;
    }
  } else if (path.isFunctionDeclaration()) {
    functionName = path.node.id.name;
  }
  
  return functionName && /^use[A-Z]/.test(functionName);
}

function isFunctionExpression(node) {
  return node.type === 'FunctionExpression';
}

function isArrowFunctionExpression(node) {
  return node.type === 'ArrowFunctionExpression';
}


// TODO: make it work (Maybe replaced by isMainFunctionComponent)
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

function isGlobalConstant(path) {
  // Check if the constant is exported
  const isExported = path.findParent(parent => parent.isExportNamedDeclaration() 
  || parent.isExportDefaultDeclaration());


  if (!isExported) {
    return false;
  }

  // Check if the constant is at the top-level scope (not nested inside any function or block)
  const parentScope = path.scope.parent;
  const isTopLevel = !parentScope || (parentScope.path && parentScope.path.type === 'Program');
  
  // Optionally, you might want to check specific naming conventions for global constants,
  // commonly prefixed with a particular string (e.g., "GLOBAL_") or all uppercase letters.
  const isConventionallyNamed = (identifier) => {
    // This regex tests for ALL_UPPERCASE naming or a specific prefix like 'GLOBAL_'
    const globalNamePattern = /^(GLOBAL_|[A-Z0-9_]+$)/;
    return globalNamePattern.test(identifier);
  };

  // Get the identifier for the constant
  const variableDeclarator = path.node;
  const identifier = variableDeclarator.id.name;

  // Check if the name follows the global convention (if applicable)
  const followsNamingConvention = isConventionallyNamed(identifier);

  // Check if the value is possibly coming from an import (simple heuristic check)
  const maybeImportedValue = variableDeclarator.init &&
    (variableDeclarator.init.type === 'CallExpression' &&
     variableDeclarator.init.callee.type === 'Import' ||
     variableDeclarator.init.type === 'ImportExpression');

  // Determine if the constant is a common global type
  const isGlobalType = (node) => {
    // Assuming constants with objects or arrays could be global config/settings
    return node && (node.type === 'ObjectExpression' || node.type === 'ArrayExpression');
  };

  const satisfiesGlobalType = isGlobalType(variableDeclarator.init);

  // Combine all the checks to determine if it's a global constant
  return isExported && isTopLevel && (followsNamingConvention || satisfiesGlobalType || maybeImportedValue);
}

function isLocalConstant(path) {
  // Check if the constant is exported
  const isExported = path.findParent((parent) =>
    parent.isExportNamedDeclaration() || parent.isExportDefaultDeclaration()
  );

  if (isExported) {
    return false;
  }

  // If the scope has no parent, it is top-level (module scope in this case)
  if (!path.scope.parent || path.scope.parent.path.type === 'Program') {
    return false; // It is a top-level declaration, so not a local constant
  }

  // Check if the constant is inside a function, a class, or a block
  const isInsideFunction = path.findParent((parent) => parent.isFunction());
  const isInsideBlock = path.findParent((parent) => parent.isBlockStatement());

  return isInsideFunction || isInsideBlock;
}

function isFunctionExpression(path) {
  // Détermine si un nœud est une expression de fonction ou une fonction fléchée,
  // même si c'est enveloppé dans une expression, comme une expression logique ou conditionnelle.
  // Par exemple: const example = someCondition ? () => {} : function() {};

  // Fonction pour détecter les expressions de fonction de manière récursive
  const isFunctionExpressionNode = (nodePath) => {
    if (nodePath.isFunctionExpression() || nodePath.isArrowFunctionExpression()) {
      return true;
    }
    
    // Pour les expressions conditionnelles et logiques, vérifiez les branches
    if (nodePath.isConditionalExpression()) {
      return (
        isFunctionExpressionNode(nodePath.get('consequent')) || 
        isFunctionExpressionNode(nodePath.get('alternate'))
      );
    }

    // À utiliser si vous autorisez des choses comme des fonctions immédiatement invoquées (IIFEs)
     if (nodePath.isCallExpression() && isFunctionExpressionNode(nodePath.get('callee'))) {
       return true;
     }

    // Pour les expressions logiques, vérifiez les deux côtés
    if (nodePath.isLogicalExpression()) {
      return (
        isFunctionExpressionNode(nodePath.get('left')) || 
        isFunctionExpressionNode(nodePath.get('right'))
      );
    }

    // Si enveloppé dans des parenthèses
    if (nodePath.isParenthesizedExpression()) {
      return isFunctionExpressionNode(nodePath.get('expression'));
    }

    // Ajoutez plus de cas si nécessaire

    // Dans les autres cas, ce n'est pas une expression de fonction
    return false;
  };

  // Obtenez l'initialisation et appelez la fonction intégrée récursive
  const initPath = path.get('init');
  return initPath && isFunctionExpressionNode(initPath);
}

function isArrowFunctionExpression(path) {
  // Détermine si un nœud est une fonction fléchée, même si elle est enveloppée dans une expression.
  
  // Fonction pour détecter les fonctions fléchées de manière récursive
  const isArrowFunctionNode = (nodePath) => {
    if (nodePath.isArrowFunctionExpression()) {
      return true;
    }
    
    // Pour les expressions conditionnelles, vérifiez les branches
    if (nodePath.isConditionalExpression()) {
      return (
        isArrowFunctionNode(nodePath.get('consequent')) || 
        isArrowFunctionNode(nodePath.get('alternate'))
      );
    }

    // Pour les expressions logiques, vérifiez les deux côtés
    if (nodePath.isLogicalExpression()) {
      return (
        isArrowFunctionNode(nodePath.get('left')) || 
        isArrowFunctionNode(nodePath.get('right'))
      );
    }

    // Si enveloppée dans des parenthèses
    if (nodePath.isParenthesizedExpression()) {
      return isArrowFunctionNode(nodePath.get('expression'));
    }

    // Ajoutez d'autres cas si nécessaire

    // Dans les autres cas, ce n'est pas une fonction fléchée
    return false;
  };

  // Obtenez l'initialisation et appelez la fonction intégrée récursive
  const initPath = path.get('init');
  return initPath && isArrowFunctionNode(initPath);
}

function getMainComponentNameFromFileName(filePath) {
  // Extract the file name without directory path or extension
  const baseName = path.basename(filePath, path.extname(filePath));
  // Turn the first letter to uppercase (React component names are PascalCase)
  return baseName.charAt(0).toUpperCase() + baseName.slice(1);
}

function isMainFunctionComponent(path, state, filePath) {
  const mainComponentName = getMainComponentNameFromFileName(filePath);

  if (path.isVariableDeclaration()) {
    // Search variable declarators which could be React functional components
    return path.node.declarations.some(declaration => {
      if (t.isVariableDeclarator(declaration)) {
        if (t.isIdentifier(declaration.id, { name: mainComponentName })) {
          // Additionally, check if its initialization is an arrow function or a function expression
          if (t.isArrowFunctionExpression(declaration.init) || t.isFunctionExpression(declaration.init)) {
            state.hasMainComponent = true;
            state.mainComponentPath = path;
            return true;
          }
        }
      }
      return false;
    });
  } else if (path.isFunctionDeclaration() && t.isIdentifier(path.node.id, { name: mainComponentName })) {
    state.hasMainComponent = true;
    state.mainComponentPath = path;
    return true;
  }

  return false;
}

function checkIsTopOfScope(path) {
  if (!path.parentPath || !t.isVariableDeclaration(path.parent)) {
    // Not a variable declaration, so no need to check further.
    return true;
  }

  // Check if it's a React FC declared as an arrow function,
  // which we want to exclude from top-of-scope checking
  if (isReactFunctionalComponent(path)) {
    return true; // Exempt React FCs from this rule
  }
  
  const variableScope = path.scope;
  
  // Handle global (module) scope differently than function/block scope.
  if (variableScope.block.type === "Program") {
    const bodyNodes = variableScope.block.body;
    let lastImportIndex = findLastImportIndex(bodyNodes);
    
    // The variable declaration should be after the last import statement.
    const declarationPosition = bodyNodes.indexOf(path.parent);
    if (lastImportIndex !== -1 && declarationPosition > lastImportIndex) {
      return true;
    } 
  } else if (variableScope.path.isFunction()) {
    // For function scope, we expect variables to be declared at the start of the function body or block statement.
    const functionBody = variableScope.path.get('body');
    
    // If functionBody is a block, we need its body array.
    if (t.isBlockStatement(functionBody.node)) {
      const blockBody = functionBody.get('body');
      if (blockBody[0] === path.parentPath) {
        // The variable is at the beginning of the block.
        return true;
      }
    } else if (t.isExpression(functionBody.node)) {
      // If the function body is an expression (arrow functions), the variable needs to be wrapped in a block first.
      return false;
    }
  } else {
    // For block scope, handle similar to function scope.
    // This could be a block from an if, for, while, etc.
    const blockParent = path.findParent(p => t.isBlockStatement(p.node));
    if (blockParent) {
      const blockBody = blockParent.get('body');
      if (blockBody[0] === path.parentPath) {
        // The variable is at the beginning of the block.
        return true;
      }
    }
  }
  
  // For all other cases, assume the placement is fine.
  return true;
}

function isReactFunctionalComponent(path) {
  if (!t.isVariableDeclarator(path.node)) {
    return false;
  }

  const variableDeclarator = path.node;

  // Check if it is initialized with an arrow function
  if (t.isArrowFunctionExpression(variableDeclarator.init)) {
    const arrowFunction = variableDeclarator.init;

    // Assuming the React FC always returns JSX or calls React.createElement
    // We look into arrow function's body to determine if it's React element
    if (t.isBlockStatement(arrowFunction.body)) {
      // Has block body, we should look for a return statement
      const returnStatement = arrowFunction.body.body.find(t.isReturnStatement);
      if (returnStatement && returnStatement.argument) {
        return t.isJSXElement(returnStatement.argument) ||
               isCallToReactCreateElement(returnStatement.argument);
      }
    } else if (t.isJSXElement(arrowFunction.body) || isCallToReactCreateElement(arrowFunction.body)) {
      // Directly returns JSX or React.createElement call without block body
      return true;
    }
  }
  
  return false; // Not a React functional component
}

function isCallToReactCreateElement(node) {
  // Check whether the node represents a call to React.createElement()
  return (
    t.isCallExpression(node) &&
    t.isMemberExpression(node.callee) &&
    (node.callee.object.name === 'React' && node.callee.property.name === 'createElement')
  ) || (
    t.isIdentifier(node.callee) && node.callee.name === 'createElement'
  );
}

function isFunctionalComponent(path) {
  if (t.isVariableDeclarator(path.node)) {
    const init = path.node.init;
    // Check if the init is an arrow function or a regular function
    if (t.isArrowFunctionExpression(init) || t.isFunctionExpression(init)) {
      // Detect if this is possibly a React component based on JSX
      // or React.createElement being returned (simplified heuristic)
      const body = init.body;
      if (t.isBlockStatement(body) && body.body.some(statement => t.isReturnStatement(statement) &&
            (t.isJSXElement(statement.argument) || isReactCreateElementCall(statement.argument)))) {
        return true;
      } else if (t.isJSXElement(body) || isReactCreateElementCall(body)) {
        return true;
      }
    }
  }
  return false;
}

function isReactCreateElementCall(node) {
  return (
    t.isCallExpression(node) &&
    t.isMemberExpression(node.callee) &&
    ((node.callee.object.name === 'React' && node.callee.property.name === 'createElement') ||
     (t.isIdentifier(node.callee) && node.callee.name === 'createElement'))
  );
}

function findLastImportIndex(bodyNodes) {
  let lastImportIndex = -1;
  for (let i = 0; i < bodyNodes.length; i++) {
    if (bodyNodes[i].type === 'ImportDeclaration') {
      lastImportIndex = i;
    }
  }
  return lastImportIndex;
}

function isVariableDeclarator(path) {
  return path.isVariableDeclarator();
}

// This function will be used to identify the type of the function
function recognizeType(path, state, filePath) {
  if (isVariableDeclarator(path)&&isCustomHook(path.get('init'))) {
    return 'customHook';
  } else if (isMainFunctionComponent(path, state, filePath)) {
    return 'mainFunctionComponent';
  } else if (path.isFunctionDeclaration()) {
    return 'normalFunction';
  } else if (path.isFunctionExpression() || isArrowFunctionExpression(path.get('init'))) {
    return 'expressionFunction';
  } else if (isGlobalConstant(path)) {
    return 'globalConstant';
  } else if (isLocalConstant(path)) {
    return 'constant';
  } else if (path.isVariableDeclarator()) {
    return 'variableDeclarator';
  } else if (isFunctionalComponent(path)) { 
    return 'functionalComponent';
  }
  return 'unknown';
}

// This function is using a switch statement to execute logic based on function type
function processFunctionType(type, path, state, filePath) {
  switch (type) {
    case 'customHook':
      handleCustomHookDeclaration(path, state, filePath);
      break;
    case 'mainFunctionComponent':
      handleMainReactComponent(path, state, filePath);
      break;
    case 'normalFunction':
      handleHelperFunctionDeclaration(path, state, filePath);
      break;
    case 'arrowFunction':
      handleArrowFunctionDeclaration(path, state, filePath);
      break;
    case 'expressionFunction':
      handleExpressionFunctionDeclaration(path, state, filePath);
      break;
    case 'globalConstant':
      handleGlobalConstantDeclaration(path, state, filePath);
      break;
    case 'localConstant':
      handlelocalConstantDeclaration(path, state, filePath);
      break;
    case 'variableDeclarator':
      handleVariableDeclarator(path, state, filePath);
      break;
    case 'functionalComponent':
      handleFunctionalComponent(path, state, filePath);
    case 'unknown':
    default:
      console.log('Unrecognized function type. Please add this function type to the structure code script.', path.node.type);
      break;
  }
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
      
    const errorMessage = generateErrorMessage("imports",state, filePath);
    if (errorMessage) {
      reportError(path.node, errorMessage);
    }
  }
  state.hasImports = true;
}

function handleVariableDeclarator(path, state, filePath) {
  if (!path.isVariableDeclarator()) {
    return;
  }
  
  const { id, init } = path.node;
  const variableName = id.name;
  
  // Perform various checks
  const isTopOfScope = checkIsTopOfScope(path);
  //const isProperlyGrouped = checkGrouping(path); Not implemented
  const isProperlyInitialized = init !== null;
  const usesCorrectDeclarationKeyword = checkDeclarationKeyword(path);
  //const isExported = checkExported(path);
  //const hoistingAwareness = checkHoistingAwareness(path);

  // Report any issues
  if (!isTopOfScope) reportVariablePlacementIssue(variableName, path, 'TopOfScope', filePath);
  //if (!isProperlyGrouped) reportVariablePlacementIssue(variableName, path, 'Grouping'); not implemented
  if (!usesCorrectDeclarationKeyword) reportVariablePlacementIssue(variableName, path, 'DeclarationKeyword', filePath);
  if (!isProperlyInitialized) reportVariablePlacementIssue(variableName, path, 'Initialization',filePath);
  //if (!isExported) reportVariablePlacementIssue(variableName, path, 'Exported', filePath);
  //if (!hoistingAwareness) reportVariablePlacementIssue(variableName, path, 'HoistingAwareness');
}

function handleFunctionalComponent(path, state, filePath) {
  handleMainReactComponent(path, state, filePath);
}


/**
 * checkHoistingAwareness returns a list of issues related to hoisting. The function checks for three main problems related to hoisting:
 * Usage of var that could lead to unexpected behavior due to function-wide scoping.
 * Function declarations within blocks which, while valid in modern JavaScript, may lead to unpredictable behavior when transpiled for older environments that only support hoisting to the top of the containing function or global scope.
 * Function expressions invoiced before defining assignments, which are not hoisted like function declarations, and could lead to a reference error if used prematurely.
 * Currently not activate since need more specification
 */

/*
function checkHoistingAwareness(path) {
  let issues = [];

  // Check for 'var' usage that could lead to hoisting issues
  if (path.node.kind === 'var') {
    // If 'var' is used, check where it's declared within the current function or globally
    let scopePath = path.scope.getFunctionParent() || path.scope.getProgramParent();
    if (scopePath && !isAtScopeTop(path, scopePath)) {
      issues.push({
        kind: 'var',
        message: 'Variable declared with "var" may be hoisted to the top of its function scope.',
        location: path.node.loc,
      });
    }
  }

  // Check for function declarations within blocks, which might lead to confusing behavior in pre-ES6 environments
  if (path.parentPath.isBlockStatement()) {
    let siblings = path.parentPath.container;
    for (let sibling of siblings) {
      if (sibling.type === 'FunctionDeclaration') {
        issues.push({
          kind: 'function',
          message: 'Function declarations in blocks are hoisted to the function scope and can lead to unexpected behaviors in pre-ES6 environments.',
          location: sibling.loc,
        });
      }
    }
  }

  // Check for function expressions used before their defining assignment, similar to var
  path.scope.traverse(path.node, {
    Identifier(identifierPath) {
      if (isUsedBeforeDefined(identifierPath, path)) {
        issues.push({
          kind: 'function-expression',
          message: 'Function expression used before its defining assignment can lead to undefined function errors.',
          location: identifierPath.node.loc,
        });
      }
    }
  });

  return issues;
}

function isAtScopeTop(variablePath, scopePath) {
  // Check if this variablePath is the first statement within scopePath's block
  let body = scopePath.node.body;
  return Array.isArray(body) ? body[0] === variablePath.node : body === variablePath.node;
}

function isUsedBeforeDefined(identifierPath, variableDeclaratorPath) {
  if (identifierPath.node.name !== variableDeclaratorPath.node.id.name) {
    return false; // Different variable, ignore
  }

  let binding = identifierPath.scope.getBinding(identifierPath.node.name);
  if (!binding || binding.kind !== 'var' || binding.path.type !== 'VariableDeclaration') {
    return false; // Not a function expression or not var binding
  }

  let bindingIdentifiers = binding.path.getBindingIdentifiers();
  if (bindingIdentifiers[identifierPath.node.name] !== identifierPath.node) {
    return false; // The binding is not connected to this identifier
  }

  // Check the position in the code to determine if it's being used before the declaration
  let bindingPosition = binding.path.node.start;
  let usagePosition = identifierPath.node.start;
  return usagePosition < bindingPosition;
}

// A placeholder for reporting the issues found; implement it as needed
function reportHoistingIssues(issues) {
  issues.forEach((issue) => {
    console.warn(`${issue.kind} hoisting issue: ${issue.message} at line ${issue.location.start.line}, column ${issue.location.start.column}`);
  });
}

// Usage example
const issues = checkHoistingAwareness(someVariablePath);
if (issues.length > 0) {
  reportHoistingIssues(issues);
}
*/

/**
 * This checkExported function does the following:
 * Starts by checking whether the VariableDeclarator is a direct child of an ExportNamedDeclaration or ExportDefaultDeclaration.
 * If the variable is not immediately exported, it searches for a named export that matches the variable's name. This is necessary for cases where variables are first declared inside the module and then exported within an export specifier list.
 * If the name wasn't found in a named export, it checks for a separate default export statement that may match the variable name. This is for cases where the variable is exported default after declaration.
 * Not working currently causing some errors
 * /
function checkExported(path) {
  
  // Ensure the `path` has a valid `id` before proceeding.
  if (!path.get('id').node) {
    console.error('The path does not have an id node.');
    return false;
  }
  
  // Retrieve the variable name from the path.
  const variableName = path.get('id').node.name;  // This line should be at the start of the function

  // First, check if the VariableDeclarator's parent is an ExportNamedDeclaration or ExportDefaultDeclaration.
  let isExported = path.findParent((p) =>
    p.isExportNamedDeclaration() || p.isExportDefaultDeclaration()
  ) !== null;

  // No need to check further if `isExported` is already true.
  if (isExported) {
    return true;
  }

  // Retrieve the program path to iterate over all body nodes.
  const programPath = path.scope.getProgramParent().path;
  const bodyNodes = programPath.node.body;

  // Check if the variable is exported in any named export declarations.
  for (const node of bodyNodes) {
    if (node.type === 'ExportNamedDeclaration' && node.specifiers) {
      for (const specifier of node.specifiers) {
        if (specifier.exported.name === variableName) {
          return true;  // Variable is exported.
        }
      }
    }
  }

  // Check for default export that may refer to our variable.
  for (const node of bodyNodes) {
    if (node.type === 'ExportDefaultDeclaration') {
      const declaration = node.declaration;
      // Checking for different possible default export types.
      if ((declaration.type === 'Identifier' && declaration.name === variableName) ||
          (declaration.type === 'VariableDeclarator' && declaration.id.name === variableName)) {
        return true;  // Variable is the default export.
      }
    }
  }

  // Variable is not exported if none of the above checks return true.
  return false;
}

/**
 * This function performs the following checks:
 * It confirms that the declaration is within the expected structure and has a kind property.
 * It checks if var is used and returns false since var should be avoided.
 * If let is used, it examines all references to the variable to determine if it is reassigned.
 * The isReassignment helper function identifies if a reference constitutes a reassignment.
 * If no reassignment is found in all references, it means const could have been used instead of let.
 * TODO: add message for reporting the issue.
 */

function checkDeclarationKeyword(path) {
  // Ensure that the node is a VariableDeclarator and has a kind (var, let, const)
  if (!path.parentPath || !path.parentPath.node || !path.parentPath.node.kind) {
    return false;
  }

  const declarationKind = path.parentPath.node.kind; // can be "var", "let", or "const"
  const isInitialized = path.node.init !== null;

  // If 'var' is used, that's a problem
  if (declarationKind === 'var') {
    return false;
  }

  if (declarationKind === 'let') {
    // Check if 'let' is used where 'const' could be used
    const identifierName = path.node.id.name;
    const binding = path.scope.getBinding(identifierName);

    if (binding && isInitialized) {
      // Loop through all references to the variable
      for (let i = 0; i < binding.referencePaths.length; i++) {
        const refPath = binding.referencePaths[i];

        // Determine if there are reassignments
        if (isReassignment(refPath, identifierName)) {
          // If we found a valid reassignment, 'let' is justified
          return true;
        }
      }

      // No valid reassignments found, hence 'const' should have been used instead of 'let'
      return false;
    }
  }

  // If using 'const' or if 'let' is justified, it's fine
  return true;
}

function isReassignment(refPath, variableName) {
  // A reference is considered a reassignment if it's an assignment expression
  // that is not part of the variable's initialization.
  return (
    refPath.isAssignmentExpression() && 
    refPath.node.left.type === 'Identifier' &&
    refPath.node.left.name === variableName &&
    refPath.parentPath.node.type !== 'VariableDeclarator'
  );
}

/**
 * Reports an issue with how a variable is placed within the code.
 * @param {string} variableName The name of the variable with the placement issue.
 * @param {Object} path Babel path object where the issue was found.
 * @param {string} issueType The type of issue that was encountered.
 * @param {Object} [options] Additional options for reporting.
 * TODO: Add more details to the report as needed.
 */
function reportVariablePlacementIssue(variableName, path, issueType, filePath, node, options = {}) {
  // Construct a detailed message for the issue
  const issueDescriptions = {
    'TopOfScope': 'Variables should be declared at the top of their scope.',
    'Grouping': 'Variables should be grouped by type or purpose.',
    'DeclarationKeyword': 'Use `const` for variables that are never reassigned. Otherwise, use `let`.',
    'Initialization': 'Variables should be initialized where they are declared, if possible.',
    'Exported': 'Consider exporting variables at the end of the module for clarity.',
    'HoistingAwareness': 'Be aware of variable hoisting which may affect execution order.',
    // Add more issue types as needed
  };

  // Extract the location information from the node, if available, or fall back to the path.
  const location = (node && node.loc) ? node.loc : (path && path.node.loc);

  // Proceed with the original check that the location is available
  if (!location) {
    console.warn(`Location information is unavailable for variable "${variableName}" with issue type "${issueType}" in file "${filePath}".`);
    return; // Exit the function as we cannot proceed without location information
  }

  const report = {
    variableName,
    issueType,
    message: issueDescriptions[issueType],
    location: location,
    filePath: filePath,
    fix: options.fix || null, // Potential automated fix or suggestion
  };

  // Format a log message for console output or logging to a file
  const logMessage = [
    `[${issueType} Issue] Variable "${variableName}" in ${filePath}:${location.start.line}:${location.start.column}`,
    `- ${report.message}`
  ].join(' ');

  // Output the message to the console
  console.warn(logMessage);
}

function handleGlobalConstantDeclaration(path, state, filePath) {
  console.log('Global constant declaration detected:', path.node.type);
  // Check if the path is directly under the Program node (not nested inside any function/component)
  if (path.scope.path.type === 'Program') {
    if (state.hasHelperFunctions || state.hasCustomHooks || state.hasReactComponent ||
        state.hasExports) {
      const errorMessage = generateErrorMessage("Global constant", state, filePath);
      if (errorMessage) {
        reportError(path.node, errorMessage, filePath);
      }
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
      reportError(path.node, errorMessage, filePath);
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
      reportError(path.node, errorMessage, filePath);
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
//TODO: TEST
function handleCustomHookDeclaration(path, state, filePath) {
  let functionName = "";
  // code to found the name of the custom hook
  if (path.node.type === 'VariableDeclaration') {
    path.node.declarations.forEach(declarator => {
      const initializer = declarator.init;
      if (initializer && (initializer.type === 'FunctionExpression' || initializer.type === 'ArrowFunctionExpression')) {
        functionName = declarator.id.name;
      }
    });
  }
  // Call isCustomHook to check if the function name matches the custom hook pattern
  if (isCustomHook(functionName)) {
    console.log('Custom hook declaration detected:', path.node.type, filePath);
    // Ensure custom hooks are declared in the right order
    if (state.hasHelperFunctions || state.hasReactComponent || state.hasEnums || 
      state.hasTypes || state.hasInterfaces || state.hasReactComponent || 
      state.hasExports || state.hasPropTypes || state.hasDefaultProps || 
      state.hasMainComponent){
      const errorMessage = generateErrorMessage("Custom Hooks",state, filePath);
      if (errorMessage) {
        reportError(path.node, errorMessage, filePath);
      }
    } 
    state.hasCustomHooks = true;
  }
}

// TODO: CheckHandler
function handlelocalConstantDeclaration(path, state, filePath) {
  console.log('Constant declaration detected:', path.node.type);
  // Check if we are inside any function or component
  if (path.scope.path.type !== 'Program') {
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
    handleGlobalConstanteDeclaration(path, state, filePath);
  }
}

function handleMainReactComponent(path, state, filePath) {
  // Check if we're encountering the first React component, which we designate as the main component
  if (isMainFunctionComponent(path, state, filePath)) {
    console.log('Main React component (primary check) detected:', path.node.type);
    state.hasReactComponent = true; // Mark that we've found the React component
    state.hasMainComponent = true; // Mark that this is the main component
    state.mainComponentPath = path;
    enterReactComponent(state);
  
    // Traverse the main component for additional logic specific to React component structure
    path.traverse({
      ImportDeclaration(innerPath) {
        handleImportDeclaration(innerPath, state, filePath);
      },
      VariableDeclarator(innerPath) {
        handleVariableDeclarator(innerPath, state, filePath);
      },
      ReturnStatement(innerPath) {
        handleReturnStatement(innerPath, state, filePath); // Only handle the main return statement
      },
      JSXElement(innerPath) {
        handleJSXElement(innerPath, state, filePath);
      },
      FunctionExpression(innerPath) {
        handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);
      },
      ArrowFunctionExpression(innerPath) {
        handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);
      },
      ClassDeclaration(innerPath) {
        // If you have logic for class components
      },
      // Here you can traverse other node types as needed specifically for the main component
      // ...

      exit(innerPath) {
        if (innerPath === path) { // Exit from the main component
          exitReactComponent(state);
        }
      },
    });
  } else {
    // Logic when the main component is not found, or if we find a secondary component in the file
  }
}

// TODO: Not working 
function handleHelperFunctionDeclaration(path, state, filePath) {
    console.log('Helper function declaration detected:', path.node.type);
    if (!state.hasConstants && !state.hasCustomHooks && !state.hasReactComponent&& !state.hasExports&& !state.hasPropTypes&& !state.hasDefaultProps) {
        state.hasHelperFunctions = true;

        }else{
          const errorMessage = generateErrorMessage("Helper Functions",state, filePath);
          if (errorMessage) {
            reportError(path.node, errorMessage);
          }
          state.hasHelperFunctions = true;
    }
  }

// TODO: replace with two separate functions
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
      // Check for the main component
      if (isMainFunctionComponent(path, state, filePath)) {
        handleMainReactComponent(path, state, filePath);
      } else {
        // Iterate over variable declarators in case of multiple declarations in one statement
        path.node.declarations.forEach(declarator => {
          const declaratorPath = path.get('declarations').find(p => p.node === declarator);
          const type = recognizeType(declaratorPath, state, filePath); // Assuming you have recognizeType function
          processFunctionType(type, declaratorPath, state, filePath);
        });
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
    FunctionDeclaration(path) {
      // Check for the main component
      if (isMainFunctionComponent(path, state, filePath)) {
        handleMainReactComponent(path, state, filePath);
      } else {
        const type = recognizeType(path, state, filePath);
        processFunctionType(type, path, state, filePath);
      }
    },
    'ArrowFunctionExpression|FunctionExpression': {
      enter(path) {
        // We're interested in Arrow/Function expressions that are part of variable declarations
        if (path.parentPath.isVariableDeclarator()) {
          const type = recognizeType(path.parentPath, state, filePath);
          processFunctionType(type, path.parentPath, state, filePath);
        }
      }
    },
    'ExportNamedDeclaration|ExportDefaultDeclaration'(path) {
      handleExportDeclarations(path, state, filePath);
    },
    // Add other node type handlers here as needed
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
  // Check if we're inside a function (component or not).
  const functionParent = innerPath.findParent(p => p.isFunctionDeclaration() || p.isFunctionExpression() || p.isArrowFunctionExpression());

  if (functionParent) {
    // Check if this JSX is part of the return statement or a variable declaration within the function
    const isPartOfReturn = !!innerPath.findParent(p => p.isReturnStatement());
    const isPartOfVariableDeclarator = !!innerPath.findParent(p => p.isVariableDeclarator());

    if (isPartOfReturn) {
      // This JSX is valid because it's part of the return statement
      // No error should be reported.
    } else if (functionParent === state.mainComponentPath && !isPartOfVariableDeclarator) {
      // If we're in the main component, JSX outside of the return statement indicates conditional rendering
      state.hasConditionalRender = true;
    } else if (isPartOfVariableDeclarator) {
      // If it's part of a variable declarator (like a component being defined), no error
    } else {
      // Error if JSX is floating freely inside the component, not wrapped in a return statement
      reportError(
        innerPath.node,
        'JSX should be returned from the component or part of a statement within render logic.',
        filePath
      );
    }
  } else if (innerPath.findParent(p => p.isProgram())) {
    // If we're at the program level, any JSX is invalid 
    reportError(
      innerPath.node,
      'JSX should be inside a function component or returned directly from an arrow function component.',
      filePath
    );
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