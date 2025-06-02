import React, { useState, useLayoutEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { fetchUserProfile, updateUserProfile } from '../../firebase'; // Import Firestore functions
import styles from './ProfileStyles';

// Format phone number for display
const formatPhoneNumber = (number) => {
  let cleaned = ('' + number).replace(/\D/g, '');
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}`;
  } else {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  }
};

export default function ProfileScreen({ route, navigation }) {
  const { contact = {} } = route.params || {}; // Ensure contact is an object, even if no params are passed
  
  const user = getAuth().currentUser;
  

  // Initialize state with fallback values from contact
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(contact.name || ''); // Use the name directly from contact
  const [phone, setPhone] = useState(contact.phone || '');
  const [email, setEmail] = useState(contact.email || '');  // Default to empty string if email is missing
  const [company, setCompany] = useState(contact.company || '');
  const [notes, setNotes] = useState(contact.notes || []);
  const [img, setImg] = useState(contact.img || null);
  const [images, setImages] = useState([]); // Store images in state
// Fetch profile data from Firestore
const fetchProfile = async (contactId) => {
  try {
    if (contactId) {
      const contactProfile = await fetchUserProfile(contactId);
      if (contactProfile) {
        setName(contactProfile.name || ''); // Set full name from the contact profile
        setPhone(contactProfile.phone || '');
        setEmail(contactProfile.email || '');
        setCompany(contactProfile.company || '');
        setNotes(contactProfile.notes || []);
        setImg(contactProfile.img || null);
        setImages(contactProfile.images || []); // Set the images field
        console.log('Images:', contactProfile.images); // Debugging
      } else {
        console.log('No contact profile found.');
      }
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};


// Refresh profile data when screen is focused
useFocusEffect(
  useCallback(() => {
    const { contactId } = contact;
      if (contactId) {
        fetchProfile(contactId); 
    } 
  }, [contact, user]) // Trigger only when `contact` or `user` changes
);

  const handleSave = () => {
    setIsEditing(false);
    if (user) {
      updateUserProfile(
        user.uid,
        name.trim(),
        formatPhoneNumber(phone),
        email.trim(),
        company.trim(),
        notes.trim()
      )
        .then(() => {
          Alert.alert("Profile Updated", "Your profile has been successfully updated.");
        })
        .catch((error) => {
          Alert.alert("Error", "Failed to update profile. Please try again.");
          console.error(error);
        });
    } else {
      Alert.alert("Error", "No user logged in");
    }
  };

  const handleCancel = () => {
    fetchProfile(contact.contactId); // Revert to the latest Firestore data
    setIsEditing(false);
  };

  const handlePhoneChange = (text) => {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setPhone(cleaned);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', paddingRight: 20 }}>
          {isEditing && (
            <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
          {isEditing && (
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
          {!isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={{ color: 'blue', marginRight: 10 }}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, isEditing]);

  return (
    <SafeAreaView style={{ backgroundColor: '#f2f2f2', flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profile}>
        {img ? (
          <Image source={{ uri: img }} style={styles.profileImg} />
        ) : (
          <View style={[styles.profileImg, styles.profileAvatar]}>
            <Text style={styles.profileAvatarText}>
              {name[0]}
            </Text>
          </View>
        )}
        </View>

        <View style={styles.profile2}>
        {isEditing ? (
          <>
             <View style={styles.section}>
                <Text style={styles.sectionTitle}>Name:</Text>
                <TextInput
                  style={styles.profileInput}
                  value={name}
                  onChangeText={setName} // Edit full name directly
                  placeholder="Enter Full Name"
                />
              </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phone Number:</Text>
              <TextInput
                style={styles.profileInput}
                value={phone}
                onChangeText={handlePhoneChange}
                keyboardType="numeric"
                placeholder="Enter Phone Number"
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Email:</Text>
              <TextInput
                style={styles.profileInput}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Enter Email"
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Company:</Text>
              <TextInput
                style={styles.profileInput}
                value={company}
                onChangeText={setCompany}
                placeholder="Enter Company"
              />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes:</Text>
              <TextInput
                style={styles.profileNotesInput}
                value={notes}
                onChangeText={setNotes}
                multiline={true}
                placeholder="Enter Notes"
              />
            </View>
          </>
        ) : (
          <>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Name:</Text>
                <Text style={styles.profileInput}>{name || 'Enter Full Name'}</Text> {/* Display full name */}
              </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phone Number:</Text>
              <Text style={styles.profileInput}>
                {formatPhoneNumber(phone) || 'Enter Phone Number'}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Email:</Text>
              <Text style={styles.profileInput}>{email || 'Enter Email'}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Company:</Text>
              <Text style={styles.profileInput}>{company || 'Enter Company'}</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes:</Text>
              {Array.isArray(notes) && notes.length > 0 ? (
                notes.map((note, index) => (
                  <Text key={index} style={styles.profileNotesText}>
                    {note.note || JSON.stringify(note)}
                  </Text>
                ))
              ) : (
                <Text style={styles.profileNotesText}>
                  {typeof notes === 'string' ? notes : 'No notes available'}
                </Text>
              )}
            </View>
          </>
        )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Image Info:</Text>
          {images.length > 0 ? (
            images.map((img, index) => (
              <View key={index} style={styles.imgInfoContainer}>
                {/* Check if the image URL exists */}
                {img.downloadURL ? (
                  <Image
                  source={{ uri: img.downloadURL }}
                  style={[styles.profileImage, { resizeMode: 'contain' }]}
                />
                ) : (
                  <Text>No image URL available</Text> // Fallback text if no URL
                )}
            
                <Text style={styles.imgInfoText}>Extracted Text: {img.extractedText}</Text>
                <Text style={styles.imgInfoText}>Metadata: {JSON.stringify(img.metadata)}</Text>
              </View>
            ))
          ) : (
            <Text>No image info available.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
