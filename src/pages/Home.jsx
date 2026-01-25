import { useNavigate } from "react-router-dom";
import BookSearch from '../components/BookSearch';

function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={() => navigate("/second")}>
                Go to Database Page
            </button>
            <button onClick={() => navigate("/login")}>
                Go to Login Page
            </button>
            {/* call our book search component */}
            <BookSearch />
        </div>
    );
}

export default Home;
