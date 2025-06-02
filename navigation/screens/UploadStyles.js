import { StyleSheet, Dimensions } from 'react-native';
const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  backButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginTop: 10,
  },
  noteInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    width: "100%", // Full width for the input
  },
});