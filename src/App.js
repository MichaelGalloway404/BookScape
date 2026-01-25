import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SecondPage from "./pages/SecondPage";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/second" element={<SecondPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
