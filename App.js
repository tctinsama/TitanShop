import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { UserProvider } from './src/context/UserContext';

const App = () => {
  return (
    <UserProvider>
        <NavigationContainer>
            <AppNavigator />
        </NavigationContainer>
    </UserProvider>
);

};

export default App;
