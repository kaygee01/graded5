import { db } from './FBconfig';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, getDoc, query, where } from 'firebase/firestore';
import { getAuth, updateProfile, deleteUser, updatePassword } from 'firebase/auth';

// Function to get the currently authenticated user
const getUser = () => {
    const auth = getAuth();
    return auth.currentUser;
};

export const addFlashcard = async (flashcardData) => {
    try {
        await addDoc(collection(db, 'flashcards'), flashcardData);
    } catch (error) {
        console.error('Error saving flashcard:', error);
    }
};

export const updateFlashcard = async (id, flashcardData) => {
    try {
        const flashcardRef = doc(db, 'flashcards', id);
        await updateDoc(flashcardRef, flashcardData);
    } catch (error) {
        console.error('Error updating flashcard:', error);
    }
};

export const deleteFlashcard = async (id) => {
    try {
        await deleteDoc(doc(db, 'flashcards', id));
    } catch (error) {
        console.error('Error deleting flashcard:', error);
    }
};

export const getFlashcards = async (userId) => {
    try {
        const q = query(collection(db, 'flashcards'), where('uid', '==', userId));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        return [];
    }
};

export const getUserById = async (uid) => {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
            return { id: userSnapshot.id, ...userSnapshot.data() };
        } else {
            console.log('No such user!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

export const updateUserProfile = async ({ firstName, password }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
      throw new Error("User not found");
  }

  try {
      const userRef = doc(db, 'users', user.uid);
      const updates = {};
      if (firstName) updates.firstName = firstName;

      if (password) {
          await updatePassword(user, password); // Ensure this password is the correct one
      }

      await updateDoc(userRef, updates);

      console.log("User profile updated successfully");
  } catch (error) {
      console.error("Error updating user profile:", error);
      throw error; 
  }
};

export const deleteUserAccount = async () => {
  const auth = getAuth();
  const user = auth.currentUser; // Get the current user

  if (!user) {
      throw new Error("User not found");
  }

  try {
      const flashcardsRef = collection(db, 'flashcards');
      const q = query(flashcardsRef, where('uid', '==', user.uid));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef); // Delete user document
      await deleteUser(user);

      console.log("User account and associated data deleted successfully");
  } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
  }
};
