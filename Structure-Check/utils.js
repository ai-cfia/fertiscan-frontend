const { t, logError, generateErrorMessage, reportError } = require('./common');    
const path = require('path');    


  
///////////////////////////////
///////////////////////////////
/////////// Todo //////////////: Make sure all check are made here
///////////////////////////////  
///////////////////////////////
///////////////////////////////

/**
 * Determines if a given path represents a React component.
 * Checks function declarations, variable declarations, and class declarations to identify React components.
 * Identifies whether the component is a main component based on preceding comments.
 *
 * @function isReactComponent
 * @param {Object} path - The Babel path object to check.
 * @returns {Object} An object containing the result of the check:
 * @returns {boolean} return.isComponent - Whether the path represents a React component.
 * @returns {boolean} return.isMainComponent - Whether the component is identified as a main component.
 * @returns {Object|null} return.path - The path object if it represents a React component, otherwise null.
 * @returns {string} return.componentName - The name of the component if identified.
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
                declarator.isVariableDeclarator() &&  
                t.isIdentifier(declarator.node.id) &&  
                /^[A-Z]/.test(declarator.node.id.name) && // Component names must start with an Uppercase letter  
                declarator.node.init &&  
                t.isArrowFunctionExpression(declarator.node.init) && // Ensure it's an Arrow function  
                declarator.node.init.returnType // Ensure it has a return type  
            ) {  
                componentName = declarator.node.id.name;  
                const returnTypeNode = declarator.node.init.returnType;  
                const typeAnnotation = returnTypeNode.typeAnnotation;  
  
                if (  
                    t.isTSTypeReference(typeAnnotation) &&  
                    (typeAnnotation.typeName.name === 'FC' || typeAnnotation.typeName.name === 'FunctionComponent')  
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
    } else if (path.isClassDeclaration()) {  
        if (isClassComponent(path)) {  
            isComponent = true;  
            componentName = path.node.id.name;  
        }  
    }  
  
    // Check for preceding comments that indicate a main component  
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
 * Determines if a given path represents a custom React hook.
 * Custom hooks must be named with a "use" prefix and must be at the top level,
 * not nested inside another function or component.
 *
 * @function isCustomHook
 * @param {Object} path - The Babel path object to check.
 * @returns {boolean} True if the path represents a custom hook, false otherwise.
 */  
function isCustomHook(path) {  
    // Check if the function is at the top level (not nested inside another function or component)  
    if (path.scope.block.type !== 'Program') {  
        return false;  
    }  
  
    // Custom hooks must not be nested inside another function or component  
    if (path.findParent(p =>   
        p.isFunctionDeclaration() || p.isFunctionExpression() || 
        p.isArrowFunctionExpression() || p.isClassMethod())) {  
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
 * Determines if a given path represents a global constant.
 * Checks if the constant is exported, is at the top level, and follows naming conventions, or is of a global type.
 *
 * @function isGlobalConstant
 * @param {Object} path - The Babel path object for the variable declarator node.
 * @returns {boolean} True if the path represents a global constant, false otherwise.
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
  
///////////////////////////////
///////////////////////////////
/////////// Todo //////////////: Make sure all check are made here
///////////////////////////////  
///////////////////////////////
///////////////////////////////

/**
 * Determines if a given path represents a local constant.
 * Checks if the constant is not exported, is not at the top level, and is inside a function or block statement.
 *
 * @function isLocalConstant
 * @param {NodePath} path - The Babel path object for the variable declarator node.
 * @returns {boolean} True if the path represents a local constant, false otherwise.
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
    // *****Here*****
    const isInsideFunction = path.findParent((parent) => parent.isFunction());  
    const isInsideBlock = path.findParent((parent) => parent.isBlockStatement());  
    return isInsideFunction || isInsideBlock;  
}  
  
///////////////////////////////
///////////////////////////////
/////////// Todo //////////////: Make sure all case are verified here
///////////////////////////////  Also make sure FunctionExpression and 
///////////////////////////////  ArrowFunctionExpression are not doing 
///////////////////////////////  the same thing.   
///////////////////////////////
///////////////////////////////

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

    // Function to detect function expressions recursively  
    const isFunctionExpressionNode = (nodePath) => {  
        if (nodePath.isFunctionExpression() || nodePath.isArrowFunctionExpression()) {  
            return true;  
        }  
  
        // For conditional and logical expressions, check the branches  
        if (nodePath.isConditionalExpression()) {  
            return (  
                isFunctionExpressionNode(nodePath.get('consequent')) ||  
                isFunctionExpressionNode(nodePath.get('alternate'))  
            );  
        }  
        // Handle cases like immediately invoked function expressions (IIFEs)  
        if (nodePath.isCallExpression() && isFunctionExpressionNode(nodePath.get('callee'))) {  
            return true;  
        }  
        // For logical expressions, check both sides  
        if (nodePath.isLogicalExpression()) {  
            return (  
                isFunctionExpressionNode(nodePath.get('left')) ||  
                isFunctionExpressionNode(nodePath.get('right'))  
            );  
        }  
        // If wrapped in parentheses  
        if (nodePath.isParenthesizedExpression()) {  
            return isFunctionExpressionNode(nodePath.get('expression'));  
        }  
        //****** Here ******
        // Add more cases as needed  
        // In other cases, it is not a function expression  
        return false;  
    };  
    // Get the initialization and call the recursive built-in function  
    const initPath = path.get('init');  
    return initPath && isFunctionExpressionNode(initPath);  
}  
  
///////////////////////////////
///////////////////////////////
/////////// Todo //////////////: Make sure all case are verified here
///////////////////////////////  Also make sure FunctionExpression and 
///////////////////////////////  ArrowFunctionExpression are not doing 
///////////////////////////////  the same thing.   
///////////////////////////////
///////////////////////////////

/**
 * Determines if a given path represents an arrow function expression.
 * Checks recursively for arrow function expressions and their presence in conditional, 
 * logical, and call expressions.
 *
 * @function isArrowFunctionExpression
 * @param {NodePath} path - The Babel path object to check.
 * @returns {boolean} True if the path represents an arrow function expression, false otherwise.
 */
function isArrowFunctionExpression(path) {  
    // Function to detect arrow functions recursively    
    const isArrowFunctionNode = (nodePath) => {    
        if (!nodePath || !nodePath.node) {  
            return false;  
        }  
  
        if (isArrowFunctionExpression(nodePath)) {    
            return true;    
        }    
    
        // For conditional expressions, check the branches    
        if (nodePath.isConditionalExpression()) {    
            return (    
                isArrowFunctionNode(nodePath.get('consequent')) ||    
                isArrowFunctionNode(nodePath.get('alternate'))    
            );    
        }    
    
        // Handle cases like immediately invoked function expressions (IIFEs)  
        if (isCallExpression(nodePath)) {    
            return true;    
        }    
    
        // For logical expressions, check both sides  
          
        if (isLogicalExpression(nodePath)) {    
            return (    
                isArrowFunctionNode(nodePath.get('left')) ||    
                isArrowFunctionNode(nodePath.get('right'))    
            );    
        }    
        
        // If wrapped in parentheses    
        if (isParenthesizedExpression()) {    
            return isArrowFunctionNode(nodePath.get('expression'));    
        }    
    
        // Add other cases as needed    
        // In other cases, it is not an arrow function    
        return false;    
    };
        // Get the initialization and call the recursive built-in function    
        const initPath = path.get('init');    
        return initPath && isArrowFunctionNode(initPath);    
}     
    
    /**  
     * Determines if a given path represents a parenthesized expression.  
     *  
     * @function isParenthesizedExpression  
     * @param {Object} path - The Babel path object to check.  
     * @returns {boolean} True if the path represents a parenthesized expression, false otherwise.  
     */  
    function isParenthesizedExpression(path) {  
        return t.isParenthesizedExpression(path);  
    }  

/**  
 * Determines if a given path represents a logical expression.  
 *  
 * @function isLogicalExpression  
 * @param {Object} path - The Babel path object to check.  
 * @returns {boolean} True if the path represents a logical expression, false otherwise.  
 */  
function isLogicalExpression(path) {  
    return t.isLogicalExpression(path.node);  
} 

/**  
 * Determines if a given path represents a call expression.  
 *  
 * @function isCallExpression  
 * @param {Object} path - The Babel path object to check.  
 * @returns {boolean} True if the path represents a call expression, false otherwise.  
 */  
function isCallExpression(path) {  
    return t.isCallExpression(path.node);  
}  
  
/**
 * Determines if a given path represents the main function component based on the file name.
 * Checks function declarations, class declarations, variable declarations, and export default declarations
 * to identify the main component.
 *
 * @function isMainFunctionComponent
 * @param {nodePath} path - The Babel path object to check.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 * @returns {boolean} True if the path represents the main function component, false otherwise.
 */
function isMainFunctionComponent(path, state, filePath) {  
    const mainComponentName = getMainComponentNameFromFileName(filePath);  
  
    if (path.isFunctionDeclaration() || path.isClassDeclaration()) {  
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
 * Determines if a given variable declaration is at the top of its scope.
 * Handles different scope types such as program (global), function, and block scopes.
 * Includes special handling for variables that are part of React functional components and import statements.
 *
 * @function isTopOfScope
 * @param {NodePath} path - The Babel path object for the variable declarator node.
 * @returns {boolean} True if the variable declaration is at the top of its scope, false otherwise.
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

//////////////////////
//////////////////////
/////////// Todo /////: Make sure the isReactFunctionalComponent and
//////////////////////  the isFunctionalComponent become only one function 
//////////////////////  because they to the same thing.
//////////////////////
//////////////////////

/**
 * Determines if a given path represents a React functional component.
 * Checks if the path is a variable declarator initialized with an arrow function
 * that returns JSX or calls React.createElement.
 *
 * @function isReactFunctionalComponent
 * @param {NodePath} path - The Babel path object for the variable declarator node.
 * @returns {boolean} True if the path represents a React functional component, false otherwise.
 */
function isReactFunctionalComponent(path) {
    if (!t.isVariableDeclarator(path.node)) {
        return false;
    }
    const variableDeclarator = path.node;

    // Check if the variable has a type annotation and if it contains React.FC
    if (variableDeclarator.id.typeAnnotation) {
        const typeAnnotation = variableDeclarator.id.typeAnnotation.typeAnnotation;

        // Check if the type annotation is React.FC
        if (t.isTSTypeReference(typeAnnotation) && t.isIdentifier(typeAnnotation.typeName, { name: 'FC' })) {
            return true;
        }
    }

    return false; // Not a React functional component
}

/**  
 * Checks if the node is a TypeScript Interface Declaration.  
 * @param {Object} path - The Babel path object to check.  
 * @returns {boolean} True if the node is a TypeScript Interface Declaration, false otherwise.  
 */  
function isTSInterfaceDeclaration(path) {  
    return t.isTSInterfaceDeclaration(path.node);  
}  
  
/**  
 * Checks if the node is a TypeScript Type Alias Declaration.  
 * @param {Object} path - The Babel path object to check.  
 * @returns {boolean} True if the node is a TypeScript Type Alias Declaration, false otherwise.  
 */  
function isTSTypeAliasDeclaration(path) {  
    return t.isTSTypeAliasDeclaration(path.node);  
}  
  
/**  
 * Checks if the node is a TypeScript Enum Declaration.  
 * @param {Object} path - The Babel path object to check.  
 * @returns {boolean} True if the node is a TypeScript Enum Declaration, false otherwise.  
 */  
function isTSEnumDeclaration(path) {  
    return t.isTSEnumDeclaration(path.node);  
} 
  
/**
 * Determines if a given node represents a call to React.createElement.
 * Checks for both direct calls (e.g., createElement) and member calls (e.g., React.createElement).
 *
 * @function isReactCreateElementCall
 * @param {Node} node - The Babel node to check.
 * @returns {boolean} True if the node represents a call to React.createElement, false otherwise.
 */
function isReactCreateElementCall(node) {
    return t.isCallExpression(node) &&
        t.isMemberExpression(node.callee) &&
        t.isIdentifier(node.callee.object, { name: 'React' }) &&
        t.isIdentifier(node.callee.property, { name: 'createElement' }) &&
        node.arguments.length > 0;
} 
  
//////////////////////
//////////////////////
/////////// Todo /////: Make sure this is relevent or 
//////////////////////  should we use it directly in other methods.
//////////////////////
//////////////////////

/**
 * Determines if a given path represents a variable declarator.
 *
 * @function isVariableDeclarator
 * @param {Object} path - The Babel path object to check.
 * @returns {boolean} True if the path represents a variable declarator, false otherwise.
 */
function isVariableDeclarator(path) {  
    return path.isVariableDeclarator();  
}  
  
/**
 * Determines if a given path represents the creation of a React context.
 * Checks if the path is a variable declarator initialized with a call to React.createContext.
 *
 * @function isContextCreation
 * @param {NodePath} path - The Babel path object to check.
 * @returns {boolean} True if the path represents a context creation using React.createContext, false otherwise.
 */ 
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
 * Determines if a given reference path represents a reassignment of a variable.
 * Checks if the reference path is an assignment expression where the left side is the specified variable.
 *
 * @function isReassignment
 * @param {nodePath} path - The Babel path object to check.
 * @param {string} variableName - The name of the variable to check for reassignment.
 * @returns {boolean} True if the reference path represents a reassignment of the variable, false otherwise.
 */
function isReassignment(path, variableName) {  
    return (  
        path.isAssignmentExpression() &&  
        path.node.left.type === 'Identifier' &&  
        path.node.left.name === variableName &&  
        path.parentPath.node.type !== 'VariableDeclarator'  
    );  
}  

//////////////////////
//////////////////////
/////////// Todo /////: Check the revelance of this function 
//////////////////////  because it have not been add during the function transportation
//////////////////////  from the one to multiple files.
//////////////////////
//////////////////////

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

//////////////////////
//////////////////////
/////////// Todo /////: Check the revelance of this function 
//////////////////////  because it have not been add during the function transportation
//////////////////////  from the one to multiple files.
//////////////////////
//////////////////////

/**
 * Determines if a given path represents a styled component.
 * Checks for styled component creation through tagged template expressions (e.g., styled.div)
 * and styled call expressions (e.g., styled(Button)).
 *
 * @function isStyledComponent
 * @param {NodePath} path - The Babel path object to check.
 * @returns {boolean} True if the path represents a styled component, false otherwise.
 */
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

//////////////////////
//////////////////////
/////////// Todo /////: Check the revelance of this function 
//////////////////////  because it have not been add during the function transportation
//////////////////////  from the one to multiple files.
//////////////////////
//////////////////////

/**
 * Determines if a given path represents a React class component.
 * Checks if the class declaration extends React.Component or Component.
 *
 * @function isClassComponent
 * @param {Object} path - The Babel path object to check.
 * @returns {boolean} True if the path represents a React class component, false otherwise.
 */
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

/**
 * Extracts the main component name from a given file path.
 * Removes the directory path and file extension, then converts the base name to PascalCase.
 *
 * @function getMainComponentNameFromFileName
 * @param {string} filePath - The file path to extract the component name from.
 * @returns {string} The main component name derived from the file name.
 */ 
function getMainComponentNameFromFileName(filePath) {  
    // Extract the file name without directory path or extension  
    const baseName = path.basename(filePath, path.extname(filePath));  
    // Turn the first letter to uppercase (React component names are PascalCase)  
    return baseName.charAt(0).toUpperCase() + baseName.slice(1);  
}  
  
/**
 * Finds the index of the last import statement in a list of body nodes.
 * Scans through the nodes and returns the index of the last import declaration.
 * Logs a message if no import statement is found.
 *
 * @function findLastImportIndex
 * @param {Array} bodyNodes - The list of body nodes to search through.
 * @returns {number} The index of the last import declaration, or -1 if no import statement is found.
 */ 
function findLastImportIndex(bodyNodes) {  
    let lastImportIndex = -1;  
    for (let i = 0; i < bodyNodes.length; i++) {  
        if (bodyNodes[i].type === 'ImportDeclaration') {  
            lastImportIndex = i;  
        }  
    }  
    if (lastImportIndex === -1) {  
        console.log('No import statement found in the file.');  
    }  
    return lastImportIndex;  
}  
  
/**
 * Recognizes the type of a given path based on various criteria such as variable declarators,
 * function declarations, arrow functions, and TypeScript declarations.
 * Determines the specific type and returns a string representing the recognized type.
 *
 * @function recognizeType
 * @param {Object} path - The Babel path object to check.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 * @returns {string} The recognized type of the path. Possible values include 'customHook', 
 *                   'mainFunctionComponent', 'functionalComponent', 'helperFunction', 
 *                   'expressionFunction', 'globalConstant', 'localConstant', 
 *                   'variableDeclarator', 'TSInterfaceDeclaration', 'TSTypeAliasDeclaration', 
 *                   'TSEnumDeclaration', or 'unknown'.
 */ 
function recognizeType(path, state, filePath) {    
    if (isVariableDeclarator(path) && isCustomHook(path.get('init'))) {    
        console.log('Detected Custom Hook:', path.toString());    
        return 'customHook';   
  
    } else if (isMainFunctionComponent(path, state, filePath)) {    
        console.log('Detected Main Function Component:', path.toString());    
        return 'mainFunctionComponent';   
  
    } else if (isArrowFunctionExpression(path) || isFunctionExpression(path)) {    
        if (isReactComponent(path.parentPath).isComponent) {    
            console.log('Detected Functional Component (Arrow/Function Expression):', path.toString());    
            return 'functionalComponent';    
        }    
        return 'expressionFunction';    
  
    } else if (isGlobalConstant(path)) {    
        console.log('Detected Global Constant:', path.toString());    
        return 'globalConstant';    
  
    } else if (isLocalConstant(path)) {    
        console.log('Detected Local Constant:', path.toString());    
        return 'localConstant';  
  
    } else if (isVariableDeclarator(path)) {  
        if (isReactFunctionalComponent(path)) {    
            console.log('Detected Functional Component (Variable Declarator):', path.toString());    
            return 'functionalComponent';    
        }    
        return 'variableDeclarator';    
  
    } else if (isTSInterfaceDeclaration(path)) {    
        console.log('Detected TS Interface Declaration:', path.toString());    
        return 'TSInterfaceDeclaration';    
  
    } else if (isTSTypeAliasDeclaration(path)) {    
        console.log('Detected TS Type Alias Declaration:', path.toString());    
        return 'TSTypeAliasDeclaration';    
  
    } else if (isTSEnumDeclaration(path)) {    
        console.log('Detected TS Enum Declaration:', path.toString());    
        return 'TSEnumDeclaration';    
  
    } else {    
        console.warn('Recognize type function is not implemented yet', path.node.type);    
    }    
    return 'unknown';    
}    


  
  
/**
 * Checks the order of context usage within a given path, ensuring that useContext is called 
 * after the context is defined. Reports an error if the context is used before its definition.
 *
 * @function checkForContextUsageOrder
 * @param {Object} path - The Babel path object to check.
 * @param {string} filePath - The file path of the current file being processed.
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
  
//////////////////////
//////////////////////
/////////// Todo /////: Make sure to implement the good error report function to call the error.
//////////////////////
//////////////////////

/**
 * Checks the declaration keyword (var, let, const) of a variable declarator to ensure best practices.
 * Reports issues if `var` is used or if `let` is used where `const` could be used instead.
 *
 * @function checkDeclarationKeyword
 * @param {Object} path - The Babel path object for the variable declarator node.
 * @param {string} filePath - The file path of the current file being processed.
 * @returns {boolean} True if the declaration is valid, false otherwise.
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
        //****Here****
        reportVariablePlacementIssue(path.node.id.name, path, 'DeclarationKeyword', filePath, path.node, {  
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
            //****Here****
            reportVariablePlacementIssue(identifierName, path, 'DeclarationKeyword', filePath, path.node, {  
                fix: `Use 'const' instead of 'let' for variable '${identifierName}' as it is not reassigned.`  
            });  
            return false;  
        }  
    }  
    // If using 'const' or if 'let' is justified, it's fine  
    return true;  
}  
  
//////////////////////
//////////////////////
/////////// Todo /////: Remove this function to implement it in 
//////////////////////  the errorHandling file and merge it with 
//////////////////////  the main error report function.
//////////////////////
//////////////////////

/**  
 * Reports an issue with how a variable is placed within the code.  
 *  
 * @param {string} variableName - The name of the variable with the placement issue.  
 * @param {Object} path - Babel path object where the issue was found.  
 * @param {string} issueType - The type of issue that was encountered.  
 * @param {string} filePath - The file path of the source file being processed.  
 * @param {Node} node - The AST node where the issue was detected.  
 * @param {Object} [options] - Additional options for reporting.  
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
  
module.exports = {    
    isReactComponent,    
    isCustomHook,    
    isGlobalConstant,    
    isLocalConstant,    
    isFunctionExpression,    
    isArrowFunctionExpression,    
    isMainFunctionComponent,    
    isExportDeclarationWithName,    
    IsTopOfScope,    
    isReactFunctionalComponent,      
    isReactCreateElementCall,    
    isVariableDeclarator,    
    isContextCreation,    
    isReassignment,    
    isClassComponent,  
    isStyledComponent,  
    getMainComponentNameFromFileName,    
    findLastImportIndex,    
    recognizeType,    
    checkForContextUsageOrder,    
    checkDeclarationKeyword,    
    reportVariablePlacementIssue,  
    isTSInterfaceDeclaration,  
    isTSTypeAliasDeclaration,  
    isTSEnumDeclaration  
};  
