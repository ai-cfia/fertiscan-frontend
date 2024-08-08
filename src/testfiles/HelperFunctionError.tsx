// IncorrectHelperFunctionOrder.tsx

import React from 'react';

// Helper function defined after constants (Incorrect as per rules)
export function HelperFunctionError() {
  return 'helperFunction';
}

export const CONSTANT = 'constant';