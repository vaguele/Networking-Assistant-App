import React, { useEffect, useState } from 'react';
import { Platform, View, Text, Button, TextInput, ScrollView, TouchableOpacity, Alert, Modal, SafeAreaView, Image, StyleSheet, } from 'react-native';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, getDoc, doc, updateDoc, query, where, serverTimestamp } from 'firebase/firestore';
import FeatherIcon from "react-native-vector-icons/Feather";
import { handleAddProfile } from "./ContactList";
import styles from './HomeScreenStyles';

// Firebase initialization
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

const firestore = getFirestore(app);

// Function to copy notes to a contact
const copyNotesToContact = async (noteId, contactId) => {
  try {
    const noteDocRef = doc(firestore, "notes", noteId);
    const noteDocSnap = await getDoc(noteDocRef);

    if (!noteDocSnap.exists()) {
      Alert.alert("Error", "Note not found!");
      return;
    }

    const noteData = noteDocSnap.data();

    const contactDocRef = doc(firestore, "contacts", contactId);
    const contactDocSnap = await getDoc(contactDocRef);

    if (!contactDocSnap.exists()) {
      Alert.alert("Error", "Contact not found!");
      return;
    }

    const contactData = contactDocSnap.data();
    const existingNotes = contactData.notes || [];

    const updatedNotes = [...existingNotes, noteData];

    await updateDoc(contactDocRef, { notes: updatedNotes });

    
  } catch (error) {
    console.error("Error copying note to contact:", error);
    
  }
};

const HomeScreen = ({ user, handleLogout }) => {
  const [noteId, setNoteId] = useState('');
  const [contactId, setContactId] = useState('');
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedNotes, setSelectedNotes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState([]); // State to store contacts
  const [showContactModal, setShowContactModal] = useState(false); // Modal for contact selection
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null); // Store selected contact
  const [filteredImgInfo, setImageInfo] = useState([]);
  const [selectedImgInfo, setSelectedImgInfo] = useState({});
  const [imgInfo, setImgInfo] = useState([]); // State to store imginfo data

  const handleCreateNewContact = async () => {
    if (selectedNotes && Object.keys(selectedNotes).length === 0 && 
        selectedImgInfo && Object.keys(selectedImgInfo).length === 0) {
      if (Platform.OS === "web") {
        alert("Error\nPlease select at least one note or image.");
      } else {
        Alert.alert("Error", "Please select at least one note or image.");
      }
      return;
    }
  
    try {
      // Create a new contact document in Firestore
      const contactRef = await addDoc(collection(firestore, "contacts"), {
        name: "New Contact", // Replace with user input if needed
        userId: user.uid,
        notes: [], // Initialize an empty notes array
        images: [], // Initialize an empty images array
      });
  
      const newContactId = contactRef.id;
  
      // Add selected notes to the new contact
      const selectedNoteIds = Object.keys(selectedNotes).filter(
        (noteId) => selectedNotes[noteId]
      );
      const newNotes = [];
      for (const noteId of selectedNoteIds) {
        const noteDocRef = doc(firestore, "notes", noteId);
        const noteDocSnap = await getDoc(noteDocRef);
        if (noteDocSnap.exists()) {
          newNotes.push(noteDocSnap.data());
        }
      }
  
      // Add selected images to the new contact
      const selectedImgIds = Object.keys(selectedImgInfo).filter(
        (imgId) => selectedImgInfo[imgId]
      );
      const newImages = [];
      for (const imgId of selectedImgIds) {
        const imgDocRef = doc(firestore, "imginfo", imgId);
        const imgDocSnap = await getDoc(imgDocRef);
        if (imgDocSnap.exists()) {
          newImages.push(imgDocSnap.data());
        }
      }
  
      // Update the new contact with notes and images
      await updateDoc(contactRef, { notes: newNotes, images: newImages });
  
      // Reset states
      setShowContactModal(false);
      setSelectedNotes({});
      setSelectedImgInfo({});
      setContactId(newContactId);
  
      Alert.alert("Success", "New contact created with notes and images!");
    } catch (error) {
      console.error("Error creating contact or adding data:", error);
      if (Platform.OS === "web") {
        alert("Error\nFailed to create contact with notes and images.");
      } else {
        Alert.alert("Error", "Failed to create contact with notes and images.");
      }
    }
  };
  
  
  useEffect(() => {
    
    if (user) {
      // Fetch notes associated with the user
      const notesCollection = collection(firestore, 'notes');
      const unsubscribeNotes = onSnapshot(notesCollection, (snapshot) => {
        const fetchedNotes = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate().toLocaleString(), // Format timestamp
          }))
          .filter((note) => note.userId === user.uid); // Filter notes for the current user
        setNotes(fetchedNotes);
        setFilteredNotes(fetchedNotes);

      });

      // Fetch contacts associated with the user
      const contactsCollection = collection(firestore, 'contacts');
      const contactsQuery = query(contactsCollection, where("userId", "==", user.uid)); // Only get contacts for the current user
      const unsubscribeContacts = onSnapshot(contactsQuery, (snapshot) => {
        const fetchedContacts = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setContacts(fetchedContacts);

      });
      const imgInfoCollection = collection(firestore, 'imginfo');
      const imgInfoQuery = query(imgInfoCollection, where("userID", "==", user.uid));
      const unsubscribeImgInfo = onSnapshot(imgInfoQuery, (snapshot) => {
        const fetchedImgInfo = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setImgInfo(fetchedImgInfo); // Store the fetched imginfo data
        console.log(fetchedImgInfo);
        console.log("Current User UID:", user?.uid);

      });
      return () => {
        unsubscribeNotes();
        unsubscribeContacts();
        unsubscribeImgInfo();
      };
    }
  }, [user]);
  const handleSelect = (id, type) => {
    if (type === "note") {
      setSelectedNotes((prevSelected) => ({
        ...prevSelected,
        [id]: !prevSelected[id],
      }));
    } else if (type === "img") {
      setSelectedImgInfo((prevSelected) => ({
        ...prevSelected,
        [id]: !prevSelected[id],
      }));
    }
  };
  const handleDeleteImgInfo = async (imgId) => {
    const imgDocRef = doc(firestore, 'imginfo', imgId);
    try {
      await deleteDoc(imgDocRef);
      setImgInfo((prevImgInfo) => prevImgInfo.filter((img) => img.id !== imgId));
    } catch (error) {
      console.error("Error deleting image metadata: ", error);
    }
  };
  

  const handleAddNote = async () => {
    if (newNote && user) {
      try {
        const docRef = await addDoc(collection(firestore, "notes"), {
          username: user.displayName || "Anonymous",
          note: newNote,
          userId: user.uid,
          timestamp: serverTimestamp(), // Add server timestamp
        });
        setNewNote(''); // Clear the input field after adding a note
        const newNoteData = {
          id: docRef.id,
          username: user.displayName || "Anonymous",
          note: newNote,
          userId: user.uid,
          timestamp: new Date().toLocaleString(), // Add a local timestamp for immediate UI feedback
      };
      // Directly update the local state
      setNotes((prevNotes) => [newNoteData, ...prevNotes]);
      setFilteredNotes((prevNotes) => [newNoteData, ...prevNotes]);
      } catch (error) {
        console.error("Error adding note: ", error);
      }
    }
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(
        notes.filter((note) =>
          note.note.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };
  const handleCopyNote = async () => {
    if (!contactId) {
      if (Platform.OS === "web") {
          alert("Error\nPlease select a Contact.");
      } else {
          Alert.alert("Error", "Please select a Contact.");
      }
      return;
  }
  
    // Handle Notes
    const selectedNoteIds = Object.keys(selectedNotes).filter(noteId => selectedNotes[noteId]);
    const selectedImgIds = Object.keys(selectedImgInfo).filter(imgId => selectedImgInfo[imgId]);
    
  
    // Copy selected notes to the contact
    for (const noteId of selectedNoteIds) {
      await copyNotesToContact(noteId, contactId);
    }
  
    // Copy selected images to the contact
    for (const imgId of selectedImgIds) {
      const imgDocRef = doc(firestore, 'imginfo', imgId);
      const imgSnapshot = await getDoc(imgDocRef);
  
      if (imgSnapshot.exists()) {
        const imgData = imgSnapshot.data();
  
        // Get the contact document
        const contactDocRef = doc(firestore, "contacts", contactId);
        const contactDocSnap = await getDoc(contactDocRef);
        if (contactDocSnap.exists()) {
          const contactData = contactDocSnap.data();
          const existingImages = contactData.images || [];
  
          const updatedImages = [...existingImages, imgData];
  
          // Update the contact with the new image
          await updateDoc(contactDocRef, { images: updatedImages });
  
          
        }
      }
    }
  
    // Show success alert after copying both notes and images
    Alert.alert("Success", "Selected notes and images have been successfully copied to the contact!");
  };
  

  const handleDeleteNote = async (noteId) => {
    const noteDocRef = doc(firestore, 'notes', noteId);
    const noteSnapshot = await getDoc(noteDocRef);
    if (noteSnapshot.exists() && noteSnapshot.data().userId === user.uid) {
      try {
        await deleteDoc(noteDocRef);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        setFilteredNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== noteId)
        );
      } catch (error) {
        console.error("Error deleting note: ", error);
      }
    } else {
      console.warn("You can only delete your own notes.");
    }
  };
 
  return (
    <View style={styles.container}>
      
      <Button title="Logout" onPress={handleLogout} color="#e74c3c" />
      <Button
        title="Select Contact"
        onPress={() => setShowContactModal(true)}
      />
      {contactId && (
        <Text style={styles.selectedContactText}>
          Selected Contact : {contactId}
        </Text>
      )}
      {/* <Button title="Link Note to Profile" onPress={handleCopyNote} /> */}
      <View style={styles.notesContainer}>
        <Text style={styles.notesTitle}>Search</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <Text style={styles.notesTitle}>Notes</Text>
      <ScrollView style={styles.noteInput}>
        {filteredNotes.length === 0 ? (
          <Text>No notes found</Text>
        ) : (
          filteredNotes.map((note) => (
            <Note
              key={note.id}
              note={note}
              user={user}
              selected={selectedNotes[note.id]}
              onSelect={() => handleSelect(note.id, "note")}
              onDelete={handleDeleteNote}
            />
          ))
        )}
        {imgInfo.length === 0 ? (
          <Text>No image information available</Text>
        ) : (
          imgInfo.map((img) => (
            <View key={img.id} style={styles.imgCard}>
              {/* Display the image */}
              <Image source={{ uri: img.downloadURL }} style={styles.img} />
              <View style={styles.imgtextContainer}>
                {/* Display extracted text (if any) */}
                <Text style={styles.imgText}>
                  Text from image:{img.extractedText || "No text found"}
                </Text>

                {/* Display metadata date */}
                <Text style={styles.imgText}>
                  Date: {img.metadata?.date || "N/A"}
                </Text>

                {/* Display location details */}
                <Text style={styles.imgText}>
                  Latitude:
                  {img.metadata?.location
                    ? `${img.metadata.location.latitude}`
                    : "N/A"}
                </Text>
                <Text style={styles.imgText}>
                  Longitude:
                  {img.metadata?.location
                    ? `${img.metadata.location.longitude}`
                    : "N/A"}
                </Text>
                <Text style={styles.imgText}>
                  Altitude: {img.metadata?.location?.altitude || "N/A"} meters
                </Text>
              </View>
              <View style={styles.imgIconContainer}>
                <TouchableOpacity
                  onPress={() => handleSelect(img.id, "img")}
                  style={styles.checkCircleIcon}
                >
                  <FeatherIcon
                    name={selectedImgInfo[img.id] ? "check-circle" : "circle"}
                    size={22}
                    color={selectedImgInfo[img.id] ? "#4caf50" : "#ccc"}
                  />
                </TouchableOpacity>
                {user?.uid === img.userID && (
                  <TouchableOpacity
                    onPress={() => handleDeleteImgInfo(img.id)}
                    style={styles.trashIcon}
                  >
                    <FeatherIcon name="trash" size={22} color="#ff4d4d" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal for selecting a contact */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select a Contact</Text>
          <TouchableOpacity>
            <Text style={styles.contactItem} onPress={handleCreateNewContact}>
              Create a New Contact
            </Text>
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.contactList}>
            {contacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactItem}
                onPress={() => {
                  // If the clicked contact is already selected, deselect it
                  setContactId((prevContactId) => (prevContactId === contact.id ? null : contact.id));
                }}
              >
                <Text style={styles.contactText}>Name: {contact.name}</Text>
                <Text style={styles.contactText}>Contact ID: {contact.id}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {contactId && (
            <>
              <Text style={styles.selectedContactText}>
                Selected Contact: {contactId}
              </Text>
              <Button title="Link Note to Profile" onPress={handleCopyNote} />
            </>
          )}
          <Button title="Close" onPress={() => setShowContactModal(false)} />
        </View>
      </Modal>
    </View>
  );
};

const Note = ({ note, user, selected, onSelect, onDelete }) => {
  const { id, username, note: content, userId, timestamp } = note;

  return (
    <View style={styles.noteCard}>
      <View>
        <Text style={styles.noteUsername}>Note ID: {id}</Text>
        <Text style={styles.noteContent}>
          {content || "No content available"}
        </Text>
        <Text style={styles.noteTimestamp}>Created: {timestamp || "N/A"}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          onPress={() => onSelect(id)}
          style={styles.checkCircleIcon}
        >
          <FeatherIcon
            name={selected ? "check-circle" : "circle"}
            size={22}
            color={selected ? "#4caf50" : "#ccc"}
          />
        </TouchableOpacity>
        {user && user.uid === userId && (
          <TouchableOpacity
            onPress={() => onDelete(id)}
            style={styles.trashIcon}
          >
            <FeatherIcon name="trash" size={22} color="#ff4d4d" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};



export default HomeScreen;
