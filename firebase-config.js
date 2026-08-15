// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA92YjJblwdPwlQXat-aDf60rZCqldi6lU",
  authDomain: "terabytes-b0356.firebaseapp.com",
  projectId: "terabytes-b0356",
  storageBucket: "terabytes-b0356.firebasestorage.app",
  messagingSenderId: "30874792569",
  appId: "1:30874792569:web:fecb1c18bfebedf1e2daa8",
  measurementId: "G-FJ5D2RB5PZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firebaseConfig = {
  apiKey: "ТВОЙ_API_KEY",
  authDomain: "ТВОЙ_PROJECT.firebaseapp.com",
  projectId: "ТВОЙ_PROJECT_ID",
  storageBucket: "ТВОЙ_PROJECT.appspot.com",
  messagingSenderId: "ТВОЙ_SENDER_ID",
  appId: "ТВОЙ_APP_ID"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Экспортируем ссылки на сервисы (чтобы использовать в script.js)
const db = firebase.firestore();
const auth = firebase.auth();
