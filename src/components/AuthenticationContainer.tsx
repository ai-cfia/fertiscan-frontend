import { useState } from "react";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

interface AuthContainerProps {
  isOpen: boolean;
  login: (username: string, password: string) => Promise<string>;
  signup: (
    username: string,
    password: string,
    confirm: string
  ) => Promise<string>;
}

const AuthenticationContainer = ({ isOpen, login, signup }: AuthContainerProps) => {
  const [isSignup, setIsSignup] = useState(false);

  const toggleMode = () => {
    setIsSignup(!isSignup);
  };

  return (
    <>
      {isSignup ? (
        <SignUpModal isOpen={isOpen} signup={signup} onChangeMode={toggleMode} />
      ) : (
        <LoginModal isOpen={isOpen} login={login} onChangeMode={toggleMode} />
      )}
    </>
  );
};

export default AuthenticationContainer;
