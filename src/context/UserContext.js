// src/context/UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext); // Xuất khẩu đúng

//
//// src/context/UserContext.js
//import React, { createContext, useContext, useState } from 'react';
//
//const UserContext = createContext();
//
//export const UserProvider = ({ children }) => {
//    const [user, setUser] = useState({ userId: null, fullname: '' });
//
//    return (
//        <UserContext.Provider value={{ user, setUser }}>
//            {children}
//        </UserContext.Provider>
//    );
//};
//
//export const useUser = () => useContext(UserContext); // Xuất khẩu đúng
