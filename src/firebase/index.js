import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore, query, where, collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig),
  db = getFirestore(app),
  auth = getAuth(app),
  storage = getStorage(app);

async function checkEmail(email) {
  const emails = [];
  try {
    const collectionRef = collection(db, 'users');
    const q = query(collectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      emails.push(doc.data());
    })
  } catch (error) {
    console.log(error);
  }
  return emails.length;
}

async function getUserInfoByUid(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    console.error(error);
  }
}

async function getInfoByUsername(username) {
  const users = [];
  try {
    const collectionRef = collection(db, 'users');
    const q = query(collectionRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    })
  } catch (error) {
    console.log(error);
  }

  return users.length > 0 ? users[0] : null;
}

async function createNewUser(user) {
  try {
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, user);
  } catch (error) {
    console.error(error);
  }
}

async function checkLogin(username, password) {
  try {
    const user = await getInfoByUsername(username);
    if (user) {
      return user.password === password;
    }
    return false;
  } catch (error) {
    console.log(error)
  }
}

async function userExists(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.log(error);
  }
}

async function saveUserInfo(user) { // Same as Create new user function, just diff name
  try {
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, user);
  } catch (error) {
    console.log(error)
  }
}

/* Storage Functions */
async function setUserProfileImage(uid, file) {
  try {
    const imageRef = ref(storage, `images/${uid}`);
    const resUpload = await uploadBytes(imageRef, file);
    return resUpload;
  } catch (error) {
    console.log(error)
  }
}

async function getImageByPath(path) {
  try {
    // console.log(path)
    const imageRef = ref(storage, path);
    const url = await getDownloadURL(imageRef);
    // console.log(url)
    return url;
  } catch (error) {
    // console.error(error)
  }
}

export { auth, checkEmail, getInfoByUsername, createNewUser, checkLogin, getUserInfoByUid, userExists, saveUserInfo, setUserProfileImage, getImageByPath }

