import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { SIGNUP_ENDPOINT } from '../../config/config';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email || !username || !password) {
      return 'Please fill in all fields';
    }
    if (!emailRegex.test(email)) {
      return 'Enter a valid email address';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  };

  const handleSignUp = async () => {
    if (loading) return;

    const errorMessage = validateInputs();
    if (errorMessage) {
      Alert.alert('Error', errorMessage);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(SIGNUP_ENDPOINT, {
        email,
        username,
        password,
      });

      if (response.status === 201) {
        Alert.alert(
          'Success',
          'Account created! Check your email for the verification code.'
        );
        navigation.navigate('Verify', { email });
      } else {
        Alert.alert('Error', response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.log('SignUp error:', error.response?.data || error.message);
      Alert.alert(
        'Sign Up Failed',
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create Account</Text>
          </LinearGradient>

          <View style={styles.body}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, loading && { opacity: 0.6 }]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <LinearGradient
                colors={['#6a11cb', '#2575fc']}
                style={styles.signUpGradient}
              >
                <Text style={styles.signUpText}>
                  {loading ? 'Signing Up…' : 'Sign Up'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.orText}>or sign up with</Text>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.switchText}>
                Already have an account? <Text style={styles.link}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 40,
  },
  headerText: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  body: { paddingHorizontal: 30, marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  passwordInput: { flex: 1, paddingVertical: 10 },
  signUpButton: { marginTop: 10, borderRadius: 10, overflow: 'hidden' },
  signUpGradient: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  signUpText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  orText: { textAlign: 'center', marginVertical: 20, color: '#999' },
  socialContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  socialText: { fontWeight: 'bold' },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#555',
  },
  link: {
    color: '#5f77f2',
    fontWeight: 'bold',
  },
});

