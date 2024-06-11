import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { GoogleLogout } from 'react-google-login';

const clientId = "157406340808-mi8iup8abk3ct3d3m2gbijd7k36knkfk.apps.googleusercontent.com";

function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const onSuccess = () => {
        console.log("[Logout Success] Logged out successfully");
        logout();
        navigate('/login'); 
    };

    return (
        <div id="signOutButton">
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div>
    );
}

export default Logout;
