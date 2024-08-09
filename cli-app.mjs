import React, { useState } from 'react';
import { render, Text, Box, useApp, useInput } from 'ink';

// Handle selection
const handleSelect = (item) => {
  console.log(`Selected: ${item.label}`);
  // Add your logic here based on the selected item.
};

// Menu items
const items = [
  {
    label: 'Option 1',
    value: 'option1'
  },
  {
    label: 'Option 2',
    value: 'option2'
  },
  {
    label: 'Option 3',
    value: 'option3'
  }
];

// Main app component
const App = () => {
  const { exit } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.downArrow) {
      setSelectedIndex((prev) => (prev + 1) % items.length);
    }

    if (key.upArrow) {
      setSelectedIndex((prev) => (prev - 1 + items.length) % items.length);
    }

    if (key.return) {
      handleSelect(items[selectedIndex]);
      exit();
    }
  });

  return React.createElement(
    Box,
    { flexDirection: 'column', padding: 1 },
    React.createElement(Text, { color: 'green' }, 'Hello, world! Select an option:'),
    items.map((item, index) =>
      React.createElement(
        Box,
        {
          key: item.value,
          padding: 1,
          borderStyle: selectedIndex === index ? 'double' : 'single',
          borderColor: selectedIndex === index ? 'cyan' : 'gray',
          // Use backgroundColor and color to style boxes and labels
          backgroundColor: selectedIndex === index ? 'blue' : undefined,
          onClick: () => {
            setSelectedIndex(index);
            handleSelect(item);
            exit();
          }
        },
        // Style the Text label based on whether it is selected
        React.createElement(Text, { color: selectedIndex === index ? 'yellow' : 'white' }, item.label)
      )
    )
  );
};

console.log('About to render');
render(React.createElement(App, null));