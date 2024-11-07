// src/screens/client/AddProduct.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, TouchableOpacity, Image } from 'react-native';

const AddProduct = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = () => {
    // Xử lý tải lên hình ảnh
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Sản Phẩm</Text>

      <Text style={styles.label}>Tên sản phẩm</Text>
      <TextInput style={styles.input} placeholder="Tên sản phẩm" />

      <Text style={styles.label}>Mô tả sản phẩm</Text>
      <TextInput style={styles.input} placeholder="Mô tả sản phẩm" multiline />

      <Text style={styles.label}>Giá sản phẩm</Text>
      <TextInput style={styles.input} placeholder="Giá sản phẩm" keyboardType="numeric" />

      <Text style={styles.label}>Danh mục</Text>
      <TextInput style={styles.input} placeholder="Tên danh mục" />

      <Text style={styles.label}>Mô tả danh mục</Text>
      <TextInput style={styles.input} placeholder="Mô tả danh mục" multiline />

      <Text style={styles.label}>Thương hiệu</Text>
      <TextInput style={styles.input} placeholder="Tên thương hiệu" />

      <Text style={styles.label}>Xuất xứ</Text>
      <TextInput style={styles.input} placeholder="Quốc gia" />

      <Text style={styles.label}>Giới tính</Text>
      <TextInput style={styles.input} placeholder="Giới tính (Nam, Nữ, Unisex)" />

      <Text style={styles.label}>Kích cỡ</Text>
      <TextInput style={styles.input} placeholder="Kích cỡ (S, M, L...)" />

      <Text style={styles.label}>Màu sắc</Text>
      <TextInput style={styles.input} placeholder="Màu sắc" />

      <Text style={styles.label}>Số lượng</Text>
      <TextInput style={styles.input} placeholder="Số lượng sản phẩm" keyboardType="numeric" />

      <Text style={styles.label}>Hình ảnh</Text>
      <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
        <Text style={styles.imageUploadText}>Chọn ảnh</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <Button title="Lưu sản phẩm" onPress={() => {/* Xử lý lưu sản phẩm */}} color="#4CAF50" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  imageUpload: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  imageUploadText: {
    color: '#555',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
});

export default AddProduct;
