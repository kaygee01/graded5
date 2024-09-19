import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';
import { getFlashcards, deleteFlashcard } from './cardActions';

const FlashcardList = ({ navigation }) => {
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFlashcards();
      setFlashcards(data);
    };
    fetchData();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="+" onPress={() => navigation.navigate('FlashcardForm')} />
      {flashcards.map(card => (
        <View
          key={card.id}
          style={[styles.card, { backgroundColor: card.color, borderColor: card.status === 'complete' ? '#ccc' : 'blue' }]}>
          <Text style={styles.title}>{card.title}</Text>
          <Text>{card.tasks}</Text>
          <View style={styles.icons}>
            <TouchableOpacity onPress={() => navigation.navigate('FlashcardForm', { edit: true, flashcard: card })}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteFlashcard(card.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
          {card.status === 'incomplete' && (
            <Button title="Done" onPress={() => updateFlashcard(card.id, { status: 'complete' })} />
          )}
        </View>
      ))}
    </View>
  );
};

const styles = {
  card: {
    padding: 20,
    marginVertical: 10,
    borderWidth: 2,
    borderRadius: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  }
};

export default FlashcardList;
