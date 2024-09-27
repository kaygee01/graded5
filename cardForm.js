import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getAuth } from 'firebase/auth';
import { addFlashcard, updateFlashcard } from './cardActions';
import CustomBorderBtn from './components/CustomBorderBtn';
import CustomSolidBtn from './components/CustomSolidBtn';
import CustomTextInput from './components/CustomTextInput';

const FlashcardForm = ({ route, navigation }) => {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState(['']); // Array for multiple tasks
  const [color, setColor] = useState('#ffcccc');
  const [dueDate, setDueDate] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isEdit = route.params?.edit;
  const flashcard = route.params?.flashcard;
  const uid = route.params?.uid;

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setCurrentUserUid(user.uid);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    if (isEdit && flashcard) {
      setTitle(flashcard.title);
      setTasks(flashcard.tasks.split(',')); // Assuming tasks are stored as a comma-separated string
      setColor(flashcard.color);
      setDueDate(flashcard.dueDate);
      setSelectedDate(new Date(flashcard.dueDate));
    }
  }, [isEdit, flashcard]);

  const saveFlashcard = async () => {
    if (isEdit && (!currentUserUid || currentUserUid !== uid)) {
      alert("You are not authorized to save this flashcard.");
      return;
    }

    if (title && tasks.length > 0 && dueDate) {
      const flashcardData = {
        title,
        tasks: tasks.join(','), // Convert tasks array to a comma-separated string
        color,
        dueDate,
        status: 'not done',
        uid: currentUserUid,
      };

      try {
        if (isEdit) {
          await updateFlashcard(flashcard.id, flashcardData);
        } else {
          await addFlashcard(flashcardData);
        }
        navigation.goBack();
      } catch (error) {
        alert('Error saving flashcard: ' + error.message);
      }
    } else {
      alert('All fields must be filled.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowPicker(false);
    setDueDate(currentDate.toISOString().split('T')[0]); // Format date as 'YYYY-MM-DD'
    setSelectedDate(currentDate);
  };

  const addTaskField = () => {
    setTasks([...tasks, '']); // Add an empty string for a new task input
  };

  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const colors = [
    { name: '#ffcccc', lighter: '#ffcccc' },
    { name: '#ffffcc', lighter: '#ffffcc' },
    { name: '#ffcc99', lighter: '#ffcc99' },
    { name: '#ccffcc', lighter: '#ccffcc' },
    { name: '#cce5ff', lighter: '#cce5ff' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{isEdit ? "Edit Flashcard" : "Create Flashcard"}</Text>

      {isAuthenticated ? (
        <Text style={styles.authStatus}>You are authenticated</Text>
      ) : (
        <Text style={styles.authStatus}>You are not authenticated</Text>
      )}

      <CustomTextInput
        title="Title"
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
        inputStyle={styles.input}
      />

      <Text style={styles.subTitle}>Tasks</Text>
      {tasks.map((task, index) => (
        <CustomTextInput
          key={index}
          title={"Task"}
          placeholder={`Enter task ${index + 1}`}
          value={task}
          onChangeText={(value) => handleTaskChange(index, value)}
          inputStyle={styles.input}
        />
      ))}
      <TouchableOpacity onPress={addTaskField} style={styles.addTaskButton}>
        <Text style={styles.addTaskText}>+ Add Task</Text>
      </TouchableOpacity>

      <View style={styles.datePickerContainer}>
        <Text style={styles.title}>Due Date</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>{dueDate || "Select a date"}</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.colorSelectionLabel}>Select Color:</Text>
      <View style={styles.colorSelection}>
        {colors.map((colorItem) => (
          <TouchableOpacity
            key={colorItem.name}
            style={[
              styles.colorOption,
              {
                backgroundColor: colorItem.lighter,
                borderWidth: color === colorItem.name ? 3 : 0,
              },
            ]}
            onPress={() => setColor(colorItem.name)} // Ensure selected color is one of the options
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <CustomSolidBtn
          title={isEdit ? "Update" : "Save"}
          onClick={saveFlashcard}
        />
        <CustomBorderBtn title="Cancel" onClick={() => navigation.goBack()} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 20,
  },
  subTitle: {
    fontWeight: '500',
    fontSize: 20,
    marginVertical: 10,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  dateInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  dateText: {
    color: '#000',
  },
  colorSelectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },
  colorSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  addTaskButton: {
    backgroundColor: '#f4511e',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addTaskText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FlashcardForm;
