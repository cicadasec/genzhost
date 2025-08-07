
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: 'genzhost',
  appId: '1:435019395162:web:0cc367c7719f44ad4a2863',
  storageBucket: 'genzhost.firebasestorage.app',
  apiKey: 'AIzaSyB8EjtE8XgOsOVFkQSBy4cLz9qlbmRwFXU',
  authDomain: 'genzhost.firebaseapp.com',
  messagingSenderId: '435019395162',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
