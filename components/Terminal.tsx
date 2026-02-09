import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { LogEntry } from '../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

interface TerminalProps {
  logs: LogEntry[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [logs]);

  return (
    <StyledView className="flex-1 bg-black p-4">
      <StyledScrollView ref={scrollViewRef} className="flex-1">
        {logs.map((log) => (
          <StyledText key={log.id} className="font-mono text-xs mb-1">
            <StyledText className="text-gray-600">[{log.timestamp}] </StyledText>
            <StyledText className={`font-bold ${
              log.level === 'success' ? 'text-emerald-500' : 
              log.level === 'error' ? 'text-red-500' : 
              log.level === 'warning' ? 'text-yellow-500' : 
              log.level === 'critical' ? 'text-fuchsia-500' : 'text-blue-500'
            }`}>
              {log.level.toUpperCase()}
            </StyledText>
            <StyledText className="text-gray-400"> {log.message}</StyledText>
          </StyledText>
        ))}
      </StyledScrollView>
    </StyledView>
  );
};

export default Terminal;
