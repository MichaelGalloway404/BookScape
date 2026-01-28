import { useNavigate } from "react-router-dom";
import BookSearch from '../components/BookSearch';
import BackgroundColorPicker from '../components/BackgroundColorPicker';
import ColorPalettePicker from '../components/ColorPalettePicker';

function Home() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={() => navigate("/second")}>
                Go to Database Page
            </button>
            <button onClick={() => navigate("/login")}>
                Login
            </button>
            {/* call our book search component */}
            <BookSearch />
            <BackgroundColorPicker />
            <ColorPalettePicker />
        </div>
    );
}

export default Home;
