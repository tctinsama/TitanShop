import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_URL } from '@env';

const Register = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [dayofbirth, setDayofbirth] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !password || !fullname || !phonenumber || !email || !dayofbirth) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    fullname,
                    phonenumber,
                    address,
                    email,
                    dayofbirth,
                    roleid: 4,
                }),
            });

            setLoading(false);

            if (!response.ok) {
                const errorText = await response.json();
                console.log('Error response:', errorText);
                Alert.alert('Error', errorText.message || 'An error occurred');
                return;
            }

            const data = await response.json();

            if (data.success) {
                Alert.alert('Success', 'Account created successfully');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', data.message || 'Registration failed');
            }
        } catch (error) {
            setLoading(false);
            console.log('Error:', error);
            Alert.alert('Error', error.message || 'An unknown error occurred');
        }
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || dayofbirth;
        setShowDatePicker(false);
        setDayofbirth(currentDate.toISOString().split('T')[0]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <View style={styles.inputContainer}>
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
                <TextInput
                    placeholder="Full Name"
                    value={fullname}
                    onChangeText={setFullname}
                    style={styles.input}
                    placeholderTextColor="#666"
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Phone Number"
                    value={phonenumber}
                    onChangeText={setPhonenumber}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholderTextColor="#666"
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                    style={styles.input}
                    placeholderTextColor="#666"
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    style={styles.input}
                    placeholderTextColor="#666"
                />
            </View>
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={showDatepicker}>
                    <Text style={styles.input}>
                        {dayofbirth ? `Date of Birth: ${dayofbirth}` : 'Select Date of Birth'}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#666"
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
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
        color: '#333',
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 12,
        width: '100%',
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
});

export default Register;
