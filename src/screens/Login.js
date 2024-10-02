import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { login } from '../services/authService';
import Icon from 'react-native-vector-icons/Ionicons';

const logo = require('../../assets/png/ion_cart.png'); // Cập nhật đường dẫn



const Login = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const user = await login(username, password);
            if (user.success) {
                if (user.rolename === 'admin') {
                    navigation.navigate('AdHome');
                } else {
                    navigation.navigate('HomeScreen', {
                        screen: 'HomeToDetails',
                        params: {
                          screen: 'HomeScreen'
                        }
                      });
                      
                }
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
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.inputPass}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="#000"
                    />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Login" onPress={handleLogin} />
            )}

            <View style={styles.linksContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>Create New Account</Text>
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
        paddingHorizontal: 0,
        marginBottom: 10,

    },
    showPasswordText: {
        marginLeft: 10,
        color: '#007BFF',
    },
    linksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    linkText: {
        color: '#007BFF',
    },
});

export default Login;
