import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import BookSearch from "./pages/BookSearch"
import SignupPage from "./pages/SignupPage";
import PublicPages from "./pages/PublicPages"

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/search" element={<BookSearch />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signUp" element={<SignupPage />} />
      <Route path="/publicPage" element={<PublicPages />} />

      <Route path="/second" element={
          <ProtectedRoute>
            <UsersPage />
          </ProtectedRoute>
        } />

    </Routes>
  );
}

export default App;
