// IncorrectTypeAliasOrder.tsx

import React from 'react';

function AliasTypeError() {
  return <div />;
}

type Props = {
  message: string;
};

export default AliasTypeError;