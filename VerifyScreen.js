import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const VerifyScreen = () => {
  const [code, setCode] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params || {};

  useEffect(() => {
    if (!email) {
      Alert.alert('Missing email', 'Email is required to verify your account.');
      navigation.goBack();
    }
  }, [email]);

  const handleVerify = async () => {
    const trimmedCode = code.trim();

    if (!trimmedCode || trimmedCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit verification code.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.108:5001/api/auth/verify', {
        email,
        code: trimmedCode,
      });

      Alert.alert('Success', response.data.message, [
        { text: 'OK', onPress: () => navigation.navigate('SignIn') }
      ]);
    } catch (error) {
      console.error('Verification failed:', error);
      Alert.alert('Verification Failed', error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Verify Your Email</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.subtitle}>Enter the 6-digit code sent to {email}</Text>

        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          maxLength={6}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerify}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#6a11cb',
    paddingVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  body: {
    paddingHorizontal: 30,
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2e86de',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    alignSelf: 'center',
    marginTop: 20,
  },
  backText: {
    color: '#6a11cb',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


