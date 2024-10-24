interface IUser {
  username: string;
  password: string;
  connected: boolean;
  lastConnection: Date | null;
}

class User implements IUser {
  username: string;
  password: string;
  connected: boolean;
  lastConnection: Date | null;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.connected = false;
    this.lastConnection = null;
  }

  // Getter methods
  getUsername() {
    return this.username;
  }

  getPassword() {
    return this.password;
  }

  isConnected() {
    return this.connected;
  }

  getLastConnection() {
    return this.lastConnection;
  }

  // Setter methods
  setUsername(username: string) {
    this.username = username;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setConnected(connected: boolean) {
    this.connected = connected;
  }

  setLastConnection(lastConnection: Date | null) {
    this.lastConnection = lastConnection;
  }
}

export const usePlaceholder = () => {
  return new User("placeholderUser", "defaultPassword");
};
