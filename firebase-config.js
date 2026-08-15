const firebaseConfig = {
  apiKey: "AIzaSyA92YjJblwdPwlQXat-aDf60rZCqldi6lU",
  authDomain: "terabytes-b0356.firebaseapp.com",
  projectId: "terabytes-b0356",
  storageBucket: "terabytes-b0356.firebasestorage.app",
  messagingSenderId: "30874792569",
  appId: "1:30874792569:web:fecb1c18bfebedf1e2daa8"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Экспортируем ссылки на сервисы
const db = firebase.firestore();
const auth = firebase.auth();

// Проверим, что всё инициализировалось
console.log("Firebase initialized:", firebase.app().name);
console.log("Firestore:", db ? "OK" : "FAILED");
console.log("Auth:", auth ? "OK" : "FAILED");
