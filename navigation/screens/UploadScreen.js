import React, { useState } from "react";
import { View, Text, Button, Image, Alert, TextInput,ScrollView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { uploadPhoto } from '../../firebase'; // Import the updated upload function
import { getCurrentUserID } from '../../firebase'; // Import the function to get current user ID
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getApp } from 'firebase/app';
a
// Get the Firestore instance
const firestore = getFirestore(getApp());

const UploadPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [extractedText, setExtractedText] = useState(""); // State to hold extracted text
  const [newNote, setNewNote] = useState(''); // New note state

  // Function to pick an image from the gallery and perform OCR
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      exif: true,
    });

    if (result.canceled) {
      Alert.alert("No image selected!");
      return;
    }

    const imageUri = result.assets[0]?.uri;
    const exifData = result.assets[0]?.exif;

    if (!imageUri) {
      Alert.alert("Error: Unable to retrieve the image URI.");
      return;
    }

    const locationData = {
      latitude: exifData?.GPSLatitude,
      longitude: exifData?.GPSLongitude,
      altitude: exifData?.GPSAltitude,
      date: exifData?.DateTimeOriginal || exifData?.DateTime,
    };

    setSelectedImage({ uri: imageUri, metadata: locationData });
    await performOCR(result.assets[0]);
  };

  // Function to perform OCR on an image
  const performOCR = async (file) => {
    let myHeaders = new Headers();
    myHeaders.append("apikey", "FEmvQr5uj99ZUvk3essuYb6P5lLLBS20");

    let raw = file;
    let requestOptions = {
      method: "POST",
      redirect: "follow",
      headers: myHeaders,
      body: raw,
    };

    try {
      const response = await fetch("https://api.apilayer.com/image_to_text/upload", requestOptions);
      const result = await response.json();
      setExtractedText(result["all_text"] || "No text found");
    } catch (error) {
      console.log("OCR Error", error);
    }
  };

  const handleCreateNote = async () => {
    const userID = getCurrentUserID(); // Get the actual user ID
    if (userID && newNote.trim()) {
      try {
        await addDoc(collection(firestore, 'notes'), {
          note: newNote,
          userId: userID,
          timestamp: serverTimestamp(),
        });
        setNewNote(''); // Clear the note input after creating the note
        Alert.alert('Note created successfully');
      } catch (error) {
        console.error("Error creating note: ", error);
        Alert.alert('Error', 'Failed to create the note.');
      }
    } else {
      Alert.alert("Error", "Please enter a note content.");
    }
  };

  const handleUpload = () => {
    const userID = getCurrentUserID(); // Get the actual user ID

    if (userID && selectedImage) {
      const uploadData = {
        image: selectedImage,
        extractedText,
      };

      uploadPhoto(uploadData, userID);
    } else {
      Alert.alert("Please select a photo and make sure you're logged in!");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 5,
          paddingLeft: 10,
          marginBottom: 10,
          width: "95%",
        }}
        placeholder="Write a note..."
        value={newNote}
        onChangeText={setNewNote}
      />
      <ScrollView>
        <Button title="Create Note" onPress={handleCreateNote} />
        <Button title="Pick an Image" onPress={pickImage} />

        {selectedImage && (
          <View>
            <Image
              source={{ uri: selectedImage.uri }}
              style={{ width: 200, height: 200, marginVertical: 20 }}
            />
            <Text>
              Location: Latitude {selectedImage.metadata.latitude}, Longitude{" "}
              {selectedImage.metadata.longitude}
            </Text>
            <Text>Date: {selectedImage.metadata.date}</Text>
          </View>
        )}

        {extractedText && (
          <View style={{ marginVertical: 20 }}>
            <Text>Extracted Text:</Text>
            <Text>{extractedText}</Text>
          </View>
        )}

        <Button title="Upload" onPress={handleUpload} />
      </ScrollView>
    </View>
  );
};

export default UploadPage;
