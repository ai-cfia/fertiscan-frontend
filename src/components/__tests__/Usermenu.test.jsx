import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Usermenu from '../Usermenu';
import { useStore } from "@/store/useStore";
import { usePlaceholder } from "@/classe/User";
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/theme';

// Mock the hooks that the Usermenu component uses
jest.mock('../../store/useStore', () => ({
  useStore: jest.fn(),
}));
jest.mock("../../classe/User", () => ({
    usePlaceholder: jest.fn(),
}));

// Dummy placeholder user
const dummyUser = {
  getUsername: jest.fn().mockReturnValue('TestUser'),
};

// Mock usePlaceholder hook
usePlaceholder.mockReturnValue(dummyUser);

// Variables to control the useStore mock
const mockSetUserPopUpOpen = jest.fn();
const mockSetAnchorElement = jest.fn();

useStore.mockReturnValue({
  anchorElement: null,
  userPopUpOpen: false,
  setUserPopUpOpen: mockSetUserPopUpOpen,
  setAnchorElement: mockSetAnchorElement,
});


describe('Usermenu', () => {
    // Resets mock function calls before each test
    beforeEach(() => {
        jest.clearAllMocks();
        useStore.mockReturnValue({
            ...useStore(),
            userPopUpOpen: false, // Default value for visibility
        });
    });

    // Test case 1
    it('renders without crashing', () => {
        render(
            <ThemeProvider theme={theme}>
                <Usermenu />
            </ThemeProvider>
        );
    });

    // Test case 2
    it('the menu is not visible when userPopUpOpen is false', () => {
        const mockAnchorEl = document.createElement('div');
        useStore.mockReturnValueOnce({...useStore(), userPopUpOpen: true, anchorEl: mockAnchorEl});
        render(
            <ThemeProvider theme={theme}>
                <Usermenu />
            </ThemeProvider>
        );
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    // Test case 3
    it('the menu becomes visible when userPopUpOpen is true', () => {
        const mockAnchorEl = document.createElement('div');
        useStore.mockReturnValueOnce({...useStore(), userPopUpOpen: true, anchorEl: mockAnchorEl});        render(
            <ThemeProvider theme={theme}>
                <Usermenu />
            </ThemeProvider>
        );
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    // Test case 4
    it('closes the menu when a MenuItem is clicked', () => {
        const mockAnchorEl = document.createElement('div');
        useStore.mockReturnValueOnce({...useStore(), userPopUpOpen: true, anchorEl: mockAnchorEl});        render(
            <ThemeProvider theme={theme}>
                <Usermenu />
            </ThemeProvider>
        );;
        fireEvent.click(screen.getByText('Dashboard'));
        expect(mockSetUserPopUpOpen).toHaveBeenCalledWith(false);
        expect(mockSetAnchorElement).toHaveBeenCalledWith(null);
    });
});
