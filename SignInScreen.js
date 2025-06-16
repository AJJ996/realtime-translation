import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LOGIN_ENDPOINT } from '../../config/config'; 

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(LOGIN_ENDPOINT, {
        email,
        password,
      });

      if (response.status === 200) {
        const user = response.data.user;

        if (user.isVerified) {
          // Navigate to Translate screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'TranslateScreen' }],
          });
        } else {
          // Not verified, send to Verify screen
          Alert.alert('Verify Your Email', 'Please verify your email to continue.');
          navigation.navigate('Verify', { email });
        }
      } else {
        Alert.alert('Sign In Failed', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.log('Sign In Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign In</Text>
      </LinearGradient>

      <View style={styles.body}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
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
          style={[styles.signInButton, loading && { opacity: 0.6 }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <LinearGradient
            colors={['#6a11cb', '#2575fc']}
            style={styles.signInGradient}
          >
            <Text style={styles.signInText}>
              {loading ? 'Signing In…' : 'Sign In'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.switchText}>
            Don't have an account? <Text style={styles.link}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignInScreen;

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
  signInButton: { marginTop: 10, borderRadius: 10, overflow: 'hidden' },
  signInGradient: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  signInText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  forgotText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#555',
  },
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


