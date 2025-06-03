import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import type { Motorcycle, FavoriteMotorcycle } from '../types/motorcycle';

export const addFavoriteMotorcycle = async (motorcycle: Motorcycle, userId: string) => {
  const favorite: Omit<FavoriteMotorcycle, 'id'> = {
    ...motorcycle,
    userId,
    createdAt: new Date(),
  };
  
  const docRef = await addDoc(collection(db, 'favorites'), favorite);
  return docRef.id;
};

export const removeFavoriteMotorcycle = async (id: string) => {
  await deleteDoc(doc(db, 'favorites', id));
};

export const getFavoriteMotorcycles = async (userId: string) => {
  const q = query(collection(db, 'favorites'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as FavoriteMotorcycle[];
};
