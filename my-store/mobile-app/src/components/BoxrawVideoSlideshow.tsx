import { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { API_BASE_URL } from '../config/api';

// MP4s live in the web app's public/boxraw/slide_anime_video folder and are
// streamed from the API host (same origin as the product images).
const SLIDE_VIDEO_FILES = [
  '01f07b356f5049f28145aeba76c01b90.HD-720p-1.6Mbps-94566943.mp4',
  '102deed7f90c4e93b2cb27dcea9656bd.HD-720p-1.6Mbps-94496454.mp4',
  '12176d42856e47f384913e27e1ccaf6c.HD-720p-1.6Mbps-96568674.mp4',
  '1b8d7ff95b91455b9cb3d606352a5169.HD-720p-1.6Mbps-95014901.mp4',
  '26df4aea42294b7da63016ff55a26650.HD-720p-1.6Mbps-91028376.mp4',
  '3e9e079af0604870b4d8a2e91f623bd0.HD-720p-1.6Mbps-96568121.mp4',
  '751acfa37fc9428b9babc7619869d388.HD-720p-1.6Mbps-87406074.mp4',
  '772a22a1973044069d60a7b24dd08e59.HD-720p-1.6Mbps-96102520.mp4',
  '7a24c88448114eb0866514e642ba7885.HD-720p-1.6Mbps-96102436.mp4',
  '7ee1cd3455854f60acaccb359d195103.HD-720p-1.6Mbps-87405999.mp4',
  '83766116cd474a43b84a7bc6318a2b37.HD-720p-1.6Mbps-96567802.mp4',
  '88766f40425440bba3789af2b4a8f0f8.HD-720p-1.6Mbps-96567590.mp4',
  'f1cd259c784540e08804efcbc17ed287.HD-720p-1.6Mbps-90427708.mp4',
  'ff604393feeb40f19cc0a6d8a150495d.HD-720p-1.6Mbps-96568860.mp4',
];

const VIDEO_URIS = SLIDE_VIDEO_FILES.map(
  (file) => `${API_BASE_URL}/boxraw/slide_anime_video/${file}`
);

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

type Playlist = { order: string[]; index: number };

/**
 * Advance to the next clip, reshuffling once every clip has played so the
 * slideshow keeps looping without repeating the clip that just finished.
 */
export function advancePlaylist(current: Playlist): Playlist {
  const nextIndex = current.index + 1;
  if (nextIndex < current.order.length) {
    return { order: current.order, index: nextIndex };
  }

  const reshuffled = shuffle(current.order);
  const justPlayed = current.order[current.index];
  if (reshuffled.length > 1 && reshuffled[0] === justPlayed) {
    [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
  }
  return { order: reshuffled, index: 0 };
}

function Slide({ uri, onFinished }: { uri: string; onFinished: () => void }) {
  const finishedRef = useRef(false);

  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = false;
    instance.muted = true; // Banner autoplay stays silent; set false for sound.
    instance.play();
  });

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinished();
  }, [onFinished]);

  // Play the clip through to its end, then hand off to the next one. A failed
  // source also advances so a single broken file can't stall the slideshow.
  useEventListener(player, 'playToEnd', finish);
  useEventListener(player, 'statusChange', ({ status }) => {
    if (status === 'error') finish();
  });

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
      playsInline
    />
  );
}

export default function BoxrawVideoSlideshow() {
  const [playlist, setPlaylist] = useState<Playlist>(() => ({
    order: shuffle(VIDEO_URIS),
    index: 0,
  }));

  const handleFinished = useCallback(() => {
    setPlaylist(advancePlaylist);
  }, []);

  if (playlist.order.length === 0) return null;

  const uri = playlist.order[playlist.index];

  return (
    <View style={styles.container}>
      <Slide key={uri} uri={uri} onFinished={handleFinished} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: 16,
  },
});
