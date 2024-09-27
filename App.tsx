// k hlapisi
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlashcardList from './cardList';
import FlashcardForm from './cardForm';
import Login from './Login';
import Signup from './signup';
import ProfileScreen from './profile';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
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
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Login' }} 
        />
        <Stack.Screen 
          name="SignUp" 
          component={Signup} 
          options={{ title: 'Sign Up' }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profile' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
