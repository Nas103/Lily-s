import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../stores/authStore';
import { reviewsAPI } from '../services/api';

type Review = {
  id: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  createdAt: string;
  userName: string;
};

type Summary = {
  count: number;
  average: number;
};

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= Math.round(value) ? 'star' : 'star-outline'}
          size={size}
          color="#000000"
        />
      ))}
    </View>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await reviewsAPI.getForProduct(productId);
      setReviews(data.reviews || []);
      setSummary(data.summary || null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      await reviewsAPI.submit({ productId, rating, title, body });
      setTitle('');
      setBody('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save review');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        {summary && summary.count > 0 ? (
          <View style={styles.summary}>
            <Stars value={summary.average} />
            <Text style={styles.summaryText}>
              {summary.average.toFixed(1)} ({summary.count})
            </Text>
          </View>
        ) : null}
      </View>

      {isAuthenticated ? (
        <View style={styles.form}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={22}
                  color="#000000"
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Review title (optional)"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Tell others what you think"
            value={body}
            onChangeText={setBody}
            multiline
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={styles.submit}
            onPress={submit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.submitText}>Submit review</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.hint}>Sign in to write a review.</Text>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 12 }} color="#000000" />
      ) : reviews.length ? (
        reviews.map((review) => (
          <View key={review.id} style={styles.review}>
            <View style={styles.reviewHeader}>
              <Stars value={review.rating} size={12} />
              <Text style={styles.reviewAuthor}>{review.userName}</Text>
            </View>
            {review.title ? (
              <Text style={styles.reviewTitle}>{review.title}</Text>
            ) : null}
            {review.body ? (
              <Text style={styles.reviewBody}>{review.body}</Text>
            ) : null}
          </View>
        ))
      ) : (
        <Text style={styles.hint}>
          No reviews yet. Be the first to share your thoughts.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#737373',
    textTransform: 'uppercase',
  },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryText: { fontSize: 12, color: '#404040' },
  stars: { flexDirection: 'row', gap: 2 },
  form: { gap: 8, marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#000000',
  },
  textarea: { minHeight: 70, textAlignVertical: 'top' },
  error: { color: '#b91c1c', fontSize: 12 },
  submit: {
    alignSelf: 'flex-start',
    backgroundColor: '#000000',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  hint: { fontSize: 13, color: '#737373' },
  review: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewAuthor: { fontSize: 13, fontWeight: '600', color: '#000000' },
  reviewTitle: { fontSize: 13, fontWeight: '600', color: '#000000' },
  reviewBody: { fontSize: 13, color: '#525252' },
});