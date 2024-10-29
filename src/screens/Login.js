// src/screens/Login.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { login } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../context/UserContext'; // Sửa để sử dụng useUser

const logo = require('../../assets/png/ion_cart.png');

const Login = ({ navigation }) => {
    const { setUserId } = useUser(); // Sử dụng useUser để lấy setUserId
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const user = await login(username, password);
            if (user.success) {
                await AsyncStorage.setItem('userid', String(user.userid));
                await AsyncStorage.setItem('fullname', user.fullname);
                await AsyncStorage.setItem('rolename', user.rolename);  // Thêm rolename

                setUserId(user.userid); // Cập nhật userId trong context

                navigation.replace(user.rolename === 'admin' ? 'AdHome' : 'HomeTabs');
            } else {
                Alert.alert('Error', user.message);
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.title}>Đăng Nhập</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.inputPass}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#000" />
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Login" onPress={handleLogin} />
            )}
            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>Đăng ký</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.linkText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f0f4f7',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    inputPass: {
        flex: 1,
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    linkText: {
        color: '#007BFF',
        textDecorationLine: 'underline', // Gạch chân để nhấn mạnh
    },
});

export default Login;
