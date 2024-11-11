// src/context/UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);
    const [fullname, setFullname] = useState(''); // Thêm trạng thái fullname

    return (
        <UserContext.Provider value={{ userId, setUserId, fullname, setFullname }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
