import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";
import { socket } from "../socket";

const ChatsContext = createContext();

const initialState = {
  chats: [],
  isLoading: false,
  activeChat: 0,
  currentChat: [],
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "chats/loaded":
      socket.emit("chat/active", action.payload || []);
      return {
        ...state,
        isLoading: false,
        chats: action.payload || [],
      };

    case "chat/loaded":
      return {
        ...state,
        isLoading: false,
        currentChat: action.payload.currentChat || [],
        activeChat: +action.payload.activeChat || 0,
      };

    case "chat/new":
      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.other_user.id !== action.payload.other_user.id) return chat;
          else return action.payload;
        }),
        currentChat: [...state.currentChat, action.payload],
      };

    case "clear":
      return initialState;
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
  const { BASE_API, isAuthenticated, user } = useAuth();
  const CHAT_API = `${BASE_API}/chat`;
  const [{ chats, isLoading, currentChat, activeChat, error }, dispatch] =
    useReducer(reducer, initialState);

  useEffect(
    function () {
      async function getChats() {
        dispatch({ type: "loading" });

        try {
          const res = await fetch(CHAT_API, {
            credentials: "include",
          });
          const data = await res.json();
          dispatch({ type: "chats/loaded", payload: data.chats });
        } catch (err) {
          dispatch({
            type: "rejected",
            payload: "There was an error loading your chats...",
          });
        }
      }
      getChats();
    },
    [CHAT_API, isAuthenticated]
  );

  const getChat = useCallback(async function getChat(chatId, otherUserId) {
    if (Number(chatId) === currentChat.id) return;

    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${CHAT_API}/${otherUserId}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data.status !== "success") throw new Error();

      dispatch({
        type: "chat/loaded",
        payload: { currentChat: data.chats, activeChat: otherUserId },
      });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading this chat...",
      });
    }
  }, []);

  async function sendChat(receiverId, message) {
    try {
      const res = await fetch(`${CHAT_API}/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId, message }),
      });

      const data = await res.json();
      if (data.status !== "success") throw new Error();
      dispatch({
        type: "chat/new",
        payload: data.newChat,
      });
      socket.emit("chat/sent", data.newChat);
    } catch {
      alert("Error Sending Message, Please check your internet connection.");
    }
  }

  function clearChatState() {
    dispatch({ type: "clear" });
  }

  useEffect(() => {
    function handleChatReceived(newChat) {
      if (newChat?.sender?.id === user?.id) return;
      dispatch({
        type: "chat/new",
        payload: newChat,
      });
    }

    socket.on("chat/received", handleChatReceived);

    return () => {
      socket.off("chat/received", handleChatReceived);
    };
  }, []);

  return (
    <ChatsContext.Provider
      value={{
        chats,
        isLoading,
        currentChat,
        error,
        getChat,
        activeChat,
        sendChat,
        clearChatState,
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
