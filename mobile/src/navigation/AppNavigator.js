import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthNavigator from './AuthNavigator'
import BottomTabs from './BottomTabs';
import CreateDecks from '../screens/main/CreateDecks';
import CreateManualFlashCards from '../screens/main/CreateManualFlashCards';
import StudyDeck from '../screens/main/StudyDeck';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Auth' component={AuthNavigator} />
            <Stack.Screen name='Home' component={BottomTabs} />
            <Stack.Screen name='CreateDeck' component={CreateDecks} />
            <Stack.Screen name='CreateManualFlashCards' component={CreateManualFlashCards} />
            <Stack.Screen name='StudyDeck' component={StudyDeck} />
        </Stack.Navigator>    
    );
}