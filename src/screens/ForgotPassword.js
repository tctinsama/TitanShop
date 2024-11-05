// src/screens/ForgotPassword.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from '../services/authService'; // Dịch vụ gửi email

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Thông báo", "Vui lòng nhập địa chỉ email của bạn");
            return;
        }

        try {
            await sendPasswordResetEmail(email);
            Alert.alert("Thông báo", "Email khôi phục mật khẩu đã được gửi!");
        } catch (error) {
            Alert.alert("Thông báo", "Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quên Mật Khẩu</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ email của bạn"
                value={email}
                onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Gửi liên kết khôi phục</Text>
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
    title: {
        fontSize: 24,
        marginBottom: 20,
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

export default ForgotPassword;
