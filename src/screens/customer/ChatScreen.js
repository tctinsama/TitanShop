import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;
  
    const newMessage = { text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText('');
    setLoading(true);
  
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCGouHk882AVluelZTb7RtDboI6sjOkeOs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: inputText }],
            },
          ],
        }),
      });
  
      const data = await response.json();
  
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
        const gptMessage = { text: data.candidates[0].content.parts.map(part => part.text).join(' '), sender: 'gpt' };
        setMessages((prevMessages) => [...prevMessages, gptMessage]);
      } else {
        console.error('Lỗi dữ liệu từ API:', data);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <ScrollView
              style={styles.messagesContainer}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {messages.map((message, index) => (
                <View
                  key={index}
                  style={message.sender === 'user' ? styles.userMessage : styles.gptMessage}
                >
                  <Text style={styles.messageText}>{message.text}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Nhập tin nhắn..."
                placeholderTextColor="#888"
              />
              <TouchableOpacity onPress={sendMessage} disabled={loading}>
                <Ionicons name="send" size={24} color={loading ? '#ccc' : '#007BFF'} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f7f7' },
  container: { flex: 1 },
  innerContainer: { flex: 1 },
  messagesContainer: { flex: 1, paddingHorizontal: 15, backgroundColor: '#fff' },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
    borderRadius: 20,
    padding: 12,
    marginVertical: 5,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  gptMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 12,
    marginVertical: 5,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  messageText: {
    color: '#000',
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
});

export default ChatScreen;
