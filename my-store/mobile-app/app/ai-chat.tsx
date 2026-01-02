import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { aiChatAPI } from '../src/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AiChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Lily Atelier's AI shopping assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newUserMessage: Message = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      console.log('[AI Chat] Sending message:', userMessage);
      
      // Send conversation history for context and learning
      const response = await aiChatAPI.sendMessage(userMessage, {
        messages: updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        context: {}, // Can add cart total, locale, etc. here
      });

      console.log('[AI Chat] Received response:', response);

      // Handle different response formats
      const reply = response.reply || response.message || response.response || response.content || '';
      
      if (!reply || reply.trim() === '') {
        console.error('[AI Chat] Empty response received');
        throw new Error('Empty response from server');
      }

      console.log('[AI Chat] Parsed reply:', reply);

      const assistantMessage: Message = {
        role: 'assistant',
        content: reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI Chat error:', error);
      console.error('Error details:', error?.response?.data || error?.message || error);
      
      // Provide more helpful error message
      let errorContent = 'Sorry, I encountered an error. Please try again or contact support.';
      
      if (error?.response?.status === 429) {
        errorContent = 'Too many requests. Please wait a moment and try again.';
      } else if (error?.response?.status === 500) {
        errorContent = 'Server error. Please try again in a moment.';
      } else if (error?.message?.includes('timeout') || error?.code === 'ECONNABORTED') {
        errorContent = 'Request timed out. Please check your connection and try again.';
      } else if (error?.message?.includes('Network')) {
        errorContent = 'Network error. Please check your internet connection.';
      }
      
      const errorMessage: Message = {
        role: 'assistant',
        content: errorContent,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userMessage : styles.assistantMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === 'user' ? styles.userMessageText : styles.assistantMessageText,
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={[styles.messageBubble, styles.assistantMessage]}>
            <View style={styles.thinkingContainer}>
              <Text style={[styles.messageText, styles.assistantMessageText]}>
                Thinking
              </Text>
              <View style={styles.dotsContainer}>
                <Text style={[styles.messageText, styles.assistantMessageText]}>.</Text>
                <Text style={[styles.messageText, styles.assistantMessageText]}>.</Text>
                <Text style={[styles.messageText, styles.assistantMessageText]}>.</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything about our products..."
          placeholderTextColor={Colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
        >
          <Ionicons
            name="send"
            size={20}
            color={loading || !input.trim() ? Colors.textMuted : Colors.white}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.black,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.zinc[100],
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: Colors.white,
  },
  assistantMessageText: {
    color: Colors.text,
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.zinc[200],
  },
});

