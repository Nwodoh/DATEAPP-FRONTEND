import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { socket } from "../socket";
import { useGeolocation } from "../hooks/useGeolocation";

const AuthContext = createContext();
const BASE_API = "http://127.0.0.1:5000/api/v1";
const AUTH_API = `${BASE_API}/auth`;
const USER_API = `${BASE_API}/user`;

const initialState = {
  user: null,
  isAuthenticated: true,
  isLoading: false,
  allUsers: [],
  likes: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "loaded":
      return { ...state, isLoading: false };
    case "login":
      socket.emit("online", action.payload);
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        isAuthenticated: true,
      };
    case "logout":
      return { ...state, isLoading: false, user: null, isAuthenticated: false };
    case "user/update":
      const user = state.user || {};
      const update = action.payload.reduce((acc, update) => {
        acc[update[0]] = update[1];
        return acc;
      }, {});
      return { ...state, isLoading: false, user: { ...user, ...update } };
    case "user/all":
      action.payload.forEach((user) => {
        if (state.allUsers.find((el) => el.id === user.id)) return;
        else state.allUsers.push(user);
      });
      return { ...state, allUsers: state.allUsers };
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({ children }) {
  const { getPosition } = useGeolocation();
  const [{ user, isAuthenticated, allUsers }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const [mapPosition, setMapPosition] = useState([0, 0]);

  useEffect(
    function () {
      user && setMapPosition(user?.location);
    },
    [user]
  );

  const setUserLocation = useCallback(
    async function setUserLocation() {
      const location = await getPosition();

      if (!location?.length) return;

      await fetch(`${USER_API}/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location }),
      });
    },
    [USER_API]
  );

  const getUser = useCallback(
    async function getUser(userId = "") {
      dispatch({ type: "loading" });

      try {
        userId || setUserLocation();
        const res = await fetch(`${USER_API}/user/${userId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.status !== "success") throw new Error();
        if (!data.user) throw new Error();
        userId || dispatch({ type: "login", payload: data.user });
        return data.user;
      } catch {
        dispatch({ type: "logout" });
      }
    },
    [setUserLocation]
  );

  useEffect(() => {
    getUser();
  }, []);

  async function login(email, password) {
    dispatch({ type: "loading" });

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
    } catch (err) {
      dispatch({ type: "loaded" });
      dispatch({ type: "loading" });

      alert(err.message || "There was an error with your request");
    }
  }

  async function sendOtp(email, type = "signup") {
    dispatch({ type: "loading" });

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

      dispatch({ type: "user/update", payload: [["email", email]] });
    } catch (err) {
      dispatch({ type: "loaded" });
      throw new Error(err.message);
    }
  }

  async function resetPassword(userData) {
    dispatch({ type: "loading" });

    try {
      if (!userData?.email) return;
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
      dispatch({ type: "loaded" });
      alert(err.message);
    }
  }

  async function signup(userData) {
    try {
      if (!userData?.email) return;
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
    } catch {
      dispatch({ type: "loaded" });
      alert("Error with signing up");
    }
  }

  const getUsersAroundPoint = useCallback(async function getUsersAroundPoint(
    position = []
  ) {
    const [lat, lon] = position;
    if (!Number(lat) || !Number(lon)) return;

    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${USER_API}/?lat=${lat}&lon=${lon}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.status !== "success") throw new Error();

      dispatch({ type: "user/all", payload: data.users });
    } catch (err) {
      console.error(err);
    }
  },
  []);

  async function like(userId, isUnlike = false) {
    try {
      const res = await fetch(`${USER_API}/like/${userId}`, {
        method: isUnlike ? "DELETE" : "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.status !== "success") throw new Error(data.message);
    } catch (err) {
      console.log();
      alert(err.message || "Unable to like user's profile");
    }
  }

  async function logout() {
    await fetch(`${AUTH_API}/logout`, { credentials: "include" });
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
        getUsersAroundPoint,
        allUsers,
        getUser,
        like,
        mapPosition,
        setMapPosition,
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
