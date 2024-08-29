const { t, generateErrorMessage, reportError } = require('./common');   
const {
    logError
} = require('./errorHandling');

const generate = require('@babel/generator').default;
const {   
    enterReactComponent,     
    exitReactComponent   
} = require('./stateManagement'); 

const {
    createSection,
    createInnerSection,
    createInnerReturn,
    createMainComponent,
    visitedNodes,
    sections
} = require('./sections')

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
const { program } = require('blessed');
const { isCallExpression } = require('typescript');

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
    sections.imports.push(path.node);
    if (path.scope.path.type !== 'Program') {  
        console.log(`Reporting error: Imports should not be declared inside a function or component. FilePath: ${filePath}`);
        reportError(path.node, 'Imports should not be declared inside a function or component.', filePath);  
    } else {  
        if (state.topLevelState.hasGlobalConstants || state.topLevelState.hasHelperFunctions ||  
            state.topLevelState.hasCustomHooks || state.topLevelState.hasStyledComponents ||  
            state.topLevelState.hasInterfaces || state.topLevelState.hasTypes ||  
            state.topLevelState.hasEnums || state.topLevelState.hasMainComponent ||  
            state.topLevelState.hasReactComponent || state.topLevelState.hasPropTypes ||  
            state.topLevelState.hasDefaultProps || state.topLevelState.hasExports) {

            console.log('Top level state check failed before import statement.');
            const errorMessage = generateErrorMessage("Import statements", state.topLevelState, filePath);  
            if (errorMessage) {  
                console.log(`Reporting error: ${errorMessage}. FilePath: ${filePath}`);
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
const handleVariableDeclarator = (path, state, filePath, traverse = false) => {
    if (!path || !path.node) {
        console.error(`Invalid path received. Path or path.node is undefined.`);
        return;
    }

    console.log('VariableDeclarator detected:', path.node.type);
    let type = '';

    if (!visitedNodes.has(path.node)) {
        if (isLocalConstant(path)) {
            console.log('Local constant detected');
            type = "localConstants";
            visitedNodes.add(path.node);
        }
    }

    if (!visitedNodes.has(path.node)) {
        if (isGlobalConstant(path)) {
            console.log('Global constant detected');
            handleGlobalConstantDeclaration(path, state, filePath);
            type = "constants";
            visitedNodes.add(path.node);
        }
    }

    if (!visitedNodes.has(path.node)) {
        if (isContextCreation(path)) {
            console.log('Context creation detected');
            handleContextCreation(path, state, filePath, sections);
            type = "contexts";
            visitedNodes.add(path.node);
        }
    }

    if (!visitedNodes.has(path.node)) {
        if (isReactFunctionalComponent(path)) {
            console.log('React functional component detected');
            handleFunctionalComponent(path, state, filePath);
            type = "functionalComponent";
            visitedNodes.add(path.node);
        }
    }

    if (type) {
        const innerSectionWrapper = createInnerSection(path.node);
        innerSectionWrapper.section = traverseReactComponent(path, state, filePath);

        switch (type) {
            case "constants":
                sections.constants.push(path.node);
                break;
            case "localConstants":
                const parentFunction = path.getFunctionParent();
                if (parentFunction) {
                    const functionBodyNode = parentFunction.node.body;
                    if (!sections.localConstants.has(functionBodyNode)) {
                        sections.localConstants.set(functionBodyNode, []);
                    }
                    sections.localConstants.get(functionBodyNode).push(innerSectionWrapper);
                }
                break;
            case "contexts":
                sections.contexts.push(innerSectionWrapper);
                break;
            case "functionalComponent":
                sections.functionalComponent.push(innerSectionWrapper);
                break;
            default:
                console.warn("Unhandled section type:", type);
                break;
        }
        
    }
};
 

 

  
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
    console.log('Handling functional component:', path.node.type);
    if (!visitedNodes.has(path.node) && !hasDisableCheckComment(path)) {
        visitedNodes.add(path.node);
        const innerSection = traverseReactComponent(path, state, filePath);
        let innerSectionWrapper = createInnerSection(path.node);
        innerSectionWrapper.node.code = generate(path.node).code; // Generate code snippet for the node
        innerSectionWrapper.section = innerSection;
    }
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

    if (path.scope.path.type === 'Program' && isGlobalConstant(path)) {  
        console.log('Global constant is in program scope');
        if (state.hasConstants || state.hasHelperFunctions ||  
            state.hasCustomHooks || state.hasStyledComponents ||  
            state.hasInterfaces || state.hasTypes ||  
            state.hasEnums || state.hasMainComponent ||  
            state.hasHandlers || state.hasHooks ||  
            state.hasReactComponent || state.hasPropTypes ||  
            state.hasDefaultProps || state.hasExports) {  

            console.log('State check failed before constant declaration');
            const errorMessage = generateErrorMessage("Global constant", state, filePath);  
            if (errorMessage) {  
                console.log(`Reporting error: ${errorMessage}. FilePath: ${filePath}`);
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
    sections.types.TSInterfaceDeclaration.push(path.node);

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
    sections.types.TSTypeAliasDeclaration.push(path.node);
    
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
    sections.types.TSEnumDeclaration.push(path.node);

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
    console.log('Styled component declaration detected:', path.node.type);
    if (isStyledComponent(path)) {  
        const tag = path.get('tag');  

        if (t.isMemberExpression(tag)) {  
            const property = tag.get('property').node.name;
            console.log('Styled member expression detected:', property);  
        } else if (t.isCallExpression(tag)) {
            const styledComponent = tag.get('arguments')[0];
            console.log('Styled call expression detected:', styledComponent);  
        }  

        if (state.hasInterfaces || state.hasTypes  
            || state.hasEnums || state.hasMainComponent  
            || state.hasHandlers || state.hasHooks  
            || state.hasReactComponent || state.hasPropTypes  
            || state.hasDefaultProps || state.hasExports) {  
            console.log('State check failed before styled component');
            const errorMessage = generateErrorMessage("Styled Component", state, filePath);  
            if (errorMessage) {  
                console.log(`Reporting error: ${errorMessage}. FilePath: ${filePath}`);
                reportError(path.node, errorMessage, filePath);  
            }  
        }  
        state.hasStyledComponents = true;  
        sections.styledComponent.push(path.node);
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
function handleCustomHookDeclaration(path, state, filePath, sections) {  
    console.log('Custom hook declaration detected:', path.node.type);

    let functionName = '';

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

    if (functionName && /^use[A-Z]/.test(functionName)) {
        console.log('Valid custom hook name detected:', functionName);

        if (state.hasStyledComponents || state.hasInterfaces
            || state.hasTypes || state.hasEnums
            || state.hasMainComponent
            || state.hasHandlers || state.hasHooks
            || state.hasReactComponent || state.hasPropTypes
            || state.hasDefaultProps || state.hasExports) {
            console.log('State check failed before custom hook declaration');
            const errorMessage = generateErrorMessage('Custom Hooks', state, filePath);
            if (errorMessage) {
                console.log(`Reporting error: ${errorMessage}. FilePath: ${filePath}`);
                reportError(path.node, errorMessage, filePath);
            }
        }
        state.hasCustomHooks = true;
        enterReactComponent(state);
        
        const innerSection = traverseReactComponent(path, state, filePath);
        let innerSectionWrapper = createInnerSection(path.node);
        innerSectionWrapper.section = innerSection;

        sections.hooks.push(innerSectionWrapper);
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
    state.localConstants =true;
    return "localConstants";
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
    console.log('Main component detected:');
    const componentName = getMainComponentNameFromFileName(filePath);  

    if (state.topLevelState.hasHandlers || state.topLevelState.hasHooks ||  
        state.topLevelState.hasReactComponent || state.topLevelState.hasPropTypes ||  
        state.topLevelState.hasDefaultProps || state.topLevelState.hasExports) {  
        console.log('State check failed before main React component');
        const errorMessage = generateErrorMessage("Main function/component", state, filePath);  
        if (errorMessage) {  
            console.log(`Reporting error: ${errorMessage}. FilePath: ${filePath}`);
            reportError(path.node, errorMessage, filePath);  
        }  
    }  

    state.topLevelState.hasReactComponent = true;  
    state.topLevelState.hasMainComponent = true;  
    state.topLevelState.mainComponentPath = path;  

    const innerSection = traverseReactComponent(path, state, filePath);  
    const mainComponent = createInnerSection(path.node, innerSection, path, true);   
    sections.mainComponent.push(mainComponent.section);  // Correctly assigning the main component section
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
        console.log('State check failed before helper function declaration');
        const errorMessage = generateErrorMessage("Helper Functions", state, filePath);  
        if (errorMessage) {  
            console.log(`Reporting error: ${errorMessage}. FilePath: ${filePath}`);
            reportError(path.node, errorMessage, filePath);  
        }  
    }  

    currentState.hasHelperFunctions = true;  

    enterReactComponent(state);  
    const innerSection = traverseReactComponent(path, state, filePath);
    let innerSectionWrapper = createInnerSection(path.node);
    innerSectionWrapper.section = innerSection;

    sections.helperFunctions.push(innerSectionWrapper);
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
const handleFunctionExpressionsAndArrowFunctions = (path, state, filePath) => {
    console.log('Function expression or arrow function detected:', path?.node?.type || 'Unknown');
    
    let functionName = 'Anonymous';
    let type = '';

    if (path && path.node) {
        if (path.isFunctionExpression() || path.isArrowFunctionExpression()) {
            if (path.parentPath.isVariableDeclarator() && path.parentPath.node.id) {
                functionName = path.parentPath.node.id.name;
                console.log('FunctionName from VariableDeclarator:', functionName);
            } else if (path.node.id) {
                functionName = path.node.id.name;
                console.log('FunctionName from function itself:', functionName);
            }
        } else if (path.parentPath.isObjectProperty() && path.parentPath.node.key) {
            functionName = path.parentPath.node.key.name || 'Anonymous';
            console.log('FunctionName from ObjectProperty:', functionName);
        } else if (path.parentPath.isClassMethod() && path.parentPath.node.key) {
            functionName = path.parentPath.node.key.name || 'Anonymous';
            console.log('FunctionName from ClassMethod:', functionName);
        } else {
            console.warn('Unexpected parent type for function expression or arrow function:', path.parentPath.node.type);
        }

        if (/^use[A-Z]/.test(functionName)) {
            console.log('Hook detected:', path.node.type);
            state.hasHooks = true;
            type = "hooks";
        } else if (/^handle[A-Z]/.test(functionName)) {
            console.log('Handler detected:', path.node.type);
            state.hasHandlers = true;
            type = "handlers";
        } else if (path.parentPath.isVariableDeclarator() && isReactFunctionalComponent(path.parentPath)) {
            console.log('Functional component detected from VariableDeclarator:', path.parentPath.node.type);
            type = "functionalComponent";
        }

        if (type) {
            if (type === "functionalComponent" && path.parentPath.isVariableDeclarator()) {
                return;
            }

            enterReactComponent(state);

            if (path.node) {
                visitedNodes.add(path.node);

                const innerSection = traverseReactComponent(path, state, filePath);
                let innerSectionWrapper = createInnerSection(path.node);

                if (path.parentPath && path.parentPath.node) {
                    try {
                        let code = generate(path.parentPath.node).code;
                        innerSectionWrapper.node.code = code;
                        innerSectionWrapper.node = sanitizeNode(innerSectionWrapper.node);
                        console.log('Generated code for VariableDeclarator:', innerSectionWrapper.node.code);
                    } catch (error) {
                        console.error('Error generating code for VariableDeclarator:', path.parentPath.node);
                        console.error('Node type:', path.parentPath.node.type);
                        console.error('Error:', error);
                    }
                } else {
                    console.warn('path.parentPath.node is undefined, skipping code generation');
                }

                innerSectionWrapper.section = innerSection;

                if (type === "hooks") {
                    sections.hooks.push(innerSectionWrapper);
                } else if (type === "handlers") {
                    sections.handlers.push(innerSectionWrapper);
                }
            } else {
                console.warn('Path node is undefined, skipping adding to visitedNodes and sections.');
            }
        }
    } else {
        console.error('Invalid path or path.node in handleFunctionExpressionsAndArrowFunctions.');
    }
};

// Sanitize nodes by removing unexpected properties
const sanitizeNode = (node) => {
    const validProps = [
        'type', 'start', 'end', 'loc', 'range', 'id', 'generator', 'async', 
        'params', 'body', 'callee', 'arguments', 'argument', 'extra', 'name', 'return'
    ];
    for (let key of Object.keys(node)) {
        if (!validProps.includes(key)) {
            console.warn(`Removing unexpected property '${key}' from node. Node Type: ${node.type}`);
            delete node[key];
        }
    }
    return node;
};




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
    sections.exports.push(path.node);

    const insideFunctionOrComponent = path.findParent(p =>   
        p.isFunctionDeclaration() ||   
        p.isFunctionExpression() ||   
        p.isArrowFunctionExpression() ||   
        p.isClassDeclaration()
    );  

    if (insideFunctionOrComponent) {  
        console.log('Reporting error: Exports should not be declared inside a function or component.');
        reportError(path.node, 'Exports should not be declared inside a function or component.', filePath);  
        return;  
    }  

    if (path.isExportNamedDeclaration()) {  
        const { specifiers } = path.node;  
        specifiers.forEach(specifier => {  
            if (specifier.exported && state.topLevelState.mainComponentName && specifier.exported.name === state.topLevelState.mainComponentName) {  
                console.log(`Main component ${state.topLevelState.mainComponentName} is exported as a named export.`);  
                state.topLevelState.hasExportedMainComponent = true;  
            }  
        });  
    }  

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
    //sections.jsx.push(path.node);

    const functionParent = path.findParent(p =>
        p.isFunctionDeclaration() || 
        p.isFunctionExpression() || 
        p.isArrowFunctionExpression() || 
        p.isClassMethod()
    );

    if (functionParent) {
        console.log('JSX within function, checking context...');
        const isPartOfReturn = !!path.findParent(p => p.isReturnStatement());
        const isPartOfVariableDeclarator = !!path.findParent(p => p.isVariableDeclarator());
        const isPartOfConditional = !!path.findParent(p => p.isConditionalExpression() || p.isLogicalExpression() || p.isJSXExpressionContainer());
        const isPartOfFunctionBody = !!path.findParent(p => p.isBlockStatement());

        if (isPartOfReturn) {
            console.log('JSX is part of return statement');
        } else if (isPartOfVariableDeclarator || isPartOfConditional || isPartOfFunctionBody) {
            console.log('JSX is part of variable or conditional or function body');
            if (functionParent === state.mainComponentPath) {
                state.functionComponentState.hasConditionalRender = true;
            }
        } else {
            console.log('JSX is not correctly placed, reporting error');
            reportError(
                path.node,
                'JSX should be returned from the component or part of a statement within render logic.',
                filePath
            );
        }
    } else if (path.findParent(p => p.isProgram())) {
        console.log('JSX is at program level, reporting error');
        reportError(
            path.node,
            'JSX should be inside a function component or returned directly from an arrow function component.',
            filePath
        );
    }
}

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
const handleReturnStatement = (path, state, filePath) => {  
    if (!path || !path.node) {  
        console.error(`Invalid path received in handleReturnStatement. Path or path.node is undefined.`);  
        return;  
    }  
  
    console.log('Return statement detected:', path.node.type);  
  
    if (!state.functionComponentState || !state.functionComponentState.insideReactComponent) {  
        console.warn('Return statement outside React component.');  
        return;  
    }  
      
    const functionPath = path.findParent(p =>  
        p.isFunctionDeclaration() ||  
        isFunctionExpression(p) ||  
        p.isArrowFunctionExpression()||
        isCustomHook(p) ||
        isReactFunctionalComponent(p)||
        isStyledComponent(p)||
        isContextCreation(p)||
        isMainFunctionComponent(p, state, filePath)||
        isCallExpression(p) 
); 
    if (!functionPath) {  
        console.warn('Could not find parent function for the return statement.');  
    } else {  
        if (!functionPath.node) {  
            console.warn('Function path node is undefined.');  
        } else if (!functionPath.node.id) {  
            console.warn('Function path node id is undefined.');  
        }  
    }  
  
    if (functionPath && functionPath.node && functionPath.node.id) {  
        const mainComponentPath = state.topLevelState?.mainComponentPath;  
        if (mainComponentPath && mainComponentPath.node && mainComponentPath.node.id) {  
            const isMainComponent = functionPath.node.id.name === mainComponentPath.node.id.name;  
            console.log(`Is main component: ${isMainComponent}`);  
  
            if (isMainComponent) {  
                if (state.functionComponentState.hasReturn) {  
                    console.log('Multiple return statements in main component, reporting error');  
                    reportError(path.node, 'Multiple return statements detected within the main component.', filePath);  
                } else {  
                    state.functionComponentState.hasReturn = true;  
                }  
            } else {  
                const parentFunction = path.findParent(p => p.isFunction());  
                if (parentFunction && parentFunction.node.id) {  
                    const parentFunctionName = parentFunction.node.id.name;  
                    if (!state.functionComponentState.nestedFunctions) {  
                        state.functionComponentState.nestedFunctions = {};  
                    }  
  
                    if (state.functionComponentState.nestedFunctions[parentFunctionName]) {  
                        console.log('Multiple return statements in nested component, reporting error');  
                        reportError(path.node, 'Multiple return statements detected within a nested component.', filePath);  
                    } else {  
                        state.functionComponentState.nestedFunctions[parentFunctionName] = true;  
                    }  
                } else {  
                    console.warn('Parent function or its node id is undefined in nested return statement handling.');  
                }  
            }  
        } else {  
            console.warn('Main component path or its node/id is undefined.');  
        }  
    }  
  
    let returnValue;  
    let returnType;  
  
    if (path.node.argument) {  
        if (path.node.argument.type === 'JSXElement' || path.node.argument.type === 'JSXFragment') {  
            returnType = 'jsx';  
            returnValue = getReturnJSX(path, path);  
        } else {  
            returnType = 'expression';  
            returnValue = path.node.argument;  
        }  
    } else {  
        returnType = 'other';  
        returnValue = null;  
    }  
  
    let innerReturn = createInnerReturn(path.node, returnType, returnValue);  
    sections.return.push(innerReturn);  
  
    return innerReturn;  
};  
  
const getReturnJSX = (parentNode, path) => {    
    const childNodes = [];  
    console.log('Collecting JSX elements within return statement...');  
    path.traverse({    
        enter(innerPath) {    
            if (innerPath.node !== parentNode.node && innerPath.isJSXElement()) {    
                childNodes.push(innerPath.node);    
            }  
        }  
    });  
    console.log('Collected JSX elements:', childNodes.length);  
    return childNodes;    
}; 

 
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
        console.log('useContext argument:', contextArgument.node.name);  
        if (t.isIdentifier(contextArgument.node)) {  
            const contextName = contextArgument.node.name;  
            const contextBinding = path.scope.getBinding(contextName);
            console.log('Context binding:', contextBinding ? 'exists' : 'undefined');
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
function handleClassComponent(path, state, filePath, sections) {  
    const node = path.node;
    const message = 'Class components are not recommended in React. Consider using functional components with hooks instead.';
    const extraInfo = {
        suggestions: ['Refactor to a functional component', 'Use hooks like useState and useEffect'],
        fix: 'Replace the class keyword with a const declaration and use React hooks.'
    };

    logError(node, message, filePath, extraInfo);
}  
 
//// Todo not use as now
/**  
 * Handles the identification and processing of React hooks and effects within the AST.  
 * Ensures that hooks are declared before effects, state, and helper functions, following the expected code structure.  
 *  
 * @param {Path} path - The AST path for the node to be processed.  
 * @param {State} state - The state object tracking encountered elements.  
 * @param {string} filePath - The file path for reporting errors.  
 */  
const handleHooksAndEffects = (path, state, filePath) => {
    console.log('Hook or effect detected:', path.node.type);

    if (isMainFunctionComponent(path, state, filePath)) {
        handleMainReactComponent(path, state, filePath);
    }

    let type = "";
    const currentState = state.functionComponentState.insideReactComponent ? state.functionComponentState : state.topLevelState;

    if (path.isCallExpression()) {
        let calleeName;

        if (path.node.callee.type === 'Identifier') {
            calleeName = path.node.callee.name;
        } else if (path.node.callee.type === 'MemberExpression') {
            calleeName = path.node.callee.property.name;
        } else {
            console.warn('Unsupported callee type:', path.node.callee.type);
            calleeName = 'unknown';
        }

        console.log('Call expression callee name:', calleeName);
        
        const hooks = ['useState', 'useReducer', 'useRef', 'useCallback', 'useMemo', 'useEffect', 'useLayoutEffect', 'useContext', 'useImperativeHandle', 'useDebugValue'];
        const stateHooks = ['useState', 'useReducer'];
        const effectHooks = ['useEffect', 'useLayoutEffect'];

        if (stateHooks.includes(calleeName)) {
            console.log('State hook detected:', calleeName);
            if (path.scope.path.type === 'Program') {
                sections.stateHooks.push(path.node);
            }
            if (currentState.hasEffects || currentState.hasHelperFunctions) {
                reportError(path.node, 'State hooks (useState, useReducer) should be declared before effects and helper functions.', filePath);
            }
            currentState.hasStateHooks = true;
            type = "stateHooks";
        }

        if (effectHooks.includes(calleeName)) {
            console.log('Effect hook detected:', calleeName);
            if (path.scope.path.type === 'Program') {
                sections.effectHooks.push(path.node);
            }
            if (currentState.hasHelperFunctions) {
                reportError(path.node, 'Effects (useEffect, useLayoutEffect) should be declared before helper functions.', filePath);
            }
            currentState.hasEffects = true;
            type = "effectHooks";
        }

        if (hooks.includes(calleeName) && !stateHooks.includes(calleeName) && !effectHooks.includes(calleeName)) {
            console.log('Other hook detected:', calleeName);
            if (currentState.hasEffects || currentState.hasHelperFunctions) {
                reportError(path.node, 'Other hooks should be declared before effects and helper functions.', filePath);
            }
            currentState.hasHooks = true;
            type = "hooks";
        }
    }

    if (path.isFunctionDeclaration() || path.isFunctionExpression() || path.isArrowFunctionExpression() || path.isClassMethod()) {
        if (currentState.hasStateHooks || currentState.hasEffects || currentState.hasHooks) {
            const functionName = path.node.id ? path.node.id.name : 'Anonymous Function';
            console.log(`Helper function ${functionName} should be declared after hooks and effects.`);
            reportError(path.node, `Helper function ${functionName} should be declared after hooks and effects.`, filePath);
        }
        currentState.hasHelperFunctions = true;
    }

    try {
        const innerSection = traverseReactComponent(path, state, filePath);
        let innerSectionWrapper = createInnerSection(path.node);
        innerSectionWrapper.section = innerSection;

        switch (type) {
            case "stateHooks":
                console.log('Added to stateHooks section');
                //sections.stateHooks.push(innerSectionWrapper);
                break;
            case "effectHooks":
                console.log('Added to effectHooks section');
                //sections.effectHooks.push(innerSectionWrapper);
                break;
            case "hooks":
                sections.hooks.push(innerSectionWrapper);
                break;
        }
    } catch (error) {
        console.error('Error during traversal inside handleHooksAndEffects:', error);
    }
};

function handleContextCreation(path, state, filePath) {  
    console.log('Context creation detected:', path.node.type);  
    if (state.hasConstants || state.hasHelperFunctions ||   
        state.hasCustomHooks || state.hasStyledComponents ||   
        state.hasInterfaces || state.hasTypes ||   
        state.hasEnums || state.hasMainComponent ||   
        state.hasHandlers || state.hasHooks ||   
        state.hasReactComponent || state.hasPropTypes ||   
        state.hasDefaultProps || state.hasExports) {  
          
        const errorMessage = generateErrorMessage("Context creation", state, filePath);  
        if (errorMessage) {  
            console.log(`Reporting error: ${errorMessage}. FilePath: ${filePath}`);
            reportError(path.node, errorMessage, filePath);  
        }  
    }  
    state.hasContexts = true;  
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
      /*
      if (path.node.type === 'JSXElement' || path.findParent((p) => p.node.type === 'JSXElement')) {
        let containerPath = path.findParent(
          (p) => p.isReturnStatement() || p.node.type === 'VariableDeclaration'
        );
        // Check leadingComments of the container node
        if (containsDisableCheck(containerPath?.node.leadingComments)) { // Using optional chaining operator
          return true;
        }
      }*/
    }
  
    return false;
}

/**
 * General traversal function for React components and hooks.
 *
 * @param {Path} path - The root path of the component or hook.
 * @param {State} state - The state object to maintain the traversal state.
 * @param {string} filePath - The path to the current file being processed.
 */
const traverseReactComponent = (path, state, filePath) => {  
    const innerSection = createSection();
    console.log('Traversing React component or hook...');

    const visitor = {  
        VariableDeclaration(innerPath) {  
            console.log('Visiting VariableDeclaration:', innerPath.node.type);
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {  
                innerPath.node.code = generate(innerPath.node).code;
                innerPath.get('declarations').forEach(declaratorPath => {  
                    let visitedNode = handleVariableDeclarator(declaratorPath, state, filePath, true);
                    if (visitedNode) {  
                        visitedNodes.add(visitedNode);  
                        visitedNode.code = generate(visitedNode).code; // Generate code snippet for the node
                    }  
                });  
            }  
        },  
        CallExpression(innerPath) {  
            console.log('Visiting CallExpression:', innerPath.node.type);
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {  
                visitedNodes.add(innerPath.node);  
                checkForContextUsageOrder(innerPath, filePath);  
                const type = handleHooksAndEffects(innerPath, state, filePath, innerSection);
                if (type) {  
                    innerPath.node.code = generate(innerPath.node).code; // Generate code snippet for the node
                }  
            }  
        },  
        ReturnStatement(innerPath) {  
            console.log('Visiting ReturnStatement:', innerPath.node.type);
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {  
                visitedNodes.add(innerPath.node);  
                let innerReturn = handleReturnStatement(innerPath, state, filePath);
            }
        },  
        JSXElement(innerPath) {  
            console.log('Visiting JSXElement:', innerPath.node.type);
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {  
                visitedNodes.add(innerPath.node);  
                handleJSXElement(innerPath, state, filePath);
                innerPath.node.code = generate(innerPath.node).code; // Generate code snippet for the node
            }
        },  
        FunctionExpression(innerPath) {  
            console.log('Visiting FunctionExpression:', innerPath.node.type);
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {  
                visitedNodes.add(innerPath.node); 
                let innerSection = traverseReactComponent(innerPath, state, filePath);
                let innerSectionWrapper = createInnerSection(innerPath.node);
                innerSectionWrapper.node.code = generate(innerPath.node).code; // Generate code snippet for the node
                innerSectionWrapper.section = innerSection;

                let type = handleHelperFunctionDeclaration(innerPath, state, filePath);  
                switch(type) {  
                    case "helperFunctions":
                        innerSection.helperFunctions.push(innerSectionWrapper);
                        break;
                }  
            }
        },  
        ArrowFunctionExpression(innerPath) {  
            console.log('Visiting ArrowFunctionExpression:', innerPath.node.type);
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {  
                let visitedNode = handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath);
                if (visitedNode) {
                    visitedNodes.add(visitedNode);
                    visitedNode.code = generate(visitedNode).code; // Generate code snippet for the node
                }  
            }
        },  
        
        exit(innerPath) {  
            if (innerPath === path) {  
                exitReactComponent(state);  
            }  
        }
    };

    if (path && path.node) {
        path.traverse(visitor);
    } else {
        console.error('Invalid path or path.node in traverseReactComponent.');
    }

    return innerSection;
};



/**
 * Processes a function type by delegating to the appropriate handler function based on the type.
 * Handles various types of functions, constants, and TypeScript declarations.
 *
 * @function processFunctionType
 * @param {string} type - The type of the function or declaration to process.
 * @param {Object} path - The Babel path object for the node to process.
 * @param {Object} state - The state object that keeps track of various code states.
 * @param {string} filePath - The file path of the current file being processed.
 */
function processFunctionType(type, path, state, filePath) {
    if (!visitedNodes.has(path.node) && !hasDisableCheckComment(path)) {
        console.log(`Processing function type: ${type}`);
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
                const visitedNode = handleFunctionExpressionsAndArrowFunctions(path, state, filePath);
                if (visitedNode) {
                    visitedNodes.add(visitedNode);
                }
                break;
            case 'globalConstant':
                handleGlobalConstantDeclaration(path, state, filePath);
                break;
            case 'localConstant':
                handleLocalConstantDeclaration(path, state, filePath);
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
handleHooksAndEffects,  
handleContextCreation,
processFunctionType,
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
