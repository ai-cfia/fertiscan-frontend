const fs = require('fs');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fsPromises = fs.promises;
const path = require('path');
const t = require('@babel/types');
const { readdir, stat } = fsPromises;
const readFileSync = fs.readFileSync;
const projectPath = 'src';
const filePattern = /\.(ts|tsx)$/; // Use a regex pattern for matching file extensions
const ignoreFilePath = 'structure-check.ignore';
const util = require('util');
const readFile = util.promisify(fs.readFile);
const generate = require('@babel/generator').default;  


const descriptionMapping = {      
  // Mapping for error messages...    
  "Import statements": ["hasGlobalConstants", "hasHelperFunctions", "hasCustomHooks", "hasStyledComponents", "hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Global constant": ["hasHelperFunctions", "hasCustomHooks", "hasStyledComponents", "hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Helper Functions": ["hasCustomHooks", "hasStyledComponents", "hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Custom Hooks": ["hasStyledComponents", "hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Styled Component": ["hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Interface": ["hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Type alias": ["hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Enums": ["hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Main function/component": ["hasHandlers", "hasHooks", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Class component": ["hasHandlers", "hasHooks", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],  
  "React component declarations": ["hasHandlers", "hasHooks", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "PropTypes definitions": ["hasDefaultProps", "hasExports"],      
  "default props": ["hasPropTypes","hasExports"],      
  "Constante": ["hasHelperFunctions", "hasCustomHooks", "hasStyledComponents", "hasInterfaces", "hasTypes", "hasEnums", "hasMainComponent", "hasClassComponent", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Handlers": ["hasHooks", "hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Hooks": ["hasReactComponent", "hasPropTypes", "hasDefaultProps", "hasExports"],      
  "Exports": []      
};      
    

// ---------------------- File processing functions ----------------------

/**
 * Recursively searches for files in a given directory that match a specified pattern.
 * 
 * @async
 * @function findFilesRecursive
 * @param {string} dir - The starting directory path.
 * @param {RegExp} pattern - The file pattern to search for.
 * @returns {Promise<string[]>} A promise that resolves to an array of file paths matching the pattern.
 */
async function findFilesRecursive(dir, pattern, fileList = [], ignorePattern) {
  const files = await readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const fileStat = await stat(fullPath);

    // Test the ignorePattern against the full path
    if (ignorePattern && ignorePattern.test(fullPath)) {
      continue; // Skip ignored files or directories
    }

    if (fileStat.isDirectory()) {
      await findFilesRecursive(fullPath, pattern, fileList, ignorePattern); // Recurse into subdirectories
    } else if (pattern.test(file)) {
      fileList.push(fullPath); // Add to list if file matches the pattern
    }
  }

  return fileList;
}

/**
 * Checks the project structure by searching for .ts and .tsx files.
 * 
 * This function recursively traverses the project directory to find files
 * matching the specified pattern, then checks each of these files.
 * 
 * @async
 * @function checkProjectStructure
 * @returns {Promise<void>} A promise that resolves when the structure check is complete.
 */
async function checkProjectStructure(filePath) {  
  try {  
    if (filePath) {  
      await checkFile(filePath); // Analyze the specific file  
    } else {  
      console.log('Recherche des fichiers .ts et .tsx dans le projet...');  
      const ignorePattern = await compileIgnorePattern(ignoreFilePath);  
      const files = await findFilesRecursive(projectPath, filePattern, [], ignorePattern);  
  
      if (files.length === 0) {  
        console.log(`Aucun fichier correspondant trouvé avec le motif "${filePattern}".`);  
      } else {  
        console.log(`Fichiers trouvés pour la vérification de structure:`, files);  
        for (const filePath of files) {  
          await checkFile(filePath); // Check each file  
        }  
      }  
    }  
  } catch (err) {  
    console.error('Erreur lors de la recherche de fichiers:', err);  
  }  
  
  console.log('Vérification de la structure du projet React terminée.');  
} 

/**
 * Parses a given file to extract relevant information.
 * 
 * This function reads the content of the specified file and processes it
 * to extract necessary data for further analysis.
 * 
 * @async
 * @function parseFile
 * @param {string} filePath - The path to the file to be parsed.
 * @returns {Promise<Object>} A promise that resolves to an object containing the parsed data.
 */
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

/**
 * Asynchronously reads and analyzes a file's content, parsing it into an AST (Abstract Syntax Tree) and traversing the
 * tree to check various coding conventions and structural rules. It initializes a state tracker for maintaining the state
 * throughout the traversal process and utilizes setup functions to establish visitor patterns for AST nodes.
 *
 * @param {string} filePath - The path of the file to be read and checked.
 */
async function checkFile(filePath) {
  console.log(`Reading file: ${filePath}`);
  const content = readFileSync(filePath, 'utf-8');
  const ast = parseFile(content);  
  let state = createStateTracker();

  traverse(ast, setupTraverse(state, filePath));

  // Once the AST traversal is complete, check if the main component's name matches the file name
  if (state.hasMainComponent) {
    const mainComponentName = getMainComponentNameFromFileName(filePath);
    if (!isExportDeclarationWithName(state.mainComponentPath, mainComponentName)) {
      console.error(`Success`);
    }
  }else{
    console.error(`Error in ${filePath}: No main detected as the main (Function/Component/Class) is detected by the fileName please rename your main component to match the file name.`);
  }

  console.log(`File ${filePath} checked.`);
  console.log("------------------------------------------------------------")
  console.log('\n');
}

// Function to read ignore patterns and compile them into a regex
async function compileIgnorePattern(ignoreFilePath) {
  try {
    const fileContent = await readFile(ignoreFilePath, 'utf-8');
    const patterns = fileContent
      .split('\n')
      .filter(Boolean) // Remove empty lines
      .filter(line => !line.startsWith('#')) // Remove comments
      .map(pattern => pattern.trim())
      .map(pattern => pattern.replace(/\./g, '\\.')) // Escape dots for regex
      .join('|'); // Combine into a single regex pattern
    return new RegExp(patterns);
  } catch (error) {
    console.error(`Error reading '${ignoreFilePath}': ${error.message}`);
    return new RegExp(''); // Return an empty regex if error occurs
  }
}

// ---------------------- State tracker functions ----------------------

/**
 * Creates a state tracker to monitor changes in the application state.
 * 
 * This function initializes a state tracker object that can be used to track
 * and manage state changes within the application.
 * 
 * @function createStateTracker
 * @param {Object} initialState - The initial state of the application.
 * @returns {Object} An object with methods to get, set, and subscribe to state changes.
 */
function createStateTracker() {  
  return {  
    topLevelState: {  
      hasImports: false, // Check for import statements in the file  
      hasExports: false, // Check for export statements in the file  
      hasGlobalConstants: false, // Check for constants used throughout the file  
      hasHelperFunctions: false, // Check for pure functions that are not React components  
      hasCustomHooks: false, // Check for hooks specific to the component but separated for reusability  
      hasStyledComponents: false, // Check for styled-components (this is marked as not implemented yet)  
      hasInterfaces: false, // Check for TypeScript interface definitions specific to the component  
      hasTypes: false, // Check for TypeScript type alias definitions specific to the component  
      hasEnums: false, // Check for TypeScript enum definitions specific to the component  
      hasMainComponent: false, // Check if the main React component is present  
      hasReactComponent: false, // Check if React components (besides the main one) are present  
      hasPropTypes: false, // Check for PropTypes definitions (if not using TypeScript)  
      hasDefaultProps: false, // Check for DefaultProps definitions (if not using TypeScript)  
    },  
    functionComponentState: {  
      hasConstants: false, // Check for local constants specific to the component  
      hasHandlers: false, // Check for handler functions  
      hasHooks: false, // Check if any React hooks are used  
      hasReturnInSameComponent: false, // Check for return statement within the same React component, to ensure it is rendering JSX  
      insideReactComponent: false, // Flag to indicate if currently traversing inside React component  
      hasEncounteredOtherComponent: false, // Check if other React components have been encountered (switched off if main component is found)  
      dontContainMainComponentSameNameAsFile: false, // Check if there is no main component with the same name as the file  
      mainComponentPath: null, // Store path of the main component, if found  
      hasGlobalConstants: false, // Include top-level state checks for misplaced declarations  
      hasHelperFunctions: false,   
      hasCustomHooks: false,   
      hasStyledComponents: false,  
      hasInterfaces: false,  
      hasTypes: false,  
      hasEnums: false,  
      hasMainComponent: false,   
      hasReactComponent: false,
      hasClassComponent: false,   
      hasPropTypes: false,   
      hasDefaultProps: false,   
    }  
  };  
}  
 
// ---------------------- Error reporting functions ----------------------

/**  
 * Enhanced error reporting to provide detailed and accurate information  
 * about encountered errors during AST traversal and code analysis.  
 *   
 * @param {Object} node - The AST node where the error was encountered.  
 * @param {string} message - The error message describing what went wrong.  
 * @param {string} filePath - The path to the file being processed.  
 * @param {string} [type] - Optional. Type of the node, can be provided for more contextual messages.  
 */  
function reportError(node, message, filePath, type, extraInfo = {}) {    
  // If the node does not have a location, fall back to a more generic error message.    
  if (!node.loc) {    
    console.error(`Error in ${filePath}: ${message}`);    
    return;    
  }    
    
  // Extract the location data from the node.    
  const location = node.loc.start;    
    
  // Determine the type of the node for more context if not provided.    
  const nodeType = type || node.type || 'Unknown';    
    
  // Construct a detailed error message.    
  const errorMessage = `\n[${nodeType}] - Error in ${filePath}:${location.line}:${location.column}:\n` +  
    `Message: ${message}\n` +  
    `Node Type: ${nodeType}\n` +  
    (extraInfo.suggestions ? `Suggestions: ${extraInfo.suggestions}\n` : '') +   
    (extraInfo.fix ? `Suggested Fix: ${extraInfo.fix}\n` : '');    
    
  console.error(errorMessage);    
}   


/**
 * Generates an error message based on the provided description, state, and file path.
 *
 * @param {string} description - The description of the error.
 * @param {object} state - The state object containing various flags indicating the presence of certain declarations.
 * @param {string} filePath - The file path where the error occurred.
 * @returns {string} - The generated error message.
 */
function generateErrorMessage(description, state, filePath) {    
  const messages = [];    
  const relevantStateKeys = descriptionMapping[description] || [];    
      
  for (const key of relevantStateKeys) {    
    if (state[key]) {    
      // Convert state key to readable form    
      const readableForm = key.replace('has', '').replace(/([A-Z])/g, ' $1').toLowerCase();    
      messages.push(readableForm.trim());    
    }    
  }    
    
  if (messages.length > 0) {    
    const reasonString = messages.join(", ");    
    return `${description} should be declared before ${reasonString}.`;    
  }    
    
  return "";    
} 



// ---------------------- Is functions ----------------------

/**
 * Determines if a given path represents a React component.
 *
 * @param {Path} path - The path to check.
 * @returns {Object} - An object containing information about the component.
 * @property {boolean} isComponent - Indicates if the path represents a React component.
 * @property {boolean} isMainComponent - Indicates if the component is a main component.
 * @property {Path|null} path - The original path if it represents a component, otherwise null.
 * @property {string} componentName - The name of the component.
 */
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
  }else if (path.isClassDeclaration()) {  
    if (isClassComponent(path)) {  
      isComponent = true;  
      componentName = path.node.id.name;  
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

/**
 * Determines if a given path represents a custom hook.
 *
 * @param {Path} path - The path to check.
 * @returns {boolean} - True if the path represents a custom hook, false otherwise.
 */
function isCustomHook(path) {  
  // Check if the function is at the top level (not nested inside another function or component)  
  if (path.scope.block.type !== 'Program') {  
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
  } else {  
    const id = path.node.id || {};  
    const key = path.node.key || {};  
    functionName = id.name || key.name || '';  
  }  
  
  return functionName && /^use[A-Z]/.test(functionName);  
} 

/**
 * Determines if a given variable is a global constant.
 *
 * @param {NodePath} path - The path of the variable declaration.
 * @returns {boolean} - True if the variable is a global constant, false otherwise.
 */
function isGlobalConstant(path) {  
  const isExported = path.findParent(parent =>  
      parent.isExportNamedDeclaration() ||  
      parent.isExportDefaultDeclaration()  
  );  

  if (!isExported) {  
      return false;  
  }  

  const parentScope = path.scope.parent;  
  const isTopLevel = !parentScope || (parentScope.path && parentScope.path.type === 'Program');  

  const variableDeclarator = path.node;  
  const identifier = variableDeclarator.id ? variableDeclarator.id.name : null;  

  if (!identifier) {  
      return false;  
  }  

  const isConventionallyNamed = /^[A-Z_][A-Z0-9_]*$/.test(identifier);  

  const maybeImportedValue = variableDeclarator.init &&  
      (variableDeclarator.init.type === 'CallExpression' &&  
          (variableDeclarator.init.callee.type === 'Import' ||  
              variableDeclarator.init.type === 'ImportExpression'));  

  const isGlobalType = (node) => {  
      return node && (node.type === 'ObjectExpression' || node.type === 'ArrayExpression');  
  };  

  const satisfiesGlobalType = isGlobalType(variableDeclarator.init);  

  return isExported && isTopLevel && (isConventionallyNamed || satisfiesGlobalType || maybeImportedValue);  
}   


/**
 * Checks if a given path represents a local constant.
 *
 * @param {Path} path - The path to check.
 * @returns {boolean} Returns true if the path represents a local constant, otherwise returns false.
 */
function isLocalConstant(path) {  
  const isExported = path.findParent((parent) =>  
      parent.isExportNamedDeclaration() || parent.isExportDefaultDeclaration()  
  );  

  if (isExported) {  
      return false;  
  }  

  if (!path.scope.parent || path.scope.parent.path.type === 'Program') {  
      return false;  
  }  

  const isInsideFunction = path.findParent((parent) => parent.isFunction());  
  const isInsideBlock = path.findParent((parent) => parent.isBlockStatement());  

  return isInsideFunction || isInsideBlock;  
}  

/**
 * Determines if a node is a function expression or an arrow function expression,
 * even if it is wrapped in an expression like a logical or conditional expression.
 * 
 * @param {NodePath} path - The path to the node to check.
 * @returns {boolean} - True if the node is a function expression, false otherwise.
 */
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

/**
 * Determines if a node is an arrow function, even if it is wrapped in an expression.
 *
 * @param {NodePath} path - The path of the node to check.
 * @returns {boolean} - True if the node is an arrow function, false otherwise.
 */
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
/**  
 * Determines if a given path represents the main function component.  
 *  
 * @param {Path} path - The path to check.  
 * @param {State} state - The state object.  
 * @param {string} filePath - The file path.  
 * @returns {boolean} - True if the path represents the main function component, false otherwise.  
 */  
function isMainFunctionComponent(path, state, filePath) {    
  const mainComponentName = getMainComponentNameFromFileName(filePath);    
  
  if (path.isFunctionDeclaration()|| path.isClassDeclaration()) {    
    if (t.isIdentifier(path.node.id, { name: mainComponentName })) {    
      state.hasMainComponent = true;    
      state.mainComponentPath = path;    
      return true;    
    }    
  } else if (path.isVariableDeclaration()) {    
    return path.node.declarations.some((declaration) => {    
      if (t.isVariableDeclarator(declaration)) {    
        if (t.isIdentifier(declaration.id, { name: mainComponentName }) &&    
            (t.isArrowFunctionExpression(declaration.init) || t.isFunctionExpression(declaration.init))) {    
          state.hasMainComponent = true;    
          state.mainComponentPath = path;    
          return true;    
        }    
      }    
      return false;    
    });    
  } else if (path.isExportDefaultDeclaration()) {    
    const declaration = path.get('declaration');    
    if (t.isIdentifier(declaration)) {    
      if (declaration.node.name === mainComponentName) {    
        state.hasMainComponent = true;    
        state.mainComponentPath = path;    
        return true;    
      }    
    } else if (t.isFunctionDeclaration(declaration) || t.isVariableDeclarator(declaration)) {    
      if (t.isIdentifier(declaration.node.id, { name: mainComponentName })) {    
        state.hasMainComponent = true;    
        state.mainComponentPath = path;    
        return true;    
      }    
    }    
  }    
  
  return false;    
}  




/**  
 * Checks whether a given export declaration matches a specified component name, considering both default and   
 * named exports in the check. This utility helps identify if a particular component or identifier is exported  
 * with the expected name from a file.  
 *  
 * @param {Path} path - The Babel AST path representing an export declaration node.  
 * @param {string} componentName - The name of the component to check for in the export declaration.  
 * @returns {boolean} - True if the given export declaration includes an export with the specified component name; false otherwise.  
 */  
function isExportDeclarationWithName(path, componentName) {  
  if (path.isExportDefaultDeclaration() && path.has('declaration')) {  
    const declaration = path.get('declaration');  
    if (declaration.isIdentifier()) {  
      return declaration.node.name === componentName;  
    } else if (declaration.isFunctionDeclaration() || declaration.isClassDeclaration()) {  
      return declaration.node.id && declaration.node.id.name === componentName;  
    }  
  } else if (path.isExportNamedDeclaration() && path.has('specifiers')) {  
    return path.get('specifiers').some(specifier => {  
      return (  
        (specifier.exported.name === componentName) && // Exported name matches  
        // Optional: If you want to check if the local name matches the exported name  
        (specifier.local ? specifier.local.name === componentName : true)   
      );  
    });  
  }  
  return false;  
} 

/**
 * Checks if the given path represents a variable declaration at the top of its scope.
 * 
 * @param {Path} path - The path to check.
 * @returns {boolean} Returns true if the variable declaration is at the top of its scope, otherwise false.
 */
function IsTopOfScope(path) {
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

/**
 * Checks if a given path represents a React functional component.
 *
 * @param {Path} path - The path to be checked.
 * @returns {boolean} - True if the path represents a React functional component, false otherwise.
 */
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
               isReactCreateElementCall(returnStatement.argument);
      }
    } else if (t.isJSXElement(arrowFunction.body) || isReactCreateElementCall(arrowFunction.body)) {
      // Directly returns JSX or React.createElement call without block body
      return true;
    }
  }
  
  return false; // Not a React functional component
}

/**
 * Checks if a given path represents a functional component.
 *
 * @param {Path} path - The path to check.
 * @returns {boolean} - Returns true if the path represents a functional component, otherwise returns false.
 */
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

/**
 * Checks whether the given node represents a call to React.createElement().
 *
 * @param {Node} node - The node to check.
 * @returns {boolean} - Returns true if the node is a call to React.createElement(), otherwise returns false.
 */
function isReactCreateElementCall(node) {
  // Check whether the node is a CallExpression
  if (t.isCallExpression(node)) {
    // Inside a CallExpression, check if the callee is a MemberExpression or an Identifier
    const isDirectCall = t.isIdentifier(node.callee) && node.callee.name === 'createElement';
    const isMemberCall = t.isMemberExpression(node.callee) &&
                         node.callee.object.name === 'React' &&
                         node.callee.property.name === 'createElement';

    // Return true if either isDirectCall or isMemberCall is true
    return isDirectCall || isMemberCall;
  }
  // Return false if the node is not a CallExpression
  return false;
}

/**
 * Checks if the given path represents a variable declarator.
 *
 * @param {Path} path - The path to check.
 * @returns {boolean} - Returns true if the path is a variable declarator, otherwise false.
 */
function isVariableDeclarator(path) {
  return path.isVariableDeclarator();
}

function isContextCreation(path) {  
  if (t.isVariableDeclarator(path.node) && t.isCallExpression(path.node.init)) {  
    const callee = path.node.init.callee;  
    if (t.isMemberExpression(callee) && t.isIdentifier(callee.object, { name: 'React' }) && t.isIdentifier(callee.property, { name: 'createContext' })) {  
      return true;  
    }  
  }  
  return false;  
}  

/**
 * Determines if a given reference to a variable within its lexical scope constitutes a reassignment.
 * A reassignment is recognized if the reference occurs in an assignment expression where the variable
 * acts as the target (left side of an assignment), and this assignment is not part of the variable's
 * own initialization declaration. Identifying such reassignments helps in deciding whether the usage of
 * 'let' over 'const' in variable declarations is justified.
 *
 * @param {Path} refPath - The Babel AST path object that represents the reference to check for reassignment.
 * @param {string} variableName - The name of the variable to check for reassignment.
 * @returns {boolean} - Returns true if the reference path represents a reassignment to the variable.
 *                      Returns false otherwise, indicating that the variable was not reassigned and
 *                      could potentially be declared with 'const'.
 */
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
 * Checks whether a given export declaration matches a specified component name, considering both default and 
 * named exports in the check. This utility helps identify if a particular component or identifier is exported
 * with the expected name from a file.
 *
 * @param {Path} path - The Babel AST path representing an export declaration node.
 * @param {string} componentName - The name of the component to check for in the export declaration.
 * @returns {boolean} - True if the given export declaration includes an export with the specified component name; false otherwise.
 */
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

// Improved function to check if the path represents a styled component  
function isStyledComponent(path) {  
  if (t.isTaggedTemplateExpression(path.node)) {  
    const tag = path.get('tag');  
  
    // Check for basic styled member expression (e.g., styled.div)  
    if (t.isMemberExpression(tag)) {  
      const object = tag.get('object');  
      return (  
        t.isIdentifier(object) &&  
        object.node.name === 'styled' &&  
        t.isIdentifier(tag.get('property'))  
      );  
    }  
  
    // Check for styled call expression (e.g., styled(Button))  
    if (t.isCallExpression(tag)) {  
      const callee = tag.get('callee');  
      return (  
        t.isIdentifier(callee.node, { name: 'styled' }) &&  
        tag.node.arguments.length > 0  
      );  
    }  
  }  
  
  // Check if it's a styled component creation using styled(Component)  
  if (t.isCallExpression(path.node)) {  
    const callee = path.get('callee');  
    return (  
      t.isIdentifier(callee.node, { name: 'styled' }) &&  
      path.node.arguments.length > 0  
    );  
  }  
  
  return false;  
}  

function isClassComponent(path) {  
  if (path.isClassDeclaration()) {  
    const superClass = path.node.superClass;  
    if (superClass && (  
      (t.isIdentifier(superClass) && superClass.name === 'Component') ||  
      (t.isMemberExpression(superClass) && superClass.object.name === 'React' && superClass.property.name === 'Component')  
    )) {  
      return true;  
    }  
  }  
  return false;  
}  


// ---------------------- Get functions ----------------------

/**  
 * Retrieves the main component name from a given file path.  
 *  
 * @param {string} filePath - The path of the file.  
 * @returns {string} - The main component name.  
 */  
function getMainComponentNameFromFileName(filePath) {  
  // Extract the file name without directory path or extension  
  const baseName = path.basename(filePath, path.extname(filePath));  
  // Turn the first letter to uppercase (React component names are PascalCase)  
  return baseName.charAt(0).toUpperCase() + baseName.slice(1);  
} 

// ---------------------- Find functions ----------------------
/**
 * Finds the index of the last import declaration in an array of body nodes.
 *
 * @param {Array} bodyNodes - The array of body nodes.
 * @returns {number} - The index of the last import declaration, or -1 if no import declaration is found.
 */
function findLastImportIndex(bodyNodes) {
  let lastImportIndex = -1;
  for (let i = 0; i < bodyNodes.length; i++) {
    if (bodyNodes[i].type === 'ImportDeclaration') {
      lastImportIndex = i;
    }
  }

  if(lastImportIndex === -1) {
    console.log('No import statement found in the file.');
  }
  return lastImportIndex;
}

/**   
 * Identifies the type of a given AST path within a JavaScript or TypeScript file.  
 *   
 * @param {Path} path - The Babel AST path for which the type needs to be recognized.  
 * @param {State} state - A state object that may carry additional information useful for recognition of certain declaration types.  
 * @param {string} filePath - The file path for the current file being processed, useful for context in type recognition.  
 *   
 * @returns {string} The recognized type as a string.  
 */  
function recognizeType(path, state, filePath) {  
  if (isVariableDeclarator(path) && isCustomHook(path.get('init'))) {  
      return 'customHook';  
  } else if (isMainFunctionComponent(path, state, filePath)) {  
      return 'mainFunctionComponent';  
  } else if (path.isFunctionDeclaration()) {  
      if (isFunctionalComponent(path)) {  
          return 'functionalComponent';  
      }  
      return 'helperFunction'; // Recognize normal functions as helper functions  
  } else if (path.isArrowFunctionExpression() || path.isFunctionExpression()) {  
      if (isReactComponent(path.parentPath).isComponent) {  
          return 'functionalComponent';  
      }  
      return 'expressionFunction';  
  } else if (isGlobalConstant(path)) {  
      return 'globalConstant';  
  } else if (isLocalConstant(path)) {  
      return 'localConstant';  
  } else if (path.isVariableDeclarator()) {  
      return 'variableDeclarator';  
  } else if (path.isTSInterfaceDeclaration()) {  
      return 'TSInterfaceDeclaration';  
  } else if (path.isTSTypeAliasDeclaration()) {  
      return 'TSTypeAliasDeclaration';  
  } else if (path.isTSEnumDeclaration()) {  
      return 'TSEnumDeclaration';  
  } else {  
      console.warn('Recognize type function is not implemented yet', path.node.type);  
  }  
  return 'unknown';  
}  


/**
 * Checks if the context is being used before it's defined.  
 *   
 * @param {NodePath} path - The path of the node to check.  
 * @param {string} filePath - The path of the file being processed.  
 */  
function checkForContextUsageOrder(path, filePath) {  
  // Check if the expression is a call to useContext  
  if (t.isCallExpression(path.node) && t.isIdentifier(path.node.callee, { name: 'useContext' })) {  
    const contextIdentifier = path.node.arguments[0];  
    if (t.isIdentifier(contextIdentifier)) {  
      const contextName = contextIdentifier.name;  
      const binding = path.scope.getBinding(contextName);  
  
      // If the binding is not found or is declared after the current path, report an error  
      if (!binding || (binding.identifier.start > path.node.start)) {  
        reportError(path.node, `Context \`${contextName}\` is used before it is defined.`, filePath);  
      }  
    }  
  }  
}  


function processFunctionType(type, path, state, filePath) {  
  switch (type) {  
    case 'customHook':  
      handleCustomHookDeclaration(path, state, filePath);  
      break;  
    case 'mainFunctionComponent':  
      handleMainReactComponent(path, state, filePath);  
      break;  
    case 'helperFunction':  
      handleHelperFunctionDeclaration(path, state, filePath);  
      break;  
    case 'arrowFunction':  
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
      break;  
    case 'TSInterfaceDeclaration':  
      handleTSInterfaceDeclaration(path, state, filePath);  
      break;  
    case 'TSTypeAliasDeclaration':  
      handleTSTypeAliasDeclaration(path, state, filePath);  
      break;  
    case 'TSEnumDeclaration':  
      handleTSEnumDeclaration(path, state, filePath);  
      break;  
    case 'unknown':  
    default:  
      console.log('Unrecognized function type. Please add this function type to the structure code script.', path.node.type);  
      break;  
  }  
}  



/**  
 * Analyzes the variable declarations in the code to encourage best practices for using declaration keywords ('const', 'let', or 'var').  
 * Specifically, the function:  
 * - Validates if the variable declaration is structured as expected with a 'kind' property indicating the type of declaration.  
 * - If 'var' is used, it suggests avoiding 'var' due to its function-wide hoisting and returns false.  
 * - For 'let' declarations, it assesses all references to the declared variable to determine if there is any reassignment.  
 * - Utilizes an isReassignment helper function to identify reassignment scenarios.  
 * - If no reassignment occurs for a 'let' declaration, it infers that 'const' would have been more appropriate to signify a non-reassignable binding.  
 * It reports cases where 'let' could be replaced by 'const' to signal the intent of a constant value more clearly.  
 *   
 * @param {Path} path - The Babel AST path object for the variable declaration node.  
 * @returns {boolean} - Returns true if the declaration keyword is appropriately used ('const' or justified 'let').  
 *                      Returns false if 'var' is used or 'let' is used without necessity (i.e., no reassignments found).  
 */  
function checkDeclarationKeyword(path, filePath) {
  // Ensure that the node is a VariableDeclarator and has a kind (var, let, const)  
  if (!path.parentPath || !path.parentPath.node || !path.parentPath.node.kind) {  
      return false;  
  }  
  const declarationKind = path.parentPath.node.kind; // can be "var", "let", or "const"  
  const isInitialized = path.node.init !== null;  
    
  // If 'var' is used, that's a problem  
  if (declarationKind === 'var') {  
      reportVariablePlacementIssue(path.node.id.name, path, 'DeclarationKeyword', filePath, path.node, {  // Utilisation de `filePath` ici  
          fix: `Consider using 'let' or 'const' instead of 'var'.`  
      });  
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
          reportVariablePlacementIssue(identifierName, path, 'DeclarationKeyword', filePath, path.node, {  // Utilisation de `filePath` ici  
              fix: `Use 'const' instead of 'let' for variable '${identifierName}' as it is not reassigned.`  
          });  
          return false;  
      }  
  }  
  // If using 'const' or if 'let' is justified, it's fine  
  return true;  
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

// ---------------------- handle functions ----------------------

/**
 * Processes an ImportDeclaration within the AST to ensure that imports are declared before other specific code constructs.
 * When encountering an import statement, the function checks if certain elements that should be positioned after the imports,
 * such as constants, types, helper functions, and React components, have been already declared. If these elements are 
 * found preceding an import statement, an error is reported since it violates the conventional file organization in a module.
 * It then marks the presence of an import within the current file's state to help enforce proper code structure in subsequent checks.
 *
 * @param {Path} path - The Babel AST path corresponding to the ImportDeclaration node.
 * @param {State} state - The state object, often used to maintain traversal state throughout the AST.
 *                        It includes flags that indicate whether certain code elements have been seen.
 * @param {string} filePath - The filesystem path to the source code file being processed.
 *                            Utilized when generating error messages to provide context.
 *
 * Note: The current implementation logs the import statement type to the console and reports an error
 * through a dedicated function, which should be elaborated upon to handle various error reporting requirements.
 * TODO: Extend the error reporting to include more detailed information and possibly integrate with tooling that
 * provides feedback within the developer's environment.
 */
function handleImportDeclaration(path, state, filePath) {  
  console.log('Import statement detected:', path.node.type);     
  if (state.functionComponentState.insideReactComponent) {  
    reportError(path.node, 'Imports should not be declared inside a function or component.', filePath);  
  } else {  
    if (state.topLevelState.hasGlobalConstants || state.topLevelState.hasHelperFunctions   
      || state.topLevelState.hasCustomHooks || state.topLevelState.hasStyledComponents   
      || state.topLevelState.hasInterfaces || state.topLevelState.hasTypes   
      || state.topLevelState.hasEnums || state.topLevelState.hasMainComponent   
      || state.topLevelState.hasReactComponent || state.topLevelState.hasPropTypes   
      || state.topLevelState.hasDefaultProps || state.topLevelState.hasExports) {  
          
      const errorMessage = generateErrorMessage("Import statements", state.topLevelState, filePath);  
      if (errorMessage) {  
        reportError(path.node, errorMessage, filePath);  
      }  
    }  
    state.topLevelState.hasImports = true;  
  }  
}  
 

/**  
 * Handles variable declarators by performing various checks to ensure proper usage and adherence to code standards.  
 * It differentiates between top-level global constants and local constants within functions or blocks.  
 * The function checks for proper initialization, grouping, declaration keywords, and ensures the correct placement within the scope.  
 *  
 * @param {Path} path - The Babel AST path for the variable declarator node.  
 * @param {State} state - The state object used to track the structure of code elements.  
 * @param {string} filePath - The path to the current file being processed for context in reporting.  
 */  
function handleVariableDeclarator(path, state, filePath) {  
  if (!path.isVariableDeclarator()) {  
    return;  
  }  
  
  const variableName = path.node.id.name;  
  
  if (!checkDeclarationKeyword(path, filePath)) {  
    return;  
  }  
  
  const isTopLevel = path.scope.path.type === 'Program';  
  const isInsideFunctionOrBlock = path.scope.path.type !== 'Program';  
  const isGlobal = isGlobalConstant(path);  
  const isLocal = isLocalConstant(path);  
  
  if (isTopLevel) {  
    if (isGlobal) {  
      handleGlobalConstantDeclaration(path, state, filePath);  
    } else {  
      const errorMessage = generateErrorMessage("Variable declaration at the top level", state, filePath);  
      if (errorMessage) {  
        reportError(path.node, `Variable "${variableName}" should not be at the top level.`, filePath, 'Variable', {  
          suggestions: 'Ensure this variable is either a global constant or moved to an appropriate scope.',  
          fix: `Consider moving the variable "${variableName}" into an appropriate function or block scope.`  
        });  
      }  
      state.topLevelState.hasDeclarations = true;  
    }  
  } else if (isInsideFunctionOrBlock) {  
    if (isLocal) {  
      const currentState = state.functionComponentState.insideReactComponent ? state.functionComponentState : state.topLevelState;  
      if (  
        currentState.hasHooks ||  
        currentState.hasHandlers ||  
        currentState.hasReactComponent ||  
        currentState.hasPropTypes ||  
        currentState.hasDefaultProps ||  
        currentState.hasExports  
      ) {  
        const errorMessage = generateErrorMessage("Local constant declaration", currentState, filePath);  
        if (errorMessage) {  
          reportError(path.node, `Local constant "${variableName}" should be declared properly.`, filePath, 'Constant', {  
            suggestions: 'Ensure local constants are declared before hooks, handlers, render logic, and export statements.',  
            fix: `Consider relocating the constant "${variableName}" to the top of its scope.`  
          });  
        }  
      }  
      currentState.hasConstants = true;  
    } else {  
      const errorMessage = generateErrorMessage("Variable declaration inside function or block", state, filePath);  
      if (errorMessage) {  
        reportError(path.node, `Variable "${variableName}" should be correctly placed within its block or function scope.`, filePath, 'Variable', {  
          suggestions: 'Ensure variables inside functions are correctly ordered.',  
          fix: `Consider reordering the variable "${variableName}" within its function or block scope.`  
        });  
      }  
    }  
  }  
}  



/**
 * Handles the traversal and processing of a functional React component node within the AST. 
 * This function delegates to a more general `handleMainReactComponent` handler that deals with common tasks associated 
 * with React components, such as checking for proper usage, following conventions, or analyzing component-specific patterns.
 * Since functional components are a subset of React components, they are processed in the context of the main component handler.
 *
 * @param {Path} path - The path object encapsulating the functional component node within the AST.
 *                        The path provides methods and context to analyze or manipulate the current AST node.
 * @param {State} state - The state object which is intended to persist state across multiple different visitor functions 
 *                        or plugins within the Babel transform process. It can be used to store and access information
 *                        specific to the current traversal or transformation.
 * @param {string} filePath - The file path of the source file being processed by Babel, which can be useful for 
 *                            reporting purposes, such as providing context in error or log messages.
 */
function handleFunctionalComponent(path, state, filePath) {
  handleMainReactComponent(path, state, filePath);
}

/**
 * Processes global constant declarations within the AST to enforce that they are placed prior to helper functions, hooks, 
 * React components, and export statements. The function checks if a constant declaration is at the top level of the module 
 * (directly within the 'Program' scope) and not nested inside other constructs. If elements that should follow the global 
 * constants are already declared, it generates an error message to maintain the intended code organizational structure.
 * Subsequently, it flags the presence of global constant declarations in the current file state, which can be utilized 
 * in later checks to preserve the desired order of code elements.
 *
 * @param {Path} path - The Babel AST path corresponding to the global constant declaration node.
 * @param {State} state - The state object that captures and retains traversal state throughout the processing of the AST.
 *                        It is used to track whether other code elements have been encountered yet.
 * @param {string} filePath - The path to the source code file being processed by Babel.
 *                            This information is included in error reports for context.
 *
 * Note: Reporting is handled by a separate `reportError` function, which should be sufficiently robust to 
 * present meaningful information to the developer. Additionally, a console log provides immediate feedback on the type of node detected.
 * TODO: Evaluate the possibility of enhancing error reporting with actionable feedback, user-friendly messaging,
 * and configuration options to align with differing codebase standards or team preferences.
 */
function handleGlobalConstantDeclaration(path, state, filePath) {  
  console.log('Global constant declaration detected:', path.node.type);  

  // Check if the path is directly under the Program node (not nested inside any function/component)  
  if (path.scope.path.type === 'Program' && isGlobalConstant(path)) {  
      if (state.hasConstants ||   
          state.hasHelperFunctions ||   
          state.hasCustomHooks ||   
          state.hasStyledComponents ||   
          state.hasInterfaces ||   
          state.hasTypes ||   
          state.hasEnums ||   
          state.hasMainComponent ||   
          state.hasHandlers ||   
          state.hasHooks ||   
          state.hasReactComponent ||   
          state.hasPropTypes ||   
          state.hasDefaultProps ||   
          state.hasExports  
      ) {  
          const errorMessage = generateErrorMessage("Global constant", state, filePath);  
          if (errorMessage) {  
              reportError(path.node, errorMessage, filePath);  
          }  
      }  
      state.hasGlobalConstants = true;  
  }  
}  


/**
 * Handles TypeScript interface declarations, checking for proper placement within the code structure. If interfaces are
 * declared after Enums, helper functions, hooks, or React components—a violation of typical organizational standards—an 
 * error is reported. The state is then updated to indicate that an interface declaration has been processed.
 *
 * @param {Path} path - The path of the interface declaration in the AST.
 * @param {State} state - The traversal state, used to assess code structure.
 * @param {string} filePath - The file path for error context.
 *
 * Note: Logs are generated for diagnostic purposes. The function presumes an ordering convention that may need adjustment according to project guidelines.
 * TODO: Optimize error reporting and ensure alignment with overarching code standards.
 */
function handleTSInterfaceDeclaration(path, state, filePath) {  
  console.log('Interface declaration detected:', path.node.type);  
    
  if (state.hasTypes ||   
      state.hasEnums ||   
      state.hasMainComponent ||   
      state.hasHandlers ||   
      state.hasHooks ||   
      state.hasReactComponent ||   
      state.hasPropTypes ||   
      state.hasDefaultProps ||   
      state.hasExports) {  
        
      const errorMessage = generateErrorMessage("Interface", state, filePath);  
      if (errorMessage) {  
          reportError(path.node, errorMessage, filePath);  
      }  
  }  
    
  state.hasInterfaces = true;  
}  


/**
 * Processes TypeScript type alias declarations within the AST to enforce code organization conventions, ensuring type aliases
 * are declared before the interfacing of Enums, helper functions, hooks, and React components. This check verifies that a type
 * alias is not declared after these constructs, as this could indicate a deviation from the preferred organizational structure 
 * in TypeScript code. Upon encountering a misplaced type alias, the function generates an appropriate error message. It also 
 * updates the state object to flag the presence of type alias declarations, which is beneficial for later traversal checks.
 *
 * @param {Path} path - The Babel AST path representing the TypeScript type alias declaration node.
 * @param {State} state - The state object that holds information about the types of declarations encountered during the AST traversal.
 *                        It is crucial for maintaining the order of declarations and detecting misplaced code structures.
 * @param {string} filePath - The path to the TypeScript source file being processed. This is included in error messages, providing 
 *                            developers with the context needed to locate and address code organization issues.
 *
 * Note: The function currently outputs a console log for diagnostic purposes and assumes a specific order of type declarations. Modifications
 * may be required if the code organization conventions change.
 */
function handleTSTypeAliasDeclaration(path, state, filePath) {  
  console.log('Type alias declaration detected:', path.node.type);  
    
  if (state.hasEnums ||   
      state.hasMainComponent ||   
      state.hasHandlers ||   
      state.hasHooks ||   
      state.hasReactComponent ||   
      state.hasPropTypes ||   
      state.hasDefaultProps ||   
      state.hasExports) {  
        
      const errorMessage = generateErrorMessage("Type alias", state, filePath);  
      if (errorMessage) {  
          reportError(path.node, errorMessage, filePath);  
      }  
  }  
    
  state.hasTypes = true;  
}  


/**
 * Processes TypeScript Enum declarations within the AST to ensure that they are placed prior to helper functions, hooks, 
 * and React components. It checks if the Enum declaration appears before these other specific code constructs, which is 
 * generally the recommended structure for TypeScript files. If elements that should follow the Enums are detected to have 
 * been declared earlier, it generates an error message indicating the violation of the expected order. After processing, 
 * it updates the state to mark the presence of Enum declarations in the current file.
 *
 * @param {Path} path - The Babel AST path corresponding to the TypeScript Enum declaration node.
 * @param {State} state - An object maintaining the traversal state during the AST processing. Utilized here to track 
 *                        whether certain code constructs like helper functions, hooks, or React components have already 
 *                        been encountered, possibly in the wrong order.
 * @param {string} filePath - The filesystem path to the TypeScript source file being examined. Useful for providing 
 *                            accurate context in any error messages or reports generated.
 *
 * Note: This function assumes that Enums should come before helper functions, custom hooks, and React components. If the 
 * project structure deviates from this assumption, adjust the order in which presence flags are checked in the state object.
 * TODO: Streamline error handling and improve the specificity of the error messaging to assist developers in quickly resolving 
 * structural issues. Consider implementing a more sophisticated logging system or integrating with project-specific tooling 
 * for issue reporting.
 */
function handleTSEnumDeclaration(path, state, filePath) {  
  console.log('Enum declaration detected:', path.node.type);  
  if (state.hasMainComponent || state.hasHandlers  
    || state.hasHooks || state.hasReactComponent  
    || state.hasPropTypes || state.hasDefaultProps  
    || state.hasExports) {  
    const errorMessage = generateErrorMessage("Enums", state, filePath);  
    if (errorMessage) {  
      reportError(path.node, errorMessage, filePath);  
    }  
  }  
  state.hasEnums = true;  
} 

// Improved function to handle a styled component  
function handleStyledComponent(path, state, filePath) {  
  if (isStyledComponent(path)) {  
    const tag = path.get('tag');  
  
    if (t.isMemberExpression(tag)) {  
      // It's a styled member expression like styled.div  
      const property = tag.get('property').node.name;  
      console.log('Found styled component:', property);  
    } else if (t.isCallExpression(tag)) {  
      // It's a styled call expression like styled(Button)  
      const styledComponent = tag.get('arguments')[0];  
      if (styledComponent) {  
        console.log('Found styled component with custom component:', styledComponent.node.name);  
      }  
    }  
  
    // Ensure styled components are declared in the appropriate order  
    if (state.hasInterfaces || state.hasTypes  
      || state.hasEnums || state.hasMainComponent  
      || state.hasHandlers || state.hasHooks  
      || state.hasReactComponent || state.hasPropTypes  
      || state.hasDefaultProps || state.hasExports) {  
      const errorMessage = generateErrorMessage("Styled Component", state, filePath);  
      if (errorMessage) {  
        reportError(path.node, errorMessage, filePath);  
      }  
    }  
    state.hasStyledComponents = true;  
  }  
}  

/**  
 * Evaluates declarations to identify custom hook functions, ensuring that they conform to the conventions for naming and placement.   
 * A custom hook is expected to start with "use" and adhere to the structural order in the code where functions, components, types,  
 * and export statements have predetermined positions. If a hook is found out of order, an error message is generated to report  
 * the discovered code organization issue.  
 *  
 * @param {Path} path - The path containing the custom hook declaration.  
 * @param {State} state - Tracks the type of declarations encountered for maintaining code organization.  
 * @param {string} filePath - The location of the file being traversed, used for error reporting.  
 *  
 * Note: This function assumes that the naming and structuring conventions for React hooks are being followed.  
 * TODO: Enhance naming and placement validation, making adjustments as needed to reflect custom project standards.  
 */  
function handleCustomHookDeclaration(path, state, filePath) {  
  console.log('Custom hook declaration detected:', path.node.type);
  let functionName = '';  
  
  // Get the function name for both function declarations and variable declarations  
  if (path.node.type === 'FunctionDeclaration') {  
    functionName = path.node.id.name;  
  } else if (path.node.type === 'VariableDeclaration') {  
    path.node.declarations.forEach(declarator => {  
      const initializer = declarator.init;  
      if (initializer && (initializer.type === 'FunctionExpression' || initializer.type === 'ArrowFunctionExpression')) {  
        functionName = declarator.id.name;  
      }  
    });  
  }  
  
  // Ensure the function name follows the custom hook naming pattern (starts with "use")  
  if (functionName && /^use[A-Z]/.test(functionName)) {  
    console.log('Custom hook declaration detected:', path.node.type);  
  
    // Ensure custom hooks are declared in the right order  
    if (state.hasStyledComponents || state.hasInterfaces  
        || state.hasTypes || state.hasEnums  
        || state.hasMainComponent  
        || state.hasHandlers || state.hasHooks  
        || state.hasReactComponent || state.hasPropTypes  
        || state.hasDefaultProps || state.hasExports) {  
      const errorMessage = generateErrorMessage('Custom Hooks', state, filePath);  
      if (errorMessage) {  
        reportError(path.node, errorMessage, filePath);  
      }  
    }  
    state.hasCustomHooks = true;  
    enterReactComponent(state);  
  
    // Traverse the custom hook for additional logic specific to React hook structure  
    path.traverse({  
      VariableDeclarator(innerPath) {  
        if (!hasDisableCheckComment(innerPath)) {  
          handleVariableDeclarator(innerPath, state, filePath);  
        }  
      },  
      CallExpression(innerPath) {  
        if (!hasDisableCheckComment(innerPath)) {  
          checkForContextUsageOrder(innerPath);  
        }  
      },  
      ReturnStatement(innerPath) {  
        if (!hasDisableCheckComment(innerPath)) {  
          handleReturnStatement(innerPath, state, filePath);  
        }  
      },  
      JSXElement(innerPath) {  
        if (!hasDisableCheckComment(innerPath)) {  
          handleJSXElement(innerPath, state, filePath);  
        }  
      },  
      FunctionExpression(innerPath) {  
        if (!hasDisableCheckComment(innerPath)) {  
          handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);  
        }  
      },  
      ArrowFunctionExpression(innerPath) {  
        if (!hasDisableCheckComment(innerPath)) {  
          handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);  
        }  
      },  
      exit(innerPath) {  
        if (innerPath === path) {  
          // Exit from the component  
          exitReactComponent(state);  
        }  
      }  
    });  
  }  
}  
 
/**  
 * Handles local constant declarations inside functions or components and ensures they precede hook states, contexts, effects,  
 * and handler function declarations. If a local constant is found after such hooks and functions, it reports an error.  
 * If the declaration occurs at the top level of the module ('Program'), it treats it as a global constant instead.  
 *  
 * @param {Path} path - The path for the local constant declaration.  
 * @param {State} state - State object tracking the encountered hooks and declarations.  
 * @param {string} filePath - The file being processed for context in reporting.  
 *  
 * Note: It assumes that non-top-level constants should precede specific hook and function declarations.  
 * TODO: Review and refine the way local and global constants are distinguished and handled.  
 */  
function handlelocalConstantDeclaration(path, state, filePath) {  
  console.log('Local constant declaration detected:', path.node.type);  

  // Check if the variable declarator is part of a variable declaration  
  if (!path.isVariableDeclarator()) {  
      return;  
  }  
  
  const variableName = path.node.id.name;  
  // Check the declaration keyword to ensure best practices are followed  
  if (!checkDeclarationKeyword(path)) {  
      return;  
  }  

  // Determine the context in which the variable is declared  
  const isTopLevel = path.scope.path.type === 'Program';  
  const isInsideFunctionOrBlock = path.scope.path.type !== 'Program';  
  const isGlobal = isGlobalConstant(path);  
  const isLocal = isLocalConstant(path);  

  if (isInsideFunctionOrBlock) {  
      // Handle local constant  
      const currentState = state.functionComponentState.insideReactComponent ? state.functionComponentState : state.topLevelState;  
      if (  
          currentState.hasHooks ||  
          currentState.hasHandlers ||  
          currentState.hasReactComponent ||  
          currentState.hasPropTypes ||  
          currentState.hasDefaultProps ||  
          currentState.hasExports  
      ) {  
          const errorMessage = generateErrorMessage("Local constant declaration", currentState, filePath);  
          if (errorMessage) {  
              reportError(path.node, errorMessage, filePath);  
          }  
      }  
      currentState.hasConstants = true;  
  } else {  
      // If the variable declaration is not within a function, consider it as a global constant  
      handleGlobalConstantDeclaration(path, state, filePath);  
  }  
}  



/**
 * Identifies and processes the main React component within a file. The main React component is typically the first
 * or most significant component in the file. Upon detection, various state flags are set to denote the presence of
 * the main React component, and additional traversal logic is applied specifically to the React component's structure.
 * The function also sets up the handling for React-specific constructs like JSX elements, imports related to the component,
 * and other function expressions within the component.
 *
 * @param {Path} path - The path for the main React component node within the AST.
 * @param {State} state - State object with flags and paths indicating what has been encountered during AST traversal.
 * @param {string} filePath - The file path of the current file being processed.
 *
 * Note: Assumes React component conventions and may require adjustments for projects following different conventions or
 * using different versions/frameworks of React.
 * TODO: Consider support for class components and refine the traversal logic to accommodate advanced patterns or React features.
 */
function handleMainReactComponent(path, state, filePath) {  
  if (isMainFunctionComponent(path, state, filePath)) {  
    if (state.hasHandlers || state.hasHooks   
      || state.hasReactComponent || state.hasPropTypes   
      || state.hasDefaultProps || state.hasExports) {   
      const errorMessage = generateErrorMessage("Main function/component", state, filePath);  
      if (errorMessage) {  
        reportError(path.node, errorMessage, filePath);  
      }  
    }  
    console.log('Main React component (primary check) detected:', path.node.type);  
    state.hasReactComponent = true;  
    state.hasMainComponent = true;  
    state.mainComponentPath = path;  
    enterReactComponent(state);  
      
    path.traverse({  
      VariableDeclarator(innerPath) {  
        if (!hasDisableCheckComment(path)) {  
          handleVariableDeclarator(innerPath, state, filePath);  
        }  
      },  
      CallExpression(path) {  
        if (!hasDisableCheckComment(path)) {  
          checkForContextUsageOrder(path);  
        }  
      },  
      ReturnStatement(innerPath) {  
        if (!hasDisableCheckComment(path)) {  
          handleReturnStatement(innerPath, state, filePath);  
        }  
      },  
      JSXElement(innerPath) {  
        if (!hasDisableCheckComment(path)) {  
          handleJSXElement(innerPath, state, filePath);  
        }  
      },  
      FunctionExpression(innerPath) {  
        if (!hasDisableCheckComment(path)) {  
          handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);  
        }  
      },  
      ArrowFunctionExpression(innerPath) {  
        if (!hasDisableCheckComment(path)) {  
          handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);  
        }  
      },  
  
      exit(innerPath) {  
        if (innerPath === path) {  
          exitReactComponent(state);  
        }  
      },  
    });  
  }  
}  


/**   
 * Handles the detection of helper function declarations within the code, ensuring they are appropriately positioned   
 * in relation to constants, hooks, components, exports, and prop type definitions.   
 * It checks whether these elements precede the helper function, which could indicate an organization issue within the code structure.  
 * If an organizational issue is found, an error message is generated.  
 *   
 * @param {Path} path - The path representing the helper function declaration node in the AST.   
 * @param {State} state - The state object tracking the order of code structure elements during AST traversal.  
 * @param {string} filePath - The file path of the source file for context in error reporting.  
 */  
function handleHelperFunctionDeclaration(path, state, filePath) {  
  console.log('Helper function declaration detected:', path.node.type);  
    
  // Ensure functions are declared before hooks, main components, and other React-specific constructs  
  const currentState = state.functionComponentState.insideReactComponent ? state.functionComponentState : state.topLevelState;  
    
  if (currentState.hasCustomHooks ||  
      currentState.hasStyledComponents ||  
      currentState.hasInterfaces ||  
      currentState.hasTypes ||  
      currentState.hasEnums ||  
      currentState.hasMainComponent ||  
      currentState.hasHandlers ||  
      currentState.hasHooks ||  
      currentState.hasReactComponent ||  
      currentState.hasPropTypes ||  
      currentState.hasDefaultProps ||  
      currentState.hasExports) {  
        
      const errorMessage = generateErrorMessage("Helper Functions", state, filePath);  
      if (errorMessage) {  
          reportError(path.node, errorMessage, filePath);  
      }  
  }  
    
  // Mark helper functions correctly in the state  
  currentState.hasHelperFunctions = true;  
    
  enterReactComponent(state);  
    
  // Traverse the function for additional logic specific to React function structure  
  path.traverse({  
      VariableDeclarator(innerPath) {  
          if (!hasDisableCheckComment(path)) {  
              handleVariableDeclarator(innerPath, state, filePath);  
          }  
      },  
      CallExpression(innerPath) {  
          if (!hasDisableCheckComment(path)) {  
              checkForContextUsageOrder(innerPath, filePath);  
          }  
      },  
      ReturnStatement(innerPath) {  
          if (!hasDisableCheckComment(path)) {  
              handleReturnStatement(innerPath, state, filePath);  
          }  
      },  
      JSXElement(innerPath) {  
          if (!hasDisableCheckComment(path)) {  
              handleJSXElement(innerPath, state, filePath);  
          }  
      },  
      FunctionExpression(innerPath) {  
          if (!hasDisableCheckComment(path)) {  
              handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);  
          }  
      },  
      ArrowFunctionExpression(innerPath) {  
          if (!hasDisableCheckComment(path)) {  
              handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);  
          }  
      },  
      // Add other node type handlers here as needed  
      exit(innerPath) {  
          if (innerPath === path) { // Exit from the function  
              exitReactComponent(state);  
          }  
      }  
  });  
}  


// TODO: Ajouter la gestion de ce handler dans les autre composants
/**
 * Processes function expressions and arrow functions, evaluating their names to categorize them as hooks or handler functions.
 * Hooks should precede handler functions and render logic within a component structure. This function enforces the correct
 * positioning of these elements by reporting errors if the conventional order is violated.
 *
 * @param {Path} innerPath - The Babel AST path for the function expression or arrow function node.
 * @param {State} state - An object that tracks the encountered elements within the React component scope.
 * @param {string} filePath - The path of the file being processed, used for error context.
 *
 * Note: Assumes naming conventions where hooks start with 'use' and handlers with 'handle'. The state is updated with flags 
 * corresponding to the order of these function types.
 */
function handleFunctionExpressionsAndArrowFunctions(path, state, filePath) {  
  const functionName = path.node.id && path.node.id.name || 'Anonymous';  
  
  // Identify if the function is a hook (e.g., useEffect)  
  if (functionName && /^use[A-Z]/.test(functionName)) {  
    if (state.hasPropTypes || state.hasDefaultProps || state.hasExports) {  
      reportError(path.node, `Hook "${functionName}" should be declared before props and exports.`, filePath, 'Hook', {  
        suggestions: 'Move this hook before any PropTypes, default props, and export statements.',  
        fix: 'Consider relocating the hook towards the beginning of the function.'  
      });  
    }  
    state.hasHooks = true; // Assumes state contains a hasHooks flag  
  // Identify if the function is a handler (e.g., handleSubmit)  
  } else if (functionName && /^handle[A-Z]/.test(functionName)) {  
    if (state.hasHooks) {  
      reportError(path.node, `Handler function "${functionName}" should be declared after hooks.`, filePath, 'Handler', {  
        suggestions: 'Move handler functions after all hook calls within the component.',  
        fix: 'Consider relocating this handler function below the hooks.'  
      });  
    } else if (state.hasConditionalRender || state.hasReturn) {  
      reportError(path.node, `Handler function "${functionName}" should be declared before render logic and return statements.`, filePath, 'Handler', {  
        suggestions: 'Move handler functions to precede the render logic and return statements.',  
        fix: 'Consider relocating this handler function above the render logic and return statements.'  
      });  
    }  
    state.hasHandlers = true;  
  }  
  
  // Traverse nested functions within the current function expression  
  path.traverse({  
    FunctionExpression(nestedPath) {  
      handleFunctionExpressionsAndArrowFunctions(nestedPath, state, filePath);  
    },  
    ArrowFunctionExpression(nestedPath) {  
      handleFunctionExpressionsAndArrowFunctions(nestedPath, state, filePath);  
    },  
    JSXElement(nestedPath) {  
      handleJSXElement(nestedPath, state, filePath);  
    },  
    VariableDeclarator(nestedPath) {  
      handleVariableDeclarator(nestedPath, state, filePath);  
    },  
    CallExpression(nestedPath) {  
      checkForContextUsageOrder(nestedPath);  
    },  
    ReturnStatement(nestedPath) {  
      handleReturnStatement(nestedPath, state, filePath);  
    }  
  });  
}  

/**  
 * Processes export statements encountered during AST traversal, identifying whether the main component of the file is  
 * correctly exported. This function logs the export statement type and updates the traversal state to indicate that  
 * an export has occurred. If the main component is exported with the correct name, it logs a confirmation and flags  
 * that the main component has been exported.  
 *  
 * @param {Path} path - The AST path representing an export statement.  
 * @param {State} state - The object tracking the presence of code elements within the file.  
 * @param {string} filePath - The path of the file being processed.  
 */  
function handleExportDeclarations(path, state, filePath) {  
  console.log('Export statement detected:', path.node.type);  
  
  // Check if the export statement is not inside a function or component  
  const insideFunctionOrComponent = path.findParent(p =>   
    p.isFunctionDeclaration() ||   
    p.isFunctionExpression() ||   
    p.isArrowFunctionExpression() ||   
    p.isClassDeclaration()  
  );  
  
  if (insideFunctionOrComponent) {  
    reportError(path.node, 'Exports should not be declared inside a function or component.', filePath);  
    return;  
  }  
  
  // Retrieve all export specifiers if it's an ExportNamedDeclaration  
  if (path.isExportNamedDeclaration()) {  
    const { specifiers } = path.node;  
    specifiers.forEach(specifier => {  
      if (specifier.exported && state.topLevelState.mainComponentName && specifier.exported.name === state.topLevelState.mainComponentName) {  
        console.log(`Main component ${state.topLevelState.mainComponentName} is exported as a named export.`);  
        state.topLevelState.hasExportedMainComponent = true;  
      }  
    });  
  }  
  
  // Check ExportDefaultDeclaration  
  if (path.isExportDefaultDeclaration()) {  
    const { declaration } = path.node;  
    if (isExportDeclarationWithName(path, state.topLevelState.mainComponentName)) {  
      console.log(`Main component ${state.topLevelState.mainComponentName} is exported as the default export.`);  
      state.topLevelState.hasExportedMainComponent = true;  
    }  
    // Check if the default export is a variable or function declaration  
    else if (declaration && (t.isIdentifier(declaration) || t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration))) {  
      if (declaration.name === state.topLevelState.mainComponentName) {  
        console.log(`Main component ${state.topLevelState.mainComponentName} is exported as the default export.`);  
        state.topLevelState.hasExportedMainComponent = true;  
      }  
    }  
  }  
  
  state.topLevelState.hasExports = true;  
}  
  
/**  
 * Inspects JSX elements within the AST to verify they are correctly placed within the structure of a React component.  
 * Validates that the JSX is part of a return statement or suitably encapsulated within variable declarations or conditional   
 * rendering logic in the main component. It reports errors for JSX that does not adhere to these structural guidelines.  
 *  
 * @param {Path} innerPath - The path representing a JSX element node within the AST.  
 * @param {State} state - The state object, used here to track the main component's path and conditional rendering presence.  
 * @param {string} filePath - The file path providing context for error messaging when JSX is found in disallowed locations.  
 */  
function handleJSXElement(innerPath, state, filePath) {  
  console.log('JSX element detected:', innerPath.node.type);  
  
  // Check if the JSX element is within a function (arrow, function, or method).  
  const functionParent = innerPath.findParent(  
    (p) =>  
      p.isFunctionDeclaration() ||  
      p.isFunctionExpression() ||  
      p.isArrowFunctionExpression() ||  
      p.isClassMethod() // Adding check for class methods  
  );  
  
  if (functionParent) {  
    // Check if this JSX is part of the return statement or a variable declaration within the function  
    const isPartOfReturn = !!innerPath.findParent((p) => p.isReturnStatement());  
    const isPartOfVariableDeclarator = !!innerPath.findParent((p) => p.isVariableDeclarator());  
    const isPartOfConditional = !!innerPath.findParent((p) => p.isConditionalExpression() || p.isLogicalExpression() || p.isJSXExpressionContainer());  
    const isPartOfFunctionBody = !!innerPath.findParent((p) => p.isBlockStatement());  
  
    if (isPartOfReturn) {  
      // This JSX is valid because it's part of the return statement  
      // No error should be reported.  
    } else if (  
      functionParent === state.mainComponentPath &&  
      (isPartOfVariableDeclarator || isPartOfConditional || isPartOfFunctionBody)  
    ) {  
      // If we're in the main component, JSX outside of the return statement indicates conditional rendering or valid encapsulation  
      state.hasConditionalRender = true;  
    } else if (isPartOfVariableDeclarator || isPartOfConditional) {  
      // If it's part of a variable declarator or conditional rendering, no error  
    } else {  
      // Error if JSX is floating freely inside the component, not wrapped in a return statement or variable/conditional  
      reportError(  
        innerPath.node,  
        'JSX should be returned from the component or part of a statement within render logic.',  
        filePath  
      );  
    }  
  } else if (innerPath.findParent((p) => p.isProgram())) {  
    // If we're at the program level, any JSX is invalid  
    reportError(  
      innerPath.node,  
      'JSX should be inside a function component or returned directly from an arrow function component.',  
      filePath  
    );  
  }  
}  


/**
 * Evaluates return statements to ensure they are appropriately situated within React components. It differentiates between
 * return statements in the main component and nested ones. Multiple return statements directly within a component trigger
 * an error, as this often indicates complex logic that could be refactored for clarity and maintainability.
 *
 * @param {Path} innerPath - The path representing the return statement AST node.
 * @param {State} state - Contains state information such as flags indicating the current component context.
 * @param {string} filePath - Used for providing context in error messages related to the return statement.
 */
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

/**  
 * Processes useContext calls to ensure the context is defined before being used.  
 *  
 * @param {Path} path - The AST path for the CallExpression node.  
 * @param {State} state - The state object tracking encountered elements.  
 * @param {string} filePath - The file path for reporting errors.  
 */  
function handleUseContext(path, state, filePath) {  
  if (t.isCallExpression(path.node) && t.isIdentifier(path.node.callee, { name: 'useContext' })) {  
    const contextArgument = path.get('arguments')[0];  
    if (t.isIdentifier(contextArgument.node)) {  
      const contextName = contextArgument.node.name;  
      const contextBinding = path.scope.getBinding(contextName);  
      if (!contextBinding) {  
        reportError(path.node, `Context \`${contextName}\` is used before it is defined.`, filePath);  
      }  
    }  
  }  
}  

function handleClassComponent(path, state, filePath) {  
  console.log('Class component detected:', path.node.type);  
  state.hasClassComponent = true;  
  
  // Ensure class components are declared in the correct order  
  if (state.hasHandlers || state.hasHooks   
    || state.hasReactComponent || state.hasPropTypes   
    || state.hasDefaultProps || state.hasExports) {  
    const errorMessage = generateErrorMessage("Class component", state, filePath);  
    if (errorMessage) {  
      reportError(path.node, errorMessage, filePath);  
    }  
  }  
    
  path.traverse({  
    ClassMethod(innerPath) {  
      handleClassMethod(innerPath, state, filePath);  
    },  
    ClassProperty(innerPath) {  
      handleClassProperty(innerPath, state, filePath);  
    },  
    VariableDeclarator(innerPath) {  
      handleVariableDeclarator(innerPath, state, filePath);  
    },  
    enter(innerPath) {  
      enterReactComponent(state);  
    },  
    exit(innerPath) {  
      exitReactComponent(state);  
    }  
  });  
}  
  
function handleClassMethod(path, state, filePath) {  
  const methodName = path.node.key.name;  
  if (methodName === 'constructor') {  
    if (state.hasHooks || state.hasHandlers || state.hasReactComponent) {  
      reportError(path.node, 'Constructor should be declared before hooks, handlers, and other React components.', filePath);  
    }  
    state.hasConstructor = true;  
  } else if (methodName.startsWith('handle')) {  
    if (state.hasHooks || state.hasReactComponent) {  
      reportError(path.node, 'Handlers should be declared before hooks and other React components.', filePath);  
    }  
    state.hasHandlers = true;  
  } else if (methodName.startsWith('render')) {  
    state.hasRenderMethod = true;  
  } else if (methodName.startsWith('componentDid')) {  
    if (state.hasHandlers || state.hasRenderMethod || state.hasReactComponent) {  
      reportError(path.node, 'Lifecycle methods should be declared before handlers, render methods, and other React components.', filePath);  
    }  
    state.hasLifecycleMethods = true;  
  }  
}  
  
function handleClassProperty(path, state, filePath) {  
  const propertyName = path.node.key.name;  
  if (propertyName === 'state') {  
    if (state.hasHandlers || state.hasRenderMethod || state.hasReactComponent) {  
      reportError(path.node, 'State should be declared before handlers, render methods, and other React components.', filePath);  
    }  
    state.hasStateProperty = true;  
  } else {  
    handleVariableDeclarator(path, state, filePath);  
  }  
}  


/**  
 * Handles the identification and processing of React hooks and effects within the AST.  
 * Ensures that hooks are declared before effects, state, and helper functions, following the expected code structure.  
 *  
 * @param {Path} path - The AST path for the node to be processed.  
 * @param {State} state - The state object tracking encountered elements.  
 * @param {string} filePath - The file path for reporting errors.  
 */  
function handleHooksAndEffects(path, state, filePath) {  
  const currentState = state.functionComponentState.insideReactComponent ? state.functionComponentState : state.topLevelState;  
    
  if (path.isCallExpression()) {  
      const calleeName = path.node.callee.name;  

      // Identify hooks and effects  
      const hooks = ['useState', 'useReducer', 'useRef', 'useCallback', 'useMemo', 'useEffect', 'useLayoutEffect', 'useContext', 'useImperativeHandle', 'useDebugValue'];  
      const stateHooks = ['useState', 'useReducer'];  
      const effectHooks = ['useEffect', 'useLayoutEffect'];  

      // Check for state hooks  
      if (stateHooks.includes(calleeName)) {  
          if (currentState.hasEffects || currentState.hasHelperFunctions) {  
              reportError(path.node, 'State hooks (useState, useReducer) should be declared before effects and helper functions.', filePath);  
          }  
          currentState.hasStateHooks = true;  
      }  

      // Check for effects  
      if (effectHooks.includes(calleeName)) {  
          if (currentState.hasHelperFunctions) {  
              reportError(path.node, 'Effects (useEffect, useLayoutEffect) should be declared before helper functions.', filePath);  
          }  
          currentState.hasEffects = true;  
      }  

      // Check for other hooks  
      if (hooks.includes(calleeName) && !stateHooks.includes(calleeName) && !effectHooks.includes(calleeName)) {  
          if (currentState.hasEffects || currentState.hasHelperFunctions) {  
              reportError(path.node, 'Other hooks should be declared before effects and helper functions.', filePath);  
          }  
          currentState.hasHooks = true;  
      }  
  }  

  // Ensure helper functions are declared after hooks and effects  
  if (path.isFunctionDeclaration() || path.isFunctionExpression() || path.isArrowFunctionExpression()) {  
      if (currentState.hasStateHooks || currentState.hasEffects || currentState.hasHooks) {  
          const functionName = path.node.id ? path.node.id.name : 'Anonymous Function';  
          reportError(path.node, `Helper function ${functionName} should be declared after hooks and effects.`, filePath);  
      }  
      currentState.hasHelperFunctions = true;  
  }  
}  


// ---------------------- Traversal setup ----------------------

function hasDisableCheckComment(path) {
  // Check if a comment array contains 'disable-check'
  const containsDisableCheck = (comments) => {
    return Array.isArray(comments) && comments.some(
      (comment) => comment.type === 'CommentLine' && comment.value.trim() === 'disable-check'
    );
  };

  if (path) {
      // Check leadingComments of the current node
      if (containsDisableCheck(path.node.leadingComments)) {
        return true;
      }

    // If the node is a JSXElement or is within a JSXElement,
    // check 'disable-check' comment for its closest parent
    if (path.node.type === 'JSXElement' || path.findParent((p) => p.node.type === 'JSXElement')) {
      let containerPath = path.findParent(
        (p) => p.isReturnStatement() || p.node.type === 'VariableDeclaration'
      );
      // Check leadingComments of the container node
      if (containsDisableCheck(containerPath?.node.leadingComments)) { // Using optional chaining operator
        return true;
      }
    }
  }

  return false;
}


/**  
 * Configures visitor methods for Babel's AST traversal, mapping various node types to their respective handler  
 * functions. This setup is crucial to appropriately react when specific nodes are encountered during the traversal  
 * process, allowing the tool to perform checks, enforce code structure, and potentially transform the code.  
 *  
 * @param {State} state - The state object that holds flags indicating the presence of various code elements encountered so far.  
 * @param {string} filePath - The path of the source file currently being processed by Babel, which can be used for context in reporting.  
 * @returns {Object} An object defining visitor methods for the traversal, linking node types to their respective handling functions.  
 */  
function setupTraverse(state, filePath) {  
  return {  
      ImportDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
              handleImportDeclaration(path, state, filePath);  
          }  
      },  
      VariableDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
            if (isMainFunctionComponent(path, state, filePath)) {  
              handleMainReactComponent(path, state, filePath);  
          } else {
              path.get('declarations').forEach((declaratorPath) => {  
                  const type = recognizeType(declaratorPath, state, filePath);  
                  processFunctionType(type, declaratorPath, state, filePath);  
              });  
          }  
        }
      },  
      TSTypeAliasDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
              handleTSTypeAliasDeclaration(path, state, filePath);  
          }  
      },  
      TSInterfaceDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
              handleTSInterfaceDeclaration(path, state, filePath);  
          }  
      },  
      TSEnumDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
              handleTSEnumDeclaration(path, state, filePath);  
          }  
      },  
      FunctionDeclaration(path) {  
          if (!hasDisableCheckComment(path)) {  
              if (isMainFunctionComponent(path, state, filePath)) {  
                  handleMainReactComponent(path, state, filePath);  
              } else {  
                  const type = recognizeType(path, state, filePath);  
                  processFunctionType(type, path, state, filePath);  
              }  
          }  
      },  
      'ArrowFunctionExpression|FunctionExpression': {  
          enter(path) {  
              if (!hasDisableCheckComment(path)) {  
                  if (path.parentPath.isVariableDeclarator()) {  
                      const type = recognizeType(path.parentPath, state, filePath);  
                      processFunctionType(type, path.parentPath, state, filePath);  
                  }  
              }  
          }  
      },  
      ClassDeclaration(path) {  
        if (!hasDisableCheckComment(path)) {    
          if (isMainFunctionComponent(path, state, filePath)) {  
            handleMainReactComponent(path, state, filePath);    
          } else {  
            handleClassComponent(path, state, filePath);  
          }  
        }    
      }, 
      CallExpression(path) {  
          if (!hasDisableCheckComment(path)) {  
              handleHooksAndEffects(path, state, filePath);  
          }  
      },  
      TaggedTemplateExpression(path) {  
          if (!hasDisableCheckComment(path)) {  
              handleStyledComponent(path, state, filePath);  
          }  
      },  
      'ExportNamedDeclaration|ExportDefaultDeclaration'(path) {  
          if (!hasDisableCheckComment(path)) {  
              handleExportDeclarations(path, state, filePath);  
          }  
      },  
  };  
}  




// ---------------------- Component enter/exit functions ----------------------

/**
 * Sets the state properties to track that traversal has entered a React component context. It flags that the traversal
 * is currently within a React component and resets the flag for detecting multiple return statements in a single component.
 *
 * @param {State} state - The state object to be updated when entering a React component during AST traversal.
 */
function enterReactComponent(state) {  
  state.functionComponentState = {  
    ...state.functionComponentState,  
    hasConstants: false,  
    hasHandlers: false,  
    hasHooks: false,  
    hasReturnInSameComponent: false,  
    insideReactComponent: true,  
  };  
}  

/**
 * Updates the traversal state object to indicate that the AST traversal has exited the context of a React component. 
 * This assists in keeping track of when to apply React-specific checks and rules during code analysis.
 *
 * @param {State} state - The state object to be updated upon exiting a React component during AST traversal.
 */
function exitReactComponent(state) {  
  state.functionComponentState.insideReactComponent = false;  
}  

// ---------------------- fix AST function ----------------------
function analyzeCode(ast, filePath) {  
  const sections = {  
    imports: [],  
    localConstants: new Map(),  
    constants: [],  
    contexts: [], // Added contexts to separate context creations  
    hooks: [],    // Added hooks to separate hooks  
    helperFunctions: [], // Ensure helper functions are initialized as arrays  
    functions: [],  
    components: [],  
    classComponents: [], 
    types: [],  
    exports: [],  
    mainComponent: null,  
  };  
    
  traverse(ast, {  
    ImportDeclaration(path) {  
      sections.imports.push(path.node);  
      path.remove();  
    },  
    VariableDeclaration(path) {  
      if (isGlobalConstant(path)) {  
        sections.constants.push(path.node);  
      } else if (isLocalConstant(path)) {  
        const parentFunction = path.getFunctionParent();  
        if (parentFunction) {  
          const functionBodyNode = parentFunction.node.body;  
          if (sections.localConstants.has(functionBodyNode)) {  
            sections.localConstants.get(functionBodyNode).push(path.node);  
          } else {  
            sections.localConstants.set(functionBodyNode, [path.node]);  
          }  
        } else {  
          sections.constants.push(path.node);  
        }  
      } else if (isContextCreation(path)) {  
        sections.contexts.push(path.node);  
      } else {  
        sections.constants.push(path.node);  
      }  
      path.remove();  
    },  
    TSTypeAliasDeclaration(path) {  
      sections.types.push(path.node);  
      path.remove();  
    },  
    TSInterfaceDeclaration(path) {  
      sections.types.push(path.node);  
      path.remove();  
    },  
    TSEnumDeclaration(path) {  
      sections.types.push(path.node);  
      path.remove();  
    },  
    FunctionDeclaration(path) {  
      if (isMainFunctionComponent(path, {}, getMainComponentNameFromFileName(filePath))) {  
        sections.mainComponent = path.node;  
      } else {  
        sections.helperFunctions.push(path.node); // Adjusted to push helper functions here  
      }  
      path.remove();  
    },  
    ArrowFunctionExpression(path) {  
      if (isReactComponent(path.parentPath) && path.parentPath.isVariableDeclarator()) {  
        if (isMainFunctionComponent(path.parentPath, {}, getMainComponentNameFromFileName(filePath))) {  
          sections.mainComponent = path.parentPath.parent;  
        } else {  
          sections.components.push(path.parentPath.node);  
        }  
      } else if (isCustomHook(path.parentPath)) {  
        sections.helperFunctions.push(path.parentPath.node); // Adjusted to push custom hooks here  
      } else {  
        sections.helperFunctions.push(path.parentPath.node); // Adjusted to push expression functions here  
      }  
      path.parentPath.remove();  
    },  
    ClassDeclaration(path) {  
      if (isClassComponent(path)) {  
        sections.classComponents.push(path.node);  // Push the class component to the classComponents section  
      } else {  
        sections.helperFunctions.push(path.node);  
      }  
      path.remove();  
    }, 
    ExportNamedDeclaration(path) {  
      sections.exports.push(path.node);  
      path.remove();  
    },  
    ExportDefaultDeclaration(path) {  
      sections.exports.push(path.node);  
      path.remove();  
    },  
  });  
  
  return sections;  
}  

  
function reorderCode(sections) {  
  const orderedSections = [  
    ...sections.imports,  
    ...sections.constants,  
    ...sections.contexts, // Place contexts after imports  
    ...sections.hooks,  // Place hooks after constants  
    ...sections.types,  
    ...sections.helperFunctions, 
    ...sections.functions,  
    ...sections.components,  
    ...sections.classComponents,
    sections.mainComponent,  
    ...sections.exports,  
  ];  
  
  for (let [functionBodyNode, localConsts] of sections.localConstants) {    
    const newFunctionBody = [    
      ...localConsts,    
      ...functionBodyNode.body.filter((node) => !localConsts.includes(node)),    
    ];    
    functionBodyNode.body = newFunctionBody;    
  }  
  
  return orderedSections.filter(Boolean);  
}  


  
function reorderCode(sections) {  
  const orderedSections = [  
    ...sections.imports,  
    ...sections.contexts, // Place contexts after imports  
    ...sections.constants,  
    ...sections.hooks,  // Place hooks after constants  
    ...sections.types,  
    ...sections.helperFunctions, // Ensure helper functions are included correctly  
    ...sections.functions,  
    ...sections.components,  
    sections.mainComponent,  
    ...sections.exports,  
  ];  
  
  for (let [functionBodyNode, localConsts] of sections.localConstants) {  
    const newFunctionBody = [  
      ...localConsts,  
      ...functionBodyNode.body.filter((node) => !localConsts.includes(node)),  
    ];  
    functionBodyNode.body = newFunctionBody;  
  }  
  
  return orderedSections.filter(Boolean);  
}  


  
function createNewAST(orderedSections) {  
  return {  
    type: 'Program',  
    body: orderedSections,  
    sourceType: 'module',  
  };  
}  
  
async function fixFile(filePath) {  
  console.log(`Fixing file: ${filePath}`);  
  
  // Create a backup before fixing the file  
  backupFile(filePath);  

  const content = readFileSync(filePath, 'utf-8');  
  const ast = parseFile(content);  
  
  // Analyze and reorder the code sections  
  const sections = analyzeCode(ast, filePath);  
  const orderedSections = reorderCode(sections);  
  
  // Create a new AST with ordered sections  
  const newAst = createNewAST(orderedSections);  
  const newCode = generate(newAst, {}).code;  
  
  // Write the new code to the file  
  fs.writeFileSync(filePath, newCode, 'utf-8');  
  console.log(`File ${filePath} fixed.`);  
}  
  
async function fixProjectStructure(filePath) {  
  try {  
    if (filePath) {  
      await fixFile(filePath); // Fix the specific file  
    } else {  
      console.log('Recherche des fichiers .ts et .tsx dans le projet...');  
      const ignorePattern = await compileIgnorePattern(ignoreFilePath);  
      const files = await findFilesRecursive(projectPath, filePattern, [], ignorePattern);  
  
      if (files.length === 0) {  
        console.log(`Aucun fichier correspondant trouvé avec le motif "${filePattern}".`);  
      } else {  
        console.log(`Fichiers trouvés pour la vérification de structure:`, files);  
        for (const filePath of files) {  
          await fixFile(filePath); // Fix the file structure  
        }  
      }  
    }  
  } catch (err) {  
    console.error('Erreur lors de la recherche de fichiers:', err);  
  }  
  
  console.log('Correction de la structure du projet React terminée.');  
} 
  
function parseCommandLineArguments() {  
  const args = process.argv.slice(2); // Get command-line arguments  
  
  let filePath = '';  
  const fix = args.includes('--fix');  
  const revert = args.includes('--revert');  
  const analyze = args.includes('--analyze');  
  
  // Check if a file path is provided  
  args.forEach(arg => {  
    if (arg.startsWith('--file=')) {  
      filePath = path.resolve(arg.replace('--file=', ''));  
    }  
  });  
  
  return { fix, revert, analyze, filePath };  
}  


// ---------------------- Revert fix option ----------------------
const backupDir = 'backup';  
  
/**  
 * Creates a backup of the given file before making any changes.  
 *   
 * @param {string} filePath - The path of the file to back up.  
 */  
function backupFile(filePath) {  
  const backupFilePath = path.join(backupDir, path.relative(projectPath, filePath));  
  const backupFileDir = path.dirname(backupFilePath);  
  
  // Create directory if it does not exist  
  fs.mkdirSync(backupFileDir, { recursive: true });  
  
  // Copy the file to the backup directory  
  fs.copyFileSync(filePath, backupFilePath);  
  console.log(`Backup of ${filePath} created at ${backupFilePath}`);  
}  
  
/**  
 * Reverts a fixed file to its original state from the backup.  
 *   
 * @param {string} filePath - The path of the file to revert.  
 */  
function revertFile(filePath) {  
  const backupFilePath = path.join(backupDir, path.relative(projectPath, filePath));  
  
  // Check if a backup exists  
  if (fs.existsSync(backupFilePath)) {  
    // Copy the backup file to the original location  
    fs.copyFileSync(backupFilePath, filePath);  
    console.log(`Reverted ${filePath} to its original state.`);  
  } else {  
    console.log(`No backup found for ${filePath}. Unable to revert.`);  
  }  
}  
  
/**  
 * Recursively finds and reverts all backed-up files.  
 *   
 * @param {string} dir - The directory to search for backups.  
 */  
async function revertProjectStructure(filePath) {  
  try {  
    if (filePath) {  
      revertFile(filePath); // Revert the specific file  
    } else {  
      console.log('Reverting project structure from backups...');  
      const files = await findFilesRecursive(backupDir, filePattern);  
  
      if (files.length === 0) {  
        console.log(`No backup files found.`);  
      } else {  
        for (const filePath of files) {  
          const originalFilePath = path.join(projectPath, path.relative(backupDir, filePath));  
          revertFile(originalFilePath);  
        }  
      }  
    }  
  } catch (err) {  
    console.error('Error during reverting project structure:', err);  
  }  
  
  console.log('Reverting project structure completed.');  
}  

  
// Main execution  
const args = parseCommandLineArguments();  
  
if (args.revert) {  
  revertProjectStructure(args.filePath);  
} else if (args.fix) {  
  fixProjectStructure(args.filePath);  
} else if (args.analyze) {  
  checkProjectStructure(args.filePath);  
} else {  
  console.error('Invalid command. Use --fix, --revert or --analyze with an optional --file=<file-path> argument.');  
}  

 

// ---------------------- Disabled functions ----------------------

/**
 * checkHoistingAwareness returns a list of issues related to hoisting. The function checks for three main problems related to hoisting:
 * Usage of var that could lead to unexpected behavior due to function-wide scoping.
 * Function declarations within blocks which, while valid in modern JavaScript, may lead to unpredictable behavior when transpiled for older environments that only support hoisting to the top of the containing function or global scope.
 * Function expressions invoiced before defining assignments, which are not hoisted like function declarations, and could lead to a reference error if used prematurely.
 * Currently not activate since need more specification
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
*/