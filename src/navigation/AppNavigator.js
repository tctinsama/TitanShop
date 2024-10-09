//src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import HomeScreen from '../screens/customer/HomeScreen';
import MyTabs from '../components/MyTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="HomeTabs">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          {/* Đặt MyTabs làm màn hình chính với header ẩn */}
          <Stack.Screen
            name="HomeTabs"
            component={MyTabs}
            options={{ headerShown: false }}  // Ẩn header nếu muốn
          />
        </Stack.Navigator>
      );
    };

export default AppNavigator;
