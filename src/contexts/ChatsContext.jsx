import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const BASE_URL = "http://localhost:9000";
const BASE_URL_2 = "http://127.0.0.1:5000/api/v1/chat";

const ChatsContext = createContext();

const initialState = {
  chats: [],
  isLoading: false,
  currentChat: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "chats/loaded":
      return {
        ...state,
        isLoading: false,
        chats: action.payload || [],
      };

    case "chat/loaded":
      return { ...state, isLoading: false, currentChat: action.payload || [] };

    case "chat/created":
      return {
        ...state,
        isLoading: false,
        chats: [...state.chats, action.payload],
        currentCity: action.payload,
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function ChatsProvider({ children }) {
  const { user } = useAuth();
  const [{ chats, isLoading, currentChat, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(
    function () {
      async function getChats() {
        dispatch({ type: "loading" });

        try {
          const res = await fetch(BASE_URL_2, {
            credentials: "include",
          });
          const data = await res.json();
          dispatch({ type: "chats/loaded", payload: data.chats });
        } catch (err) {
          console.log(err, 2);
          dispatch({
            type: "rejected",
            payload: "There was an error loading your chats...",
          });
        }
      }
      getChats();
    },
    [user]
  );

  const getChat = useCallback(
    async function getChat(otherUserId) {
      if (Number(otherUserId) === currentChat.id) return;

      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL_2}/${otherUserId}`);
        const data = await res.json();
        dispatch({ type: "chat/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading this chat...",
        });
      }
    },
    [currentChat.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  // async function deleteCity(id) {
  //   dispatch({ type: "loading" });

  //   try {
  //     await fetch(`${BASE_URL}/cities/${id}`, {
  //       method: "DELETE",
  //     });

  //     dispatch({ type: "city/deleted", payload: id });
  //   } catch {
  //     dispatch({
  //       type: "rejected",
  //       payload: "There was an error deleting the city...",
  //     });
  //   }
  // }

  return (
    <ChatsContext.Provider
      value={{
        chats,
        isLoading,
        currentChat,
        error,
        getChat,
        createCity,
        // deleteCity,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
}

function useChats() {
  const context = useContext(ChatsContext);
  if (context === undefined)
    throw new Error("ChatsContext was used outside the ChatsProvider");
  return context;
}

export { ChatsProvider, useChats };
// case "city/deleted":
//       return {
//         ...state,
//         isLoading: false,
//         cities: state.cities.filter((city) => city.id !== action.payload),
//         currentCity: {},
//       };

// case "rejected":
//   return {
//     ...state,
//     isLoading: false,
//     error: action.payload,
//   };
