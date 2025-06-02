import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Existing styles for notes section
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    marginTop: 20, // Adjusted for better spacing
  },
  notesContainer: {
    width: "100%", // Full width for the notes section
    padding: 10,
  },
  notesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
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
  notesList: {
    maxHeight: height * 0.4, // Limit height for the scroll view
  },
  noteCard: {
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Ensure the content is spaced out
    alignItems: "center", // Vertically center the content
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  noteContent: {
    flex: 1, // Take up available space
    marginRight: 10, // Add spacing between text and icons
  },
  iconContainer: {
    flexDirection: "column", // Stack the icons vertically
    justifyContent: "flex-start", // Align icons at the top
    alignItems: "flex-end", // Align the icons to the right side
  },
  imgIconContainer: {
    flexDirection: "column", // Stack the icons vertically
    justifyContent: "flex-start", // Align icons at the top
    alignItems: "center", // Align the icons to the right side
    marginTop: 10,
  },
  checkCircleIcon: {
    marginBottom: 5, // Add space between check-circle and trash
  },
  trashIcon: {
    marginTop: 5, // Optional spacing for trash icon
  },

  noteUsername: {
    fontWeight: "bold",
  },
  noteTimestamp: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },

  // Unique styles for image section
  imgSectionContainer: {
    width: "100%", // Ensure the section takes the full width
    padding: 15,
    marginTop: 20, // Add margin to separate from notes
    backgroundColor: "#f0f0f0", // Give the section a different background color
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  imgTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15, // Add space between title and image
  },
  img: {
    width: 150, // Set a fixed width to align the images to the left
    height: 150, // Set a fixed height for consistency
    borderRadius: 10,
    marginRight: 15, // Space between image and text
    resizeMode: "contain", // Ensure the image scales proportionally
    alignSelf: "flex-start", // Align the image to the left
  },
  imgTextContainer: {
    flexDirection: "column", // Arrange items in a column
    justifyContent: "center", // Center items vertically
    alignItems: "center", // Center items horizontally
    flex: 1, // Take up available space for consistent layout
    padding: 10, // Add some padding around the container
  },
  imgText: {
    fontSize: 14, // Ensure consistent font size
    color: "#555", // Neutral text color
    marginBottom: 5, // Add spacing between rows
    textAlign: "center", // Center align the text
  },

  // Modal-related styles
  modalContainer: {
    flex: 1,
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the content horizontally
    backgroundColor: "white",
    padding: 12,
    paddingTop: 35,
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 0,
    textAlign: "center",
    paddingTop: 10,
  },
  contactList: {
    flexGrow: 1, // Ensures the list takes up remaining space and scrolls if necessary
    justifyContent: "center", // Vertically center the contacts
    alignItems: "center", // Horizontally center the contacts
    paddingTop: 180,
    paddingBottom: 180,
  },
  contactItem: {
    padding: 10,
    margin: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: "80%", // Make contact items take up most of the width of the modal
    alignItems: "center", // Center the contact text
  },
  contactText: {
    fontSize: 18,
    textAlign: "center", // Center the text inside the contact item
  },
  imgInfoContainer: {
    padding: 10,
  },
  noteCard: {
    flexDirection: "row", // Align items in a row
    justifyContent: "space-between", // Ensure the content is spaced out
    alignItems: "center", // Vertically center the content
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  imgCard: {
    marginVertical: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderColor: "#dddddd",
    borderWidth: 1,
    borderRadius: 5,
  },
  img: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  imgText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  imgInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default styles;
