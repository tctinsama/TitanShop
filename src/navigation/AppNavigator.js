import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Home from '../screens/customer/Home';
import AdHome from '../screens/admin/AdHome';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AdHome" component={AdHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
