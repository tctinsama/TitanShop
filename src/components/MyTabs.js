// src/components/MyTabs.js
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/customer/HomeScreen';  // Import HomeScreen
import NotificationsScreen from '../screens/customer/NotificationsScreen';  // Import NotificationsScreen (đảm bảo bạn có màn hình này)
import CartScreen from '../screens/customer/CartScreen';  // Import ProfileScreen (đảm bảo bạn có màn hình này)

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
          initialRouteName="Home"
          activeColor="forestgreen"
          inactiveColor="darkgreen "
          barStyle={{
            backgroundColor: '#FFF',
            height: 70,
            paddingBottom: 0,
          }}
        >
         <Tab.Screen
             name="Home"
             component={HomeScreen}
             options={{
               tabBarLabel: 'Home',
               tabBarIcon: ({ color }) => (
                 <MaterialCommunityIcons name="home" color={color} size={22} />
               ),
             }}
           />
      <Tab.Screen
        name="Cart"
        component={CartScreen}  // Bạn cần tạo màn hình NotificationsScreen nếu chưa có
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}  // Bạn cần tạo màn hình ProfileScreen nếu chưa có
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
