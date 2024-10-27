import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const OrderSuccess = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderCode } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Thanh toán thành công!</Text>
            <Text>Mã đơn hàng: {orderCode}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>Quay về trang chủ</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    message: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    button: { backgroundColor: '#007bff', padding: 12, borderRadius: 4, marginTop: 16 },
    buttonText: { color: '#fff', fontSize: 16 },
});

export default OrderSuccess;
