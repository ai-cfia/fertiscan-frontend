import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/theme';
import { useStore } from '../../store/useStore';
import { getSize } from '@/utils/themeUtils';
import useBreakpoints from '@/utils/useBreakpoints';

// Mocking dependencies
jest.mock('../../store/useStore');
jest.mock('../../utils/themeUtils');
jest.mock('../../utils/useBreakpoints');

describe('Header Component', () => {
  beforeEach(() => {
    // Mock implementation for getSize
    (getSize as jest.Mock).mockReturnValue('16px');

    // Mock implementation for useStore
    (useStore as unknown as jest.Mock).mockReturnValue({
      setSideNavOpen: jest.fn(),
      sideNavOpen: false,
      setUserPopUpOpen: jest.fn(),
      setAnchorElement: jest.fn(),
    });

    // Mock implementation for useBreakpoints
    (useBreakpoints as jest.Mock).mockReturnValue({
      isExtraSmall: true,
      isSmall: false,
      isMedium: false,
      isLarge: false,
      isExtraLarge: false,
    });
  });

  it('renders the Header component', () => {
    render(
      <ThemeProvider theme={theme}>
        <Header />
      </ThemeProvider>
    );

    // Check if Français button is rendered
    expect(screen.getByText(/Français/)).toBeInTheDocument();
    // Check if Menu icon button is rendered
    expect(screen.getByLabelText(/menu/)).toBeInTheDocument();
  });

  it('handles the side navigation toggle', () => {
    const { setSideNavOpen, sideNavOpen } = useStore();

    render(
      <ThemeProvider theme={theme}>
        <Header />
      </ThemeProvider>
    );

    const menuButton = screen.getByLabelText(/menu/);
    fireEvent.click(menuButton);

    expect(setSideNavOpen).toHaveBeenCalledWith(!sideNavOpen);
  });

  it('handles user popup toggle', () => {
    const { setUserPopUpOpen, setAnchorElement } = useStore();

    render(
      <ThemeProvider theme={theme}>
        <Header />
      </ThemeProvider>
    );

    const accountButton = screen.getAllByRole('button').find(btn => btn.querySelector('[data-testid="AccountCircleIcon"]'));
    if (accountButton) {
      fireEvent.click(accountButton);
    } else {
      throw new Error("Account button not found");
    }

    expect(setUserPopUpOpen).toHaveBeenCalledWith(true);
    expect(setAnchorElement).toHaveBeenCalled();
  });
});
