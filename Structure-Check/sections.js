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
    nodes: [],
    others:[] 
});  
  
const createInnerSection = (node, section = createSection(), mainComponentPath = null, isMainComponent = false) => ({  
    node: node,  
    section: section || createSection(),  
    mainComponentPath: mainComponentPath,  
    isMainComponent: isMainComponent  
});  
  
const createInnerReturn = (node, returnType, returnValue) => ({  
    node: node,  
    returnType: returnType, // 'jsx', 'expression', or 'other'  
    returnValue: returnValue,  
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
    return: [],    
    styledComponent: [],    
    functionalComponent: [],    
    types: {    
        TSInterfaceDeclaration: [],    
        TSTypeAliasDeclaration: [],    
        TSEnumDeclaration: []    
    },    
    exports: [],    
    mainComponent: [],    
    nodes: [],
    others:[]
};    
  
const visitedNodes = new Set();  
  
module.exports = {  
    createSection,  
    createInnerSection,  
    createInnerReturn,  
    visitedNodes,  
    sections  
};  
