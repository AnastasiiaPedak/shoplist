import { defineStore } from 'pinia';
import { useCollection } from 'vuefire';
import { db } from '../firebase';
import {
  doc,
  updateDoc,
  query,
  where,
  writeBatch,
  collection,
  getDocs,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';

export const useCategoriesStore = defineStore('categories', () => {
  const { pending, data } = useCollection(collection(db, 'categories'));

  async function addCategory(newCategory) {
    try {
      await addDoc(collection(db, 'categories'), newCategory);
    } catch (err) {
      console.error('Error adding new category', err);
    }
  }

  async function updateCategoryAndReferences(category) {
    const categoryRef = doc(db, 'categories', category.id);

    try {
      await updateDoc(categoryRef, { name: category.name });

      const shoplistQuery = query(
        collection(db, 'shoplist'),
        where('category.id', '==', category.id)
      );

      const shoplistItemsSnapshot = await getDocs(shoplistQuery);

      const batch = writeBatch(db);

      shoplistItemsSnapshot.forEach((doc) => {
        const shoplistItemRef = doc.ref;
        batch.update(shoplistItemRef, { 'category.name': category.name });
      });

      await batch.commit();
    } catch (err) {
      console.error('Error updating category and references', err);
    }
  }

  async function deleteCategoryAndReferences(category) {
    const categoryRef = doc(db, 'categories', category.id);

    try {
      const shoplistQuery = query(
        collection(db, 'shoplist'),
        where('category.id', '==', category.id)
      );

      const shoplistItemsSnapshot = await getDocs(shoplistQuery);

      shoplistItemsSnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });

      await deleteDoc(categoryRef, { name: category.name });
    } catch (err) {
      console.error('Error deleting category and references', err);
    }
  }

  return {
    pending,
    data,
    addCategory,
    updateCategoryAndReferences,
    deleteCategoryAndReferences,
  };
});
