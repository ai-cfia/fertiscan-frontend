// Header.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/theme';

describe('Header Component', () => {
  const mockSetSideNavOpen = jest.fn();
  const mockSetUserPopUpOpen = jest.fn();
  const mockSetAnchorElement = jest.fn();

  beforeEach(() => {
    // Reset the mock function before each test
    mockSetSideNavOpen.mockReset();
    mockSetUserPopUpOpen.mockReset();
    mockSetAnchorElement.mockReset();
  });

  it('renders the Header component', () => {
    render(
      <ThemeProvider theme={theme}>
        <Header setSideNavOpen={mockSetSideNavOpen}/>
      </ThemeProvider>
    );

    // Check if the "Français" button is rendered
    expect(screen.getByText('Français')).toBeInTheDocument();

    // Check if the Menu icon button is rendered
    expect(screen.getByLabelText('menu')).toBeInTheDocument();
  });

  it('handles the side navigation toggle', () => {
    render(
      <ThemeProvider theme={theme}>
        <Header setSideNavOpen={mockSetSideNavOpen}/>
      </ThemeProvider>
    );

    const menuButton = screen.getByLabelText('menu');
    fireEvent.click(menuButton);

    // Check if setSideNavOpen is called
    expect(mockSetSideNavOpen).toHaveBeenCalled();
  });
});
