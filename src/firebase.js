import { initializeApp } from "firebase/app";
// import { useFirestore } from "vuefire";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAoqBtacx6RS0q4cIayalTTC8C3M-yi5cU",
  authDomain: "shoplist-9bc94.firebaseapp.com",
  projectId: "shoplist-9bc94",
  storageBucket: "shoplist-9bc94.appspot.com",
  messagingSenderId: "860698377609",
  appId: "1:860698377609:web:9b5a3277b7669117887558",
  measurementId: "G-YZL0Q74FY7"
};

export const firebaseApp = initializeApp(firebaseConfig);


export const db = getFirestore(firebaseApp);
