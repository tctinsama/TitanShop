import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/customer/HomeScreen';  
import NotificationsScreen from '../screens/customer/NotificationsScreen';  
import CartScreen from '../screens/customer/CartScreen';  

const Tab = createMaterialBottomTabNavigator();

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
        component={CartScreen}
        initialParams={{ userId }} 
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => renderIcon("cart", color),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        initialParams={{ userId }} 
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color }) => renderIcon("bell", color),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
