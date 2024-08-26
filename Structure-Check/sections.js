// sections.js
const createSection = () => ({
    imports: [],
    localConstants: new Map(),
    constants: [],
    contexts: [],
    hooks: [],
    stateHooks: [],
    effectHooks: [],
    handlers: [],
    helperFunctions: [],
    classComponents: [],
    return: [],
    styledComponent: [],
    functionalComponent: [],
    types: {
        TSInterfaceDeclaration: [],
        TSTypeAliasDeclaration: [],
        TSEnumDeclaration: [],
    },
    exports: [],
    mainComponent: null,
    jsx: [],
    nodes: []
});

const createInnerSection = (node) => ({
    node: node,
    section: createSection()
});

const createInnerReturn = (node, jsx) => ({
    node: node,
    JSXTable: jsx,
});

const createMainComponent = (innerSection, path) => ({
    innerSection: createInnerSection(innerSection),
    mainComponentPath: path
});

const visitedNodes = new Set();

module.exports = {
    createSection,
    createInnerSection,
    createInnerReturn,
    createMainComponent,
    visitedNodes
};