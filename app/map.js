import React, { useState, useEffect } from 'react';
import { Platform, View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, Heatmap } from 'react-native-maps';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { useGlobalSearchParams,  } from 'expo-router';

export default function MapScreen() {
  const { phoneNumber } = useGlobalSearchParams();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    (async () => {
      if (!phoneNumber) {
        setErrorMsg('Please enter a phone number.');
        return;
      }

      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('This will not work on an Android Emulator. Try it on a physical device!');
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        let address = reverseGeocode[0];
        setLocationName(`${address.city}, ${address.region}`);
        setAddress(`${address.subregion}, ${address.formattedAddress}`);
      }
    })();
  }, [phoneNumber]);

  const initialRegion = {
    latitude: location ? location.coords.latitude : 34.0522,
    longitude: location ? location.coords.longitude : -118.2437,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const heatmapPoints = location
    ? [
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          weight: 1,
        },
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {location && (
            <>
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title={locationName}
                description={address}
              />
              <Heatmap points={heatmapPoints} radius={50} />
            </>
          )}
        </MapView>
      </View>
      {address ? (
        <Text style={styles.locationText}>Location: {address}</Text>
      ) : (
        <Text style={styles.locationText}>{errorMsg || 'Fetching location...'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    bottom: 20,
  },
});
