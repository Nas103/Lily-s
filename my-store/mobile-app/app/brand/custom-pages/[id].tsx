import { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { apiClient } from '@/services/api';

export default function BrandCustomPageBuilderMobile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiFindings, setAiFindings] = useState<any>(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('clothing');
  const [gender, setGender] = useState('women');
  const [sizes, setSizes] = useState('S,M,L,XL');

  const load = async () => {
    try {
      const res = await apiClient.get(`/brand/custom-pages/${id}`);
      setPage(res.data.page);
      if (res.data.page?.aiReview) setAiFindings(res.data.page.aiReview);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) void load(); }, [id]);

  const save = async () => {
    try {
      await apiClient.patch(`/brand/custom-pages/${id}`, { pageName: page.pageName, description: page.description, guidelines: page.guidelines });
      Alert.alert('Saved', 'Draft saved');
      await load();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed');
    }
  };

  const runAi = async () => {
    try {
      const res = await apiClient.post('/ai/brand-page-review', { pageId: id });
      setAiFindings(res.data.findings);
      Alert.alert('Done', 'AI scan complete');
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed');
    }
  };

  const submit = async () => {
    try {
      await apiClient.post(`/brand/custom-pages/${id}/submit`);
      Alert.alert('Submitted', 'Waiting for admin approval');
      await load();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed');
    }
  };

  const addProduct = async () => {
    try {
      await apiClient.post(`/brand/custom-pages/${id}/products`, {
        name, description: desc, price: Number(price), category, gender, sizes: sizes.split(',').map(s=>s.trim()).filter(Boolean), colors: []
      });
      setAdding(false); setName(''); setDesc(''); setPrice('');
      await load();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Failed');
    }
  };

  const uploadImage = async (productId: string) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert('Permission needed', 'Allow photo access');
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    const form = new FormData();
    form.append('file', { uri: asset.uri, name: asset.fileName || 'image.jpg', type: asset.mimeType || 'image/jpeg' } as any);
    try {
      await apiClient.post(`/brand/custom-products/${productId}/images/upload`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert('Uploaded', 'Image uploaded');
      await load();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error || 'Upload failed (max 2MB)');
    }
  };

  if (loading) return <View style={{ padding: 20 }}><Text>Loading…</Text></View>;
  if (!page) return <View style={{ padding: 20 }}><Text>Not found</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>{page.pageName}</Text>
      <Text style={{ color: '#666' }}>Status: {page.status}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <TouchableOpacity onPress={runAi} style={{ borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}><Text>AI scan</Text></TouchableOpacity>
        <TouchableOpacity onPress={save} style={{ borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}><Text>Save</Text></TouchableOpacity>
        <TouchableOpacity onPress={submit} disabled={page.status === 'SUBMITTED' || page.status === 'APPROVED'} style={{ backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}><Text style={{ color: '#fff' }}>Submit for approval</Text></TouchableOpacity>
      </View>
      <TextInput value={page.pageName || ''} onChangeText={(t)=>setPage({...page,pageName:t})} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 10 }} />
      <TextInput value={page.description || ''} onChangeText={(t)=>setPage({...page,description:t})} placeholder="Description" multiline style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 10, minHeight: 80 }} />
      {aiFindings ? (
        <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, gap: 6 }}>
          <Text style={{ fontWeight: '600' }}>AI findings</Text>
          {(aiFindings.issues||[]).map((iss:any,i:number)=>(<Text key={i} style={{ color: iss.level==='error'?'#b91c1c':'#92400e', fontSize: 12 }}>{iss.message}</Text>))}
          {(aiFindings.issues||[]).length===0 ? <Text style={{ color: '#059669', fontSize: 12 }}>No issues</Text> : null}
        </View>
      ) : null}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: '600' }}>Products</Text>
        <TouchableOpacity onPress={()=>setAdding(!adding)} style={{ borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}><Text>{adding?'Cancel':'Add product'}</Text></TouchableOpacity>
      </View>
      {adding ? (
        <View style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, gap: 8 }}>
          <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 8 }} />
          <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="decimal-pad" style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 8 }} />
          <TextInput placeholder="Description" value={desc} onChangeText={setDesc} multiline style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 8, minHeight: 60 }} />
          <TextInput placeholder="Sizes (S,M,L)" value={sizes} onChangeText={setSizes} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 8 }} />
          <TouchableOpacity onPress={addProduct} style={{ backgroundColor: '#000', padding: 10, borderRadius: 10 }}><Text style={{ color: '#fff', textAlign: 'center' }}>Create</Text></TouchableOpacity>
        </View>
      ) : null}
      {(page.products||[]).map((p:any)=>(
        <View key={p.id} style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, gap: 8 }}>
          <Text style={{ fontWeight: '600' }}>{p.name}</Text>
          <Text style={{ color: '#666' }}>${Number(p.price).toFixed(2)} • {p.status}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {(p.images||[]).map((img:any)=>(<Image key={img.id} source={{ uri: `https://lilys.app/api/brand-products/images/${img.id}` }} style={{ width: 70, height: 90, borderRadius: 8 }} />))}
          </View>
          <TouchableOpacity onPress={()=>uploadImage(p.id)} style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 10 }}><Text style={{ textAlign: 'center' }}>Upload image from device (max 2MB)</Text></TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}
