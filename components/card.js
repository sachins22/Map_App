import { Text, View, StyleSheet } from 'react-native';
import React from 'react';

export default function Card({ address }) {
  return (
    <View style={styles.container}>
      <Text style={styles.locationText}>Location: {address}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 0, 1)',
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    height:100,
    // borderRadius:60,
    borderBottomStartRadius:60
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
