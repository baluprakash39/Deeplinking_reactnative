

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from React Navigation

const styles = StyleSheet.create({
  searchInput: {
    height: 32,
    marginTop: 32,
    marginRight: 16,
    backgroundColor: 'rgba(249, 249, 249, 0.6)',
    color: 'white',
    padding: 4,
    fontSize: 16,
    width: 200,
    borderRadius: 10,
  },
});

function Home() {
  const [search, setSearch] = useState('');
  const [createVehicle1, setCreateVehicle1] = useState(true);
  const [addVehicle1, setAddVehicle1] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [selectedSection, setSelectedSection] = useState('All Bikes');
  const [bikeData, setBikeData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [acc, setAcc] = useState(null);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [filteredProductData, setFilteredProductData] = useState([]);

  useEffect(() => {
    fetchSections();
    fetchBikeDetails();
  }, []);

  useEffect(() => {
    filterProductData();
  }, [search, productData]);

  const filterProductData = () => {
    const filteredData = productData.filter((data) =>
      data.vehiclename.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProductData(filteredData);
  };

  const fetchSections = () => {
    const url = 'https://shy-tan-tam.cyclic.cloud/bikes/bikes';

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.sections && data.sections.length > 0) {
          setSections(data.sections);
        }
      })
      .catch((error) => {
        console.error('Error fetching sections:', error);
      });
  };

  const fetchBikeDetails = () => {
    const url = 'https://shy-tan-tam.cyclic.cloud/formdetails/getbikes';

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setProductData(data.user);
      })
      .catch((error) => {
        console.error('Error fetching bike details:', error);
      });
  };

  const carddata = (data) => {
    AsyncStorage.setItem('homedata', JSON.stringify(data._id))
      .then(() => {
        console.log('Data saved successfully:', data._id);
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };

  const products = (section) => {
    setSelectedSection(section);
    setAcc(section);

    if (section === 'Accesories') {
      fetchBikeDetails();
    } else {
      // Use Axios to fetch data here
      axios
        .get(`https://shy-tan-tam.cyclic.cloud/formdetails/getbikes/${section}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          if (response.data) {
            setProductData(response.data.bikes);
          }
        })
        .catch((error) => {
          console.error('Error fetching bike details:', error);
        });
    }
  };

  const navigation = useNavigation(); // Get the navigation object

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Vehicle"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View style={{ flexDirection: 'row', borderRadius: 10, marginTop: 10 }}>
        {sections
          .filter((sec) => sec.Sectionname !== 'Accesories' && sec.Sectionname !== 'Care')
          .map((sec, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: 'black',
                borderWidth: 1,
                borderColor: '#F9F9F9',
                borderRadius: 10,
                padding: 10,
                margin: 5,
                width: '49%',
                marginBottom: 20,
              }}
              onPress={() => products(sec.Sectionname)}
            >
              <Text style={{ color: 'white' }}>{sec.Sectionname}</Text>
            </TouchableOpacity>
          ))}
      </View>
      <FlatList
        data={filteredProductData}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => carddata(item)}
            style={{
              borderColor: '#F9F9F980',
              borderWidth: 1,
              backgroundColor: 'black',
              height: 250,
              flex: 1,
              margin: 5,
              borderRadius: 10,
            }}
          >
            <Image
              style={{
                height: '60%',
                width: '100%',
                borderRadius: 10,
              }}
              source={{ uri: item.adminallimages[0] }}
            />
            <View style={{ flex: 1, justifyContent: 'space-between', padding: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{item.vehiclename}</Text>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                  <Icon name="speedometer-outline" style={{ marginRight: 5, fontSize: 5 }} />
                  {item.EngineCC} CC
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Price Starts from</Text>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{item.exShowroomPrice}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default Home;
