module.exports = {  
    transform: {  
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',  
    },  
    testEnvironment: 'node',  
    testMatch: [  
        '**/src/Structure-Check/__tests__/**/*.test.js',  
    ],  
};  
