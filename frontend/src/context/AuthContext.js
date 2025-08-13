import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get("rf_user", null));

  useEffect(() => {
    storage.set("rf_user", user);
  }, [user]);

  function register(name, email, password) {
    const users = storage.get("rf_users", []);
    if (users.some((u) => u.email === email)) return false;

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: "UPORABNIK",
    };
    users.push(newUser);
    storage.set("rf_users", users);

    setUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
    return true;
  }

  function login(email, password) {
    const users = storage.get("rf_users", []);
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return false;

    setUser({
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
    });
    return true;
  }

  function logout() {
    setUser(null);
  }

  const value = useMemo(() => ({ user, register, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
