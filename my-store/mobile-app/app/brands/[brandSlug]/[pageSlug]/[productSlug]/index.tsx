import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { apiClient } from '@/services/api';

export default function BrandCustomProductMobile() {
  const { brandSlug, pageSlug, productSlug } = useLocalSearchParams<{ brandSlug: string; pageSlug: string; productSlug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get(`/brand-pages/${brandSlug}/${pageSlug}/${productSlug}`);
        setProduct(res.data.product);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [brandSlug, pageSlug, productSlug]);

  if (loading) return <View style={{ padding: 20 }}><Text>Loading…</Text></View>;
  if (!product) return <View style={{ padding: 20 }}><Text>Not found</Text></View>;

  const images = product.images || [];
  const main = images[0];
  const mainUri = main ? `https://lilys.app/api/brand-products/images/${main.id}` : undefined;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 4, color: '#999' }}>{product.brand?.name}</Text>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>{product.name}</Text>
      <Text style={{ fontSize: 16 }}>${Number(product.price).toFixed(2)}</Text>
      <Image source={{ uri: mainUri }} style={{ width: '100%', height: 420, borderRadius: 16, backgroundColor: '#f5f5f5' }} />
      <Text style={{ color: '#666' }}>{product.description}</Text>
      {product.sizes?.length ? <Text>Sizes: {product.sizes.join(', ')}</Text> : null}
      {product.colors?.length ? <Text>Colors: {product.colors.join(', ')}</Text> : null}
    </ScrollView>
  );
}
