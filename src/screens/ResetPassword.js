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
            <Text style={styles.title}>Khôi phục mật khẩu</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập mật khẩu mới"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#666"
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Xác nhận mật khẩu mới"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholderTextColor="#666"
                />
            </View>
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
        alignItems: 'center',
        paddingHorizontal: 30,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#000',
    },
    inputContainer: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    input: {
        height: 50,
        fontSize: 16,
        color: '#000',
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ResetPassword;
