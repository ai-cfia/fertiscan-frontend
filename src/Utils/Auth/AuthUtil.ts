// AuthUtils.js
export const isAuthenticated = () => {
  // Cherchez le cookie `auth`
  const authCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth="));

  // Vérifiez que le cookie est présent et n'est pas vide
  if (authCookie) {
    const authValue = authCookie.split("=")[1];
    return authValue !== undefined && authValue !== "";
  }

  return false;
};

export const logout = () => {
  // Set the cookie's expiry date to a past date to effectively remove it
  document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};
