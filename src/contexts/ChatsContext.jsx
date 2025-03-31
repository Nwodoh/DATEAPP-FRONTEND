import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { socket } from "../socket";

const ChatsContext = createContext();

const initialState = {
  chats: [],
  isLoading: false,
  isLoadingMessages: false,
  activeOtherUser: {},
  currentChat: [],
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "chats/loadingMessages":
      return { ...state, isLoadingMessages: true };

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
        isLoadingMessages: false,
        currentChat: action.payload.currentChat || [],
        activeOtherUser: action.payload.activeOtherUser || 0,
      };

    case "chat/new":
      state.currentChat.forEach((chat, i) => {
        if (chat.optimistic && chat.sender_id === action.payload.sender_id)
          state.currentChat.splice(i, 1); // remove optimistics
      });

      return {
        ...state,
        chats: state.chats.map((chat) => {
          if (chat.other_user.id !== action.payload.receiver_id) return chat;
          else return action.payload;
        }),
        currentChat: [...state.currentChat, action.payload],
      };

    case "chat/new/optimistic":
      const { sender_id, receiver_id, message } = action.payload;

      return {
        ...state,
        currentChat: [
          ...state.currentChat,
          {
            id: Date.now(),
            optimistic: true,
            sender_id,
            receiver_id,
            message,
            otherUser: state.activeOtherUser,
          },
        ],
      };

    case "chat/newPerson":
      return { ...state, chats: [...state.chats, action.payload] };

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
  const [
    {
      chats,
      isLoading,
      isLoadingMessages,
      currentChat,
      activeOtherUser,
      error,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [showExplorer, setShowExplorer] = useState(false);

  useEffect(
    function () {
      async function getChats() {
        dispatch({ type: "loading" });

        try {
          const res = await fetch(`${CHAT_API}/`, {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("login-token")}`,
            },
          });
          const data = await res.json();

          dispatch({ type: "chats/loaded", payload: data.chats });
        } catch (err) {
          console.log(err);
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

  const getChat = useCallback(
    async function getChat(otherUserId) {
      dispatch({ type: "chats/loadingMessages" });

      try {
        const res = await fetch(`${CHAT_API}/${otherUserId}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("login-token")}`,
          },
        });
        const data = await res.json();

        if (data.status !== "success") throw new Error();

        dispatch({
          type: "chat/loaded",
          payload: {
            currentChat: data.chats,
            activeOtherUser: data.other_user,
          },
        });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading this chat...",
        });
      }
    },
    [CHAT_API]
  );

  async function sendChat(receiverId, message) {
    try {
      dispatch({
        type: "chat/new/optimistic",
        payload: { sender_id: user?.id, receiver_id: receiverId, message },
      });
      const res = await fetch(`${CHAT_API}/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("login-token")}`,
        },
        body: JSON.stringify({ receiverId, message }),
      });

      const data = await res.json();

      if (data.status !== "success")
        throw new Error(data?.message || data?.error);

      dispatch({
        type: "chat/new",
        payload: data.newChat,
      });

      if (
        !chats.find((chat) => chat.other_user.id === data.newChat.receiver_id)
      )
        dispatch({
          type: "chat/newPerson",
          payload: data.newChat,
        });

      socket.emit("chat/sent", data.newChat);
    } catch (err) {
      console.log(err);
      alert(
        err.message ||
          "Error Sending Message, Please check your internet connection."
      );
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
  }, [user?.id]);

  return (
    <ChatsContext.Provider
      value={{
        chats,
        isLoading,
        isLoadingMessages,
        currentChat,
        error,
        getChat,
        activeOtherUser,
        sendChat,
        clearChatState,
        showExplorer,
        setShowExplorer,
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
