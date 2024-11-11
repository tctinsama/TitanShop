import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, Image, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState(null);

  // Request permission for image picker (if needed for Android)
  useEffect(() => {
    // Android-specific permission request can be handled here, 
    // iOS will prompt automatically on first usage of image picker
  }, []);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User canceled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          setImage(response.assets[0].uri); // Save the image URI
        }
      }
    );
  };

  const handleUploadProduct = () => {
    const formData = new FormData();
    formData.append('userId', '123'); // userId cần được lấy từ context hoặc thông qua các phương thức đăng nhập
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('categoryId', categoryId);

    if (image) {
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'product_image.jpg',
      });
    }

    fetch('http://10.0.2.2:3000/api/shop/products/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert('Product uploaded successfully!');
        console.log(data);
      })
      .catch((error) => {
        alert('Failed to upload product');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Sản Phẩm</Text>

      <Text style={styles.label}>Tên sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Mô tả sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Mô tả sản phẩm"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Giá sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Danh mục</Text>
      <TextInput
        style={styles.input}
        placeholder="Danh mục"
        value={categoryId}
        onChangeText={setCategoryId}
      />

      <Text style={styles.label}>Chọn ảnh sản phẩm</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imageUpload}>
        <Text style={styles.imageUploadText}>Chọn ảnh</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      <Button title="Tải sản phẩm lên" onPress={handleUploadProduct} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
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
