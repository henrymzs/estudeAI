import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthNavigator from './AuthNavigator'
import BottomTabs from './BottomTabs';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Auth' component={AuthNavigator} />
            <Stack.Screen name='Main' component={BottomTabs} />
        </Stack.Navigator>    
    );
}