import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useAuth } from '../src/stores/authStore';
import { deliveryAddressesAPI } from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';

// Common country codes
const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA' },
  { code: '+27', country: 'ZA' },
  { code: '+44', country: 'GB' },
  { code: '+61', country: 'AU' },
  { code: '+33', country: 'FR' },
  { code: '+49', country: 'DE' },
  { code: '+971', country: 'AE' },
  { code: '+966', country: 'SA' },
  { code: '+254', country: 'KE' },
  { code: '+234', country: 'NG' },
];

interface DeliveryAddress {
  id?: string;
  label: string;
  fullName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  isDefault: boolean;
}

export default function DeliveryAddressFormScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCountryCodePicker, setShowCountryCodePicker] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+27');
  const [formData, setFormData] = useState<DeliveryAddress>({
    label: '',
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    isDefault: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (id) {
      loadAddress();
    }
  }, [id, isAuthenticated]);

  const loadAddress = async () => {
    try {
      setLoading(true);
      const addresses = await deliveryAddressesAPI.getAll();
      const address = addresses.find((a: any) => a.id === id);
      if (address) {
        setFormData({
          label: address.label || '',
          fullName: address.fullName || '',
          phone: address.phone || '',
          addressLine1: address.addressLine1 || '',
          addressLine2: address.addressLine2 || '',
          city: address.city || '',
          state: address.state || '',
          postcode: address.postcode || '',
          country: address.country || '',
          isDefault: address.isDefault || false,
        });
        // Extract country code from phone if present
        if (address.phone) {
          const codeMatch = address.phone.match(/^(\+\d{1,4})/);
          if (codeMatch) {
            setSelectedCountryCode(codeMatch[1]);
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Failed to load address');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.label.trim()) {
      Alert.alert('Validation Error', 'Label is required');
      return;
    }
    if (!formData.fullName.trim()) {
      Alert.alert('Validation Error', 'Full name is required');
      return;
    }
    if (!formData.addressLine1.trim()) {
      Alert.alert('Validation Error', 'Address line 1 is required');
      return;
    }
    if (!formData.city.trim()) {
      Alert.alert('Validation Error', 'City is required');
      return;
    }
    if (!formData.postcode.trim()) {
      Alert.alert('Validation Error', 'Postcode is required');
      return;
    }
    if (!formData.country.trim()) {
      Alert.alert('Validation Error', 'Country is required');
      return;
    }

    try {
      setSaving(true);
      const phoneWithCode = formData.phone
        ? `${selectedCountryCode}${formData.phone.replace(/^\+\d{1,4}/, '')}`
        : undefined;

      const addressData = {
        ...formData,
        phone: phoneWithCode,
      };

      if (id) {
        await deliveryAddressesAPI.update(id, addressData);
      } else {
        await deliveryAddressesAPI.create(addressData);
      }

      Alert.alert('Success', 'Address saved successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to save address';
      Alert.alert('Error', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>{id ? 'Edit Address' : 'Add Address'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Label *</Text>
          <TextInput
            style={styles.input}
            value={formData.label}
            onChangeText={(text) => setFormData({ ...formData, label: text })}
            placeholder="e.g., Home, Work, Office"
            maxLength={50}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="Recipient full name"
            maxLength={100}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneContainer}>
            <TouchableOpacity
              style={styles.countryCodeButton}
              onPress={() => setShowCountryCodePicker(!showCountryCodePicker)}
            >
              <Text style={styles.countryCodeText}>{selectedCountryCode}</Text>
              <Ionicons name="chevron-down" size={16} color="#000000" />
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.phoneInput]}
              value={formData.phone?.replace(/^\+\d{1,4}/, '') || ''}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Phone number"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
          {showCountryCodePicker && (
            <View style={styles.countryCodePicker}>
              <ScrollView style={styles.countryCodeList}>
                {COUNTRY_CODES.map((item) => (
                  <TouchableOpacity
                    key={item.code}
                    style={[
                      styles.countryCodeItem,
                      selectedCountryCode === item.code && styles.countryCodeItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedCountryCode(item.code);
                      setShowCountryCodePicker(false);
                    }}
                  >
                    <Text style={styles.countryCodeItemText}>
                      {item.code} ({item.country})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address Line 1 *</Text>
          <TextInput
            style={styles.input}
            value={formData.addressLine1}
            onChangeText={(text) => setFormData({ ...formData, addressLine1: text })}
            placeholder="Street address"
            maxLength={200}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address Line 2</Text>
          <TextInput
            style={styles.input}
            value={formData.addressLine2}
            onChangeText={(text) => setFormData({ ...formData, addressLine2: text })}
            placeholder="Apartment, suite, etc. (optional)"
            maxLength={200}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="City"
              maxLength={100}
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>State/Province</Text>
            <TextInput
              style={styles.input}
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              placeholder="State"
              maxLength={100}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Postcode *</Text>
            <TextInput
              style={styles.input}
              value={formData.postcode}
              onChangeText={(text) => setFormData({ ...formData, postcode: text })}
              placeholder="Postcode"
              maxLength={20}
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Country *</Text>
            <TextInput
              style={styles.input}
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text.toUpperCase() })}
              placeholder="Country code (e.g., ZA, US)"
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
        >
          <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
            {formData.isDefault && <Ionicons name="checkmark" size={16} color="#ffffff" />}
          </View>
          <Text style={styles.checkboxLabel}>Set as default address</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Address</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
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
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    minWidth: 80,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#000000',
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
  },
  countryCodePicker: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  countryCodeList: {
    maxHeight: 200,
  },
  countryCodeItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  countryCodeItemSelected: {
    backgroundColor: '#f5f5f5',
  },
  countryCodeItemText: {
    fontSize: 14,
    color: '#000000',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000000',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

