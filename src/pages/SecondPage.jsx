import { useNavigate } from "react-router-dom";

function SecondPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Second Page</h1>

      <button onClick={() => navigate("/")}>
        Return Home
      </button>
    </div>
  );
}

export default SecondPage;
