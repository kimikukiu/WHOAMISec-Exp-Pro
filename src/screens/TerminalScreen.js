import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Network from 'expo-network';

export default function TerminalScreen() {
  const [output, setOutput] = useState([
    { type: 'info', text: 'WHOAMISec Pro v1.0.0' },
    { type: 'info', text: 'Type "help" for available commands.' },
  ]);
  const [input, setInput] = useState('');
  const scrollViewRef = useRef();

  const handleCommand = async () => {
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newOutput = [...output, { type: 'input', text: `> ${input}` }];
    
    let response = '';
    switch (cmd) {
      case 'help':
        response = 'Available commands:\n  whoami   - Device & User Info\n  net      - Network Configuration\n  scan     - Simulate Vulnerability Scan\n  clear    - Clear terminal\n  about    - App Info';
        break;
      case 'whoami':
        response = `User: Admin\nDevice: ${Device.modelName}\nOS: ${Device.osName} ${Device.osVersion}`;
        break;
      case 'net':
        const ip = await Network.getIpAddressAsync();
        response = `IP Address: ${ip}\nState: Connected`;
        break;
      case 'scan':
        response = 'Scanning system...\n[+] Checking root status... Safe\n[+] Analyzing network... Secure\n[+] Verifying integrity... OK\nScan complete. No threats found.';
        break;
      case 'clear':
        setOutput([]);
        setInput('');
        return;
      case 'about':
        response = 'WHOAMISec Pro\nDeveloped for Security Analysis & Device Fingerprinting.';
        break;
      default:
        response = `Command not found: ${cmd}`;
    }

    newOutput.push({ type: 'response', text: response });
    setOutput(newOutput);
    setInput('');
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.outputWindow}
        contentContainerStyle={styles.scrollContent}
      >
        {output.map((line, index) => (
          <Text key={index} style={[
            styles.text, 
            line.type === 'input' ? styles.inputText : styles.responseText
          ]}>
            {line.text}
          </Text>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <Text style={styles.prompt}>$</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleCommand}
          placeholder="Type command..."
          placeholderTextColor="#666"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  outputWindow: {
    flex: 1,
    padding: 15,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  text: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    marginBottom: 5,
  },
  inputText: {
    color: '#00ff00',
    fontWeight: 'bold',
  },
  responseText: {
    color: '#cccccc',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#000',
  },
  prompt: {
    color: '#00ff00',
    fontSize: 16,
    marginRight: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 16,
    height: 40,
  },
});
