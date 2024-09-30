import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api';



export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
        throw new Error('Login failed');
    }
}

