import { jwtDecode } from "jwt-decode";

export const getLoggedInUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);

    return {
      userId: decoded.userId || null,
      role: decoded.role || "USER",
      exp: decoded.exp || null,
    };
  } catch (err) {
    return null;
  }
};
