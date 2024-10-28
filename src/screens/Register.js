import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { register } from '../services/authService';

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [dayofbirth, setDayofbirth] = useState('');

    const handleRegister = async () => {
        // Kiểm tra xem tất cả các trường đã được điền hay chưa
        if (!username || !password || !fullname || !phonenumber || !email || !dayofbirth) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const response = await register({
                username,
                password,
                fullname,
                phonenumber,
                address,
                email,
                dayofbirth,
            });

            if (response.success) {
                Alert.alert('Success', 'Account created successfully');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', response.message || 'Registration failed');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'An unknown error occurred');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullname}
                onChangeText={setFullname}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phonenumber}
                onChangeText={setPhonenumber}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={dayofbirth}
                onChangeText={setDayofbirth}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Register" onPress={handleRegister} />
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
});

export default Register;
