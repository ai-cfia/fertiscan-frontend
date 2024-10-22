// src/components/Counter.test.tsx
import Counter from "@/component/Counter";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

describe("Counter component", () => {
  it("renders the counter and increments on click", () => {
    render(<Counter />);

    const counterText = screen.getByText(/Counter: 0/i);
    expect(counterText).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /Increment/i });
    fireEvent.click(button);

    const updatedCounterText = screen.getByText(/Counter: 1/i);
    expect(updatedCounterText).toBeInTheDocument();
  });
});
