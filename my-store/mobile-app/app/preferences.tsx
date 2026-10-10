import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/stores/authStore';
import { useProfile, Preferences } from '../src/stores/profileStore';
import { linksAPI } from '../src/services/api';

type TabId = 'shop' | 'notifications' | 'privacy' | 'links';

const TABS: { id: TabId; label: string }[] = [
  { id: 'shop', label: 'Shop' },
  { id: 'notifications', label: 'Alerts' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'links', label: 'Linked' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Onyx', 'Sand', 'Oat', 'Shadow', 'Fog'];
const CATEGORIES = ['Featured', 'Kaftans', 'Hijabs', 'Dresses', 'Outerwear', 'Accessories'];
const CURRENCIES = ['ZAR', 'USD', 'EUR', 'GBP', 'NGN', 'KES'];


function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: progress.value > 0.5 ? '#000000' : '#d4d4d4',
  }));
  const knobStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(progress.value * 20, { damping: 18, stiffness: 220 }) },
    ],
  }));

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onChange(!value)}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

function Row({
  title,
  description,
  children,
  delay = 0,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(300).delay(delay)} style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {description ? <Text style={styles.rowDescription}>{description}</Text> : null}
      </View>
      {children}
    </Animated.View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Animated.View entering={FadeIn}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[styles.chip, active && styles.chipActive]}
      >
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function PreferencesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const prefs = useProfile((state) => state.preferences);
  const loadProfile = useProfile((state) => state.load);
  const updatePreferences = useProfile((state) => state.updatePreferences);
  const [tab, setTab] = useState<(typeof TABS)[number]['id']>('shop');
  const [links, setLinks] = useState<{ googleLinked: boolean; appleLinked: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [, linksData] = await Promise.all([
        loadProfile(),
        linksAPI.get().catch(() => ({ links: null })),
      ]);
      setLinks(linksData.links);
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  }, [loadProfile]);

  useEffect(() => {
    if (isAuthenticated) void load();
  }, [isAuthenticated, load]);

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header onBack={() => router.back()} />
        <View style={styles.center}>
          <Text style={styles.muted}>Please sign in to manage preferences.</Text>
        </View>
      </View>
    );
  }

  if (loading || !prefs) {
    return (
      <View style={styles.container}>
        <Header onBack={() => router.back()} />
        <View style={styles.center}>
          <ActivityIndicator color="#000000" />
        </View>
      </View>
    );
  }

  const update = (patch: Partial<Preferences>) => {
    updatePreferences(patch).catch(() => Alert.alert('Error', 'Unable to save'));
  };

  const toggleList = (key: 'preferredSizes' | 'preferredColors' | 'preferredCategories', item: string) => {
    const list = prefs[key];
    const next = list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
    update({ [key]: next } as Partial<Preferences>);
  };

  return (
    <View style={styles.container}>
      <Header onBack={() => router.back()} />
      <View style={styles.tabs}>
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <TouchableOpacity key={item.id} onPress={() => setTab(item.id)} style={styles.tab}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{item.label}</Text>
              {active && <Animated.View entering={FadeIn} style={styles.tabUnderline} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Animated.View key={tab} entering={FadeInDown.duration(280)}>
          {tab === 'shop' && (
            <View>
              <Text style={styles.groupTitle}>Currency</Text>
              <View style={styles.chips}>
                {CURRENCIES.map((c) => (
                  <Chip key={c} label={c} active={prefs.preferredCurrency === c} onPress={() => update({ preferredCurrency: c })} />
                ))}
              </View>
              <Text style={styles.groupTitle}>Preferred sizes</Text>
              <View style={styles.chips}>
                {SIZES.map((s) => (
                  <Chip key={s} label={s} active={prefs.preferredSizes.includes(s)} onPress={() => toggleList('preferredSizes', s)} />
                ))}
              </View>
              <Text style={styles.groupTitle}>Preferred colours</Text>
              <View style={styles.chips}>
                {COLORS.map((c) => (
                  <Chip key={c} label={c} active={prefs.preferredColors.includes(c)} onPress={() => toggleList('preferredColors', c)} />
                ))}
              </View>
              <Text style={styles.groupTitle}>Favourite categories</Text>
              <View style={styles.chips}>
                {CATEGORIES.map((c) => (
                  <Chip key={c} label={c} active={prefs.preferredCategories.includes(c)} onPress={() => toggleList('preferredCategories', c)} />
                ))}
              </View>
            </View>
          )}

          {tab === 'notifications' && (
            <View>
              <Row title="Email notifications" description="Account and order emails">
                <Toggle value={prefs.emailNotifications} onChange={(v) => update({ emailNotifications: v })} />
              </Row>
              <Row title="Push notifications" description="Alerts on your devices" delay={40}>
                <Toggle value={prefs.pushNotifications} onChange={(v) => update({ pushNotifications: v })} />
              </Row>
              <Row title="SMS notifications" description="Delivery updates by text" delay={80}>
                <Toggle value={prefs.smsNotifications} onChange={(v) => update({ smsNotifications: v })} />
              </Row>
              <Row title="Order updates" description="Shipping and delivery status" delay={120}>
                <Toggle value={prefs.orderUpdates} onChange={(v) => update({ orderUpdates: v })} />
              </Row>
              <Row title="Product updates" description="New drops and restocks" delay={160}>
                <Toggle value={prefs.productUpdates} onChange={(v) => update({ productUpdates: v })} />
              </Row>
              <Row title="Marketing emails" description="Offers and campaigns" delay={200}>
                <Toggle value={prefs.marketingEmails} onChange={(v) => update({ marketingEmails: v })} />
              </Row>
            </View>
          )}

          {tab === 'privacy' && (
            <View>
              <Row title="Two-factor authentication" description="Add an extra layer of security">
                <Toggle value={prefs.twoFactorEnabled} onChange={(v) => update({ twoFactorEnabled: v })} />
              </Row>
              <Row title="Location sharing" description="Improve currency and delivery accuracy" delay={40}>
                <Toggle value={prefs.locationSharing} onChange={(v) => update({ locationSharing: v })} />
              </Row>
              <TouchableOpacity
                style={styles.row}
                onPress={() => router.push('/change-password')}
                activeOpacity={0.7}
              >
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Change password</Text>
                  <Text style={styles.rowDescription}>Update your account password</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#a3a3a3" />
              </TouchableOpacity>
            </View>
          )}

          {tab === 'links' && (
            <View>
              {(['google', 'apple'] as const).map((provider, index) => {
                const linked = links?.[provider === 'google' ? 'googleLinked' : 'appleLinked'] ?? false;
                return (
                  <Row
                    key={provider}
                    title={provider === 'google' ? 'Google' : 'Apple'}
                    description={linked ? 'Connected' : 'Not connected'}
                    delay={index * 40}
                  >
                    <TouchableOpacity
                      style={styles.linkButton}
                      onPress={() =>
                        linksAPI
                          .set(provider, linked ? 'unlink' : 'link')
                          .then((res) => setLinks(res.links))
                          .catch(() => Alert.alert('Error', 'Unable to update link'))
                      }
                    >
                      <Text style={styles.linkButtonText}>{linked ? 'Disconnect' : 'Connect'}</Text>
                    </TouchableOpacity>
                  </Row>
                );
              })}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function Header({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Preferences</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000000' },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: { paddingHorizontal: 10, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontSize: 13, color: '#737373', fontWeight: '500' },
  tabTextActive: { color: '#000000', fontWeight: '700' },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#000000',
  },
  content: { padding: 16, paddingBottom: 48 },
  groupTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#737373',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: '#000000', borderColor: '#000000' },
  chipText: { fontSize: 12, color: '#525252', fontWeight: '600' },
  chipTextActive: { color: '#ffffff' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
    gap: 16,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, color: '#000000', fontWeight: '500' },
  rowDescription: { fontSize: 12, color: '#737373', marginTop: 2 },
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  knob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginLeft: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  linkButton: {
    backgroundColor: '#000000',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  linkButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  muted: { color: '#737373', fontSize: 15, textAlign: 'center' },
});