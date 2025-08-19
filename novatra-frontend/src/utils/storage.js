export const getToken = () => localStorage.getItem("token");
export const setToken = (t) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");

export const getUserLS = () => {
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch { return null; }
};
export const setUserLS = (u) => localStorage.setItem("user", JSON.stringify(u));
export const clearUserLS = () => localStorage.removeItem("user");
