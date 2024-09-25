const isAuthenticated = () => {
  // Look for the `auth` cookie
  const authCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth="));

  // Check that the cookie is present and not empty
  if (authCookie) {
    const authValue = authCookie.split("=")[1];
    return authValue !== undefined && authValue !== "";
  }

  return false;
};

const logout = () => {
  // Set the cookie's expiry date to a past date to effectively remove it
  document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export { isAuthenticated, logout };
