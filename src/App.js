import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SecondPage from "./pages/SecondPage";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import BookSearch from "./components/BookSearch"

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/search" element={<BookSearch />} />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/second"
        element={
          <ProtectedRoute>
            <SecondPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;
