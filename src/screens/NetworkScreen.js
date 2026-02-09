import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Button } from 'react-native';
import * as Network from 'expo-network';
import InfoRow from '../components/InfoRow';

export default function NetworkScreen() {
  const [ipAddress, setIpAddress] = useState(null);
  const [networkState, setNetworkState] = useState(null);

  const fetchNetworkInfo = async () => {
    try {
      const ip = await Network.getIpAddressAsync();
      setIpAddress(ip);
      const state = await Network.getNetworkStateAsync();
      setNetworkState(state);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNetworkInfo();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <InfoRow label="IP Address" value={ipAddress} copyable={true} />
        <InfoRow label="Connected" value={networkState?.isConnected ? 'Yes' : 'No'} />
        <InfoRow label="Internet Reachable" value={networkState?.isInternetReachable ? 'Yes' : 'No'} />
        <InfoRow label="Connection Type" value={networkState?.type} />
      </View>
      <Button title="Refresh Network Info" onPress={fetchNetworkInfo} />
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
