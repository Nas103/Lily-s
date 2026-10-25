import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiClient } from '@/services/api';

export default function BrandCustomPageMobile() {
  const { brandSlug, pageSlug } = useLocalSearchParams<{ brandSlug: string; pageSlug: string }>();
  const router = useRouter();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get(`/brand-pages/${brandSlug}/${pageSlug}`);
        setPage(res.data.page);
      } catch {
        setPage(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [brandSlug, pageSlug]);

  if (loading) return <View style={{ padding: 20 }}><Text>Loading…</Text></View>;
  if (!page) return <View style={{ padding: 20 }}><Text>Not found</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, color: '#999' }}>{page.brand?.name}</Text>
      <Text style={{ fontSize: 26, fontWeight: '600' }}>{page.pageName}</Text>
      {page.description ? <Text style={{ color: '#666' }}>{page.description}</Text> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {(page.products||[]).map((p:any)=>{
          const img = p.images?.[0];
          const uri = img ? `https://lilys.app/api/brand-products/images/${img.id}` : undefined;
          return (
            <TouchableOpacity key={p.id} onPress={() => router.push(`/brands/${brandSlug}/${pageSlug}/${p.slug}` as any)} style={{ width: '47%' }}>
              <Image source={{ uri }} style={{ width: '100%', height: 220, borderRadius: 12, backgroundColor: '#f5f5f5' }} />
              <Text style={{ marginTop: 6 }}>{p.name}</Text>
              <Text style={{ color: '#666' }}>${Number(p.price).toFixed(2)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
