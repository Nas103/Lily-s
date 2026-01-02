import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { paymentMethodsAPI } from '../services/api';
import { PaymentMethod } from '../types';
import { Ionicons } from '@expo/vector-icons';

type PaymentMethodFormProps = {
  paymentMethod?: PaymentMethod | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function PaymentMethodForm({ paymentMethod, onSuccess, onCancel }: PaymentMethodFormProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: (paymentMethod?.type || 'CARD') as 'CARD' | 'BANK_ACCOUNT' | 'E_WALLET',
    cardNumber: '',
    expiryMonth: paymentMethod?.expiryMonth?.toString() || '',
    expiryYear: paymentMethod?.expiryYear?.toString() || '',
    holderName: paymentMethod?.holderName || '',
    isDefault: paymentMethod?.isDefault || false,
  });

  const handleSubmit = async () => {
    if (formData.type === 'CARD') {
      if (!formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.holderName) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }

      // Extract last 4 digits and brand (secure - only store last 4)
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      const cardLast4 = cardNumber.slice(-4);
      
      // Detect card brand securely (only using first digit)
      let cardBrand = 'VISA';
      const firstDigit = cardNumber.charAt(0);
      if (firstDigit === '5' || firstDigit === '2') cardBrand = 'MASTERCARD';
      if (firstDigit === '3') cardBrand = 'AMEX';
      if (firstDigit === '4') cardBrand = 'VISA';
      if (firstDigit === '6') cardBrand = 'DISCOVER';
      
      // Security: Never store full card number, only last 4 digits
      // Full card details should be processed by payment gateway (PayFast)

      try {
        setLoading(true);
        const methodData = {
          type: formData.type,
          cardLast4,
          cardBrand,
          expiryMonth: parseInt(formData.expiryMonth),
          expiryYear: parseInt(formData.expiryYear),
          holderName: formData.holderName,
          isDefault: formData.isDefault,
        };

        await paymentMethodsAPI.create(methodData);
        onSuccess();
      } catch (error: any) {
        console.error('Error saving payment method:', error);
        Alert.alert('Error', error?.response?.data?.error || error?.message || 'Failed to save payment method');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Info', 'Only card payments are currently supported');
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Number *</Text>
          <TextInput
            style={styles.input}
            value={formData.cardNumber}
            onChangeText={(text) => setFormData({ ...formData, cardNumber: formatCardNumber(text) })}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Expiry Month *</Text>
            <TextInput
              style={styles.input}
              value={formData.expiryMonth}
              onChangeText={(text) => setFormData({ ...formData, expiryMonth: text.replace(/\D/g, '').slice(0, 2) })}
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Expiry Year *</Text>
            <TextInput
              style={styles.input}
              value={formData.expiryYear}
              onChangeText={(text) => setFormData({ ...formData, expiryYear: text.replace(/\D/g, '').slice(0, 4) })}
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cardholder Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.holderName}
            onChangeText={(text) => setFormData({ ...formData, holderName: text })}
            placeholder="Name on card"
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
        >
          <View style={[styles.checkbox, formData.isDefault && styles.checkboxChecked]}>
            {formData.isDefault && <Ionicons name="checkmark" size={16} color="#ffffff" />}
          </View>
          <Text style={styles.checkboxLabel}>Set as default payment method</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Add Payment Method'}
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

