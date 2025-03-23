import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ChatsProvider } from "./contexts/ChatsContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

import ChatList from "./components/ChatList";
import SpinnerFullPage from "./components/SpinnerFullPage";
import ChatPage from "./components/ChatPage";
import Likes from "./components/Likes";
import PageNav from "./components/PageNav";
import ProfilePage from "./components/ProfilePage";

import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatsProvider>
          <PageNav />
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<Homepage />} />
              <Route path="about" element={<About />} />
              <Route path="signup" element={<Signup />} />
              <Route path="signup/verify" element={<Signup type="verify" />} />
              <Route path="login" element={<Login />} />
              <Route
                path="forgot-password"
                element={<Login type="forgot-password" />}
              />
              <Route
                path="reset-password"
                element={<Login type="reset-password" />}
              />
              <Route
                path="app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to="chats" />} />
                <Route path="chats" element={<ChatList />} />
                <Route path="chats/:otherUserId" element={<ChatPage />} />
                <Route path="likes" element={<Likes />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/:otherUserId" element={<ProfilePage />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </ChatsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
