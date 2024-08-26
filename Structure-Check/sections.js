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
    mainComponent: [],
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
    mainComponent: [],  
    nodes: []  
};  

const visitedNodes = new Set();

module.exports = {
    createSection,
    createInnerSection,
    createInnerReturn,
    createMainComponent,
    visitedNodes,
    sections
};