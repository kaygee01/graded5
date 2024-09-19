import { db } from './firebaseConfig';

export const addFlashcard = async (flashcard) => {
  await db.collection('flashcards').add(flashcard);
};

export const updateFlashcard = async (id, updatedData) => {
  await db.collection('flashcards').doc(id).update(updatedData);
};

export const deleteFlashcard = async (id) => {
  await db.collection('flashcards').doc(id).delete();
};

export const getFlashcards = async () => {
  const snapshot = await db.collection('flashcards').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
