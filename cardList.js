import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { getFlashcards, deleteFlashcard, updateFlashcard, getUserById } from './cardActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth } from 'firebase/auth';

const FlashcardList = ({ navigation, route }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [userName, setUserName] = useState('');
  const [refresh, setRefresh] = useState(false);
  const { uid } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      const user = getAuth().currentUser;
      if (!user) {
        console.error('User is not authenticated');
        return;
      }

      const data = await getFlashcards(user.uid);
      const filteredData = data.filter(card => card.uid === uid);
      setFlashcards(filteredData);

      const userData = await getUserById(uid);
      if (userData) {
        setUserName(userData.firstName);
      }
    };

    fetchData();
  }, [uid, refresh]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setRefresh(prev => !prev); // Trigger refresh when the screen is focused
    });

    return unsubscribe;
  }, [navigation]);

  const handleComplete = async (id) => {
    await updateFlashcard(id, { status: 'complete' });
    setRefresh(prev => !prev);
  };

  const handleDelete = async (id) => {
    await deleteFlashcard(id);
    setRefresh(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Profile', { uid })}
          activeOpacity={0.7}
        >
          <View style={styles.buttonContent}>
            <Icon name="user" size={20} color="#000" />
            <Text style={styles.userName}>{`Hello, ${userName}`}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('FlashcardForm', { uid })} style={styles.addButton}>
          <Icon name="plus" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <Text style={styles.sectionTitle}>Incomplete Flashcards</Text>
        {flashcards.filter(card => card.status === 'not done').map(card => (
          <View key={card.id} style={[styles.card, { backgroundColor: card.color }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{card.title}</Text>
              <Text style={styles.dueDate}>{card.dueDate}</Text>
            </View>
            <Text style={styles.taskText}>
             {card.tasks.split(',').map((task, index) => (
                <Text key={index}>
                  {task.trim()}
                  {index < card.tasks.split(',').length - 1 ? '\n' : ''}
                </Text>
              ))}
            </Text>
            <View style={styles.icons}>
              <TouchableOpacity onPress={() => navigation.navigate('FlashcardForm', { edit: true, uid, flashcard: card })}>
                <Icon name="pencil" size={20} color="#f4511e" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(card.id)}>
                <Icon name="trash" size={20} color="#f4511e" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.completeButton} onPress={() => handleComplete(card.id)}>
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Completed Flashcards</Text>
        {flashcards.filter(card => card.status === 'complete').map(card => (
          <View key={card.id} style={[styles.card, { backgroundColor: 'lightgrey' }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{card.title}</Text>
              <Text style={styles.dueDate}>{card.dueDate}</Text>
            </View>
            <Text style={styles.taskText}>
            <Text style={styles.taskText}>
              {card.tasks.split(',').map((task, index) => (
                <Text key={index}>
                  {task.trim()}
                  {index < card.tasks.split(',').length - 1 ? '\n' : ''}
                </Text>
              ))}
            </Text>
            </Text>
            <View style={styles.icons}>
              <Text style={styles.completedText}>Completed</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: 'black',
    marginLeft: 7,
  },
  addButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  card: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  dueDate: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic',
  },
  taskText: {
    fontSize: 14,
    color: '#555',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  completedText: {
    color: '#555',
    fontSize: 14,
  },
  completeButton: {
    backgroundColor: '#f4511e',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  completeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  btn: {
    width: "50%",
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    borderWidth: 1,
  },
});

export default FlashcardList;
