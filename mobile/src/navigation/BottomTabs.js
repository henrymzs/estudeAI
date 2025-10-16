import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';

import Home from "../screens/main/Home";
import Statistics from '../screens/main/Statistics';
import Profile from '../screens/main/Profile';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Estatísticas') {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    } else if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveColor: '#667eea',
                tabBarInactiveColor: '#a0aec0',
            })}
        >
            <Tab.Screen name="Estatísticas" component={Statistics} />
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Perfil" component={Profile} />
        </Tab.Navigator>
    );
}