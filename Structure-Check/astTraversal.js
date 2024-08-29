const traverse = require('@babel/traverse').default;
const { codeFrameColumns } = require("@babel/code-frame");
const { reportError } = require('./common');
const { createStateTracker } = require('./stateManagement');
const generate = require('@babel/generator').default;
const { statSync, readFileSync, writeFileSync } = require('fs');
const fs = require('fs');
const path = require('path');    

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
    handleClassMethod, handleHooksAndEffects, handleContextCreation, processFunctionType
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
            exports: [], mainComponent: null, nodes: [], others: []  // Initialize others
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
            if (node) {
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
        }
    };
};

const handleNode = (path, handler, state, filePath, sections) => {
    const node = path.node;
    if (node && !visitedNodes.has(node) && !hasDisableCheckComment(path)) {
        visitedNodes.add(node);
        console.log(`Visiting node: ${node.type}`);
        handler(path, state, filePath, sections);
    } else {
        if (!node) console.error("Null or undefined node encountered:", path.toString());
    }
};

const reorderCode = (sections) => {
    const log = [];
    const unknownNodes = [];
    const invalidNodes = [];  // Pour les nœuds invalides ou problématiques

    // Validate the sections structure upfront
    console.log('Debug: Sections structure before processing:', sections);

    // Create a list of known sections and their content
    const orderedSections = [
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
        ...sections.return,
        ...sections.styledComponent,
        ...sections.functionalComponent,
        ...(sections.mainComponent ? [sections.mainComponent] : []),
        ...sections.exports,
    ];

    // Init finalCode array
    const finalCode = []; 

    orderedSections.forEach(node => {
        if (node) {
            try {
                if (isValidNode(node)) {
                    // Valid node, add to finalCode
                    finalCode.push(node);
                } else {
                    throw new Error('Invalid node type');
                }
            } catch (error) {
                log.push({
                    nodeType: node.type,
                    start: node.start,
                    end: node.end,
                    loc: node.loc,
                    code: node.code,
                    error: error.message,
                });
                invalidNodes.push(node);  // Add to invalid nodes list
            }
        } else {
            console.warn('Undefined node encountered, skipping.');
        }
    });

    // Add invalid nodes at the end with appropriate comments
    if (invalidNodes.length > 0) {
        finalCode.push(
            {
                type: 'CommentLine',
                value: ' Invalid nodes, please check them and add disable comment',
                leading: true,
            }
        );
        invalidNodes.forEach(node => finalCode.push(node));
    }

    // Identify any elements not placed in a specific section and add them to 'unknownNodes'
    sections.nodes.forEach(node => {
        if (node && !orderedSections.includes(node)) {
            log.push({
                nodeType: node.type,
                start: node.start,
                end: node.end,
                loc: node.loc,
                code: node.code,
            });
            unknownNodes.push(sanitizeUnknownNode(node)); // Collect and sanitize unknown nodes
        }
    });

    // Add unknown nodes at the end with appropriate comments
    if (unknownNodes.length > 0) {
        finalCode.push(
            {
                type: 'CommentLine',
                value: ' Unknown nodes, please place them and add disable comment',
                leading: true,
            }
        );
        unknownNodes.forEach(node => finalCode.push(node));
    }

    // Debug for 'unknownNodes' section
    console.log('Debug: Unknown Nodes Section:', unknownNodes);

    // Assemble final code with a comment before unknown nodes
    const resultCode = [
        ...finalCode.filter(isValidNode),
        ...sections.others.map(sanitizeUnknownNode),
    ];

    // Debug final ordered sections
    console.log('Debug: Final Ordered Code List:', resultCode);

    return { orderedSections: resultCode, log };
};

// La fonction pour vérifier si un nœud est valide (est inchangée)
const isValidNode = (node) => {
    return node && typeof node.type === 'string';
};

// La fonction pour assainir les nœuds en supprimant les propriétés inattendues (est inchangée)
const sanitizeUnknownNode = (node) => {
    const validProps = [
        'type', 'start', 'end', 'loc', 'range',
        'id', 'generator', 'async', 'params',
        'body', 'callee', 'arguments', 'argument',
        'extra', 'name', 'return', 'declarations', 'specifiers'
    ];

    const sanitizedNode = {};

    validProps.forEach(prop => {
        if (node[prop] !== undefined) {
            sanitizedNode[prop] = node[prop];
        }
    });

    if (!sanitizedNode.type) {
        sanitizedNode.type = 'ExpressionStatement'; // Default to ExpressionStatement if type missing
        sanitizedNode.expression = {
            type: 'Identifier',
            name: '"UNKNOWN_NODE"',
        };
    }

    return sanitizedNode;
};



const createNewAST = (orderedSections) => {
    return {
        type: 'Program',
        body: orderedSections.filter(node => node && typeof node.type === 'string'),
        sourceType: 'module',
    };
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

const fixFile = async (filePath) => {
    console.log(`Fixing file: ${filePath}`);

    if (statSync(filePath).isFile()) {
        createBackup(filePath);
        const content = readFileContent(filePath);
        console.log(`Original File Content: \n${content}`);

        const ast = parseFile(content);
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
            ...sections.return,
            ...sections.styledComponent,
            ...sections.functionalComponent,
            sections.mainComponent && sections.mainComponent.section,
            ...sections.exports
        );

        const { orderedSections, log } = reorderCode(sections);

        orderedSections.push(...sections.others.map(sanitizeUnknownNode));

        console.log('Ordered Sections:', JSON.stringify(orderedSections, getCircularReplacer(), 2));
        console.log('Log of problematic sections:', JSON.stringify(log, getCircularReplacer(), 2));

        saveLog(log);

        const newAst = createNewAST(orderedSections);

        let newContent;
        try {
            newContent = generate(newAst, {}).code;
            console.log('Generated Code:', newContent);

            if (!newContent || newContent.trim() === '') {
                console.error('Generated content is empty.');
                log.push({ error: 'Generated content is empty', filePath, newAst });
                saveLog(log);
                return;
            }
        } catch (error) {
            console.error('Error generating code for file:', filePath);
            console.error('AST Node:', JSON.stringify(newAst, getCircularReplacer(), 2));
            log.push({ error: 'Error generating code', filePath, newAst, error: error.message });
            saveLog(log);
            throw error;
        }

        writeFileContent(filePath, newContent);
        console.log(`File ${filePath} has been fixed.`);
    } else {
        console.error(`${filePath} is not a file`);
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
        imports: [], localConstants: new Map(), constants: [], contexts: [], hooks: [],
        stateHooks: [], effectHooks: [], handlers: [], helperFunctions: [], components: [],
        classComponents: [], classMethods: [], classProperties: [], returns: [], styledComponent: [],
        functionalComponent: [], types: { TSInterfaceDeclaration: [], TSTypeAliasDeclaration: [], TSEnumDeclaration: [] },
        exports: [], mainComponent: null, nodes: [], others: []  // Initialize others
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
        ...sections.returns,
        ...sections.styledComponent,
        ...sections.functionalComponent,
        sections.mainComponent && sections.mainComponent,
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