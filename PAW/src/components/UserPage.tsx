import React, { useEffect, useState } from 'react';
import { User } from '../models/User';
import UserSession from '../api/UserSession';

const UserPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const allUsers = UserSession.getAllUsers();
        setUsers(allUsers);
    }, []);

    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.firstName} {user.lastName} - {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserPage;