// IncorrectLocalConstantOrder.tsx

function someFunction() {
    // Local constant defined after a function inside, which is incorrect as per rules
    const someValue = 5;
  
    function innerFunction() {
      console.log('This should not appear before a local constant.');
    }
  
    return innerFunction;
  }