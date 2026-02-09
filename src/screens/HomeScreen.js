import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Device from 'expo-device';
import InfoRow from '../components/InfoRow';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <InfoRow label="Device Name" value={Device.deviceName} />
        <InfoRow label="Brand" value={Device.brand} />
        <InfoRow label="Model" value={Device.modelName} />
        <InfoRow label="Manufacturer" value={Device.manufacturer} />
        <InfoRow label="Design Name" value={Device.designName} />
        <InfoRow label="Product Name" value={Device.productName} />
      </View>

      <View style={styles.section}>
        <InfoRow label="OS Name" value={Device.osName} />
        <InfoRow label="OS Version" value={Device.osVersion} />
        <InfoRow label="OS Build ID" value={Device.osBuildId} />
        <InfoRow label="SDK Version" value={Device.osInternalBuildId} />
      </View>

      <View style={styles.section}>
        <InfoRow label="Device Year" value={Device.deviceYearClass} />
        <InfoRow label="Total Memory" value={Device.totalMemory ? `${(Device.totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB` : 'Unknown'} />
        <InfoRow label="Is Device" value={Device.isDevice ? 'Yes' : 'No (Simulator)'} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
