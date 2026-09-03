import { createContext, useContext, useState } from "react";
import { ROLES } from "../utils/constants";

// NOTE: This is a frontend-only stub for local development.
// Once Harsh's JWT auth endpoints are live, replace `login`/`user`
// below with real token storage + decoding (see api/authApi.js).

const AuthContext = createContext(null);

const MOCK_USER = {
  id: "STU2023CS041",
  name: "Janvi Gupta",
  role: ROLES.STUDENT,
  batch: "2023-2027",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);

  const login = (nextUser) => setUser(nextUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
