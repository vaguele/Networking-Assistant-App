import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, TextInput, Button, Alert } from 'react-native';
import FeatherIcon from "react-native-vector-icons/Feather";
import { db, auth, updateOnAuthStateChanged } from "../../firebase";
import { collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc } from "firebase/firestore";
import styles from "./ContactListStyles";

export const handleAddProfile = async ({
  userId,
  newFirstName,
  newLastName,
  newPhone,
  newEmail,
  newCompany,
  selectedNotes, // Notes will be passed here
  setContacts,
  setFilteredContacts,
  setNewFirstName,
  setNewLastName,
  setNewPhone,
  setNewEmail,
  setNewCompany,
  setModalVisible,
}) => {
  if (!userId) return;

  if (
    newFirstName.trim() ||
    newLastName.trim() ||
    newPhone.trim() ||
    newEmail.trim() ||
    newCompany.trim()
  ) {
    const newContact = {
      userId,
      name: `${newFirstName} ${newLastName}`.trim() || "Unnamed Contact",
      phone: newPhone || "No Phone",
      email: newEmail || "No Email",
      company: newCompany || "No Company",
      notes: selectedNotes || [], // Use selected notes
      img: "",
    };

    try {
      const docRef = await addDoc(collection(db, "contacts"), newContact);
      setContacts((prevContacts) => [
        ...prevContacts,
        { ...newContact, id: docRef.id },
      ]);
      setFilteredContacts((prevContacts) => [
        ...prevContacts,
        { ...newContact, id: docRef.id },
      ]); // Update filtered list
      setNewFirstName("");
      setNewLastName("");
      setNewPhone("");
      setNewEmail("");
      setNewCompany("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding contact:", error);
    }
  }
};


const ContactList = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState([]); // For selecting contacts to merge

  useEffect(() => {
    const unsubscribe = updateOnAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("User ID changed:", userId); // Check if userId is correctly updated after login
    if (!userId) return;

    const fetchContacts = async () => {
      try {
        setLoading(true);
        const contactsRef = collection(db, "contacts");
        const q = query(contactsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        const fetchedContacts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            notes: Array.isArray(data.notes) ? data.notes.map(note => note.note || note) : [],
            id: doc.id,
          };
        });

        setContacts(fetchedContacts);
        setFilteredContacts(fetchedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };



    fetchContacts();
  }, [userId]);

  const handleAddProfile = async () => {
    if (!userId) return;

    

    if (
      newFirstName.trim() ||
      newLastName.trim() ||
      newPhone.trim() ||
      newEmail.trim() ||
      newCompany.trim() ||
      newNotes.trim()
    ) {
      const newContact = {
        userId,
        name: `${newFirstName} ${newLastName}`.trim() || "Unnamed Contact",
        phone: newPhone || "No Phone",
        email: newEmail || "No Email", // Default to "No Email" if newEmail is empty
        company: newCompany || "No Company",
        notes: newNotes || [],
        img: "",
      };

      try {
        const docRef = await addDoc(collection(db, "contacts"), newContact);
        console.log("Contact added with ID:", docRef.id);

        setContacts((prevContacts) => [
          ...prevContacts,
          { ...newContact, id: docRef.id },
        ]);
        setFilteredContacts((prevContacts) => [
          ...prevContacts,
          { ...newContact, id: docRef.id },
        ]);
        setNewFirstName("");
        setNewLastName("");
        setNewPhone("");
        setNewEmail("");
        setNewCompany("");
        setNewNotes("");
        setModalVisible(false);

      } catch (error) {
        console.error("Error adding contact:", error);
      }
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      // Confirm before deleting
      Alert.alert(
        "Delete Contact",
        "Are you sure you want to delete this contact?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              console.log(`Deleting contact with ID: ${contactId}`);
              await deleteDoc(doc(db, "contacts", contactId));
              // Update the local state after deletion
              setContacts((prevContacts) =>
                prevContacts.filter((contact) => contact.id !== contactId)
              );
              setFilteredContacts((prevContacts) =>
                prevContacts.filter((contact) => contact.id !== contactId)
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };


  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(
        contacts.filter((contact) =>
          Object.values(contact)
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      );
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts((prevSelected) => {
      if (prevSelected.includes(contactId)) {
        return prevSelected.filter((id) => id !== contactId);
      } else {
        return [...prevSelected, contactId];
      }
    });
  };

  // Initialize empty fields for merged contact
  const mergeContacts = async () => {
    if (selectedContacts.length < 2) return; // Ensure at least 2 contacts are selected
  
    // Get the selected contacts to merge
    const contactsToMerge = contacts.filter((contact) =>
      selectedContacts.includes(contact.id)
    );
  
    // Initialize empty fields for merged contact
    const mergedContact = {
      name: "",
      phone: "",
      email: "",
      company: "",
      notes: [],
      images: [], // Initialize an array to store merged images
      img: "",
    };
  
    // Merge the fields for all selected contacts
    contactsToMerge.forEach((contact, index) => {
      // Merge names with a separator ("/")
      mergedContact.name +=
        contact.name + (index < contactsToMerge.length - 1 ? "\n" : "");
  
      // Merge phone numbers, emails, and companies by joining them with spaces
      mergedContact.phone += contact.phone + "\n";
      mergedContact.email += contact.email + "\n";
      mergedContact.company += contact.company + "\n";
  
      // Merge notes into a single array, ensuring unique notes
      mergedContact.notes = [
        ...mergedContact.notes,
        ...(Array.isArray(contact.notes) ? contact.notes : [contact.notes]),
      ];
  
      // Merge images array, ensuring unique entries
      if (Array.isArray(contact.images)) {
        mergedContact.images = [
          ...mergedContact.images,
          ...contact.images.filter(
            (image) =>
              !mergedContact.images.some(
                (existingImage) => existingImage.downloadURL === image.downloadURL
              )
          ),
        ];
      }
  
      // Take the first available image for the `img` field if not already set
      if (!mergedContact.img && contact.img) {
        mergedContact.img = contact.img;
      }
    });
  
    // Make sure to trim extra spaces or separators
    mergedContact.phone = mergedContact.phone.trim();
    mergedContact.email = mergedContact.email.trim();
    mergedContact.company = mergedContact.company.trim();
    mergedContact.notes = mergedContact.notes.join("\n"); // Joining notes as a single string
  
    try {
      // Create a new contact with the merged information
      const newContactRef = await addDoc(collection(db, "contacts"), {
        userId,
        ...mergedContact,
      });
  
      // Add the new merged contact to the local state without removing the original ones
      setContacts((prevContacts) => [
        ...prevContacts,
        { ...mergedContact, id: newContactRef.id },
      ]);
      setFilteredContacts((prevContacts) => [
        ...prevContacts,
        { ...mergedContact, id: newContactRef.id },
      ]);
  
      // Clear the selected contacts after merge
      setSelectedContacts([]); // Clear the selected contacts
  
      Alert.alert(
        "Contacts Merged",
        "The selected contacts have been successfully merged."
      );
    } catch (error) {
      console.error("Error merging contacts:", error);
    }
  };
  

  const sections = useMemo(() => {
    const sectionsMap = filteredContacts.reduce((acc, item) => {
      if (!item || !item.name) return acc;
      const name = item.name || "Unnamed";
      const [lastName] = name.split(" ").reverse();
      const firstLetter = lastName[0].toUpperCase();
      acc[firstLetter] = [...(acc[firstLetter] || []), item];
      return acc;
    }, {});

    return Object.entries(sectionsMap)
      .map(([letter, items]) => ({
        letter,
        items,
      }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, [filteredContacts]);


  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={{ backgroundColor: "#f2f2f2" }}>
        <TextInput
          style={styles.noteInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {selectedContacts.length >= 2 && (
          <Button title="Merge Contacts" onPress={mergeContacts} />
        )}
        {filteredContacts.length === 0 ? (
          <Text>No contacts found</Text>
        ) : (
          sections.map(({ letter, items }) => (
            <View style={styles.section} key={letter}>
              <Text style={styles.sectionTitle}>{letter}</Text>
              <View style={styles.sectionItems}>
                {items.map(
                  ({ id, img, name, phone, email, company, notes }) => (
                    <View key={id} style={styles.cardWrapper}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("ProfileScreen", {
                            contact: {
                              img: img || null,
                            name: name || "Unnamed",
                            phone: phone || "No Phone",
                            email: email || "No Email",
                            notes: notes || [],
                            company: company || "No Company",
                            contactId: id || null, // Pass the contact ID here
                            },
                          })
                        }
                      >
                        <View style={styles.card}>
                          {img ? (
                            <Image
                              alt=""
                              resizeMode="cover"
                              source={{ uri: img }}
                              style={styles.cardImg}
                            />
                          ) : (
                            <View style={[styles.cardImg, styles.cardAvatar]}>
                              <Text style={styles.cardAvatarText}>
                                {name[0]}
                              </Text>
                            </View>
                          )}
                          <View style={styles.cardBody}>
                            <Text style={styles.cardTitle}>{name}</Text>
                            <Text style={styles.cardPhone}>{phone}</Text>
                            <Text style={styles.cardPhone}>
                              Contact ID: {id}
                            </Text>
                          </View>
                          <View style={styles.cardAction}>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("ProfileScreen", {
                                  contact: {
                                    id,
                                    name,
                                    phone,
                                    email,
                                    company,
                                    notes,
                                    img,
                                  },
                                })
                              }
                            >
                              <FeatherIcon
                                color="#9ca3af"
                                name="chevron-right"
                                size={22}
                              />
                            </TouchableOpacity>

                            {/* Add select button for merging */}
                            <TouchableOpacity
                              onPress={() => handleSelectContact(id)}
                              style={styles.mergeButton}
                            >
                              <FeatherIcon
                                name={
                                  selectedContacts.includes(id)
                                    ? "check-circle"
                                    : "circle"
                                }
                                size={22}
                                color={
                                  selectedContacts.includes(id)
                                    ? "#4caf50"
                                    : "#ccc"
                                }
                              />
                            </TouchableOpacity>

                            {/* Delete icon next to profile icon */}
                            <TouchableOpacity
                              onPress={() => handleDeleteContact(id)}
                              style={styles.deleteButton}
                            >
                              <FeatherIcon
                                name="trash"
                                size={22}
                                color="#ff4d4d"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )
                )}
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <FeatherIcon name="plus" size={30} color="#fff" />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
            <TextInput
                style={styles.input}
                placeholder="Enter First Name (Optional)"
                value={newFirstName}
                onChangeText={setNewFirstName}
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Last Name (Optional)"
                value={newLastName}
                onChangeText={setNewLastName}
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Phone Number (Optional)"
                value={newPhone}
                onChangeText={setNewPhone}
                placeholderTextColor="#888"
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Email (Optional)"
                value={newEmail}
                onChangeText={setNewEmail}
                placeholderTextColor="#888"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Company Name (Optional)"
                value={newCompany}
                onChangeText={setNewCompany}
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Notes (Optional)"
                value={newNotes}
                onChangeText={setNewNotes}
                placeholderTextColor="#888"
              />
               <Text style={styles.previewNotes}>
                Preview: {Array.isArray(newNotes) ? newNotes.join(", ") : newNotes}
              </Text>
              <Button title="Add Contact" onPress={handleAddProfile} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ContactList;
