import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
    onLoginSuccess?: (data: { token: string; refreshToken: string }) => void;
}

import { useAuth } from '../AuthContext'; 

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

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </label>
            </div>
            <div>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </label>
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
