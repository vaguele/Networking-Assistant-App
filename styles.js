import { StyleSheet, Dimensions } from 'react-native';
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  authContainer: {
    flex: 1, // Ensure it fills the screen height
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center',    // Center content horizontally
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
    width: '100%', // Ensure it aligns with the input width
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Prevent black background
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default styles;
