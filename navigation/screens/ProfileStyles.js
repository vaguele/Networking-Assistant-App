import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingLeft: 24,
    marginBottom: 10,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#616d79',
    width: '30%',
  },
  profileInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  profile: {
    paddingVertical: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  profileAvatar: {
    display: 'flex',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9ca1ac',
    borderRadius: 8,
  },
  profileAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  profile2: {
    paddingVertical: 3,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  notesHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8, // Space between header and input
  },
  profileNotes: {
    flex: 1, // Make the Notes section take up the remaining space
    minHeight: 120, // Ensure it has some height
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  imagesContainer: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap', // Allow images to wrap if they exceed the screen width
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  imgInfoContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  imgInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});

export default styles;
