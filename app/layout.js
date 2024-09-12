import React from 'react';
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack initialRouteName="index">
     
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="map" options={{ headerShown: false }} />
    </Stack>
  );
}
