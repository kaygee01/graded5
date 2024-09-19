// k hlapisi
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashcardList from './cardList';
import FlashcardForm from './cardForm';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FlashcardList">
        <Stack.Screen 
          name="FlashcardList" 
          component={FlashcardList} 
          options={{ title: 'My Flashcards' }} 
        />
        <Stack.Screen 
          name="FlashcardForm" 
          component={FlashcardForm} 
          options={{ title: 'Create or Edit Flashcard' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
