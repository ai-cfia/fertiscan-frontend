// src/components/Counter.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from '@/Components/Counter';

describe('Counter component', () => {
  it('renders the counter and increments on click', () => {
    render(<Counter />);
    
    const counterText = screen.getByText(/Counter: 0/i);
    expect(counterText).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Increment/i });
    fireEvent.click(button);

    const updatedCounterText = screen.getByText(/Counter: 1/i);
    expect(updatedCounterText).toBeInTheDocument();
  });
});
