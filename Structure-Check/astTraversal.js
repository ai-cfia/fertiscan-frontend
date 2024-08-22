const { parseFile, readFileContent } = require('./fileOperations');
const traverse = require('@babel/traverse').default
const { codeFrameColumns } = require("@babel/code-frame");
const { t, logError, generateErrorMessage, reportError } = require('./common');  
const { createStateTracker } = require('./stateManagement');    
const {   
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
    handleContextCreation, 
    processFunctionType, 
} = require('./astHandlers.js'); 
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
    getMainComponentNameFromFileName,   
    findLastImportIndex,   
    recognizeType,   
    checkForContextUsageOrder,   
    checkDeclarationKeyword,   
    reportVariablePlacementIssue   
} = require('./utils');

const fs = require('fs');    
const readFileSync = fs.readFileSync;  


// Define the sections object globally  
const sections = {    
    imports: [],    
    localConstants: new Map(),    
    constants: [],    
    contexts: [],    
    hooks: [],   
    stateHooks:[],   
    effectHooks:[],  
    handlers:[],  
    helperFunctions: [],  
    components: [],    
    classComponents: [],   
    classMethod: [],  
    classProperty:[],   
    return:[],  
    styledComponent:[],  
    functionalComponent:[],  
  
    types: {    
        TSInterfaceDeclaration: [],    
        TSTypeAliasDeclaration: [],    
        TSEnumDeclaration: []    
    },    
    exports: [],    
    mainComponent: null,    
    nodes: []   
};    
  
/**
 * Checks the structure and naming conventions of a given file.
 * Reads the file, parses its contents into an AST, performs various checks, and logs errors if any issues are found.
 *
 * @async
 * @function checkFile
 * @param {string} filePath - The path of the file to check.
 * @param {Object} state - The state object that keeps track of various code states during traversal.
 * @returns {Promise<void>} A promise that resolves when the file has been checked.
 * @throws Will log an error and exit the process if there is an issue reading the file.
 */
const checkFile = async (filePath, state) => {    
    console.log(`Reading file: ${filePath}`);    
    try {    
        const content = readFileSync(filePath, 'utf-8');    
        const ast = parseFile(content);    
  
        const sections = {    
            imports: [],    
            localConstants: new Map(),    
            constants: [],    
            contexts: [],    
            hooks: [],   
            stateHooks:[],   
            effectHooks:[],  
            handlers:[],  
            helperFunctions: [],      
            components: [],    
            classComponents: [],   
            classMethod: [],  
            classProperty:[],   
            return:[],  
            styledComponent:[],  
            functionalComponent:[],  
  
            types: {    
                TSInterfaceDeclaration: [],    
                TSTypeAliasDeclaration: [],    
                TSEnumDeclaration: []    
            },    
            exports: [],    
            mainComponent: null,    
            nodes: [] // Add nodes array    
        };    
  
        traverse(ast, setupTraverse(state, filePath, sections));    
    
        // Check if the main component's name matches the file name    
        if (state.hasMainComponent) {    
            const mainComponentName = getMainComponentNameFromFileName(filePath);    
            if (!isExportDeclarationWithName(state.mainComponentPath, mainComponentName)) {    
                reportError(state.mainComponentPath.node, 'Main component name does not match file name.', filePath);    
            }    
        } else {    
            reportError(null, 'No main component detected. The main (Function/Component/Class) should match the file name.', filePath);    
        }    
    
        console.log(`File ${filePath} checked.`);    
        console.log("------------------------------------------------------------\n");    
    } catch (error) {    
        console.error(`Error reading file ${filePath}: ${error.message}`);    
        process.exit(1);    
    }    
};  


  
//////////////////////
//////////////////////
/////////// Todo /////: Make sure that the disablecheckcomment is well implemented and is working in this function
//////////////////////
//////////////////////

/**  
 * Configures visitor methods for Babel's AST traversal, mapping various node types to their respective handler  
 * functions. This setup is crucial to appropriately react when specific nodes are encountered during the traversal  
 * process, allowing the tool to perform checks, enforce code structure, and potentially transform the code.  
 *  
 * @param {State} state - The state object that holds flags indicating the presence of various code elements encountered so far.  
 * @param {string} filePath - The path of the source file currently being processed by Babel, which can be used for context in reporting.  
 * @returns {Object} An object defining visitor methods for the traversal, linking node types to their respective handling functions.  
 */  
const setupTraverse = (state, filePath, sections) => {
    const visitedNodes = new Set();

    return {
        enter(path) {
            path.node.code = codeFrameColumns(readFileContent(filePath), path.node.loc, { highlightCode: true });
        },
        ImportDeclaration(innerPath) {
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {
                visitedNodes.add(innerPath.node);
                handleImportDeclaration(innerPath, state, filePath, sections);
            }
        },
        VariableDeclaration(innerPath) {
            if(isMainFunctionComponent(innerPath,state,filePath)){
                handleMainReactComponent(innerPath,state,filePath,sections)
            }
            else if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {  
                visitedNodes.add(innerPath.node);  
                innerPath.get('declarations').forEach(declaratorPath => {  
                    if (!visitedNodes.has(declaratorPath.node)) {  
                        visitedNodes.add(declaratorPath.node);  
                        handleVariableDeclarator(declaratorPath, state, filePath, sections);  
                    }  
                });  
            }  
        },
        TSTypeAliasDeclaration(innerPath) {
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {
                visitedNodes.add(innerPath.node);
                handleTSTypeAliasDeclaration(innerPath, state, filePath, sections);
            }
        },
        TSInterfaceDeclaration(innerPath) {
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {
                visitedNodes.add(innerPath.node);
                handleTSInterfaceDeclaration(innerPath, state, filePath, sections);
            }
        },
        TSEnumDeclaration(innerPath) {
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {
                visitedNodes.add(innerPath.node);
                handleTSEnumDeclaration(innerPath, state, filePath, sections);
            }
        },
        FunctionDeclaration(innerPath) {
            if(isMainFunctionComponent(innerPath,state,filePath)){
                handleMainReactComponent(innerPath,state,filePath,sections)
            }
            else if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {
                visitedNodes.add(innerPath.node);
                handleHelperFunctionDeclaration(innerPath, state, filePath, sections);
            }
        },
        'ArrowFunctionExpression|FunctionExpression': {
            enter(innerPath) {
                if(isMainFunctionComponent(innerPath,state,filePath)){
                    handleMainReactComponent(innerPath,state,filePath,sections)
                }
                if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {
                    visitedNodes.add(innerPath.node);
                    handleFunctionExpressionsAndArrowFunctions(innerPath, state, filePath, sections);
                }
            }
        },
        ClassDeclaration(innerPath) {
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {
                visitedNodes.add(innerPath.node);
                handleClassComponent(innerPath, state, filePath, sections);
            }
        },
        CallExpression(innerPath) {
            if(isMainFunctionComponent(innerPath,state,filePath)){
                handleMainReactComponent(innerPath,state,filePath,sections)
            }
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {
                visitedNodes.add(innerPath.node);
                handleHooksAndEffects(innerPath, state, filePath, sections);
            }
        },
        TaggedTemplateExpression(innerPath) {
            if(isMainFunctionComponent(innerPath,state,filePath)){
                handleMainReactComponent(innerPath,state,filePath,sections)
            }
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {
                visitedNodes.add(innerPath.node);
                handleStyledComponent(innerPath, state, filePath, sections);
            }
        },
        'ExportNamedDeclaration|ExportDefaultDeclaration'(innerPath) {
            if (!visitedNodes.has(innerPath.node) && !hasDisableCheckComment(innerPath)) {
                visitedNodes.add(innerPath.node);
                handleExportDeclarations(innerPath, state, filePath, sections);
            }
        }
    };
};
  
//////////////////////
//////////////////////
/////////// Todo /////: Make sure this is tested and no error accur when fixing code
//////////////////////
//////////////////////

/**
 * Reorders sections of code into a specific order for better organization.
 * Organizes imports, constants, contexts, hooks, types, helper functions, functions, components, class components, main component, and exports.
 * Also ensures that local constants are placed at the beginning of their respective function bodies.
 *
 * @function reorderCode
 * @param {Object} sections - An object containing arrays of different code sections.
 * @param {Array} sections.imports - An array of import statements.
 * @param {Array} sections.constants - An array of constant declarations.
 * @param {Array} sections.contexts - An array of context declarations.
 * @param {Array} sections.hooks - An array of hook declarations.
 * @param {Array} sections.types - An array of type declarations.
 * @param {Array} sections.helperFunctions - An array of helper functions.
 * @param {Array} sections.components - An array of component declarations.
 * @param {Array} sections.classComponents - An array of class component declarations.
 * @param {Object} sections.mainComponent - The main component.
 * @param {Array} sections.exports - An array of export statements.
 * @param {Array} sections.localConstants - An array of local constants within function bodies.
 * @returns {Array} An array of ordered code sections.
 */ 
const reorderCode = (sections) => {  
    const orderedSections = [  
        ...sections.imports,  
        ...sections.constants,  
        ...sections.contexts,  
        ...sections.hooks,  
        ...sections.types,  
        ...sections.helperFunctions,  
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
};  
  
/**
 * Creates a new Abstract Syntax Tree (AST) from the ordered sections of code.
 * Constructs a new program node containing the provided ordered sections as its body.
 *
 * @function createNewAST
 * @param {Array} orderedSections - An array of ordered code sections.
 * @returns {Object} The newly created AST.
 */
const createNewAST = (orderedSections) => {  
    return {  
        type: 'Program',  
        body: orderedSections,  
        sourceType: 'module',  
    };  
};  
  
/**
 * Fixes the structure of a specified file by reading its content, parsing it into an AST,
 * analyzing and reordering code sections, and then writing the updated content back to the file.
 * Creates a backup of the original file before making changes.
 *
 * @async
 * @function fixFile
 * @param {string} filePath - The path of the file to fix.
 * @returns {Promise<void>} A promise that resolves when the file has been fixed.
 * @throws Will log an error and exit the process if the provided path is not a file.
 */  
const fixFile = async (filePath) => {  
    console.log(`Fixing file: ${filePath}`);  

    const { createBackup, readFileContent, writeFileContent } = require('./fileOperations');  
    const { generate } = require('@babel/generator').default;  
  
    // Vérification que le chemin est un fichier  
    if (statSync(filePath).isFile()) {  
        // Create a backup before fixing the file  
        createBackup(filePath);  
        const content = readFileContent(filePath);  
        const ast = parseFile(content);  
        const state = createStateTracker();  
  
        traverse(ast, setupTraverse(state, filePath));  
        // Analyze and reorder the code sections    
        const sections = analyzeCode(ast, filePath);  
        const orderedSections = reorderCode(sections);  

        const newAst = createNewAST(orderedSections);  
        const newContent = generate(newAst, {}).code;  
  
        writeFileContent(filePath, newContent);  
  
        console.log(`File ${filePath} fixed.`);  
    } else {  
        console.error(`${filePath} is not a file.`);  
        process.exit(1);  // Exit the process if it's not a file
    }  
};  

//////////////////////
//////////////////////
/////////// Todo /////: Make sure this is tested and no error accur when fixing code
//////////////////////  Also this function does not have been transport by gpt but by me
//////////////////////  Make sure it is well implemented.
//////////////////////
//////////////////////



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
  /*
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
      }*/
    }
  
    return false;
}



//////////////////////
//////////////////////
/////////// Todo /////: Make sure this is tested and no error accur when fixing code
//////////////////////
//////////////////////

/**
 * Analyzes the Abstract Syntax Tree (AST) of a file and categorizes its sections into imports, constants, contexts, hooks, 
 * helper functions, components, class components, TypeScript types, and exports. Removes the nodes from the original AST 
 * as they are categorized.
 *
 * @function analyzeCode
 * @param {Object} ast - The Abstract Syntax Tree (AST) of the file being analyzed.
 * @param {string} filePath - The path of the file being processed.
 * @returns {Object} An object containing categorized sections of the code.
 * @returns {Array} returns.imports - An array of import statements.
 * @returns {Map} returns.localConstants - A map of local constants within function bodies.
 * @returns {Array} returns.constants - An array of constant declarations.
 * @returns {Array} returns.contexts - An array of context declarations.
 * @returns {Array} returns.hooks - An array of hook declarations.
 * @returns {Array} returns.helperFunctions - An array of helper functions.
 * @returns {Array} returns.functions - An array of other functions.
 * @returns {Array} returns.components - An array of component declarations.
 * @returns {Array} returns.classComponents - An array of class component declarations.
 * @returns {Object} returns.types - An object containing arrays of TypeScript types (TSInterfaceDeclaration, TSTypeAliasDeclaration, TSEnumDeclaration).
 * @returns {Array} returns.exports - An array of export statements.
 * @returns {Object|null} returns.mainComponent - The main component, if detected.
 */  

// Todo : make sur this is revelant since it make traverse and setup traverse already do it
const analyzeCode = (ast, filePath) => {  
    const sections = {  
        imports: [],  
        localConstants: new Map(),  
        constants: [],  
        contexts: [],  
        hooks: [],  
        stateHooks: [],  
        effectHooks: [],  
        handlers: [],  
        helperFunctions: [],  
        functions: [],  
        components: [],  
        classComponents: [],  
        classMethod: [],  
        classProperty: [],  
        returns: [],  
        styledComponent: [],  
        functionalComponent: [],  
        types: {  
            TSInterfaceDeclaration: [],  
            TSTypeAliasDeclaration: [],  
            TSEnumDeclaration: []  
        },  
        exports: [],  
        mainComponent: null,  
        nodes: []  
    };  
  
    const state = createStateTracker();  
    traverse(ast, setupTraverse(state, filePath, sections));
 
  
    sections.nodes.push(  
        ...sections.imports,  
        ...sections.constants, 
        ...sections.localConstants, 
        ...sections.contexts,  
        ...sections.hooks,  
        ...sections.stateHooks,  
        ...sections.effectHooks,  
        ...sections.handlers,  
        ...sections.types.TSInterfaceDeclaration,  
        ...sections.types.TSTypeAliasDeclaration,  
        ...sections.types.TSEnumDeclaration,  
        ...sections.helperFunctions,  
        ...sections.functions,  
        ...sections.components,  
        ...sections.classComponents,  
        ...sections.classMethod,  
        ...sections.classProperty,  
        ...sections.returns,  
        ...sections.styledComponent,  
        ...sections.functionalComponent,  
        sections.mainComponent,  
        ...sections.exports  
    );  
  
    return sections;  
};  

module.exports = {  
    checkFile,  
    setupTraverse,  
    analyzeCode,  
    reorderCode,  
    createNewAST,
    hasDisableCheckComment,
    fixFile,  
    sections,
};  
