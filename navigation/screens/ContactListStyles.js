const styles = {
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionItems: {
    marginTop: 10,
  },
  cardWrapper: {
    marginBottom: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center", // Center content vertically within the card
  },
  cardImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  cardAvatar: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardAvatarText: {
    fontSize: 22,
    color: "#fff",
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardPhone: {
    fontSize: 14,
    color: "#6b7280",
  },
  cardAction: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto", // Push the action (delete icon) to the right
    marginRight: 10, // Add a margin to avoid the icon being too close to the card edge
  },
  addButton: {
    position: "absolute",
    right: 10,
    backgroundColor: "#3b82f6",
    padding: 10,
    borderRadius: 20,
    elevation: 5,
    zIndex: 10, // Ensures it stays on top of other elements
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center", // Vertically center
    alignItems: "center", // Horizontally center
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    zIndex: 9999, // Ensure it's on top of other elements
    position: "absolute", // Ensure it's fixed on the screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Horizontally center the modal content
    zIndex: 10000, // Ensure the modal is above all elements
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // Make the border color more visible
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
    color: "#333", // Make sure text color is visible
    backgroundColor: "#f9f9f9", // Light background for visibility
  },
  noteInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    width: "75%", // Full width for the input
  },
  dropDownMenu: {
    marginBottom: 10,
  },
  mergeButton: {
    // paddingTop: 8, // Adjust top padding as needed
    // paddingBottom: 8, // Adjust bottom padding as needed
    padding: 20,
  },
};

export default styles;
