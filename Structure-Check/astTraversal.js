const traverse = require('@babel/traverse').default;
const { codeFrameColumns } = require("@babel/code-frame");
const { reportError } = require('./common');
const { createStateTracker } = require('./stateManagement');
const generate = require('@babel/generator').default;
const { statSync, readFileSync, writeFileSync } = require('fs');
const fs = require('fs');
const path = require('path');
const {t}  = require('./common');
const { parse } = require('@babel/parser');

const {
    createSection, createInnerSection, createInnerReturn, createMainComponent,
    visitedNodes, sections
} = require('./sections');
const {
    parseFile, createBackup, readFileContent, writeFileContent
} = require('./fileOperations');
const {
    handleImportDeclaration, handleVariableDeclarator, handleFunctionalComponent,
    handleGlobalConstantDeclaration, handleTSInterfaceDeclaration, handleTSTypeAliasDeclaration,
    handleTSEnumDeclaration, handleStyledComponent, handleCustomHookDeclaration,
    handleLocalConstantDeclaration, handleMainReactComponent, handleHelperFunctionDeclaration,
    handleFunctionExpressionsAndArrowFunctions, handleExportDeclarations,
    handleJSXElement, handleReturnStatement, handleUseContext, handleClassComponent,
    handleClassMethod, handleHooksAndEffects, handleContextCreation, processFunctionType, handleIfStatement, sanitizeParsedCode
} = require('./astHandlers.js');
const {
    isMainFunctionComponent, isExportDeclarationWithName,
    getMainComponentNameFromFileName, isGlobalConstant, isLocalConstant
} = require('./utils');

const checkFile = async (filePath, state) => {
    console.log(`Reading file: ${filePath}`);
    try {
        const content = readFileSync(filePath, 'utf-8');
        const ast = parseFile(content);

        const sections = {
            imports: [], localConstants: new Map(), constants: [], contexts: [], hooks: [],
            stateHooks: [], effectHooks: [], handlers: [], helperFunctions: [], components: [],
            classComponents: [], classMethods: [], classProperties: [], returns: [], styledComponent: [],
            functionalComponent: [], types: { TSInterfaceDeclaration: [], TSTypeAliasDeclaration: [], TSEnumDeclaration: [] },
            exports: [], mainComponent: null, nodes: [], others: [], expressions: [], statements: [] // Initialize others
        };

        traverse(ast, setupTraverse(state, filePath, sections));

        console.log(`File ${filePath} checked.`);
        console.log("------------------------------------------------------------\n");
    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`);
        process.exit(1);
    }
};

const setupTraverse = (state, filePath, sections) => {
    return {
        enter(path) {
            const node = path.node;
            if (node && !t.isComment(node)) {
                node.code = codeFrameColumns(readFileContent(filePath), node.loc, { highlightCode: true });
            } else {
                console.error(`Null or undefined node encountered at enter path: ${path.toString()}`);
            }
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
            handleNode(path, handleTSTypeAliasDeclaration, state, filePath, sections);
        },
        TSInterfaceDeclaration(path) {
            handleNode(path, handleTSInterfaceDeclaration, state, filePath, sections);
        },
        TSEnumDeclaration(path) {
            handleNode(path, handleTSEnumDeclaration, state, filePath, sections);
        },
        FunctionDeclaration(path) {
            if (isMainFunctionComponent(path, state, filePath)) {
                handleNode(path, handleMainReactComponent, state, filePath, sections);
            } else {
                handleNode(path, handleHelperFunctionDeclaration, state, filePath, sections);
            }
        },
        'ArrowFunctionExpression|FunctionExpression': {
            enter(path) {
                if (isMainFunctionComponent(path, state, filePath)) {
                    handleNode(path, handleMainReactComponent, state, filePath, sections);
                } else {
                    handleNode(path, handleFunctionExpressionsAndArrowFunctions, state, filePath, sections);
                }
            }
        },
        ClassDeclaration(path) {
            handleNode(path, handleClassComponent, state, filePath, sections);
        },
        CallExpression(path) {
            if (isMainFunctionComponent(path, state, filePath)) {
                handleNode(path, handleMainReactComponent, state, filePath, sections);
            } else {
                handleNode(path, handleHooksAndEffects, state, filePath, sections);
            }
        },
        TaggedTemplateExpression(path) {
            handleNode(path, handleStyledComponent, state, filePath, sections);
        },
        ReturnStatement(path) {
            handleNode(path, handleReturnStatement, state, filePath, sections);
        },
        'ExportNamedDeclaration|ExportDefaultDeclaration'(path) {
            handleNode(path, handleExportDeclarations, state, filePath, sections);
        },
        // General statement handling moved here
        enter(path) {
            if (path.isStatement() && !path.isReturnStatement()) { // Ensure we're not double-handling return statements
                handleNode(path, handleIfStatement, state, filePath, sections);
            }
        },
        exit(innerPath) {
            if (innerPath === path) {
                exitReactComponent(state);
            }
        }
    };
};

const handleNode = (path, handler, state, filePath, sections) => {
    const node = path.node;
    if (node && !visitedNodes.has(node) && !hasDisableCheckComment(path) && isValidNodeType(node)) {
        visitedNodes.add(node);
        console.log(`Visiting node: ${node.type}`);
        if (typeof handler === 'function') { // Ensure handler is a function
            handler(path, state, filePath, sections);
        } else {
            console.error(`Handler is not a function for node type: ${node.type}`);
        }
    } else {
        if (!node) {
            console.error("Null or undefined node encountered:", path.toString());
        } else if (!isValidNodeType(node)) {
            console.error(`Invalid node type: ${node.type}`);
            handleUnknownNode(node, path); // Handle the unknown node appropriately.
        }
    }
};

function hasDisableCheckComment(path) {
    const containsDisableCheck = (comments) => {
        return Array.isArray(comments) && comments.some((comment) => comment.value.includes('disable-check'));
    };

    let leadingComments = path.node.leadingComments;
    return containsDisableCheck(leadingComments);
}

/**
 * Handles unknown nodes during AST traversal.
 *
 * @param {Object} node - The unknown node to be handled.
 * @param {Object} path - The Babel path object for the unknown node.
 */
const handleUnknownNode = (node, path) => {
    console.warn(`Unknown node type encountered: ${node ? node.type : 'null'}`);
    if (node && path) {
        sections.others.push({
            node,
            code: node.code, // Add code if available,
            loc: path.node.loc
        });
    }
};

const reorderCode = () => {
    const log = [];
    const unknownNodes = [];

    console.log('Debug: Sections structure before processing:', sections);

    const orderedSections = [
        ...sections.imports,
        ...sections.contexts,
        ...sections.constants,
        ...Array.from(sections.localConstants.values()).flat(),
        ...sections.hooks,
        ...sections.functionalComponent,
        ...sections.stateHooks,
        ...sections.effectHooks,
        ...sections.handlers,
        ...sections.types.TSInterfaceDeclaration,
        ...sections.types.TSTypeAliasDeclaration,
        ...sections.types.TSEnumDeclaration,
        ...sections.helperFunctions,
        ...sections.statements,
        ...sections.expressions,
        ...sections.return,
        ...sections.styledComponent,
        ...(sections.mainComponent ? [sections.mainComponent] : []),
        ...sections.exports,
    ];

    const finalCode = orderedSections.flatMap(node => {
        try {
            if (isValidNode(node)) {
                return node;
            }
            throw new Error('Invalid node type');
        } catch (err) {
            unknownNodes.push(node);
            log.push({ nodeType: node?.type, start: node?.start, end: node?.end, loc: node?.loc, code: node?.code, error: err.message });
            console.error(`Error with node: ${node?.type}, Message: ${err.message}`);
            console.error(`Node Code: ${node?.code}`);
            return [];
        }
    });

    if (unknownNodes.length > 0) {
        finalCode.push({
            type: 'CommentLine',
            value: ' Unknown nodes, please place them and add disable comment',
            leading: true,
        });
        finalCode.push(...unknownNodes);

        console.warn(`Unknown nodes count: ${unknownNodes.length}`);
    }

    return { orderedSections: finalCode, log };
};

// Validate node to ensure it has essential properties
const isValidNode = (node) => {
    return (
        node && 
        typeof node.type === 'string' &&
        ['ExpressionStatement', 'CommentLine', /* Add other known types here */].includes(node.type)
    );
};

const isValidNodeType = (node) => {
    const validTypes = [
        'ImportDeclaration',
        'VariableDeclaration',
        'FunctionDeclaration',
        'ArrowFunctionExpression',
        'FunctionExpression',
        'ClassDeclaration',
        'CallExpression',
        'TaggedTemplateExpression',
        'ReturnStatement',
        'ExportNamedDeclaration',
        'ExportDefaultDeclaration',
        'BlockStatement',
        'IfStatement',
        'ExpressionStatement',
        'BlockStatement' // Ajout des types manquants
        // Ajoutez d'autres types valides au besoin
    ];
    return validTypes.includes(node.type);
};


const ensureLogDirectoryExists = () => {
    const logDir = path.resolve(__dirname, 'log');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
};

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return;
            seen.add(value);
        }
        return value;
    };
};

const saveLog = (log) => {
    ensureLogDirectoryExists();

    const timestamp = new Date().toISOString().replace(/[:-]/g, '').replace(/\..+/, '');
    const logFilePath = path.resolve(__dirname, `log/log_${timestamp}.json`);

    const simplifiedLog = log.map(entry => {
        const { nodeType, start, end, loc, code, elementType, error, filePath, newAst } = entry;
        return { nodeType, start, end, loc, code, elementType, error, filePath, newAst: newAst && JSON.stringify(newAst, getCircularReplacer(), 2) };
    });

    fs.writeFileSync(logFilePath, JSON.stringify(simplifiedLog, null, 2), 'utf-8');
    console.log(`Log saved to ${logFilePath}`);
};

const createNewAST = (orderedSections) => ({
    type: 'Program',
    body: orderedSections.filter(node => node && typeof node.type === 'string'),
    sourceType: 'module'
});

function generateAndSaveCode(parsedCode, newFilePath) {
    const sanitizedCode = sanitizeParsedCode(parsedCode);
    try {
        const outputCode = generate(t.program(sanitizedCode), {}).code;
        writeFileContent(newFilePath, outputCode);
    } catch (error) {
        console.error('Error generating code:', error);
    }
}

const fixFile = async (filePath) => {
    console.log(`Fixing file: ${filePath}`);
    if (statSync(filePath).isFile()) {
        createBackup(filePath);
        const content = readFileContent(filePath);

        console.log(`Original File Content: \n${content}`);
        const ast = parseFile(content);
        const state = createStateTracker();

        const sections = analyzeCode(ast, filePath);
        const { orderedSections, log } = reorderCode(sections);

        orderedSections.push(...sections.others.map(sanitizeNode));
        console.log('Ordered Sections:', orderedSections);
        console.log('Problematic Sections Log:', log);

        const newAst = createNewAST(orderedSections);
        generateAndSaveCode(newAst, filePath);

        saveLog(log); // Ensure the log is saved after processing
    } else {
        console.error(`${filePath} is not a file`);
    }
};

const sanitizeNode = (node) => {
    const validProps = [
        'type', 'start', 'end', 'loc', 'range', 'id', 'generator', 'async',
        'params', 'body', 'callee', 'arguments', 'argument', 'extra', 'name', 'return',
        'declarations', 'specifiers'
    ];

    let sanitizedNode = {};

    for (let key of Object.keys(node)) {
        if (validProps.includes(key)) {
            sanitizedNode[key] = node[key];
        }
    }

    sanitizedNode.leadingComments = node.leadingComments || [];
    sanitizedNode.trailingComments = node.trailingComments || [];

    return sanitizedNode;
};

const analyzeCode = (ast, filePath) => {
    const sections = {
        imports: [], localConstants: new Map(), constants: [], contexts: [], hooks: [],
        stateHooks: [], effectHooks: [], handlers: [], helperFunctions: [], components: [],
        classComponents: [], classMethods: [], classProperties: [], return: [], styledComponent: [],
        functionalComponent: [], types: { TSInterfaceDeclaration: [], TSTypeAliasDeclaration: [], TSEnumDeclaration: [] },
        exports: [], mainComponent: null, nodes: [], others: [], expressions: [], statements: [] // Initialize others
    };

    const state = createStateTracker();
    traverse(ast, setupTraverse(state, filePath, sections));

    sections.nodes.push(
        ...sections.imports,
        ...sections.constants,
        ...sections.localConstants.values(),
        ...sections.contexts,
        ...sections.hooks,
        ...sections.stateHooks,
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
        ...sections.return,
        ...sections.statements,
        ...sections.styledComponent,
        ...sections.functionalComponent,
        sections.mainComponent && sections.mainComponent,
        ...sections.exports,
        ...sections.others
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
    parsedCode
};