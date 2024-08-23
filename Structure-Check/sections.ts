import { NodesVisitor } from "typescript";

interface InnerSection {
    node: Node;
    section: Sections;
}

interface InnerReturn{
    index:Number;
    node:Node;
    JSXTable: Node[];
}

interface MainComponent{
    innerSection: InnerSection;
    mainComponentPath:String;
}

interface Sections {
    imports: Node[];
    localConstants: Map<any, any>;
    constants: Node[];
    contexts: Node[];
    hooks: Node[];
    stateHooks: any[]; //To be added
    effectHooks: any[]; //To be added
    handlers: Node[];
    helperFunctions: InnerSection[];
    classComponents: any[]; // Just save all the class and what inside no refactoring of the class component
    return: InnerReturn[];
    styledComponent: InnerSection[];
    functionalComponent: InnerSection[];
    jsx: Node[];
    types: {
        TSInterfaceDeclaration: Node[];
        TSTypeAliasDeclaration: Node[];
        TSEnumDeclaration: Node[];
    };
    exports: Node[];
    mainComponent: MainComponent | null;
    nodes: Node[];
}

const createSection = (): Sections => ({
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
    jsx:[],
    nodes: []
});

const createInnerSection = (node: Node): InnerSection => ({
    node: node,
    section: createSection()
});

const createInnerReturn = (index:Number, node: Node, jsx): InnerReturn => ({
    node: node,
    jsx: createSection()
});

const createMainComponent=(innerSection:Node, path:string):MainComponent => ({
    innerSection: createInnerSection(innerSection),
    mainComponentPath: path
})



module.exports= {
    createSection,
    createInnerSection,
    createInnerReturn,
    createMainComponent
}