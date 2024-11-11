//src/services/authService.js
import axios from 'axios';
import { API_URL } from '@env';


export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        console.log(response.data); // Log dữ liệu nhận được
        return response.data;
    } catch (error) {
        // Kiểm tra xem có lỗi từ phản hồi không
        if (error.response) {
            // Yêu cầu đã được thực hiện và máy chủ đã trả về mã trạng thái
            console.error('Login Error - Status:', error.response.status);
            console.error('Login Error - Data:', error.response.data);
        } else if (error.request) {
            // Yêu cầu đã được thực hiện nhưng không có phản hồi
            console.error('Login Error - No Response:', error.request);
        } else {
            // Có lỗi trong thiết lập yêu cầu
            console.error('Login Error - Message:', error.message);
        }
        throw new Error('Login failed');
    }
}

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData); // Sửa dấu nháy cho đúng
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Register Error - Status:', error.response.status);
            console.error('Register Error - Data:', error.response.data);
            throw new Error(error.response.data.message || 'Registration failed'); // Gửi thông báo lỗi từ server
        } else if (error.request) {
            console.error('Register Error - No Response:', error.request);
            throw new Error('No response from server');
        } else {
            console.error('Register Error - Message:', error.message);
            throw new Error('Registration failed: ' + error.message);
        }
    }
};

//// src/services/authService.js
//export const sendPasswordResetEmail = async (email) => {
//    const response = await axios.post(`${API_URL}/api/reset-password`, { email });
//    return response.data; // Hoặc xử lý theo cách bạn cần
//};