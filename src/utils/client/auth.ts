import Cookies from "js-cookie";

export const getAuthHeader = () => {
  return "Basic " + btoa(`${atob(Cookies.get("token") ?? "")}:`);
};
