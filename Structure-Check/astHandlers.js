const t = require('@babel/types');  
const {   
    enterReactComponent,   
    exitReactComponent   
} = require('./stateManagement');  
const { logError, generateErrorMessage, 
    reportError, errors 
} = require('./errorHandling');  

const { traverseReactComponent} = require('./astTraversal');
const {   
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
    isFunctionalComponent,  
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
    reportVariablePlacementIssue  
} = require('./utils');  


  
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
 */ 
function handleImportDeclaration(path, state, filePath) {  
    console.log('Import statement detected:', path.node.type);  
  
    if (state.functionComponentState.insideReactComponent) {  
        reportError(path.node, 'Imports should not be declared inside a function or component.', filePath);  
    } else {  
        if (state.topLevelState.hasGlobalConstants || state.topLevelState.hasHelperFunctions ||  
            state.topLevelState.hasCustomHooks || state.topLevelState.hasStyledComponents ||  
            state.topLevelState.hasInterfaces || state.topLevelState.hasTypes ||  
            state.topLevelState.hasEnums || state.topLevelState.hasMainComponent ||  
            state.topLevelState.hasReactComponent || state.topLevelState.hasPropTypes ||  
            state.topLevelState.hasDefaultProps || state.topLevelState.hasExports) {  
  
            const errorMessage = generateErrorMessage("Import statements", state.topLevelState, filePath);  
            if (errorMessage) {  
                reportError(path.node, errorMessage, filePath);  
            }  
        }  
        state.topLevelState.hasImports = true;  
    }  
}  
  
/**
 * Processes variable declarators and enforces rules for variable placement within the code.
 * Handles top-level, global, and local declarations, and can report errors based on specific rules.
 *
 * @function handleVariableDeclarator
 * @param {Object} path - The Babel path object for the variable declarator node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 * @throws Will log errors if variable declarations do not conform to specified rules.
 */
function handleVariableDeclarator(path, state, filePath) {  
    console.log('Variable declarator detected:', path.node.type);

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

            // Check if the local constant is declared in a proper place
            const parentFunction = path.getFunctionParent();
            const isPartOfFunctionBody = parentFunction && parentFunction.isBlockStatement();
            
            if (!isPartOfFunctionBody || currentState.hasHooks || currentState.hasHandlers || currentState.hasReactComponent ||  
                currentState.hasPropTypes || currentState.hasDefaultProps || currentState.hasExports) {  

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
    console.log('Functional component detected:', path.node.type);

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
 */ 
function handleGlobalConstantDeclaration(path, state, filePath) {  
    console.log('Global constant declaration detected:', path.node.type);  

    // Check if the path is directly under the Program node (not nested inside any function/component)  
    if (path.scope.path.type === 'Program' && isGlobalConstant(path)) {  
        if (state.hasConstants || state.hasHelperFunctions ||  
            state.hasCustomHooks || state.hasStyledComponents ||  
            state.hasInterfaces || state.hasTypes ||  
            state.hasEnums || state.hasMainComponent ||  
            state.hasHandlers || state.hasHooks ||  
            state.hasReactComponent || state.hasPropTypes ||  
            state.hasDefaultProps || state.hasExports) {  
            const errorMessage = generateErrorMessage("Global constant", state, filePath);  
            if (errorMessage) {  
                reportError(path.node, errorMessage, filePath);  
            }  
        }  
        state.hasGlobalConstants = true;  
    }  
}  
  
/**
 * Handles TypeScript interface declarations within the code.
 * Logs the detection of an interface and checks the current state to determine if the interface is correctly placed.
 * Reports an error if the interface is placed incorrectly based on certain state conditions.
 *
 * @function handleTSInterfaceDeclaration
 * @param {Object} path - The Babel path object for the interface declaration node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */
function handleTSInterfaceDeclaration(path, state, filePath) {  
    console.log('Interface declaration detected:', path.node.type);  
  
    if (state.hasTypes || state.hasEnums ||  
        state.hasMainComponent || state.hasHandlers ||  
        state.hasHooks || state.hasReactComponent ||  
        state.hasPropTypes || state.hasDefaultProps ||  
        state.hasExports) {  
        const errorMessage = generateErrorMessage("Interface", state, filePath);  
        if (errorMessage) {  
            reportError(path.node, errorMessage, filePath);  
        }  
    }  
  
    state.hasInterfaces = true;  
}  
  
/**
 * Handles TypeScript type alias declarations within the code.
 * Logs the detection of a type alias and checks the current state to determine if the type alias is correctly placed.
 * Reports an error if the type alias is placed incorrectly based on certain state conditions.
 *
 * @function handleTSTypeAliasDeclaration
 * @param {Object} path - The Babel path object for the type alias declaration node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */
function handleTSTypeAliasDeclaration(path, state, filePath) {  
    console.log('Type alias declaration detected:', path.node.type);  
  
    if (state.hasEnums || state.hasMainComponent ||  
        state.hasHandlers || state.hasHooks ||  
        state.hasReactComponent || state.hasPropTypes ||  
        state.hasDefaultProps || state.hasExports) {  
        const errorMessage = generateErrorMessage("Type alias", state, filePath);  
        if (errorMessage) {  
            reportError(path.node, errorMessage, filePath);  
        }  
    }  
  
    state.hasTypes = true;  
}  
  
/**
 * Handles TypeScript enum declarations within the code.
 * Logs the detection of an enum and checks the current state to determine if the enum is correctly placed.
 * Reports an error if the enum is placed incorrectly based on certain state conditions.
 *
 * @function handleEnumDeclaration
 * @param {Object} path - The Babel path object for the enum declaration node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */ 
function handleTSEnumDeclaration(path, state, filePath) {  
    console.log('Enum declaration detected:', path.node.type);  
    if (state.hasMainComponent || state.hasHandlers  
        || state.hasHooks || state.hasReactComponent  
        || state.hasPropTypes || state.hasDefaultProps  
        || state.hasExports) {  
        const errorMessage = generateErrorMessage("Enums", state, filePath);  
        if (errorMessage) {  
            console.log('--------------------Location-----------:', path.node.loc);  
            reportError(path.node, errorMessage, filePath);  
        }  
    }  
    state.hasEnums = true;  
}  
  
/**
 * Handles styled component declarations within the code.
 * Logs the detection of a styled component and checks the current state to determine if the styled component is correctly placed.
 * Reports an error if the styled component is placed incorrectly based on certain state conditions.
 *
 * @function handleStyledComponent
 * @param {Object} path - The Babel path object for the styled component node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */ 
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
        traverseReactComponent(path, state, filePath);

    }  
}  

/**
 * Handles local constant declarations within the code.
 * Logs the detection of a local constant and checks the current state to determine if the constant is correctly placed.
 * Reports an error if the local constant is placed incorrectly based on certain state conditions.
 *
 * @function handleLocalConstantDeclaration
 * @param {Object} path - The Babel path object for the variable declarator node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */
function handleLocalConstantDeclaration(path, state, filePath) {  
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
        if (currentState.hasHooks ||  
            currentState.hasHandlers ||  
            currentState.hasReactComponent ||  
            currentState.hasPropTypes ||  
            currentState.hasDefaultProps ||  
            currentState.hasExports) {  
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
 * Handles the detection and processing of the main React component within a file.
 * Ensures that the main component is correctly placed according to the state rules.
 * Traverses the component's AST to handle various declarations and expressions.
 *
 * @function handleMainReactComponent
 * @param {Object} path - The Babel path object for the main React component node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */ 
function handleMainReactComponent(path, state, filePath) {  
    if (isMainFunctionComponent(path, state, filePath)) {  
        if (state.topLevelState.hasHandlers || state.topLevelState.hasHooks  
            || state.topLevelState.hasReactComponent || state.topLevelState.hasPropTypes  
            || state.topLevelState.hasDefaultProps || state.topLevelState.hasExports) {  
            const errorMessage = generateErrorMessage("Main function/component", state, filePath);  
            if (errorMessage) {  
                reportError(path.node, errorMessage, filePath);  
            }  
        }  
        console.log('Main React component (primary check) detected:', path.node.type);  
        state.topLevelState.hasReactComponent = true;  
        state.topLevelState.hasMainComponent = true;  
        state.topLevelState.mainComponentPath = path;  
        enterReactComponent(state);  
        traverseReactComponent(path, state, filePath); 
    }  
}

/**
 * Handles helper function declarations within the code.
 * Ensures that the helper functions are declared in the correct order relative to other code constructs.
 * Traverses the helper function's AST to handle various declarations and expressions.
 *
 * @function handleHelperFunctionDeclaration
 * @param {Object} path - The Babel path object for the helper function declaration node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
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
    traverseReactComponent(path, state, filePath); 
}  

/**
 * Handles function expressions and arrow functions within the code.
 * Checks for hooks and handler functions, ensuring they are declared in the correct order relative to other code constructs.
 * Traverses nested functions to apply required handling.
 *
 * @function handleFunctionExpressionsAndArrowFunctions
 * @param {Object} path - The Babel path object for the function expression or arrow function node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */
function handleFunctionExpressionsAndArrowFunctions(path, state, filePath) {  
    console.log('Function expression or arrow function detected:', path.node.type);

    const functionName = path.node.id && path.node.id.name || 'Anonymous';  
  
    // Identify if the function is a hook (e.g., useEffect)  
    if (functionName && /^use[A-Z]/.test(functionName)) {  
        if (state.hasPropTypes || state.hasDefaultProps || state.hasExports) {  
            reportError(path.node, `Hook "${functionName}" should be declared before props and exports.`, filePath, 'Hook', {  
                suggestions: 'Move this hook before any PropTypes, default props, and export statements.',  
                fix: 'Consider relocating the hook towards the beginning of the function.'  
            });  
        }  
        state.hasHooks = true;
        
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
        
        enterReactComponent(state);
        traverseReactComponent(path, state, filePath);
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
function handleJSXElement(path, state, filePath) {  
    console.log('JSX element detected:', path.node.type);  

    // Check if the JSX element is within a function (arrow, function, or method).
    const functionParent = path.findParent(p =>
        p.isFunctionDeclaration() || 
        p.isFunctionExpression() || 
        p.isArrowFunctionExpression() || 
        p.isClassMethod()
    );

    if (functionParent) {
        // Check if this JSX is part of the return statement or a variable declaration within the function
        const isPartOfReturn = !!path.findParent(p => p.isReturnStatement());
        const isPartOfVariableDeclarator = !!path.findParent(p => p.isVariableDeclarator());
        const isPartOfConditional = !!path.findParent(p => p.isConditionalExpression() || p.isLogicalExpression() || p.isJSXExpressionContainer());
        const isPartOfFunctionBody = !!path.findParent(p => p.isBlockStatement());

        if (isPartOfReturn) {
            // This JSX is valid because it's part of the return statement
            // No error should be reported.
        } else if (isPartOfVariableDeclarator || isPartOfConditional || isPartOfFunctionBody) {
            // If we're in the main component, JSX outside of the return statement indicates conditional rendering or valid encapsulation
            if (functionParent === state.mainComponentPath) {
                state.functionComponentState.hasConditionalRender = true;
            }
        } else {
            // Error if JSX is floating freely inside the component, not wrapped in a return statement or variable/conditional
            reportError(
                path.node,
                'JSX should be returned from the component or part of a statement within render logic.',
                filePath
            );
        }
    } else if (path.findParent(p => p.isProgram())) {
        // If we're at the program level, any JSX is invalid
        reportError(
            path.node,
            'JSX should be inside a function component or returned directly from an arrow function component.',
            filePath
        );
    }
}

/////////////////////////
/////////////////////////
/////////// Todo ////////: Make sure that the return are well detected when in a component.
/////////////////////////
/////////////////////////

/**
 * Handles the processing of return statements within React components.
 * Ensures that return statements are correctly placed within main and nested components,
 * and reports errors if multiple return statements are detected.
 *
 * @function handleReturnStatement
 * @param {Object} innerPath - The Babel path object for the return statement node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */ 
function handleReturnStatement(path, state, filePath) { 
    console.log('Return statement detected:', path.node.type); 

    if (!state.functionComponentState.insideReactComponent) return;

    const functionPath = path.findParent(p =>   
        p.isFunctionDeclaration() || 
        p.isFunctionExpression() || 
        p.isArrowFunctionExpression() || 
        p.isClassMethod()
    );

    if (functionPath) {
        const isMainComponent = functionPath === state.mainComponentPath;

        if (isMainComponent) {
            // Ensure there's only one direct return statement in the main component
            if (state.functionComponentState.hasReturn) {
                reportError(path.node, 'Multiple return statements detected within the main component.', filePath);
            } else {
                state.functionComponentState.hasReturn = true;
            }
        } else {
            // Handle nested component returns or other function returns
            if (state.functionComponentState.hasReturnInSameComponent) {
                reportError(path.node, 'Multiple return statements detected within a nested component.', filePath);
            } else {
                state.functionComponentState.hasReturnInSameComponent = true;
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
    console.log('UseContext detected:', path.node.type);

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


/**
 * Handles the processing of React class components.
 * Logs the detection of a class component and updates the state accordingly.
 * Ensures that class components are correctly placed relative to other code constructs
 * and traverses the class to handle its methods and properties.
 *
 * @function handleClassComponent
 * @param {Object} path - The Babel path object for the class component node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */  
function handleClassComponent(path, state, filePath) {  
    console.log('Class component detected:', path.node.type);  

    state.hasClassComponent = true;  

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


/**
 * Handles the processing of class methods within React class components.
 * Checks for constructors, handlers, render methods, and lifecycle methods to ensure they 
 * are declared in the correct order relative to other code constructs.
 *
 * @function handleClassMethod
 * @param {Object} path - The Babel path object for the class method node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */
 
function handleClassMethod(path, state, filePath) { 
    console.log('Class method detected:', path.node.type);

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

/**
 * Handles the processing of class properties within React class components.
 * Ensures that the `state` property is declared in the correct order relative to other code constructs.
 * Delegates the handling of other properties to the `handleVariableDeclarator` function.
 *
 * @function handleClassProperty
 * @param {Object} path - The Babel path object for the class property node.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */ 
function handleClassProperty(path, state, filePath) {  
    console.log('Class property detected:', path.node.type);

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
    console.log('Hook or effect detected:', path.node.type);
    
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
    if (p =>   
        p.isFunctionDeclaration() || p.isFunctionExpression() || 
        p.isArrowFunctionExpression() || p.isClassMethod() ) {  
        if (currentState.hasStateHooks || currentState.hasEffects || currentState.hasHooks) {  
            const functionName = path.node.id ? path.node.id.name : 'Anonymous Function';  
            reportError(path.node, `Helper function ${functionName} should be declared after hooks and effects.`, filePath);  
        }  
        currentState.hasHelperFunctions = true;  
    }  
}  

/**
 * Determines if a given path has a 'disable-check' comment associated with it.
 * Checks the leading comments of the path and, in the case of JSX elements,
 * checks the leading comments of their closest relevant parent.
 *
 * @function hasDisableCheckComment
 * @param {Object} path - The Babel path object to check.
 * @returns {boolean} True if a 'disable-check' comment is found, false otherwise.
 */
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

module.exports = {  
handleImportDeclaration,  
handleVariableDeclarator,  
handleFunctionalComponent,  
handleGlobalConstantDeclaration,  
handleTSInterfaceDeclaration,  
handleTSTypeAliasDeclaration,  
handleTSEnumDeclaration,  
handleStyledComponent,  
handleCustomHookDeclaration,  
handleLocalConstantDeclaration,  
handleMainReactComponent,  
handleHelperFunctionDeclaration,  
handleFunctionExpressionsAndArrowFunctions,  
handleExportDeclarations,  
handleJSXElement,  
handleReturnStatement,  
handleUseContext,  
handleClassComponent,  
handleClassMethod,  
handleClassProperty,  
handleHooksAndEffects,  
};  


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
