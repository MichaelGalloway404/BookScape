import { useNavigate } from "react-router-dom";
// import BookSearch from '../components/BookSearch';
// import BackgroundColorPicker from '../components/BackgroundColorPicker';
// import ColorPalettePicker from '../components/ColorPalettePicker';

function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={() => navigate("/login")}>
                Login
            </button>
            <button onClick={() => navigate("/search")}>
                Search for a book
            </button>
            <button onClick={() => navigate("/signUp")}>
                Sign Up
            </button>

        </div>
    );
}

export default Home;
