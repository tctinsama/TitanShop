import React, { useState } from 'react';
import { View, TextInput, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { login } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../context/UserContext';

const logo = require('../../assets/images/logo-removebg-preview.png');

const Login = ({ navigation }) => {
    const { setUserId } = useUser();
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
            <Text style={styles.title}>LOGIN</Text>
            <View style={styles.inputContainer}>
                <Icon name="person-outline" size={20} color="#000" style={styles.inputIcon} />
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    placeholderTextColor="#666"
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="lock-closed-outline" size={20} color="#000" style={styles.inputIcon} />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.inputPass}
                    placeholderTextColor="#666"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#000" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#000" style={styles.loader} />
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            )}

            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.linkText}>Forgot password ?</Text>
                </TouchableOpacity>
            </View>
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
    logo: {
        width: 400,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        width: '100%',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#000',
    },
    inputIcon: {
        marginRight: 10,
    },
    inputPass: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#000',
    },
    eyeIcon: {
        marginLeft: 10,
    },
    loader: {
        marginVertical: 20,
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
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
    },
    linkText: {
        color: '#000',
        textDecorationLine: 'underline',
        fontSize: 16,
    },
});

export default Login;