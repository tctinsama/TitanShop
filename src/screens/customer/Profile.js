// src/screens/Profile.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const navigation = useNavigation();
    const { userId } = useUser();  // Lấy userId từ context
    const [fullname, setFullname] = useState('');
    const [role, setRole] = useState('');  // State lưu rolename

    // Lấy fullname và rolename từ AsyncStorage
    useEffect(() => {
        const fetchUserInfo = async () => {
            const name = await AsyncStorage.getItem('fullname');
            const rolename = await AsyncStorage.getItem('rolename');
            setFullname(name || 'Không rõ');
            setRole(rolename || '');
        };
        fetchUserInfo();
    }, []);

    const avatarUri = Image.resolveAssetSource(require('../../../assets/images/avt.png')).uri;

   const handleLogout = async () => {
        // Xóa thông tin người dùng khỏi AsyncStorage
        await AsyncStorage.removeItem('userid');
        await AsyncStorage.removeItem('fullname');
        // Điều hướng về màn hình đăng nhập
        navigation.navigate('Login');
    };
    const confirmLogout = () => {
            Alert.alert(
                "Xác nhận đăng xuất",
                "Bạn có chắc chắn muốn đăng xuất hay không?",
                [
                    {
                        text: "Không",
                        onPress: () => console.log("Hủy bỏ"),
                        style: "cancel",
                    },
                    { text: "Có", onPress: handleLogout },
                ],
                { cancelable: false }
            );
        };

    return (
        <ScrollView style={styles.container}>


            <View style={styles.profileHeader}>
                {/* Avatar người dùng */}
                <Image
                    source={{ uri: avatarUri }}
                    style={styles.avatar}
                    defaultSource={require('../../../assets/images/avt.png')} // Backup nếu ảnh không tải được
                />
                {/* Hiển thị tên người dùng */}
                <Text style={styles.username}>{fullname || 'Không rõ'}</Text>
                {/* Nút Shop của tôi (chỉ hiện nếu role là client) */}
                   {role === 'client' && (
                       <TouchableOpacity
                           style={styles.shopButton}
                           onPress={() => navigation.navigate('ShopManagement')}
                       >
                           <Text style={styles.shopButtonText}>Shop của tôi</Text>
                       </TouchableOpacity>
                   )}
            </View>

            {/* Đơn Mua */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đơn Mua</Text>
                <View style={styles.purchaseRow}>
                    <TouchableOpacity style={styles.iconContainer}>
                        <MaterialCommunityIcons name="clipboard-check-outline" size={32} color="#007BFF" />
                        <Text style={styles.iconText}>Chờ xác nhận</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer}>
                        <Ionicons name="cube-outline" size={32} color="#FF9900" />
                        <Text style={styles.iconText}>Chờ lấy hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer}>
                        <MaterialCommunityIcons name="truck-delivery-outline" size={32} color="#FF4D4D" />
                        <Text style={styles.iconText}>Chờ giao hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer}>
                        <Ionicons name="star-outline" size={32} color="#28A745" />
                        <Text style={styles.iconText}>Đánh giá</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Hỗ Trợ */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hỗ Trợ</Text>
                <TouchableOpacity style={styles.supportItem}>
                    <Ionicons name="help-circle-outline" size={24} color="#007BFF" />
                    <Text style={styles.supportText}>Trung tâm trợ giúp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.supportItem}>
                    <Ionicons name="chatbubbles-outline" size={24} color="#007BFF" />
                    <Text style={styles.supportText}>Trò chuyện</Text>
                </TouchableOpacity>
            </View>


            <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
                <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7',
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        backgroundColor: '#e0e0e0', // Màu nền nếu ảnh chưa tải được
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    section: {
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    purchaseRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    iconContainer: {
        alignItems: 'center',
    },
    iconText: {
        marginTop: 5,
        fontSize: 14,
        textAlign: 'center',
    },
    supportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    supportText: {
        marginLeft: 10,
        fontSize: 16,
    },
    logoutButton: {
        marginVertical: 20,
        padding: 15,
        backgroundColor: '#FF4D4D', // Màu đỏ cho nút đăng xuất
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Profile;
