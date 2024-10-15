import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000';

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