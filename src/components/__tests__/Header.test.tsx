import theme from "@/app/theme";
import { ThemeProvider } from "@mui/material/styles";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Header from "../Header";

describe("Header Component", () => {
  const mockSetSideNavOpen = jest.fn();

  beforeEach(() => {
    mockSetSideNavOpen.mockReset();
  });

  it("renders the Header component and its sub-components", () => {
    render(
      <ThemeProvider theme={theme}>
        <Header setSideNavOpen={mockSetSideNavOpen} />
      </ThemeProvider>,
    );

    // Check if the language toggle button is rendered
    expect(screen.getByTestId("language-toggle-button")).toBeInTheDocument();

    // Check if the Menu icon button is rendered
    expect(screen.getByTestId("menu-toggle-button")).toBeInTheDocument();

    // Check if the logo is rendered
    expect(screen.getByTestId("logo-image")).toBeInTheDocument();

    // Check if the user account button is rendered
    expect(screen.getByTestId("user-account-button")).toBeInTheDocument();
  });

  it("handles the side navigation toggle", () => {
    render(
      <ThemeProvider theme={theme}>
        <Header setSideNavOpen={mockSetSideNavOpen} />
      </ThemeProvider>,
    );

    const menuButton = screen.getByTestId("menu-toggle-button");
    fireEvent.click(menuButton);

    // Check if setSideNavOpen is called
    expect(mockSetSideNavOpen).toHaveBeenCalled();
  });
});
