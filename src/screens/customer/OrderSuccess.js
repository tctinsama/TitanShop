//src/screens/customer/OrderSuccess.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OrderSuccess = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Đặt hàng thành công!</Text>
            <Button title="Quay về Trang Chủ" onPress={() => navigation.navigate('HomeTabs')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    message: { fontSize: 24, marginBottom: 20 },
});

export default OrderSuccess;
