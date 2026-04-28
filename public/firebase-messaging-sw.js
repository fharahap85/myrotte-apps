// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyD5yt182xOHeUnxa06vz1SwF4cxQJE49KU",
  authDomain: "notifikasi-74c94.firebaseapp.com",
  projectId: "notifikasi-74c94",
  storageBucket: "notifikasi-74c94.firebasestorage.app",
  messagingSenderId: "632621079630",
  appId: "1:632621079630:web:bcffc7d2e4b5a481cfb71f",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/src/assets/Rotte_Logo 1.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
