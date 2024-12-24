import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '@env';
import { useUser } from '../../context/UserContext';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userId } = useUser();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      Alert.alert('Error', 'Could not load categories. Please try again.');
    }
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to allow access to the media library to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      try {
        const imageUrl = await uploadImageToCloudinary(fileUri);
        setProductData((prevData) => ({ ...prevData, image: imageUrl }));
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        Alert.alert('Error', 'There was an error uploading the image.');
      }
    }
  };

  const uploadImageToCloudinary = async (fileUri) => {
    const data = new FormData();
    data.append('file', {
      uri: fileUri,
      type: 'image/jpeg',
      name: fileUri.split('/').pop(),
    });
    data.append('upload_preset', 'cloudtinsama');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/do0k0jkej/image/upload',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error.response || error);
      throw new Error('Error uploading image to Cloudinary');
    }
  };

  const handleSaveProduct = async () => {
    if (!productData.name || !productData.description || !productData.price || !productData.category || !productData.image) {
      Alert.alert('Error', 'Please fill all fields and select an image.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID is required.');
      return;
    }

    setLoading(true);

    const price = parseFloat(productData.price);
    if (isNaN(price) || price <= 0) {
      Alert.alert('Error', 'Please enter a valid price.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', price.toString());
    formData.append('category', productData.category);
    formData.append('image', {
      uri: productData.image,
      type: 'image/jpeg',
      name: 'uploaded_image.jpg',
    });
    formData.append('userId', userId);

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from API:', errorText);
        Alert.alert('Error', errorText);
        return;
      }

      const jsonResponse = await response.json();
      Alert.alert('Success', 'Product saved successfully!');
      setProductData({
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
      });
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'There was an error saving the product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      <Text style={styles.label}>Product Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={productData.name}
        onChangeText={(text) => setProductData((prev) => ({ ...prev, name: text }))}
      />

      <Text style={styles.label}>Product Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Enter product description"
        multiline
        value={productData.description}
        onChangeText={(text) => setProductData((prev) => ({ ...prev, description: text }))}
      />

      <Text style={styles.label}>Product Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product price"
        keyboardType="numeric"
        value={productData.price}
        onChangeText={(text) => setProductData((prev) => ({ ...prev, price: text }))}
      />

      <Text style={styles.label}>Category</Text>
      <TouchableOpacity style={styles.pickerContainer} onPress={() => setShowPicker(!showPicker)}>
        <Text style={styles.selectedCategoryText}>
          {productData.category ? `Selected: ${productData.category}` : 'Select Category'}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        categories.length > 0 ? (
          <Picker
            selectedValue={productData.category}
            onValueChange={(value) => {
              setProductData((prev) => ({ ...prev, category: value }));
              setShowPicker(false);
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map((category) => (
              <Picker.Item key={category.categoryproductid} label={category.categoryname} value={category.categoryproductid} />
            ))}
          </Picker>
        ) : (
          <Text style={{ color: 'red' }}>No categories available.</Text>
        )
      )}

      <Text style={styles.label}>Image</Text>
      <TouchableOpacity style={styles.imageUpload} onPress={handleImageUpload}>
        <Text style={styles.imageUploadText}>Select Image</Text>
      </TouchableOpacity>
      {productData.image && <Image source={{ uri: productData.image }} style={styles.imagePreview} />}

      <TouchableOpacity style={styles.button} onPress={handleSaveProduct} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save Product</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, color: '#333', textAlign: 'center' },
  label: { fontSize: 16, color: '#555', marginBottom: 5, marginTop: 10, alignSelf: 'flex-start' },
  input: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 10, backgroundColor: '#fff', marginBottom: 10, width: '100%' },
  textArea: { height: 100, textAlignVertical: 'top' },
  pickerContainer: { height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, backgroundColor: '#fff', marginBottom: 10, width: '100%', justifyContent: 'center', paddingHorizontal: 10 },
  selectedCategoryText: { color: '#555' },
  picker: { width: '100%' },
  imageUpload: { backgroundColor: '#ddd', paddingVertical: 10, borderRadius: 5, alignItems: 'center', marginVertical: 10, width: '100%' },
  imageUploadText: { color: '#555' },
  imagePreview: { width: 100, height: 100, marginTop: 10, borderRadius: 5 },
  button: { backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 5, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AddProduct;
