import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { addFlashcard, updateFlashcard } from './cardActions';

const FlashcardForm = ({ route, navigation }) => {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState('');
  const [color, setColor] = useState('red');
  const [dueDate, setDueDate] = useState('');

  const isEdit = route.params?.edit;
  const flashcard = route.params?.flashcard;

  const saveFlashcard = () => {
    if (title && tasks && dueDate) {
      const flashcardData = { title, tasks, color, dueDate, status: 'incomplete' };
      if (isEdit) {
        updateFlashcard(flashcard.id, flashcardData);
      } else {
        addFlashcard(flashcardData);
      }
      navigation.goBack();
    } else {
      alert('All fields must be filled.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Tasks"
        value={tasks}
        onChangeText={setTasks}
        style={styles.input}
      />
      <TextInput
        placeholder="Due Date (e.g., 2024-09-20)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
      />
      {/* Color Selection */}
      <View style={styles.colorSelection}>
        {['red', 'yellow', 'orange', 'green', 'blue'].map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.colorOption, { backgroundColor: c, borderWidth: color === c ? 3 : 0 }]}
            onPress={() => setColor(c)}
          />
        ))}
      </View>
      <Button title={isEdit ? "Update" : "Save"} onPress={saveFlashcard} />
    </View>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderColor: '#ccc'
  },
  colorSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  }
};

export default FlashcardForm;
