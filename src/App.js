import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SecondPage from "./pages/SecondPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/second" element={<SecondPage />} />
    </Routes>
  );
}

export default App;
