import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Welcome from "../screens/common/Welcome";
import Login from "../screens/auth/Login";
import Register from "../screens/auth/Register";

const Stack = createStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Welcome' component={Welcome} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Register' component={Register} />
        </Stack.Navigator>
    );
}