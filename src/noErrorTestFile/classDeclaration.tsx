import React, { Component } from 'react';

interface MyComponentProps {
  initialCount?: number;
}

interface MyComponentState {
  count: number;
}

class MyComponent extends Component<MyComponentProps, MyComponentState> {
  static defaultProps = {
    initialCount: 0,
  };

  constructor(props: MyComponentProps) {
    super(props);
    this.state = {
      count: props.initialCount ?? 0,
    };
    this.title = "Counter Component"; // Initializing the class property
  }

  increment = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  };

  decrement = () => {
    this.setState((prevState) => ({
      count: prevState.count - 1,
    }));
  };

  reset = () => {
    this.setState({
      count: this.props.initialCount ?? 0,
    });
  };

  render() {
    return (
      <div>
        <h1>Count: {this.state.count}</h1>
        <button onClick={this.increment}>Increment</button>
        <button onClick={this.decrement}>Decrement</button>
      </div>
    );
  }
}

export default MyComponent;