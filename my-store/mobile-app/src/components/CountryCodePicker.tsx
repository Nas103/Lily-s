import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Common country codes
const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+32', country: 'BE', flag: '🇧🇪' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
  { code: '+43', country: 'AT', flag: '🇦🇹' },
  { code: '+45', country: 'DK', flag: '🇩🇰' },
  { code: '+46', country: 'SE', flag: '🇸🇪' },
  { code: '+47', country: 'NO', flag: '🇳🇴' },
  { code: '+358', country: 'FI', flag: '🇫🇮' },
  { code: '+351', country: 'PT', flag: '🇵🇹' },
  { code: '+353', country: 'IE', flag: '🇮🇪' },
  { code: '+48', country: 'PL', flag: '🇵🇱' },
  { code: '+420', country: 'CZ', flag: '🇨🇿' },
  { code: '+36', country: 'HU', flag: '🇭🇺' },
  { code: '+40', country: 'RO', flag: '🇷🇴' },
  { code: '+30', country: 'GR', flag: '🇬🇷' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+64', country: 'NZ', flag: '🇳🇿' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+974', country: 'QA', flag: '🇶🇦' },
  { code: '+965', country: 'KW', flag: '🇰🇼' },
  { code: '+973', country: 'BH', flag: '🇧🇭' },
  { code: '+968', country: 'OM', flag: '🇴🇲' },
  { code: '+961', country: 'LB', flag: '🇱🇧' },
  { code: '+962', country: 'JO', flag: '🇯🇴' },
  { code: '+20', country: 'EG', flag: '🇪🇬' },
  { code: '+212', country: 'MA', flag: '🇲🇦' },
  { code: '+234', country: 'NG', flag: '🇳🇬' },
  { code: '+254', country: 'KE', flag: '🇰🇪' },
  { code: '+256', country: 'UG', flag: '🇺🇬' },
  { code: '+255', country: 'TZ', flag: '🇹🇿' },
  { code: '+250', country: 'RW', flag: '🇷🇼' },
  { code: '+233', country: 'GH', flag: '🇬🇭' },
  { code: '+225', country: 'CI', flag: '🇨🇮' },
  { code: '+221', country: 'SN', flag: '🇸🇳' },
  { code: '+213', country: 'DZ', flag: '🇩🇿' },
  { code: '+216', country: 'TN', flag: '🇹🇳' },
  { code: '+218', country: 'LY', flag: '🇱🇾' },
  { code: '+249', country: 'SD', flag: '🇸🇩' },
  { code: '+251', country: 'ET', flag: '🇪🇹' },
  { code: '+252', country: 'SO', flag: '🇸🇴' },
  { code: '+253', country: 'DJ', flag: '🇩🇯' },
  { code: '+257', country: 'BI', flag: '🇧🇮' },
  { code: '+258', country: 'MZ', flag: '🇲🇿' },
  { code: '+260', country: 'ZM', flag: '🇿🇲' },
  { code: '+263', country: 'ZW', flag: '🇿🇼' },
  { code: '+264', country: 'NA', flag: '🇳🇦' },
  { code: '+265', country: 'MW', flag: '🇲🇼' },
  { code: '+267', country: 'BW', flag: '🇧🇼' },
  { code: '+268', country: 'SZ', flag: '🇸🇿' },
  { code: '+269', country: 'KM', flag: '🇰🇲' },
  { code: '+290', country: 'SH', flag: '🇸🇭' },
  { code: '+291', country: 'ER', flag: '🇪🇷' },
  { code: '+297', country: 'AW', flag: '🇦🇼' },
  { code: '+298', country: 'FO', flag: '🇫🇴' },
  { code: '+299', country: 'GL', flag: '🇬🇱' },
  { code: '+350', country: 'GI', flag: '🇬🇮' },
  { code: '+352', country: 'LU', flag: '🇱🇺' },
  { code: '+354', country: 'IS', flag: '🇮🇸' },
  { code: '+356', country: 'MT', flag: '🇲🇹' },
  { code: '+357', country: 'CY', flag: '🇨🇾' },
  { code: '+370', country: 'LT', flag: '🇱🇹' },
  { code: '+371', country: 'LV', flag: '🇱🇻' },
  { code: '+372', country: 'EE', flag: '🇪🇪' },
  { code: '+373', country: 'MD', flag: '🇲🇩' },
  { code: '+374', country: 'AM', flag: '🇦🇲' },
  { code: '+375', country: 'BY', flag: '🇧🇾' },
  { code: '+376', country: 'AD', flag: '🇦🇩' },
  { code: '+377', country: 'MC', flag: '🇲🇨' },
  { code: '+378', country: 'SM', flag: '🇸🇲' },
  { code: '+379', country: 'VA', flag: '🇻🇦' },
  { code: '+380', country: 'UA', flag: '🇺🇦' },
  { code: '+381', country: 'RS', flag: '🇷🇸' },
  { code: '+382', country: 'ME', flag: '🇲🇪' },
  { code: '+383', country: 'XK', flag: '🇽🇰' },
  { code: '+385', country: 'HR', flag: '🇭🇷' },
  { code: '+386', country: 'SI', flag: '🇸🇮' },
  { code: '+387', country: 'BA', flag: '🇧🇦' },
  { code: '+389', country: 'MK', flag: '🇲🇰' },
  { code: '+390', country: 'IT', flag: '🇮🇹' },
  { code: '+392', country: 'IT', flag: '🇮🇹' },
  { code: '+421', country: 'SK', flag: '🇸🇰' },
  { code: '+423', country: 'LI', flag: '🇱🇮' },
  { code: '+500', country: 'FK', flag: '🇫🇰' },
  { code: '+501', country: 'BZ', flag: '🇧🇿' },
  { code: '+502', country: 'GT', flag: '🇬🇹' },
  { code: '+503', country: 'SV', flag: '🇸🇻' },
  { code: '+504', country: 'HN', flag: '🇭🇳' },
  { code: '+505', country: 'NI', flag: '🇳🇮' },
  { code: '+506', country: 'CR', flag: '🇨🇷' },
  { code: '+507', country: 'PA', flag: '🇵🇦' },
  { code: '+508', country: 'PM', flag: '🇵🇲' },
  { code: '+509', country: 'HT', flag: '🇭🇹' },
  { code: '+590', country: 'GP', flag: '🇬🇵' },
  { code: '+591', country: 'BO', flag: '🇧🇴' },
  { code: '+592', country: 'GY', flag: '🇬🇾' },
  { code: '+593', country: 'EC', flag: '🇪🇨' },
  { code: '+594', country: 'GF', flag: '🇬🇫' },
  { code: '+595', country: 'PY', flag: '🇵🇾' },
  { code: '+596', country: 'MQ', flag: '🇲🇶' },
  { code: '+597', country: 'SR', flag: '🇸🇷' },
  { code: '+598', country: 'UY', flag: '🇺🇾' },
  { code: '+599', country: 'CW', flag: '🇨🇼' },
  { code: '+51', country: 'PE', flag: '🇵🇪' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+53', country: 'CU', flag: '🇨🇺' },
  { code: '+54', country: 'AR', flag: '🇦🇷' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+56', country: 'CL', flag: '🇨🇱' },
  { code: '+57', country: 'CO', flag: '🇨🇴' },
  { code: '+58', country: 'VE', flag: '🇻🇪' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+63', country: 'PH', flag: '🇵🇭' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+66', country: 'TH', flag: '🇹🇭' },
  { code: '+84', country: 'VN', flag: '🇻🇳' },
  { code: '+880', country: 'BD', flag: '🇧🇩' },
  { code: '+92', country: 'PK', flag: '🇵🇰' },
  { code: '+93', country: 'AF', flag: '🇦🇫' },
  { code: '+94', country: 'LK', flag: '🇱🇰' },
  { code: '+95', country: 'MM', flag: '🇲🇲' },
  { code: '+880', country: 'BD', flag: '🇧🇩' },
  { code: '+960', country: 'MV', flag: '🇲🇻' },
  { code: '+961', country: 'LB', flag: '🇱🇧' },
  { code: '+962', country: 'JO', flag: '🇯🇴' },
  { code: '+963', country: 'SY', flag: '🇸🇾' },
  { code: '+964', country: 'IQ', flag: '🇮🇶' },
  { code: '+965', country: 'KW', flag: '🇰🇼' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+967', country: 'YE', flag: '🇾🇪' },
  { code: '+968', country: 'OM', flag: '🇴🇲' },
  { code: '+970', country: 'PS', flag: '🇵🇸' },
  { code: '+972', country: 'IL', flag: '🇮🇱' },
  { code: '+973', country: 'BH', flag: '🇧🇭' },
  { code: '+974', country: 'QA', flag: '🇶🇦' },
  { code: '+975', country: 'BT', flag: '🇧🇹' },
  { code: '+976', country: 'MN', flag: '🇲🇳' },
  { code: '+977', country: 'NP', flag: '🇳🇵' },
  { code: '+992', country: 'TJ', flag: '🇹🇯' },
  { code: '+993', country: 'TM', flag: '🇹🇲' },
  { code: '+994', country: 'AZ', flag: '🇦🇿' },
  { code: '+995', country: 'GE', flag: '🇬🇪' },
  { code: '+996', country: 'KG', flag: '🇰🇬' },
  { code: '+998', country: 'UZ', flag: '🇺🇿' },
];

type CountryCodePickerProps = {
  value: string;
  onValueChange: (code: string) => void;
};

export default function CountryCodePicker({ value, onValueChange }: CountryCodePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const selected = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0];

  return (
    <>
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerText}>{selected.flag} {selected.code}</Text>
        <Ionicons name="chevron-down" size={20} color="#666666" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country Code</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    onValueChange(item.code);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryCode}>{item.code}</Text>
                  <Text style={styles.countryName}>{item.country}</Text>
                  {value === item.code && (
                    <Ionicons name="checkmark" size={20} color="#000000" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#ffffff',
    minWidth: 100,
  },
  pickerText: {
    fontSize: 16,
    color: '#000000',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    width: 60,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: '#666666',
  },
});

