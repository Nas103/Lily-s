import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../src/stores/authStore';
import { BRAND } from '../src/constants/brand';
import CountryPicker from '../src/components/CountryPicker';
import CountryCodePicker from '../src/components/CountryCodePicker';

export default function LoginScreen() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [countryCode, setCountryCode] = useState('+27');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!isLogin && !country) {
      Alert.alert('Error', 'Please select your country');
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        await login(email, password);
      } else {
        // Strip a leading 0 when a country code is present (matches profile).
        const cleanedPhoneNumber =
          phoneNumber.startsWith('0') && countryCode
            ? phoneNumber.substring(1)
            : phoneNumber;
        const phoneValue = cleanedPhoneNumber.trim()
          ? `${countryCode} ${cleanedPhoneNumber.trim()}`
          : undefined;
        await register(email, password, name, country, phoneValue);
      }
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorMessage = error?.message || error?.response?.data?.error || 'Something went wrong. Please try again.';
      Alert.alert('Error', errorMessage);
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{BRAND.name}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country</Text>
              <CountryPicker
                value={country}
                onValueChange={setCountry}
                placeholder="Select your country"
              />
            </View>
          )}

          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone</Text>
              <View style={styles.phoneContainer}>
                <CountryCodePicker
                  value={countryCode}
                  onValueChange={setCountryCode}
                />
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete={isLogin ? 'password' : 'password-new'}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchButtonText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  phoneInput: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#666666',
    fontSize: 14,
  },
});

