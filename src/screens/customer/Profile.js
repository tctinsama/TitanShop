import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const Profile = () => {
    const navigation = useNavigation();
    const { userId } = useUser();
    const [fullname, setFullname] = useState('');
    const [role, setRole] = useState('');
    const [orderCounts, setOrderCounts] = useState({ confirm: 0, pickup: 0, deliver: 0 });
    const [loading, setLoading] = useState(false);

    const handleRegisterShop = async () => {
        if (!userId) {
          Alert.alert('Lỗi', 'Không có userId. Vui lòng đăng nhập lại.');
          return;
        }

        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/api/role/update-approval`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
          });

          const data = await response.json();

          if (response.ok) {
            Alert.alert('Thông báo', data.message);
          } else {
            Alert.alert('Lỗi', data.message || 'Không thể gửi yêu cầu. Vui lòng thử lại sau.');
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          Alert.alert("Lỗi", "Không thể gửi yêu cầu. Vui lòng thử lại sau.");
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const name = await AsyncStorage.getItem('fullname');
            const rolename = await AsyncStorage.getItem('rolename');
            setFullname(name || 'Không rõ');
            setRole(rolename || '');

        };
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchOrderCounts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/order/count/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setOrderCounts(data);
            } catch (error) {
                console.error("Lỗi khi lấy số lượng đơn hàng:", error);
                Alert.alert("Lỗi", "Không thể lấy dữ liệu đơn hàng. Vui lòng thử lại sau.");
            }
        };
        fetchOrderCounts();
    }, [userId]);

    const avatarUri = Image.resolveAssetSource(require('../../../assets/images/avt.png')).uri;

    const handleLogout = async () => {
        await AsyncStorage.removeItem('userid');
        await AsyncStorage.removeItem('fullname');
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
                <Image
                    source={{ uri: avatarUri }}
                    style={styles.avatar}
                    defaultSource={require('../../../assets/images/avt.png')}
                />
                <Text style={styles.username}>{fullname || 'Không rõ'}</Text>
                {role === 'client' && (
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => navigation.navigate('ShopManagement')}
                    >
                        <Text style={styles.shopButtonText}>Shop của tôi</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Đơn Mua</Text>
                <View style={styles.purchaseRow}>
                    <TouchableOpacity style={styles.iconContainer}>
                        <MaterialCommunityIcons name="clipboard-check-outline" size={32} color="#007BFF" />
                        <Text style={styles.iconText}>Chờ xác nhận</Text>
                        {orderCounts.confirm > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{orderCounts.confirm}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer}>
                        <Ionicons name="cube-outline" size={32} color="#FF9900" />
                        <Text style={styles.iconText}>Chờ giao hàng</Text>
                        {orderCounts.pickup > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{orderCounts.pickup}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer}>
                        <MaterialCommunityIcons name="truck-delivery-outline" size={32} color="#FF4D4D" />
                        <Text style={styles.iconText}>Đang giao</Text>
                        {orderCounts.deliver > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{orderCounts.deliver}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer}>
                        <Ionicons name="star-outline" size={32} color="#28A745" />
                        <Text style={styles.iconText}>Đánh giá</Text>
                    </TouchableOpacity>
                </View>
            </View>

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

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tiện ích</Text>
                {role === 'customer' && (
                    <TouchableOpacity style={styles.supportItem} onPress={handleRegisterShop} disabled={loading}>
                        <Ionicons name="help-circle-outline" size={24} color="#007BFF" />
                        <Text style={styles.supportText}>Đăng kí trở thành nhà bán hàng</Text>
                    </TouchableOpacity>
                )}
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
        backgroundColor: '#f9fbfd',
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        backgroundColor: '#e0e0e0',
    },
    username: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
    },
    shopButton: {
        backgroundColor: '#28a745',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    shopButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    section: {
        marginVertical: 15,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
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
        color: '#666',
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
        color: '#333',
    },
    logoutButton: {
        marginVertical: 20,
        paddingVertical: 15,
        alignItems: 'center',
        backgroundColor: '#ff4d4d',
        borderRadius: 8,
        marginHorizontal: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: '#f44336',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default Profile;
