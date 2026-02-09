
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Terminal from './components/Terminal';
import { AppTab, LogEntry, OSINTResult, ThreatFeedItem, Exploit, ExploitHistoryItem, LeakedRecord, NetworkConfig, BotNode } from './types';
import { analyzeTarget, generateLeakedData } from './services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_CHART_DATA = [
  { name: '00:00', intensity: 10 }, { name: '04:00', intensity: 40 },
  { name: '08:00', intensity: 20 }, { name: '12:00', intensity: 80 },
  { name: '16:00', intensity: 120 }, { name: '20:00', intensity: 150 },
  { name: '23:59', intensity: 30 },
];

const BOT_LOCATIONS = [
  { id: 'US-01', country: 'USA', status: 'ONLINE', latency: 45, uptime: '12d', type: 'SERVER' },
  { id: 'RU-05', country: 'Russia', status: 'ONLINE', latency: 120, uptime: '45d', type: 'IOT' },
  { id: 'CN-09', country: 'China', status: 'BUSY', latency: 250, uptime: '5d', type: 'SERVER' },
  { id: 'DE-02', country: 'Germany', status: 'ONLINE', latency: 32, uptime: '89d', type: 'DESKTOP' },
  { id: 'BR-11', country: 'Brazil', status: 'ONLINE', latency: 180, uptime: '2d', type: 'IOT' },
  { id: 'JP-04', country: 'Japan', status: 'ONLINE', latency: 60, uptime: '15d', type: 'SERVER' },
];

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
    case 'Critical': return 'text-fuchsia-500 border-fuchsia-500 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(192,38,211,0.2)]';
    case 'High': return 'text-red-500 border-red-500 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
    case 'Medium': return 'text-orange-500 border-orange-500 bg-orange-500/10';
    case 'Low': return 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
    default: return 'text-gray-400 border-gray-400 bg-gray-400/10';
  }
};

const App: React.FC = () => {
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
  const [exploitHistory, setExploitHistory] = useState<ExploitHistoryItem[]>([]);
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
    if (!targetInput) return;
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
    
    setExploitHistory(prev => [newHistory, ...prev]);
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
    <div className="flex h-screen overflow-hidden bg-[#020202] text-[#e2e8f0] font-mono antialiased">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} target={targetInput || "NO_TARGET"} isUp={isTargetUp} isAttacking={isAttacking} netConfig={netConfig} />
      
      <main className="flex-1 ml-16 md:ml-64 overflow-y-auto p-4 md:p-10 custom-scroll pb-72">
        <header className="flex items-center justify-between mb-10 border-b border-white/5 pb-8 relative">
          <div className="flex flex-col">
             <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">WHOAMISec <span className="text-emerald-500">PRO_BOT</span></h1>
                <span className="px-2 py-0.5 bg-fuchsia-600/20 text-fuchsia-500 text-[8px] font-black rounded border border-fuchsia-500/30 animate-pulse uppercase tracking-widest">Standalone_Kernel_V8.5</span>
             </div>
             <p className="text-[10px] text-gray-600 tracking-[0.4em] uppercase font-black mt-2">Distributed Command & Control Interface</p>
          </div>
          <div className="flex gap-4">
             <div className="hidden lg:flex items-center gap-6 px-6 py-3 bg-black/40 border border-emerald-500/20 rounded-2xl shadow-inner">
                <div className="flex flex-col items-center">
                   <span className="text-[8px] text-gray-500 font-black uppercase">Nodes</span>
                   <span className="text-xs text-emerald-500 font-black">45,231</span>
                </div>
                <div className="w-px h-6 bg-white/5"></div>
                <div className="flex flex-col items-center">
                   <span className="text-[8px] text-gray-500 font-black uppercase">Global_Load</span>
                   <span className={`text-xs font-black ${isAttacking ? 'text-fuchsia-500' : 'text-blue-500'}`}>{isAttacking ? '99%' : '2%'}</span>
                </div>
             </div>
             <button onClick={() => window.location.reload()} className="p-4 bg-white/5 border border-white/5 text-gray-400 rounded-2xl hover:text-white hover:bg-white/10 transition-all"><i className="fas fa-rotate"></i></button>
          </div>
        </header>

        {activeTab === AppTab.DASHBOARD && (
          <div className="space-y-8 animate-in">
             {/* Swarm Visualization Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#050505] border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden h-[500px]">
                   <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none cyber-grid"></div>
                   <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-8 flex items-center gap-3"><i className="fas fa-earth-americas"></i> Global Bot Swarm Distribution</h3>
                   <div className="relative w-full h-full flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-10 opacity-30">
                         {botNodes.map(node => (
                            <div key={node.id} className={`flex flex-col items-center gap-2 ${isAttacking ? 'animate-pulse' : ''}`}>
                               <div className={`w-12 h-12 rounded-full border-2 ${isAttacking ? 'border-fuchsia-500 bg-fuchsia-500/20' : 'border-emerald-500 bg-emerald-500/10'} flex items-center justify-center`}>
                                  <i className="fas fa-microchip text-xl text-white"></i>
                               </div>
                               <span className="text-[8px] font-black text-gray-500 uppercase">{node.country}</span>
                            </div>
                         ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className={`w-[80%] h-[80%] border-2 border-emerald-500/10 rounded-full ${isAttacking ? 'animate-spin-slow scale-110 border-fuchsia-500/20' : ''}`}></div>
                         <div className={`absolute w-[60%] h-[60%] border border-emerald-500/5 rounded-full ${isAttacking ? 'animate-reverse-spin scale-125 border-fuchsia-500/10' : ''}`}></div>
                      </div>
                      {isAttacking && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <h2 className="text-6xl font-black text-fuchsia-500/80 italic animate-pulse">SWARM ACTIVE</h2>
                           <p className="text-[12px] text-fuchsia-400 font-mono mt-4 tracking-[1em]">EXTREME_OVERCLOCK_MODE</p>
                        </div>
                      )}
                   </div>
                </div>
                <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-8 flex flex-col h-full shadow-2xl">
                   <h3 className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-6 border-b border-white/5 pb-4">Real-Time Threat Intelligence</h3>
                   <div className="space-y-4 overflow-y-auto custom-scroll pr-2 flex-1">
                      {threatFeed.map(item => (
                        <div key={item.id} className="p-4 bg-black border border-white/5 rounded-2xl animate-in shadow-inner border-l-2 border-l-emerald-500/40">
                           <div className="flex justify-between text-[8px] font-black uppercase text-emerald-900 mb-2 font-mono"><span>{item.source}</span><span>{item.time}</span></div>
                           <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-tighter">{item.event}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'C2 Kernel', value: 'Standalone v8.5', icon: 'fa-microchip', color: 'text-emerald-500' },
                { label: 'Zombie Count', value: '45.2K Active', icon: 'fa-users-rays', color: 'text-fuchsia-500' },
                { label: 'Max Throughput', value: '1.2 Tbps', icon: 'fa-bolt-lightning', color: 'text-orange-500' },
                { label: 'Stealth Factor', value: 'Grade-A (Encrypted)', icon: 'fa-mask', color: 'text-blue-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#050505] border border-white/5 p-6 rounded-[2rem] flex items-center gap-5 shadow-2xl group hover:border-emerald-500/20 transition-all">
                  <div className={`w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-2xl ${stat.color} ring-1 ring-white/5 group-hover:scale-110 transition-transform`}><i className={`fas ${stat.icon}`}></i></div>
                  <div>
                    <p className="text-gray-600 text-[9px] uppercase font-black tracking-widest">{stat.label}</p>
                    <h3 className="text-lg font-black text-white uppercase">{stat.value}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === AppTab.NETWORK && (
          <div className="space-y-8 animate-in">
             <div className="bg-[#050505] border border-white/5 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><i className="fas fa-satellite-dish text-[30rem]"></i></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                   <div className="space-y-10">
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter border-b border-white/5 pb-6">Payload Injector & Swarm Config</h3>
                      <div className="space-y-8">
                         <div className="relative group">
                            <label className="text-[10px] text-gray-600 font-black uppercase mb-3 block tracking-[0.3em]">Primary Target Vector</label>
                            <input type="text" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} placeholder="https://target-server.net" className="w-full bg-black border border-white/5 rounded-2xl p-6 text-fuchsia-500 font-mono text-lg focus:border-fuchsia-500/50 transition-all outline-none shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                         </div>
                         <div className="grid grid-cols-2 gap-8">
                            <div>
                               <label className="text-[10px] text-gray-600 font-black uppercase mb-3 block tracking-[0.3em]">Zombie Threads</label>
                               <input type="number" value={netConfig.threads} onChange={(e) => setNetConfig({...netConfig, threads: parseInt(e.target.value)})} className="w-full bg-black border border-white/5 rounded-2xl p-5 text-white font-mono focus:border-emerald-500 outline-none" />
                            </div>
                            <div>
                               <label className="text-[10px] text-gray-600 font-black uppercase mb-3 block tracking-[0.3em]">Power Overclock</label>
                               <select value={netConfig.powerLevel} onChange={(e) => setNetConfig({...netConfig, powerLevel: e.target.value as any})} className="w-full bg-black border border-white/5 rounded-2xl p-5 text-fuchsia-500 font-black uppercase outline-none cursor-pointer">
                                  <option value="Standard">Standard (Stable)</option>
                                  <option value="Turbo">Turbo (High-Load)</option>
                                  <option value="Critical">Critical (Stress)</option>
                                  <option value="EXTREME_OVERCLOCK">EXTREME_OVERCLOCK (DANGER)</option>
                               </select>
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-8">
                            <div>
                               <label className="text-[10px] text-gray-600 font-black uppercase mb-3 block tracking-[0.3em]">Attack Strategy</label>
                               <select value={strategy} onChange={(e) => setStrategy(e.target.value)} className="w-full bg-black border border-white/5 rounded-2xl p-5 text-emerald-500 font-black uppercase outline-none cursor-pointer">
                                  {STRATEGIES[AppTab.NETWORK].map(m => <option key={m} value={m}>{m}</option>)}
                               </select>
                            </div>
                            <div>
                               <label className="text-[10px] text-gray-600 font-black uppercase mb-3 block tracking-[0.3em]">Payload Size (kb)</label>
                               <input type="number" value={netConfig.payloadSize} onChange={(e) => setNetConfig({...netConfig, payloadSize: parseInt(e.target.value)})} className="w-full bg-black border border-white/5 rounded-2xl p-5 text-white font-mono focus:border-emerald-500 outline-none" />
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="flex flex-col justify-center items-center">
                      <div className="bg-black/50 border border-white/5 rounded-[5rem] p-16 text-center shadow-[inset_0_0_100px_rgba(192,38,211,0.05)] border-t-8 border-t-fuchsia-600 relative overflow-hidden w-full max-w-md">
                         <div className={`w-40 h-40 ${isAttacking ? 'bg-fuchsia-600/30 animate-spin-slow scale-110' : 'bg-fuchsia-600/10'} border-8 border-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_80px_rgba(192,38,211,0.5)] transition-all`}>
                            <i className={`fas ${isAttacking ? 'fa-bolt-lightning' : 'fa-skull-crossbones'} text-fuchsia-600 text-7xl`}></i>
                         </div>
                         <h4 className="text-4xl font-black text-white uppercase italic mb-4 tracking-tighter">SWARM_COMMAND</h4>
                         <p className="text-[11px] text-gray-600 font-black uppercase mb-12 tracking-[0.5em]">{isAttacking ? 'ZOMBIE_PROTOCOL_ENGAGED' : 'AWAITING_MASTER_ORDER'}</p>
                         
                         {!isAttacking ? (
                           <button onClick={startDdos} className="w-full bg-fuchsia-600 text-black py-8 rounded-[2.5rem] font-black text-2xl uppercase hover:bg-fuchsia-500 shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-6 group">
                             <i className="fas fa-play group-hover:scale-125 transition-transform"></i> EXECUTE SWARM
                           </button>
                         ) : (
                           <button onClick={stopDdos} className="w-full bg-white text-black py-8 rounded-[2.5rem] font-black text-2xl uppercase hover:bg-gray-200 shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-6">
                             <i className="fas fa-stop-circle text-fuchsia-600"></i> TERMINAL_KILL
                           </button>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {(activeTab === AppTab.EXTRACTOR || activeTab === AppTab.SQL_INJECT) && (
          <div className="space-y-8 animate-in">
             <div className="bg-[#050505] border border-white/5 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="max-w-5xl mx-auto space-y-10 relative z-10 text-center">
                   <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Deep-Spectrum Identity Extractor</h2>
                   <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1 relative group">
                        <i className="fas fa-fingerprint absolute left-8 top-1/2 -translate-y-1/2 text-emerald-500 text-xl"></i>
                        <input type="text" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} placeholder="ENTER VECTOR TARGET (URL/IP)" className="w-full bg-black border border-white/10 rounded-3xl py-8 pl-16 pr-8 text-emerald-400 text-xl font-mono focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none shadow-2xl" />
                      </div>
                      <select value={strategy} onChange={(e) => setStrategy(e.target.value)} className="md:w-96 bg-black border border-white/10 rounded-3xl py-8 px-10 text-emerald-500 text-xl font-black uppercase appearance-none cursor-pointer outline-none shadow-2xl">
                        {(STRATEGIES[activeTab as keyof typeof STRATEGIES] || []).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                   </div>
                   <button onClick={handleScan} disabled={isScanning} className="w-full bg-emerald-600 text-black py-8 rounded-3xl font-black text-2xl uppercase hover:bg-emerald-500 shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-6 group">
                     {isScanning ? <i className="fas fa-dna fa-spin"></i> : <i className="fas fa-skull-cowboy group-hover:scale-125 transition-transform"></i>}
                     {isScanning ? 'EXTRACTING_IDENTITIES...' : `INITIALIZE REAPER NODE`}
                   </button>
                </div>
             </div>

             {currentResult && (
               <>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in">
                  <ResultCategory title="Identity Swarm" icon="fa-id-card-clip" items={[ ...(currentResult.emails || []).map(v => ({ val: v, type: 'EMAIL_VECTOR' })), ...(currentResult.phones || []).map(v => ({ val: v, type: 'PHONE_VECTOR' })) ]} />
                  <ResultCategory title="Harvested Assets" icon="fa-box-open" items={(currentResult.scrapedFiles || []).map(f => ({ val: `${f.name} (${f.size})`, type: `ASSET_${f.extension}` }))} />
                  <ResultCategory title="Payload Options" icon="fa-virus-covid" items={currentResult.exploits.map(v => ({ val: `${v.name}`, type: `BYPASS_${v.severity.toUpperCase()}`, isClickable: true, original: v, severity: v.severity }))} onItemClick={(item) => setSelectedExploit(item.original)} />
               </div>
               </>
             )}
          </div>
        )}

        {activeTab === AppTab.BOTNET_CORE && (
           <div className="space-y-8 animate-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                    <h3 className="text-xl font-black text-white uppercase italic tracking-widest border-b border-white/5 pb-6 mb-8 flex items-center gap-4"><i className="fas fa-network-wired text-emerald-500"></i> Swarm Cluster Management</h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scroll pr-4">
                       {botNodes.map(node => (
                          <div key={node.id} className="bg-black/50 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                             <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${node.status === 'ONLINE' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-orange-500/10 border-orange-500 text-orange-500'}`}>
                                   <i className={`fas ${node.type === 'SERVER' ? 'fa-server' : node.type === 'IOT' ? 'fa-microchip' : 'fa-desktop'}`}></i>
                                </div>
                                <div>
                                   <p className="text-[12px] font-black text-white uppercase tracking-wider">{node.id} - {node.country}</p>
                                   <p className="text-[9px] text-gray-500 font-mono mt-1">Uptime: {node.uptime} | Latency: {node.latency}ms</p>
                                </div>
                             </div>
                             <span className={`text-[9px] font-black uppercase px-4 py-1 rounded-full ${node.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>{node.status}</span>
                          </div>
                       ))}
                    </div>
                 </div>
                 <div className="bg-[#050505] border border-white/5 rounded-[3rem] p-10 shadow-2xl flex flex-col items-center justify-center text-center">
                    <i className="fas fa-brain text-7xl text-fuchsia-500 mb-8 animate-pulse"></i>
                    <h3 className="text-2xl font-black text-white uppercase italic mb-4">Swarm Intelligence (AI-C2)</h3>
                    <p className="text-gray-400 text-sm max-w-sm mb-10 leading-relaxed italic">"Our neural C2 automatically rotates proxies and emulates human traffic patterns to bypass the world's strongest defenses."</p>
                    <div className="grid grid-cols-2 gap-4 w-full">
                       <div className="bg-black/80 border border-white/5 p-6 rounded-3xl">
                          <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Bypass_Success</p>
                          <p className="text-2xl font-black text-emerald-500">99.8%</p>
                       </div>
                       <div className="bg-black/80 border border-white/5 p-6 rounded-3xl">
                          <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Neural_Nodes</p>
                          <p className="text-2xl font-black text-fuchsia-500">12,400</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* PERSISTENT_TERMINAL */}
        <div className="fixed bottom-6 left-16 right-4 md:left-64 md:right-10 h-44 md:h-56 z-40 bg-black/95 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_-20px_80px_rgba(0,0,0,0.9)] border-t-emerald-500/20">
           <Terminal logs={logs} />
        </div>
      </main>

      {/* DATA VAULT MODAL */}
      {viewingExploitResult && viewingExploitResult.leakedData && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-6 md:p-12 animate-in">
          <div className="bg-[#050505] border border-fuchsia-500/40 w-full max-w-7xl rounded-[4rem] shadow-[0_0_150px_rgba(192,38,211,0.2)] overflow-hidden relative border-t-[12px] border-t-fuchsia-600">
            <div className="p-12 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a]">
               <div className="flex items-center gap-10">
                  <div className="w-24 h-24 rounded-3xl bg-fuchsia-600/10 flex items-center justify-center border-4 border-fuchsia-600 shadow-[0_0_40px_rgba(192,38,211,0.4)] animate-pulse">
                     <i className="fas fa-database text-fuchsia-500 text-5xl"></i>
                  </div>
                  <div>
                     <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">EXTRACTED_IDENTITY_VAULT</h3>
                     <p className="text-[12px] text-fuchsia-500 font-black uppercase tracking-[0.6em] mt-4 italic">CLUSTER_SOURCE: {viewingExploitResult.leakedData.databaseName}</p>
                  </div>
               </div>
               <button onClick={() => setViewingExploitResult(null)} className="text-gray-600 hover:text-white text-5xl ml-6 transition-transform hover:rotate-90 duration-300"><i className="fas fa-circle-xmark"></i></button>
            </div>
            <div className="p-12 space-y-12 overflow-y-auto max-h-[70vh] custom-scroll">
               <div className="space-y-8">
                  <h4 className="text-[14px] font-black text-gray-500 uppercase tracking-[0.5em] border-b border-white/5 pb-6 flex items-center gap-4"><i className="fas fa-table-list"></i> Decrypted User Manifest</h4>
                  <div className="overflow-hidden border border-white/5 rounded-[3rem] bg-black shadow-2xl">
                     <table className="w-full text-left text-sm font-mono">
                        <thead className="bg-[#0a0a0a] text-fuchsia-500 font-black uppercase text-[12px] border-b border-white/5">
                           <tr><th className="px-10 py-8">UID</th><th className="px-10 py-8">IDENTIFIER</th><th className="px-10 py-8">CREDENTIAL_VAULT</th><th className="px-10 py-8">CONTACT_EMAIL</th><th className="px-10 py-8">ACL_ROLE</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-400">
                           {viewingExploitResult.leakedData.records.map((rec) => (
                              <tr key={rec.id} className="hover:bg-fuchsia-600/5 transition-all group">
                                 <td className="px-10 py-6 font-black text-gray-700">{rec.id}</td>
                                 <td className="px-10 py-6 text-white font-black text-lg">{rec.username}</td>
                                 <td className="px-10 py-6 text-red-500/80 font-bold truncate max-w-[250px] group-hover:text-fuchsia-400">{rec.passwordHash}</td>
                                 <td className="px-10 py-6 italic text-[12px]">{rec.email}</td>
                                 <td className="px-10 py-6"><span className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest ${rec.role.includes('Admin') ? 'bg-red-500/20 text-red-500 border border-red-500/40' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'}`}>{rec.role}</span></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPLOIT MODAL */}
      {selectedExploit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-10 animate-in">
           <div className="bg-[#050505] border border-white/10 w-full max-w-3xl rounded-[4rem] shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden relative">
              <div className={`h-4 w-full ${getSeverityStyles(selectedExploit.severity).includes('fuchsia') ? 'bg-fuchsia-600' : 'bg-emerald-600'} absolute top-0 left-0`}></div>
              <div className="p-12 border-b border-white/5 flex justify-between items-center bg-[#0a0a0a] mt-4">
                 <div className="flex items-center gap-8">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border-4 ${getSeverityStyles(selectedExploit.severity)} shadow-2xl transition-all`}><i className="fas fa-biohazard text-4xl"></i></div>
                    <div><h3 className="text-3xl font-black uppercase text-white tracking-tighter italic">{selectedExploit.name}</h3><span className={`text-[11px] font-black px-5 py-1.5 rounded-full border-2 ${getSeverityStyles(selectedExploit.severity)} uppercase mt-3 inline-block tracking-widest`}>{selectedExploit.severity} LOAD</span></div>
                 </div>
                 <button onClick={() => setSelectedExploit(null)} className="text-gray-600 hover:text-white text-5xl transition-colors"><i className="fas fa-circle-xmark"></i></button>
              </div>
              <div className="p-16 space-y-12">
                 <p className="text-2xl text-gray-400 font-mono leading-relaxed italic border-l-8 border-emerald-500/20 pl-10 py-4 font-light">"{selectedExploit.description}"</p>
                 <button onClick={() => handleRunExploit(selectedExploit)} className="w-full bg-fuchsia-600 text-black font-black py-10 rounded-[3rem] uppercase tracking-[0.4em] text-3xl hover:bg-fuchsia-500 shadow-[0_20px_60px_rgba(192,38,211,0.3)] active:scale-95 transition-all flex items-center justify-center gap-8"><i className="fas fa-radiation text-4xl"></i> INITIALIZE SWARM PAYLOAD</button>
              </div>
           </div>
        </div>
      )}

      {/* OVERLAY */}
      {(isExploiting || isScanning) && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/98 backdrop-blur-3xl">
           <div className="relative w-80 h-80 mb-16">
              <div className="absolute inset-0 border-8 border-fuchsia-600/20 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-fuchsia-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-10 border-4 border-emerald-500/20 rounded-full"></div>
              <div className="absolute inset-10 border-4 border-emerald-500 border-b-transparent rounded-full animate-reverse-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <i className={`fas ${isScanning ? 'fa-dna' : 'fa-skull-crossbones'} text-white text-6xl animate-pulse`}></i>
              </div>
           </div>
           <div className="text-center">
              <h3 className="text-fuchsia-500 font-black text-6xl uppercase tracking-[0.5em] animate-pulse italic leading-tight">{isScanning ? 'EXTRACTING_INTEL' : 'BYPASSING_PROTECTIONS'}</h3>
              <p className="text-[14px] text-gray-600 uppercase mt-10 font-mono tracking-[0.5em] font-black">Standalone Swarm Kernel v8.5 [OVERCLOCK_ACTIVE]</p>
           </div>
        </div>
      )}
    </div>
  );
};

const ResultCategory = ({ title, icon, items, onItemClick }: { title: string, icon: string, items: any[], onItemClick?: (item: any) => void }) => (
  <div className="bg-[#050505] border border-white/5 rounded-[3.5rem] p-10 flex flex-col h-full min-h-[450px] shadow-2xl transition-all hover:border-emerald-500/20 group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.06] transition-all"><i className={`fas ${icon} text-[12rem] text-emerald-500`}></i></div>
    <div className="flex items-center gap-8 mb-12 border-b border-white/5 pb-10 relative z-10">
      <div className="w-20 h-20 rounded-3xl bg-black flex items-center justify-center ring-1 ring-white/10 group-hover:ring-emerald-500/50 transition-all shadow-inner"><i className={`fas ${icon} text-3xl text-emerald-500/80`}></i></div>
      <h4 className="text-[16px] font-black text-white uppercase tracking-[0.5em] italic">{title}</h4>
    </div>
    <div className="space-y-6 overflow-y-auto custom-scroll pr-4 flex-1 relative z-10">
      {items.length === 0 && <div className="py-24 text-center opacity-10"><p className="text-[14px] font-black uppercase tracking-[0.8em]">Buffer Null</p></div>}
      {items.map((item, idx) => (
        <div key={idx} {...(item.isClickable ? { onClick: () => onItemClick?.(item) } : {})} className={`group/item flex flex-col p-8 bg-black/40 border border-white/5 rounded-3xl relative transition-all ${item.isClickable ? `cursor-pointer hover:bg-emerald-500/5 hover:scale-[1.02] border-emerald-500/20 shadow-2xl` : 'hover:border-white/10 shadow-md'}`}>
          <div className="flex justify-between items-start mb-5">
            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${item.severity ? getSeverityStyles(item.severity).split(' ')[0] : 'text-gray-500'}`}>{item.type}</span>
            {item.severity && <span className={`text-[10px] font-black border-2 px-4 py-1.5 rounded-full ${getSeverityStyles(item.severity)}`}>{item.severity.toUpperCase()}</span>}
          </div>
          <span className="text-[16px] font-mono break-all leading-tight text-white/80 group-hover/item:text-emerald-400 transition-colors font-bold uppercase italic">{item.val}</span>
        </div>
      ))}
    </div>
  </div>
);

export default App;
