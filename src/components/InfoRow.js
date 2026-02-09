import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export default function InfoRow({ label, value, copyable = false }) {
  const handleCopy = async () => {
    if (value) {
      await Clipboard.setStringAsync(value.toString());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        onPress={copyable ? handleCopy : undefined} 
        disabled={!copyable}
        style={styles.valueContainer}
      >
        <Text style={styles.value}>{value || 'N/A'}</Text>
        {copyable && <Text style={styles.copyHint}>(tap to copy)</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  valueContainer: {
    alignItems: 'flex-end',
    flex: 1,
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'right',
  },
  copyHint: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
    textAlign: 'right',
  },
});
