import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { AppTab, NetworkConfig } from '../types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  target?: string;
  isUp?: boolean;
  isAttacking?: boolean;
  netConfig?: NetworkConfig;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, target = "NONE", isUp = true, isAttacking = false, netConfig }) => {
  const menuItems = [
    { id: AppTab.DASHBOARD, label: 'Dash', icon: 'hardware-chip' },
    { id: AppTab.EXTRACTOR, label: 'Extract', icon: 'eye' },
    { id: AppTab.SQL_INJECT, label: 'Inject', icon: 'server' },
    { id: AppTab.NETWORK, label: 'Attack', icon: 'flash' },
    { id: AppTab.BOTNET_CORE, label: 'Bots', icon: 'planet' },
  ];

  return (
    <StyledView className="w-20 bg-[#0a0a0a] border-r border-gray-800 flex-col h-full pt-10 items-center">
      <StyledView className={`w-12 h-12 rounded-xl items-center justify-center mb-10 ${isAttacking ? 'bg-fuchsia-600' : 'bg-emerald-600'}`}>
         <Ionicons name={isAttacking ? "flash" : "skull"} size={24} color="black" />
      </StyledView>

      <StyledView className="flex-1 gap-6">
        {menuItems.map((item) => (
          <StyledTouchableOpacity
            key={item.id}
            onPress={() => setActiveTab(item.id)}
            className={`items-center justify-center w-14 h-14 rounded-2xl ${activeTab === item.id ? 'bg-emerald-500/20' : ''}`}
          >
            <Ionicons 
              name={item.icon as any} 
              size={24} 
              color={activeTab === item.id ? '#10b981' : '#6b7280'} 
            />
            <StyledText className="text-[8px] text-gray-500 mt-1 uppercase font-bold">{item.label}</StyledText>
          </StyledTouchableOpacity>
        ))}
      </StyledView>
    </StyledView>
  );
};

export default Sidebar;
