import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { AppTab, LogEntry, OSINTResult, ThreatFeedItem, Exploit, ExploitHistoryItem, NetworkConfig, BotNode } from './types';
import { analyzeTarget, generateLeakedData } from './services/geminiService';
import Sidebar from './components/Sidebar';
import Terminal from './components/Terminal';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const STRATEGIES = {
  [AppTab.EXTRACTOR]: ["Deep Forensic Harvester", "Full-Spectrum Identity Siphon", "DarkWeb Metadata Crawler", "Email/Phone/Handle Reaper"],
  [AppTab.SQL_INJECT]: ["Zero-Day Blind Bypass", "Extreme Schema Dump", "Auth-Layer Decryptor", "Admin-Access Token Siphon"],
  [AppTab.CMS_EXPLOIT]: ["SpyBruter v2 Global Scan", "Mass WordPress RCE", "Joomla Multi-Payload", "Ghost-Bypass Protocol"],
  [AppTab.NETWORK]: [
    "L7-BOTNET-STRESS (EXTREME)", 
    "CLOUDFLARE-UAM BYPASS V4", 
    "AWS-SHIELD SHREDDER", 
    "GOOGLE-CAPTCHA NEURAL SOLVER",
    "TCP-STREAMS ZOMBIE FLOOD"
  ]
};

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'text-fuchsia-500 border-fuchsia-500 bg-fuchsia-500/10';
    case 'High': return 'text-red-500 border-red-500 bg-red-500/10';
    case 'Medium': return 'text-orange-500 border-orange-500 bg-orange-500/10';
    case 'Low': return 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
    default: return 'text-gray-400 border-gray-400 bg-gray-400/10';
  }
};

const BOT_LOCATIONS = [
  { id: 'US-01', country: 'USA', status: 'ONLINE', latency: 45, uptime: '12d', type: 'SERVER' },
  { id: 'RU-05', country: 'Russia', status: 'ONLINE', latency: 120, uptime: '45d', type: 'IOT' },
  { id: 'CN-09', country: 'China', status: 'BUSY', latency: 250, uptime: '5d', type: 'SERVER' },
  { id: 'DE-02', country: 'Germany', status: 'ONLINE', latency: 32, uptime: '89d', type: 'DESKTOP' },
  { id: 'BR-11', country: 'Brazil', status: 'ONLINE', latency: 180, uptime: '2d', type: 'IOT' },
  { id: 'JP-04', country: 'Japan', status: 'ONLINE', latency: 60, uptime: '15d', type: 'SERVER' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [targetInput, setTargetInput] = useState('');
  const [strategy, setStrategy] = useState("L7-BOTNET-STRESS (EXTREME)");
  const [isScanning, setIsScanning] = useState(false);
  const [isExploiting, setIsExploiting] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isTargetUp, setIsTargetUp] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentResult, setCurrentResult] = useState<OSINTResult | null>(null);
  const [selectedExploit, setSelectedExploit] = useState<Exploit | null>(null);
  const [viewingExploitResult, setViewingExploitResult] = useState<ExploitHistoryItem | null>(null);
  const [threatFeed, setThreatFeed] = useState<ThreatFeedItem[]>([]);
  const [botNodes, setBotNodes] = useState<BotNode[]>(BOT_LOCATIONS as any);
  
  const attackIntervalRef = useRef<any>(null);

  const [netConfig, setNetConfig] = useState<NetworkConfig>({
    threads: 5000,
    time: 0,
    rqs: 150000,
    proxyScrape: true,
    method: 'L7-GECKO-V2',
    powerLevel: 'Standard',
    payloadSize: 1024,
    headerJitter: true
  });

  const addLog = useCallback((message: string, level: LogEntry['level'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
      message,
      level
    };
    setLogs(prev => [...prev.slice(-200), newLog]);
  }, []);

  useEffect(() => {
    const events = [
      "SWARM_CORE: 15,000 new IoT bots infected via CVE-2025-X.",
      "BYPASS_V4: Neural CAPTCHA solver training complete (99.8% acc).",
      "NETWORK: Global latency optimized. Target handshake ready.",
      "KERNEL: Standalone kernel v8.5 patched for extreme threading.",
      "ZOMBIE: Nodes in Asia-Pacific responding to C2 broadcast."
    ];
    const updateFeed = () => {
      const newItem: ThreatFeedItem = {
        id: Math.random().toString(36),
        source: "C2_MASTER",
        event: events[Math.floor(Math.random() * events.length)],
        time: new Date().toLocaleTimeString()
      };
      setThreatFeed(prev => [newItem, ...prev].slice(0, 15));
    };
    updateFeed();
    const interval = setInterval(updateFeed, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    addLog('SYSTEM_BOOT: WHOAMISec Standalone V8.5 EXTREME LOADED.', 'success');
    addLog('SWARM: Connecting to Global C2 Backbone...', 'info');
    setTimeout(() => addLog('SWARM: 45,230 nodes READY for deployment.', 'success'), 1500);
  }, [addLog]);

  useEffect(() => {
    const available = STRATEGIES[activeTab as keyof typeof STRATEGIES];
    if (available) setStrategy(available[0]);
  }, [activeTab]);

  const handleScan = async () => {
    if (!targetInput) {
      Alert.alert("Target Required", "Please enter a target URL or IP.");
      return;
    }
    setIsScanning(true);
    addLog(`INIT: Deploying Deep-Web Reaper on ${targetInput}...`, 'warning');
    addLog(`ZOMBIE: Tasking 1,000 nodes for identity extraction...`, 'info');
    try {
      const result = await analyzeTarget(targetInput, 'full', strategy);
      setCurrentResult(result);
      setIsTargetUp(true);
      addLog(`SUCCESS: Full-Spectrum Intel Extracted. Identities: ${result.emails.length + result.phones.length}`, 'success');
    } catch (err) {
      addLog(`ERR: C2 connection unstable. Re-syncing...`, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleRunExploit = async (exploit: Exploit) => {
    setIsExploiting(true);
    setSelectedExploit(null);
    addLog(`DEPLOY: Uploading Payload [${exploit.name}] to Swarm Buffer...`, 'warning');
    
    await new Promise(r => setTimeout(r, 1000));
    addLog(`BYPASS: Forcing admin-session through reCAPTCHA barrier...`, 'warning');
    await new Promise(r => setTimeout(r, 1200));
    addLog(`DATA: Harvesting SQL sectors via Zombie Swarm...`, 'success');
    
    const leaked = await generateLeakedData(currentResult?.target || targetInput || 'target.com', exploit.name);
    const newHistory: ExploitHistoryItem = {
      id: Math.random().toString(36),
      exploitName: exploit.name,
      target: currentResult?.target || targetInput || 'unknown',
      timestamp: new Date().toLocaleTimeString(),
      status: 'SUCCESS',
      leakedData: leaked
    };
    
    setViewingExploitResult(newHistory);
    setIsExploiting(false);
    addLog(`VAULT: Decrypted ${leaked.records.length} records. High-value data secured.`, 'success');
  };

  const startDdos = async () => {
    if (!targetInput) {
      addLog("ERR: Target destination NULL.", "critical");
      return;
    }
    setIsAttacking(true);
    setIsTargetUp(true);
    
    const mult = netConfig.powerLevel === 'EXTREME_OVERCLOCK' ? 50 : netConfig.powerLevel === 'Critical' ? 10 : 2;
    const finalRqs = netConfig.rqs * mult;

    addLog(`SWARM_ENGAGE: Power Mode [${netConfig.powerLevel}] active on ${targetInput}`, 'critical');
    
    if (strategy.includes("BYPASS") || strategy.includes("NEURAL")) {
      addLog(`BYPASS: Emulating human browser sessions on 10,000 nodes...`, 'warning');
      await new Promise(r => setTimeout(r, 800));
      addLog(`BYPASS: WAF/Captcha filters neutralized.`, 'success');
    }

    addLog(`ZOMBIE: Flooding via ${netConfig.threads * mult} threads. RQS: ${finalRqs.toLocaleString()}`, 'warning');

    let step = 0;
    attackIntervalRef.current = setInterval(() => {
      step++;
      if (step === 1 && netConfig.powerLevel === 'EXTREME_OVERCLOCK') {
        setIsTargetUp(false);
        addLog(`ALERT: Target ${targetInput} SHREDDED. Status: DOWN.`, 'critical');
      }
      addLog(`FLOOD: ${finalRqs.toLocaleString()} packets delivered. Swarm health: 100%`, 'info');
    }, 1200);
  };

  const stopDdos = () => {
    if (attackIntervalRef.current) {
      clearInterval(attackIntervalRef.current);
      attackIntervalRef.current = null;
    }
    setIsAttacking(false);
    setIsTargetUp(true);
    addLog(`SWARM_STOP: All zombie nodes returned to idle state.`, 'info');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#020202]">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <StyledView className="flex-1 flex-row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} target={targetInput || "NO_TARGET"} isUp={isTargetUp} isAttacking={isAttacking} netConfig={netConfig} />
        
        <StyledView className="flex-1 p-4">
          {activeTab === AppTab.DASHBOARD && (
            <StyledScrollView className="flex-1">
              <StyledText className="text-emerald-500 font-bold text-xl mb-4">GLOBAL SWARM DISTRIBUTION</StyledText>
              <StyledView className="flex-row flex-wrap gap-4">
                 {botNodes.map(node => (
                    <StyledView key={node.id} className="bg-[#111] p-4 rounded-xl border border-gray-800 w-[45%]">
                      <StyledText className="text-white font-bold">{node.id}</StyledText>
                      <StyledText className="text-gray-500 text-xs">{node.country}</StyledText>
                      <StyledText className={`text-xs font-bold mt-2 ${node.status === 'ONLINE' ? 'text-emerald-500' : 'text-orange-500'}`}>{node.status}</StyledText>
                    </StyledView>
                 ))}
              </StyledView>
            </StyledScrollView>
          )}

          {activeTab === AppTab.NETWORK && (
             <StyledScrollView className="flex-1">
                <StyledText className="text-fuchsia-500 font-bold text-xl mb-6">ATTACK CONSOLE</StyledText>
                <StyledTextInput 
                  className="bg-[#111] text-white p-4 rounded-xl border border-gray-800 mb-4"
                  placeholder="Target URL (e.g., https://target.com)"
                  placeholderTextColor="#666"
                  value={targetInput}
                  onChangeText={setTargetInput}
                />
                
                <StyledTouchableOpacity 
                  onPress={isAttacking ? stopDdos : startDdos}
                  className={`p-6 rounded-2xl items-center justify-center mb-6 ${isAttacking ? 'bg-white' : 'bg-fuchsia-600'}`}
                >
                  <StyledText className={`font-black text-xl ${isAttacking ? 'text-black' : 'text-white'}`}>
                    {isAttacking ? 'TERMINATE SWARM' : 'EXECUTE ATTACK'}
                  </StyledText>
                </StyledTouchableOpacity>

                <StyledView className="bg-[#111] p-4 rounded-xl border border-gray-800">
                   <StyledText className="text-gray-500 text-xs mb-2">POWER LEVEL</StyledText>
                   <StyledText className="text-fuchsia-500 font-black text-2xl">{netConfig.powerLevel}</StyledText>
                </StyledView>
             </StyledScrollView>
          )}

          <StyledView className="h-48 mt-4 bg-black border-t border-gray-800">
             <Terminal logs={logs} />
          </StyledView>
        </StyledView>
      </StyledView>

      {/* MODALS */}
      <Modal visible={!!selectedExploit} transparent animationType="slide">
         <StyledView className="flex-1 bg-black/90 justify-center p-6">
            <StyledView className="bg-[#111] p-6 rounded-3xl border border-gray-800">
               <StyledText className="text-white text-2xl font-black mb-4">{selectedExploit?.name}</StyledText>
               <StyledText className="text-gray-400 mb-8">{selectedExploit?.description}</StyledText>
               <StyledTouchableOpacity 
                  onPress={() => selectedExploit && handleRunExploit(selectedExploit)}
                  className="bg-emerald-600 p-4 rounded-xl items-center"
               >
                  <StyledText className="text-black font-bold">DEPLOY PAYLOAD</StyledText>
               </StyledTouchableOpacity>
               <StyledTouchableOpacity 
                  onPress={() => setSelectedExploit(null)}
                  className="mt-4 items-center"
               >
                  <StyledText className="text-gray-500">CANCEL</StyledText>
               </StyledTouchableOpacity>
            </StyledView>
         </StyledView>
      </Modal>

    </SafeAreaView>
  );
}
