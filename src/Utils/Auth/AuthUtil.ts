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
