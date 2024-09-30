import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { forgotPassword } from '../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        try {
            const response = await forgotPassword(email);
            if (response.success) {
                Alert.alert('Success', 'Password reset link sent to your email');
            } else {
                Alert.alert('Error', response.message);
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
            />
            <Button title="Send Password Reset Link" onPress={handleForgotPassword} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 10,
    },
});

export default ForgotPassword;
