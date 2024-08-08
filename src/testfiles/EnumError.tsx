// IncorrectEnumOrder.tsx

import React from 'react';

export function EnumError() {
  return <div />;
}

// Enum defined after a component
enum Colors {
  Red = 'red',
  Green = 'green',
  Blue = 'blue'
}