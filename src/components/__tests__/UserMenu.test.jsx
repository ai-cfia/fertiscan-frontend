import theme from '@/app/theme';
import { usePlaceholder } from '@/classe/User';
import { ThemeProvider } from '@mui/material/styles';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import UserMenu from '../UserMenu';

jest.mock('../../classe/User', () => ({
  usePlaceholder: jest.fn(),
}));

const dummyUser = {
  getUsername: jest.fn().mockReturnValue('placeholderUser'),
};

usePlaceholder.mockReturnValue(dummyUser);

describe('UserMenu', () => {
  const mockSetUserPopUpOpen = jest.fn();
  const mockSetAnchorElement = jest.fn();
  let anchorElement = null;

  beforeEach(() => {
    // Reset the mock function calls before each test
    mockSetUserPopUpOpen.mockReset();
    mockSetAnchorElement.mockReset();
    anchorElement = document.createElement('div'); // Create a new div element to be used as an anchor
  });

  it('renders without crashing', () => {
    render(
      <ThemeProvider theme={theme}>
        <UserMenu
          anchorElement={anchorElement}
          userPopUpOpen={false}
          setUserPopUpOpen={mockSetUserPopUpOpen}
          setAnchorElement={mockSetAnchorElement}
        />
      </ThemeProvider>,
    );
  });

  it('the menu becomes not visible when userPopUpOpen is false', () => {
    render(
      <ThemeProvider theme={theme}>
        <UserMenu
          anchorElement={anchorElement}
          userPopUpOpen={false}
          setUserPopUpOpen={mockSetUserPopUpOpen}
          setAnchorElement={mockSetAnchorElement}
        />
      </ThemeProvider>,
    );
    expect(screen.queryByTestId('user-menu')).not.toBeVisible();
  });

  it('the menu becomes visible when userPopUpOpen is true', () => {
    render(
      <ThemeProvider theme={theme}>
        <UserMenu
          anchorElement={anchorElement}
          userPopUpOpen={true}
          setUserPopUpOpen={mockSetUserPopUpOpen}
          setAnchorElement={mockSetAnchorElement}
        />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('dashboard-menu-item')).toBeVisible();
  });

  it('closes the menu when a MenuItem is clicked', () => {
    render(
      <ThemeProvider theme={theme}>
        <UserMenu
          anchorElement={anchorElement}
          userPopUpOpen={true}
          setUserPopUpOpen={mockSetUserPopUpOpen}
          setAnchorElement={mockSetAnchorElement}
        />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByTestId('dashboard-menu-item'));
    expect(mockSetUserPopUpOpen).toHaveBeenCalledWith(false);
    expect(mockSetAnchorElement).toHaveBeenCalledWith(null);
  });
});
