import GoogleLogin from "react-google-login";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

const clientId = "157406340808-mi8iup8abk3ct3d3m2gbijd7k36knkfk.apps.googleusercontent.com";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();  

    const onSuccess = (res: any) => {
        console.log("[Login Success] currentUser:", res.profileObj);
        login(); 
        navigate('/'); 
    };
    
    const onFailure = (res: any) => {
        console.log("[Login Failed] res:", res);
    };

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                style={{ marginTop: "100px" }}
                isSignedIn={true}
            />
        </div>
    );
}

export default Login;
