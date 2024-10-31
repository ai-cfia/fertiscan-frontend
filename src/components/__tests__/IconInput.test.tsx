import theme from "@/app/theme";
import { ThemeProvider } from "@mui/material/styles";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import IconInput from "@/components/IconInput";
import BugReportIcon from '@mui/icons-material/BugReport';

describe("IconInput Component", () => {
  let mockValue = ""
  const mockChangeInputValue = jest.fn((value:string)=> mockValue=value)

  const testIcon = (
    <BugReportIcon data-testid={"test-icon"}></BugReportIcon>
  )

  beforeEach(() => {
    mockChangeInputValue.mockReset();

  });

  it("renders a text IconInput component and its sub-components", () => {
    render(
      <ThemeProvider theme={theme}>
        <IconInput id={"testInput"} icon={testIcon} placeholder={"test input"} type={"text"} value={mockValue} setValue={mockChangeInputValue}/>
      </ThemeProvider>,
    );

    // Check if the icon passed in the props is rendered
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();

    // Check if the input is rendered
    expect(screen.getByTestId("input")).toBeInTheDocument();

    // Check that there is no showPassword button even when the input is focussed
    fireEvent.click(screen.getByTestId("input"))
    expect(screen.queryByTestId("show-password")).not.toBeInTheDocument();

  });

  it("renders a password IconInput component and its sub-components", () => {
    render(
      <ThemeProvider theme={theme}>
        <IconInput id={"testInput"} icon={testIcon} placeholder={"test input"} type={"password"} value={mockValue} setValue={mockChangeInputValue}/>
      </ThemeProvider>,
    );

    // Check if the icon passed in the props is rendered
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();

    const input = screen.getByTestId("input");
    const realInput = input.getElementsByTagName("input")[0]
    // Check if the input is rendered
    expect(input).toBeInTheDocument();
    // Check if the input is a password input
    expect(realInput).toHaveAttribute('type','password');

    const showPassword = screen.getByTestId("show-password");
    // Check that when the input is not focussed, the show password button is not visible
    expect(showPassword).not.toBeVisible();

    // Check that when the input is focussed, the show password button is visible
    fireEvent.click(input);
    expect(realInput).toHaveFocus();
    expect(showPassword).toBeInTheDocument();

    // Check that when the showPassword button is clicked, the input becomes a text input
    fireEvent.click(showPassword);
    expect(realInput).toHaveAttribute('type','text');

    // Check that when the input is unfocused, the input is a password again and the showPassword button disappear
    fireEvent.blur(realInput);
    expect(realInput).toHaveAttribute('type','password')
    expect(showPassword).not.toBeInTheDocument();
  });

});
