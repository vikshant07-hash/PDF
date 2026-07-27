import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCall = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Kripya pehle koi phone number darj karein.');
      return;
    }

    const formattedNumber = `tel:${phoneNumber}`;

    Linking.canOpenURL(formattedNumber)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'Yeh device phone call support nahi karta hai.');
        } else {
          return Linking.openURL(formattedNumber);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>SIM Call App</Text>
        <Text style={styles.subtitle}>Number daalein aur SIM se call lagayein</Text>

        <TextInput
          style={styles.input}
          placeholder="Phone Number (jaise 9876543210)"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleCall}>
          <Text style={styles.buttonText}>Call Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
