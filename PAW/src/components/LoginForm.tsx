import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gapi} from "gapi-script";
import LoginButton from './GoogleLogin';
import '../styles/loginForm.css';

interface LoginFormProps {
    onLoginSuccess?: (data: { token: string; refreshToken: string }) => void;
}

import { useAuth } from '../AuthContext'; 

const clientId = "157406340808-mi8iup8abk3ct3d3m2gbijd7k36knkfk.apps.googleusercontent.com";

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                login();
                onLoginSuccess?.(data);
                navigate('/');
                alert('Login Successful');
            } else {
                throw new Error(data.error || 'Login failed');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert('Login failed: ' + error.message);
            } else {
                alert('Login failed with an unexpected error');
            }
        }
    };

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: clientId,
                scope: '',
            });
        }
        gapi.load('client:auth2', start);
    }, []);

    return (
        <form onSubmit={handleSubmit} className="formDesign">
            <div>
                <label>User name</label>
                <input
                    value={username}
                    onChange={handleUsernameChange}
                    className="inputDesign"
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="inputDesign"
                />
            </div>
            <button type="submit" className="buttonDesign">Sign in</button>
            <div className="googleLogin">
                <LoginButton />
            </div>
        </form>
    );
};

export default LoginForm;
