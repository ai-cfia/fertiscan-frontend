import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SideNav from '../Sidenav';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

const theme = createTheme();

describe('SideNav Component', () => {
    const onClose = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: jest.fn(),
        });
    });

    it('should render the SideNav component', () => {
        render(
            <ThemeProvider theme={theme}>
                <SideNav open={true} onClose={onClose} />
            </ThemeProvider>
        );

        expect(screen.getByText('FertiScan')).toBeInTheDocument();
        expect(screen.getByText('New inspection')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Report an issue')).toBeInTheDocument();
    });

    it('should call onClose when clicking on the drawer button', () => {
        const onClose = jest.fn();

        render(
          <ThemeProvider theme={theme}>
            <SideNav open={true} onClose={onClose} />
          </ThemeProvider>
        );

        const newInspectionButton = screen.getByTestId('new-inspection-button');

        fireEvent.click(newInspectionButton);
        expect(onClose).toHaveBeenCalled();

        const searchPageButton = screen.getByTestId('search-page-button');

        fireEvent.click(searchPageButton);
        expect(onClose).toHaveBeenCalled();

        const reportIssueButton = screen.getByTestId('report-issue-button');

        fireEvent.click(reportIssueButton);
        expect(onClose).toHaveBeenCalled();
      });

    it('should call onClose when clicking outside the drawer', () => {
        const onClose = jest.fn();

        render(
          <ThemeProvider theme={theme}>
            <SideNav open={true} onClose={onClose} />
          </ThemeProvider>
        );

        const drawer = screen.getByTestId('backdrop');
        fireEvent.click(drawer);
        expect(onClose).toHaveBeenCalled();
    });

    it('should have correct links', () => {
        render(
            <ThemeProvider theme={theme}>
                <SideNav open={true} onClose={onClose} />
            </ThemeProvider>
        );

        expect(screen.getByText('New inspection').closest('a')).toHaveAttribute('href', '/');
        expect(screen.getByText('Search').closest('a')).toHaveAttribute('href', '/SearchPage');
        expect(screen.getByText('Report an issue').closest('a')).toHaveAttribute('href', 'https://github.com/ai-cfia/fertiscan-frontend/issues/new/choose');
    });
});
