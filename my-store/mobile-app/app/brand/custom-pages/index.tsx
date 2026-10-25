import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/services/api';

export default function BrandCustomPagesMobile() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [pages, setPages] = useState<any[]>([]);
  const [pageName, setPageName] = useState(user?.name ? user.name + ' Edit' : 'My Edit');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await apiClient.get('/brand/custom-pages');
      setPages(res.data?.pages || []);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const create = async () => {
    try {
      const res = await apiClient.post('/brand/custom-pages', { pageName });
      Alert.alert('Created', 'Page template created');
      await load();
      router.push(`/brand/custom-pages/${res.data.page.id}` as any);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Custom Pages</Text>
      <Text style={{ color: '#666' }}>Build your own product page template. Add products with images from your device.</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput value={pageName} onChangeText={setPageName} style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 10 }} />
        <TouchableOpacity onPress={create} style={{ backgroundColor: '#000', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 12 }}>
          <Text style={{ color: '#fff' }}>Create</Text>
        </TouchableOpacity>
      </View>
      {pages.map((p) => (
        <TouchableOpacity key={p.id} onPress={() => router.push(`/brand/custom-pages/${p.id}` as any)} style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 16, padding: 16 }}>
          <Text style={{ fontWeight: '600' }}>{p.pageName}</Text>
          <Text style={{ color: '#666', marginTop: 4 }}>{p.status} • {p.products?.length || 0} products</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
