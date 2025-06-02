// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, collection, query, onSnapshot, orderBy, doc, getDoc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { View, Text, SafeAreaView, Image, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsUuAz2fdzF2mlVvqrcHl7XXRyWgWWonk",
  authDomain: "team315app-fc321.firebaseapp.com",
  projectId: "team315app-fc321",
  storageBucket: "team315app-fc321.firebasestorage.app",
  messagingSenderId: "1090266338930",
  appId: "1:1090266338930:web:8f1d2af74e5b0fdc1214eb",
  measurementId: "G-WRNL23N0RQ"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);



// Export the auth and db for use in other parts of your app
export { auth, db,storage };

//==== FIREBASE AUTH ====
export const createAccount = (username, email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      updateProfile(userCredentials.user, { displayName: username });
    })
    .catch((error) => {
      alert(error);
    });
};

export const signInUser = (email, password) => {
  signInWithEmailAndPassword(auth, email, password).catch((error) => {
    alert(error);
  });
};

export const signOutUser = () => {
  signOut(auth).catch((error) => {
    alert(error);
  });
};

export const updateOnAuthStateChanged = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(user);
  });
  return unsubscribe; // Return the unsubscribe function
};

//==== FIRESTORE ====
export const dbAddComment = (userID, username, comment) => {
  addDoc(collection(db, "comments"), {
    comment: comment,
    timestamp: Date.now(),
    userID: userID,
    username: username,
  });
};

export const updateOnSnapshot = (callback) => {
  const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
  onSnapshot(q, callback);
};

// Function to create a user profile if it doesn't exist
export const createUserProfile = (
  userID,
  firstName,
  lastName,
  phone,
  email,
  company,
  notes
) => {
  const userRef = doc(db, "users", userID); // Reference to the user document

  const userData = {
    firstName: firstName || "",
    lastName: lastName || "",
    phone: phone || "",
    email: email || "",
    company: company || "",
    notes: notes || "",
  };

  // Check if the user document already exists
  getDoc(userRef)
    .then((docSnap) => {
      if (!docSnap.exists()) {
        // If the document doesn't exist, create it
        setDoc(userRef, { userID: userID, ...userData })
          .then(() => {
            console.log("User profile created successfully");
          })
          .catch((error) => {
            console.error("Error creating user profile: ", error);
          });
      } else {
        console.log("User profile already exists.");
      }
    })
    .catch((error) => {
      console.error("Error checking user profile existence: ", error);
    });
};

// Update user profile function
export const updateUserProfile = (
  userID,
  firstName,
  lastName,
  phone,
  email,
  company,
  notes
) => {
  const userRef = doc(db, "contacts", userID);

  const updatedData = {
    firstName: firstName || "",
    lastName: lastName || "",
    phone: phone || "",
    email: email || "",
    company: company || "",
    notes: notes || [],
  };

  return updateDoc(userRef, updatedData)
    .then(() => {
      console.log("User profile updated successfully");
    })
    .catch((error) => {
      console.error("Error updating profile: ", error);
      throw error; // Throwing the error so it can be handled in the component
    });
};

/// Function to delete a user profile
export const deleteUserProfile = (userID) => {
  if (!userID) {
    console.error("Error: No userID provided");
    return Promise.reject(new Error("No userID provided")); // Return a rejected promise for consistency
  }

  const userRef = doc(db, "users", userID); // Reference to the user document in Firestore

  console.log("Attempting to delete profile for userID:", userID); // Debugging log

  // Try to delete the document
  return deleteDoc(userRef)
    .then(() => {
      console.log("User profile deleted successfully");
      return { success: true }; // Return a success message or status
    })
    .catch((error) => {
      console.error("Error deleting user profile: ", error);
      throw error; // Rethrow the error to handle it at the component level
    });
};

// Function to check if the document exists before deleting
export const checkAndDeleteUserProfile = async (userID) => {
  if (!userID) {
    console.error("Error: No userID provided");
    return;
  }

  const userRef = doc(db, "users", userID);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Document exists, proceed with deletion
    console.log("Document exists, proceeding with deletion.");
    deleteUserProfile(userID);
  } else {
    console.log("No such document found for userID:", userID);
  }
};

// Function to fetch user profile from Firestore
// Function to fetch user profile from Firestore, including images
export const fetchUserProfile = async (contactId) => {
  try {
    const docRef = doc(db, 'contacts', contactId); // Use the correct collection and path
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data(); // Return the profile data (including images array)
    } else {
      console.log('No such document!');
      return null; // Return null if no document is found
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error; // Optionally throw the error if you want to handle it in the component
  }
};

export const uploadPhoto = async (uploadData, userID) => {
  try {
    console.log("Starting upload...");

    // Fetch the image as a blob
    const response = await fetch(uploadData.image.uri);
    const blob = await response.blob();

    // Create a storage reference in Firebase Storage
    const storageRef = ref(getStorage(), `images/${userID}/${Date.now()}.jpg`);

    // Upload the image to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob);

    // Get the download URL after the upload
    const downloadURL = await getDownloadURL(snapshot.ref);
    const { latitude = null, longitude = null, altitude = null, date = null } = 
    uploadData.image.metadata || {};

  // Add document to Firestore
  await addDoc(collection(db, "imginfo"), {
    userID,
    downloadURL,
    extractedText: uploadData.extractedText || '',  // Default to an empty string if missing
    metadata: {
      location: {
        latitude,      // Default to null if not provided
        longitude,     // Default to null if not provided
        altitude,      // Default to null if not provided
      },
      date,            // Default to null if not provided
    },
    timestamp: Date.now(),
  });

    console.log("Image, metadata, and extracted text uploaded successfully.");
    Alert.alert("Upload successful", "The photo, its metadata, and extracted text have been uploaded.");
    
  } catch (error) {
    console.error("Error uploading image:", error);
    Alert.alert("Error", "There was an issue uploading the photo. Please try again.");
  }
};

export const getCurrentUserID = () => {
  const user = auth.currentUser;
  return user ? user.uid : null; // Return the user ID if logged in, or null if not
};