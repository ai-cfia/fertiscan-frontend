import theme from "@/app/theme";
import { ThemeProvider } from "@mui/material/styles";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import LoginModal from "@/components/LoginModal";

describe("LoginModal Component", () => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockErrorLogin = jest.fn((username:string,password:string)=>{
    return new Error("User "+username+" was not found").message
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockErrorSignup = jest.fn((username:string,password:string,confirm:string)=>{
    return new Error("User "+username+" already exists").message
  });



  beforeEach(() => {
    mockErrorLogin.mockReset();
    mockErrorSignup.mockReset();
  });

  it("renders a LoginModal component and check that the login features and only them are present", ()=>{

    render(
      <ThemeProvider theme={theme}>
        <LoginModal isOpen={true} login={mockErrorLogin} signup={mockErrorSignup}/>
      </ThemeProvider>
    )
    // The title should be present and be Login
    expect(screen.getByTestId("modal-title")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Login");
    // The username input should be present
    expect(screen.getByTestId("modal-username")).toBeInTheDocument();
    // The password input should be present
    expect(screen.getByTestId("modal-password")).toBeInTheDocument();
    // The confirm password should not be present
    expect(screen.queryByTestId("modal-confirm-password")).not.toBeInTheDocument();
    // The check box should not be present
    expect(screen.queryByTestId("modal-reminder")).not.toBeInTheDocument();
    // The submit button should be present
    expect(screen.getByTestId("modal-submit")).toBeInTheDocument();
    // The submit button should have the text "Login"
    expect(screen.getByTestId("modal-submit")).toHaveTextContent("Login");
    // The submit button should be disabled
    expect(screen.getByTestId("modal-submit")).toBeDisabled();
    // The signup text should be present
    expect(screen.getByTestId("modal-change")).toBeInTheDocument();
    // The signup text should have the text "Sign Up"
    expect(screen.getByTestId("modal-change")).toHaveTextContent("Don't have an account? Sign Up");
  })

  it("renders a LoginModal component, clicks on the Sign Up text then check that the signup features are present", ()=>{
    render(
      <ThemeProvider theme={theme}>
        <LoginModal isOpen={true} login={mockErrorLogin} signup={mockErrorSignup}/>
      </ThemeProvider>
    )
    // Click on the Sign Up text
    fireEvent.click(screen.getByTestId("modal-change-button"));
    // The title should be present and be Sign Up
    expect(screen.getByTestId("modal-title")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Sign Up");
    // The username input should be present
    expect(screen.getByTestId("modal-username")).toBeInTheDocument();
    // The password input should be present
    expect(screen.getByTestId("modal-password")).toBeInTheDocument();
    // The confirm password should be present
    expect(screen.getByTestId("modal-confirm-password")).toBeInTheDocument();
    // The check box should be present
    expect(screen.getByTestId("modal-reminder")).toBeInTheDocument();
    // The submit button should be present
    expect(screen.getByTestId("modal-submit")).toBeInTheDocument();
    // The submit button should have the text "Sign Up"
    expect(screen.getByTestId("modal-submit")).toHaveTextContent("Sign Up");
    // The submit button should be disabled
    expect(screen.getByTestId("modal-submit")).toBeDisabled();
    // The signup text should be present
    expect(screen.getByTestId("modal-change")).toBeInTheDocument();
    // The signup text should have the text "Login"
    expect(screen.getByTestId("modal-change")).toHaveTextContent("Already have an account? Login");
  });

  it("checks that the submit button is enabled when the inputs are filled", ()=>{
    render(
      <ThemeProvider theme={theme}>
        <LoginModal isOpen={true} login={mockErrorLogin} signup={mockErrorSignup}/>
      </ThemeProvider>
    )
    // Fill the username input
    fireEvent.change(screen.getByTestId("modal-username").getElementsByTagName("input")[0],{target:{value:"test"}});
    // Fill the password input
    fireEvent.change(screen.getByTestId("modal-password").getElementsByTagName("input")[0],{target:{value:"password"}});
    // The submit button should be enabled
    expect(screen.getByTestId("modal-submit")).not.toBeDisabled();
  })

  it("checks that the submit button is disabled when the reminder is not checked on signup and enable when it is checked and all the inputs are filled", ()=>{
    render(
      <ThemeProvider theme={theme}>
        <LoginModal isOpen={true} login={mockErrorLogin} signup={mockErrorSignup}/>
      </ThemeProvider>
    )
    // Click on the Sign Up text
    fireEvent.click(screen.getByTestId("modal-change-button"));
    // Fill the username input
    fireEvent.change(screen.getByTestId("modal-username").getElementsByTagName("input")[0],{target:{value:"test"}});
    // Fill the password input
    fireEvent.change(screen.getByTestId("modal-password").getElementsByTagName("input")[0],{target:{value:"password"}});
    // Fill the confirm password input
    fireEvent.change(screen.getByTestId("modal-confirm-password").getElementsByTagName("input")[0],{target:{value:"password"}});
    // The submit button should be disabled
    expect(screen.getByTestId("modal-submit")).toBeDisabled();
    // Check the reminder
    fireEvent.click(screen.getByTestId("modal-reminder"));
    // The submit button should be enabled
    expect(screen.getByTestId("modal-submit")).not.toBeDisabled();
  });

  it("checks that the error message is displayed when the login fails", ()=>{
    render(
      <ThemeProvider theme={theme}>
        <LoginModal isOpen={true} login={mockErrorLogin} signup={mockErrorSignup}/>
      </ThemeProvider>
    )
    // Fill the username input
    fireEvent.change(screen.getByTestId("modal-username").getElementsByTagName("input")[0],{target:{value:"test"}});
    // Fill the password input
    fireEvent.change(screen.getByTestId("modal-password").getElementsByTagName("input")[0],{target:{value:"password"}});
    // Click on the submit button
    fireEvent.click(screen.getByTestId("modal-submit"));
    new Promise((r)=>setTimeout(r,20)).then(()=> {//! forced to wait for update !
      // Check that the mock function is called
      expect(mockErrorLogin).toHaveBeenCalled();
      // Check that the error message is displayed
      expect(screen.getByTestId("modal-error-message")).toBeInTheDocument();
      expect(screen.getByTestId("modal-error-message")).toHaveTextContent("User test was not found");
    });
  });

  it("checks that the error message is displayed when the signup fails", ()=>{
    render(
      <ThemeProvider theme={theme}>
        <LoginModal isOpen={true} login={mockErrorLogin} signup={mockErrorSignup}/>
      </ThemeProvider>
    )
    // Click on the Sign Up text
    fireEvent.click(screen.getByTestId("modal-change-button"));
    // Fill the username input
    fireEvent.change(screen.getByTestId("modal-username").getElementsByTagName("input")[0],{target:{value:"test"}});
    // Fill the password input
    fireEvent.change(screen.getByTestId("modal-password").getElementsByTagName("input")[0],{target:{value:"password"}});
    // Fill the confirm password input
    fireEvent.change(screen.getByTestId("modal-confirm-password").getElementsByTagName("input")[0],{target:{value:"password"}});
    // Check the reminder
    fireEvent.click(screen.getByTestId("modal-reminder"));
    // Click on the submit button
    fireEvent.click(screen.getByTestId("modal-submit"));
    new Promise((r)=>setTimeout(r,20)).then(()=> {//! forced to wait for update !
      // Check that the mock function is called
      expect(mockErrorSignup).toHaveBeenCalled();
      // Check that the error message is displayed
      expect(screen.getByTestId("modal-error-message")).toBeInTheDocument();
      expect(screen.getByTestId("modal-error-message")).toHaveTextContent("User test already exists");
    });
  });

});
