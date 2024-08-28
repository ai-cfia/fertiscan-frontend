const traverse = require('@babel/traverse').default;
const { codeFrameColumns } = require("@babel/code-frame");
const { reportError } = require('./common');
const { createStateTracker } = require('./stateManagement');
const generate = require('@babel/generator').default;
const { statSync, readFileSync } = require('fs');
const { 
    createSection,
    createInnerSection,
    createInnerReturn,
    createMainComponent,
    visitedNodes,
    sections 
} = require('./sections');
const { 
    parseFile, 
    createBackup, 
    readFileContent, 
    writeFileContent 
} = require('./fileOperations'); 
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
    handleHooksAndEffects, 
    handleContextCreation, 
    processFunctionType 
} = require('./astHandlers.js'); 
const { 
    isMainFunctionComponent, 
    isExportDeclarationWithName, 
    getMainComponentNameFromFileName, 
    isGlobalConstant, 
    isLocalConstant 
} = require('./utils');

/**
 * Checks the structure and naming conventions of a given file.
 * Reads the file, parses its contents into an AST, performs various checks, and logs errors if any issues are found.
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
            stateHooks: [],
            effectHooks: [],
            handlers: [],
            helperFunctions: [],
            components: [],
            classComponents: [],
            classMethods: [],
            classProperties: [],
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
            nodes: [],
            others: []  // Initialize others
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

const setupTraverse = (state, filePath) => {
    return {
        enter(path) {
            path.node.code = codeFrameColumns(readFileContent(filePath), path.node.loc, { highlightCode: true });
        },
        ImportDeclaration(path) {
            handleNode(path, handleImportDeclaration, state, filePath, sections);
        },
        VariableDeclaration(path) {
            if (isMainFunctionComponent(path, state, filePath)) {
                handleNode(path, handleMainReactComponent, state, filePath, sections);
            } else {
                path.get('declarations').forEach(declaratorPath => {
                    handleNode(declaratorPath, handleVariableDeclarator, state, filePath, sections);
                });
            }
        },
        TSTypeAliasDeclaration(path) {
            handleNode(path, handleTSTypeAliasDeclaration, state, filePath);
        },
        TSInterfaceDeclaration(path) {
            handleNode(path, handleTSInterfaceDeclaration, state, filePath);
        },
        TSEnumDeclaration(path) {
            handleNode(path, handleTSEnumDeclaration, state, filePath);
        },
        FunctionDeclaration(path) {
            if (isMainFunctionComponent(path, state, filePath)) {
                handleNode(path, handleMainReactComponent, state, filePath, sections);
            } else {
                handleNode(path, handleHelperFunctionDeclaration, state, filePath);
            }
        },
        'ArrowFunctionExpression|FunctionExpression': {
            enter(path) {
                if (isMainFunctionComponent(path, state, filePath)) {
                    handleNode(path, handleMainReactComponent, state, filePath);
                } else {
                    handleNode(path, handleFunctionExpressionsAndArrowFunctions, state, filePath);
                }
            }
        },
        ClassDeclaration(path) {
            handleNode(path, handleClassComponent, state, filePath);
        },
        CallExpression(path) {
            if (isMainFunctionComponent(path, state, filePath)) {
                handleNode(path, handleMainReactComponent, state, filePath);
            } else {
                handleNode(path, handleHooksAndEffects, state, filePath);
            }
        },
        TaggedTemplateExpression(path) {
            if (isMainFunctionComponent(path, state, filePath)) {
                handleNode(path, handleMainReactComponent, state, filePath);
            } else {
                handleNode(path, handleStyledComponent, state, filePath);
            }
        },
        ReturnStatement(path) {
            handleNode(path, handleReturnStatement, state, filePath);
        },
        'ExportNamedDeclaration|ExportDefaultDeclaration'(path) {
            handleNode(path, handleExportDeclarations, state, filePath);
        }
    };
};

const handleNode = (path, handler, state, filePath, sections = {}) => {
    if (!visitedNodes.has(path.node) && !hasDisableCheckComment(path)) {
        visitedNodes.add(path.node);
        console.log(`Visiting node: ${path.node.type}`);
        handler(path, state, filePath);
    }
};

const reorderCode = (sections) => {
    const orderedSections = [
        ...(sections.imports || []),
        ...(sections.constants || []),
        ...(sections.contexts || []),
        ...(sections.hooks || []),
        ...(sections.stateHooks || []),
        ...(sections.effectHooks || []),
        ...(sections.handlers || []),
        ...(sections.types.TSInterfaceDeclaration || []),
        ...(sections.types.TSTypeAliasDeclaration || []),
        ...(sections.types.TSEnumDeclaration || []),
        ...(sections.helperFunctions || []),
        ...(sections.components || []),
        ...(sections.classComponents || []),
        ...(sections.classMethods || []),
        ...(sections.classProperties || []),
        ...(sections.returns || []),
        ...(sections.styledComponent || []),
        ...(sections.functionalComponent || []),
        ...(sections.mainComponent ? [sections.mainComponent] : []),
        ...(sections.exports || []),
        ...(sections.others || [])
    ];

    for (let [functionBodyNode, localConsts] of (sections.localConstants || new Map()).entries()) {
        if (Array.isArray(localConsts)) {
            const newFunctionBody = [
                ...localConsts,
                ...functionBodyNode.body.filter((node) => !localConsts.includes(node)),
            ];
            functionBodyNode.body = newFunctionBody;
        }
    }

    return orderedSections.filter(Boolean);
};

const createNewAST = (orderedSections) => {
    return {
        type: 'Program',
        body: orderedSections,
        sourceType: 'module',
    };
};

const fixFile = async (filePath) => {
    console.log(`Fixing file: ${filePath}`);

    if (statSync(filePath).isFile()) {
        createBackup(filePath);
        const content = readFileContent(filePath);
        console.log(`Original File Content: \n${content}`); // Log the original content for verification

        const ast = parseFile(content);
        const state = createStateTracker();

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
                components: [],
                classComponents: [],
                classMethods: [],
                classProperties: [],
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
                nodes: [],
                others: []
        };

        traverse(ast, setupTraverse(state, filePath));

        // After traversal, log the populated sections for debugging
        console.log('Sections after AST traversal:',sections);

        const orderedSections = reorderCode(sections);
        console.log('Ordered Sections:', JSON.stringify(orderedSections, null, 2)); // Log ordered sections for verification

        let newAst = createNewAST(orderedSections);
        console.log('New AST:', JSON.stringify(newAst, null, 2)); // Log new AST structure for verification

        let newContent;
        try {
            newContent = generate(newAst, {}).code;
            console.log('Generated Code:', newContent); // Log the generated code for verification
        } catch (error) {
            console.error('Error generating code for file:', filePath);
            const getCircularReplacer = () => {
                const seen = new WeakSet();
                return (key, value) => {
                    if (typeof value === "object" && value !== null) {
                        if (seen.has(value)) {
                            return;
                        }
                        seen.add(value);
                    }
                    return value;
                };
            };
            console.error('AST Node:', JSON.stringify(newAst, getCircularReplacer(), 2));
            throw error;
        }

        writeFileContent(filePath, newContent);
        console.log(`File ${filePath} has been fixed.`);
    } else {
        console.error(`${filePath} is not a file.`);
        process.exit(1);
    }
};

const hasDisableCheckComment = (path) => {
    const containsDisableCheck = (comments) => {
        return Array.isArray(comments) && comments.some((comment) => comment.type === 'CommentLine' && comment.value.trim() === 'disable-check');
    };

    if (path) {
        if (containsDisableCheck(path.node.leadingComments)) {
            return true;
        }
    }

    return false;
};

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
        components: [],
        classComponents: [],
        classMethods: [],
        classProperties: [],
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
        nodes: [],
        others: []
    };

    const state = createStateTracker();
    traverse(ast, setupTraverse(state, filePath, sections));

    sections.nodes.push(
        ...sections.imports,
        ...sections.constants,
        ...sections.localConstants,
        ...sections.contexts,
        ...sections.hooks,
        ...sections.effectHooks,
        ...sections.handlers,
        ...sections.types.TSInterfaceDeclaration,
        ...sections.types.TSTypeAliasDeclaration,
        ...sections.types.TSEnumDeclaration,
        ...sections.helperFunctions,
        ...sections.components,
        ...sections.classComponents,
        ...sections.classMethods,
        ...sections.classProperties,
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