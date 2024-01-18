import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useCollection } from 'vuefire';
import { addDoc, collection, deleteDoc, doc, updateDoc, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { query } from 'firebase/database';


export const useListStore = defineStore('list', () => {
  const isInShopView = ref(false);
  const { pending, data } = useCollection(collection(db, 'shoplist'));

  async function addItem(item) {
    try {
      const res = await addDoc(collection(db, 'shoplist'), item);
    } catch (err) {
      console.error('Error adding document to shoplist', err);
    }
  }

  async function deleteItem(itemId) {
    try {
      await deleteDoc(doc(db, 'shoplist', itemId));
    } catch (err) {
      console.error('Error deleting document from shoplist', err);
    }
  }

  async function updateStatus(item) {
    const docRef = doc(db, 'shoplist', item.id);
    
    try {
      await updateDoc(docRef, {[item.name]: item.value});
    } catch (err) {
      console.error('Error updating status', err);
    }
  } 

  function clearList() {
    deleteItems();
    updateItems();
  }

  async function deleteItems() {
    try {
      const notInDefaultListItems = query(collection(db, 'shoplist'), where('in_default', '!=', true));
      const notInDefaultListItemsSnapshot = await getDocs(notInDefaultListItems);
  
      notInDefaultListItemsSnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(db, 'shoplist', docSnapshot.id);
        await deleteDoc(docRef);
      });
    } catch(err) {
      console.error('Error while deleting items after clear', err);
    }
  }

  async function updateItems() {
    try {
      const itemsQuery = query(collection(db, 'shoplist'));
      const querySnapshot = await getDocs(itemsQuery);
  
      querySnapshot.forEach(async (docSnapshot) => {
        const docRef = doc(db, 'shoplist', docSnapshot.id);
        await updateDoc(docRef, {
          to_buy: false,
          in_cart: false
        });
      });
    } catch(err) {
      console.error('Error while updating items after clear', err);
    }
  }

  return { 
    isInShopView,
    pending,
    data,
    addItem,
    deleteItem,
    updateStatus,
    clearList
  }
})