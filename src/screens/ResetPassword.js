// src/screens/ResetPassword.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { resetPassword } from '../services/authService'; // Dịch vụ khôi phục mật khẩu

const ResetPassword = ({ route }) => {
    const { token } = route.params; // Token nhận từ email
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Thông báo", "Mật khẩu không khớp!");
            return;
        }

        try {
            await resetPassword(token, password);
            Alert.alert("Thông báo", "Mật khẩu đã được khôi phục thành công!");
            // Chuyển hướng về trang đăng nhập
        } catch (error) {
            Alert.alert("Thông báo", "Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu mới"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu mới"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Khôi phục mật khẩu</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default ResetPassword;
