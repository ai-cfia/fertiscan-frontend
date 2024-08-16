import React, { Component } from 'react';

// Class components defined here will have various errors as described

// Error: Handlers defined after hooks and render methods
class ErrorHandlersAfterHooks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    componentDidUpdate(prevProps, prevState) {
        // Lifecycle method
    }

    render() {
        return (
            <div>{this.state.count}</div>
        );
    }

    handleClick = () => {
        // Handler method defined after render
    }

    componentDidMount() {
        // Lifecycle method
    }
}

// Error: State defined after handlers and render methods
class ErrorStateAfterHandlers extends Component {
    handleClick = () => {
        // Handler method
    }

    render() {
        return (
            <div>{this.state.count}</div>
        );
    }

    state = {
        count: 0
    };
}

// Error: Lifecycle methods defined after handlers and render methods
class ErrorLifecycleMethodsAfterHandlers extends Component {
    handleClick = () => {
        // Handler method
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>Click</button>
            </div>
        );
    }

    componentDidMount() {
        // Lifecycle method defined after handlers
    }
}

// Error: Constructor defined after handlers, hooks, and render methods
class ErrorConstructorAfterHandlers extends Component {
    handleClick = () => {
        // Handler method
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClick}>Click</button>
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }
}

// Error: Multiple returns in same component
class ErrorMultipleReturns extends Component {
    render() {
        if (this.state) {
            return <div>State exists</div>;
        } else {
            return <div>No state</div>;  // Second return statement in same component
        }
    }
}

export default function Test() {
    return (
        <div>Test File for Class Component Errors</div>
    );
}