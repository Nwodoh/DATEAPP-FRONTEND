import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ChatsProvider } from "./contexts/ChatsContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

import ChatList from "./components/ChatList";
import Form from "./components/Form";
import SpinnerFullPage from "./components/SpinnerFullPage";
import ChatPage from "./components/ChatPage";

const Homepage = lazy(() => import("./pages/Homepage"));
const About = lazy(() => import("./pages/About"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const AppLayout = lazy(() => import("./pages/AppLayout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatsProvider>
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
                <Route path="form" element={<Form />} />
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
