import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import InfoRow from '../components/InfoRow';

export default function SecurityScreen() {
  const [isRooted, setIsRooted] = useState(null);

  useEffect(() => {
    const checkRoot = async () => {
      try {
        const rooted = await Device.isRootedExperimentalAsync();
        setIsRooted(rooted);
      } catch (e) {
        setIsRooted(false); // Default or error
      }
    };
    checkRoot();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.header}>Security Checks</Text>
        <InfoRow 
          label="Rooted / Jailbroken" 
          value={isRooted === null ? 'Checking...' : (isRooted ? 'YES (Unsafe)' : 'No (Safe)')} 
        />
        <InfoRow label="Application ID" value={Application.applicationId} copyable={true} />
        <InfoRow label="Build Version" value={Application.nativeBuildVersion} />
        <InfoRow label="App Version" value={Application.nativeApplicationVersion} />
        <InfoRow label="Android ID" value={Application.androidId} copyable={true} />
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
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
