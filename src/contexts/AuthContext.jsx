import { createContext, useContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const BASE_API = "http://127.0.0.1:5000/api/v1";
const AUTH_API = `${BASE_API}/auth`;
const USER_API = `${BASE_API}/user`;

const initialState = {
  user: null,
  isAuthenticated: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    case "update/user":
      const user = state.user || {};
      const update = action.payload.reduce((acc, update) => {
        acc[update[0]] = update[1];
        return acc;
      }, {});
      return { ...state, user: { ...user, ...update } };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(`${USER_API}/me`, { credentials: "include" });
        const data = await res.json();
        console.log(data);
        if (data.status !== "success") throw new Error();
        if (!data.user) throw new Error();
        dispatch({ type: "login", payload: data.user });
      } catch {
        dispatch({ type: "logout" });
        navigate("/login");
      }
    }

    getUser();
  }, []);

  async function login(email, password) {
    try {
      const res = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.status !== "success") throw new Error(data.message);
      if (!data.user) throw new Error("User not Found.");

      dispatch({ type: "login", payload: data.user });
      console.log(data.user);
    } catch (err) {
      alert(err.message || "There was an error with your request");
    }
  }

  async function sendOtp(email, type = "signup") {
    try {
      if (!email) return;
      if (!type) throw new Error("OTP type not set @ sendOTP");
      const res = await fetch(`${AUTH_API}/otp/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.status !== "success") throw new Error(data.message);
      alert(`Sending 6 digit OTP ${email}. This might take some minutes.`);

      dispatch({ type: "update/user", payload: [["email", email]] });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function resetPassword(userData) {
    try {
      if (!userData?.email) return;
      console.log(userData);
      const res = await fetch(`${AUTH_API}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await res.json();
      if (data.status !== "success") throw new Error(data.message);

      dispatch({ type: "login", payload: data.user });
    } catch (err) {
      alert(err.message);
    }
  }

  async function signup(userData) {
    if (!userData?.email) return;
    console.log(userData);
    const res = await fetch(`${AUTH_API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const data = await res.json();
    if (data.status !== "success") throw new Error(data.message);

    dispatch({ type: "login", payload: data.user });
  }

  async function logout() {
    await fetch(`${AUTH_API}/logout`);
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        sendOtp,
        resetPassword,
        signup,
        BASE_API,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
