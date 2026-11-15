// Konfigurasi Firebase Anda
// Ganti nilai di bawah ini dengan config project Firebase Anda dari Firebase Console:
// Project Settings > General > Your apps > Web app (Firebase SDK snippet: Config)
const firebaseConfig = {
  apiKey: "AIzaSyCXp3TqgXJcQWgvyXilYRO-BU7APmgudoc",
  authDomain: "evotexirpl.firebaseapp.com",
  projectId: "evotexirpl",
  storageBucket: "evotexirpl.firebasestorage.app",
  messagingSenderId: "376350393782",
  appId: "1:376350393782:web:a033e21dd203d5c2c56d17",
  measurementId: "G-B414G5CREQ",
};


// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Koleksi data
const DB_CANDIDATES = "candidates";
const DB_VOTERS = "voters";
const DB_SETTINGS = "settings";
