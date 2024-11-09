// src/context/UserContext.js
import React, { createContext, useContext, useState } from 'react';

// Tạo context cho người dùng
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Trạng thái lưu trữ userId và fullname riêng biệt
    const [userId, setUserId] = useState(null);
    const [fullname, setFullname] = useState('');

    // Đảm bảo việc gọi hooks luôn theo thứ tự
    return (
        <UserContext.Provider value={{ userId, setUserId, fullname, setFullname }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook để lấy dữ liệu từ context
export const useUser = () => useContext(UserContext);
