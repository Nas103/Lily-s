import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { deliveryAddressesAPI } from '../services/api';
import { DeliveryAddress } from '../types';
import { Ionicons } from '@expo/vector-icons';
import CountryCodePicker from './CountryCodePicker';

type DeliveryAddressFormProps = {
  address?: DeliveryAddress | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function DeliveryAddressForm({ address, onSuccess, onCancel }: DeliveryAddressFormProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    label: address?.label || '',
    fullName: address?.fullName || '',
    phone: address?.phone || '',
    countryCode: address?.phone?.split(' ')[0] || '+1',
    phoneNumber: address?.phone?.split(' ').slice(1).join(' ') || '',
    addressLine1: address?.addressLine1 || '',
    addressLine2: address?.addressLine2 || '',
    city: address?.city || '',
    state: address?.state || '',
    postcode: address?.postcode || '',
    country: address?.country || '',
    isDefault: address?.isDefault || false,
  });

  const handleSubmit = async () => {
    if (!formData.label || !formData.fullName || !formData.addressLine1 || !formData.city || !formData.postcode || !formData.country) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // Remove leading 0 from phone number when country code is present
      let phoneNumber = formData.phoneNumber?.trim() || '';
      if (phoneNumber && phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.substring(1);
      }
      const phone = phoneNumber ? `${formData.countryCode} ${phoneNumber}`.trim() : undefined;
      
      const addressData = {
        label: formData.label,
        fullName: formData.fullName,
        phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        city: formData.city,
        state: formData.state || undefined,
        postcode: formData.postcode,
        country: formData.country,
        isDefault: formData.isDefault,
      };

      if (address?.id) {
        await deliveryAddressesAPI.update(address.id, addressData);
      } else {
        await deliveryAddressesAPI.create(addressData);
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving address:', error);
      Alert.alert('Error', error?.response?.data?.error || error?.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>{address ? 'Edit Address' : 'Add Address'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Label *</Text>
          <TextInput
            style={styles.input}
            value={formData.label}
            onChangeText={(text) => setFormData({ ...formData, label: text })}
            placeholder="e.g., Home, Work"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="Recipient name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <View style={styles.phoneContainer}>
            <CountryCodePicker
              value={formData.countryCode}
              onValueChange={(code) => setFormData({ ...formData, countryCode: code })}
            />
            <TextInput
              style={[styles.input, styles.phoneInput]}
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address Line 1 *</Text>
          <TextInput
            style={styles.input}
            value={formData.addressLine1}
            onChangeText={(text) => setFormData({ ...formData, addressLine1: text })}
            placeholder="Street address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address Line 2</Text>
          <TextInput
            style={styles.input}
            value={formData.addressLine2}
            onChangeText={(text) => setFormData({ ...formData, addressLine2: text })}
            placeholder="Apartment, suite, etc. (optional)"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>City *</Text>
            <TextInput
              style={styles.input}
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="City"
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.input}
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
              placeholder="State/Province"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Postcode *</Text>
            <TextInput
              style={styles.input}
              value={formData.postcode}
              onChangeText={(text) => setFormData({ ...formData, postcode: text })}
              placeholder="Postcode"
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Country *</Text>
            <TextInput
              style={styles.input}
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text.toUpperCase() })}
              placeholder="Country"
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
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Address'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
  row: {
    flexDirection: 'row',
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  phoneInput: {
    flex: 1,
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
    borderColor: '#e5e5e5',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000000',
    borderColor: '#000000',
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

