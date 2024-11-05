import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/customer/HomeScreen';  
import NotificationsScreen from '../screens/customer/NotificationsScreen';  
import CartScreen from '../screens/customer/CartScreen';  
import Profile from '../screens/customer/Profile';


const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="CartScreen" 
        component={CartScreen} 
        options={{ title: 'Giỏ Hàng', headerShown: true }} 
      />
    </Stack.Navigator>
  );
}

function MyTabs({ userId }) {  
  const renderIcon = (iconName, color) => (
    <MaterialCommunityIcons name={iconName} color={color} size={22} />
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="forestgreen"
      inactiveColor="darkgreen"
      barStyle={{
        backgroundColor: '#FFF',
        height: 70,
        paddingBottom: 0,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ userId }} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => renderIcon("home", color),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStack}
        initialParams={{ userId }} 
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => renderIcon("cart", color),
        }}
      />
      <Tab.Screen
          name="Profile"
          component={Profile}
          initialParams={{ userId }}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color }) => renderIcon("account", color), // Cập nhật biểu tượng cho Profile
          }}
        />
      </Tab.Navigator>
  );
}

export default MyTabs;
