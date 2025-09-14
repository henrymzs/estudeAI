import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "../screens/main/Home";
import Statistics from '../screens/main/Statistics';
import Profile from '../screens/main/Profile';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator 
            initialRouteName="Home" 
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Statistics" component={Statistics} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}