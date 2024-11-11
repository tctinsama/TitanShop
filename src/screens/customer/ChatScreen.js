import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Thêm tin nhắn của người dùng vào danh sách
    const newMessage = { text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText('');

    setLoading(true);
    try {
      // Gọi API của Google Gemini
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCV_LQsmE8yDu6chRXbUgjsZE39PxggOJA', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: inputText }, // Gửi input của người dùng
              ],
            },
          ],
        }),
      });

      // Log toàn bộ dữ liệu trả về từ API
      const data = await response.json();

      // Kiểm tra và trích xuất văn bản từ content trong phản hồi
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
        const content = data.candidates[0].content;

        // Truy cập vào text trong parts
        if (content && content.parts && content.parts[0] && content.parts[0].text) {
          const gptMessage = { text: content.parts[0].text, sender: 'gpt' };
          setMessages((prevMessages) => [...prevMessages, gptMessage]);
        } else {
          console.error('Không tìm thấy thuộc tính text trong content.parts:', content.parts);
        }
      } else {
        console.error('Lỗi dữ liệu từ API:', data);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API Gemini:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View key={index} style={message.sender === 'user' ? styles.userMessage : styles.gptMessage}>
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
        />
        <TouchableOpacity onPress={sendMessage} disabled={loading}>
          <Ionicons name="send" size={24} color={loading ? '#ccc' : '#007BFF'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f0' },
    messagesContainer: { flex: 1, padding: 10 },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#007BFF',
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
      maxWidth: '75%',
    },
    gptMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#e0e0e0',
      borderRadius: 10,
      padding: 10,
      marginVertical: 5,
      maxWidth: '75%',
      opacity: 1, // Đảm bảo rằng văn bản không bị mờ
    },
    messageText: {
      color: '#000',  // Đổi màu chữ sang đen để dễ đọc
      fontSize: 16,   // Đặt kích thước chữ lớn hơn
      fontWeight: 'bold', // Tăng độ đậm của chữ
    },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff' },
    input: { flex: 1, marginRight: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, padding: 10 },
  });
  
export default ChatScreen;
