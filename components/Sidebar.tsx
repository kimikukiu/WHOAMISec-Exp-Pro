
import React from 'react';
import { AppTab, NetworkConfig } from '../types';

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
    { id: AppTab.DASHBOARD, label: 'Control Center', icon: 'fa-microchip' },
    { id: AppTab.EXTRACTOR, label: 'Deep Extractor', icon: 'fa-user-secret' },
    { id: AppTab.SQL_INJECT, label: 'Payload Vault', icon: 'fa-database' },
    { id: AppTab.NETWORK, label: 'Attack Console', icon: 'fa-satellite-dish' },
    { id: AppTab.BOTNET_CORE, label: 'Zombie Swarm', icon: 'fa-users-rays' },
    { id: AppTab.SETTINGS, label: 'Kernel Config', icon: 'fa-sliders' },
  ];

  const getPowerColor = () => {
    if (!netConfig) return 'text-emerald-500';
    if (netConfig.powerLevel === 'EXTREME_OVERCLOCK') return 'text-fuchsia-500 animate-pulse';
    if (netConfig.powerLevel === 'Critical') return 'text-red-500';
    if (netConfig.powerLevel === 'Turbo') return 'text-orange-500';
    return 'text-emerald-500';
  };

  return (
    <aside className="w-16 md:w-64 bg-[#050505] border-r border-emerald-500/10 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-4 md:p-6 flex items-center justify-center md:justify-start gap-3 border-b border-white/5 mb-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-2xl ring-1 transition-all ${isAttacking ? 'bg-fuchsia-600 ring-fuchsia-400 animate-pulse' : 'bg-emerald-500 ring-emerald-400/50'}`}>
          <i className={`fas ${isAttacking ? 'fa-bolt-lightning' : 'fa-skull'} text-black text-lg`}></i>
        </div>
        <div className="hidden md:block flex flex-col">
          <span className="font-black text-sm tracking-widest text-white uppercase italic">WHOAMISec</span>
          <span className={`text-[10px] font-black uppercase ${isAttacking ? 'text-fuchsia-500' : 'text-emerald-500'}`}>V8.5 PRO_BOT</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-center md:justify-start gap-4 px-4 md:px-6 py-4 transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border-r-4 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                : 'text-gray-500 hover:text-emerald-400 hover:bg-white/5'
            }`}
          >
            <i className={`fas ${item.icon} text-lg md:text-base w-6 transition-transform group-hover:scale-110`}></i>
            <span className="hidden md:block font-black uppercase text-[10px] tracking-[0.2em]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Persistent Swarm Monitor */}
      <div className="p-4 border-t border-white/5 hidden md:block">
        <div className={`bg-black/80 backdrop-blur-md p-4 rounded-2xl border ${isAttacking ? 'border-fuchsia-500/40 shadow-[0_0_30px_rgba(192,38,211,0.1)]' : 'border-emerald-500/10'} transition-all`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em]">Swarm Status</span>
            <div className={`w-2 h-2 rounded-full ${isUp ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'} `}></div>
          </div>
          <div className="flex flex-col gap-2">
             <p className="text-[10px] text-white font-mono font-bold truncate uppercase tracking-tighter">{target}</p>
             <div className="flex justify-between items-center border-t border-white/5 pt-2">
                <span className={`text-[8px] font-black uppercase ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isUp ? 'TARGET_ACTIVE' : 'TARGET_NULL'}
                </span>
                {isAttacking && (
                  <span className="text-[8px] font-black text-fuchsia-500 uppercase animate-bounce">SWARMING...</span>
                )}
             </div>
             {isAttacking && netConfig && (
               <div className="mt-2 space-y-1.5 bg-black/60 p-2.5 rounded-xl border border-white/5">
                  <div className="flex justify-between text-[7px] text-gray-600 font-black uppercase">
                     <span>ZOMBIES</span>
                     <span className={getPowerColor()}>{(netConfig.threads * (netConfig.powerLevel === 'EXTREME_OVERCLOCK' ? 100 : netConfig.powerLevel === 'Critical' ? 10 : 1)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[7px] text-gray-600 font-black uppercase">
                     <span>LOAD_FACTOR</span>
                     <span className={getPowerColor()}>{netConfig.powerLevel === 'EXTREME_OVERCLOCK' ? '99.9%' : '45.2%'}</span>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
                     <div className={`h-full transition-all duration-500 ${netConfig.powerLevel === 'EXTREME_OVERCLOCK' ? 'bg-fuchsia-600' : 'bg-emerald-500'}`} style={{ width: isAttacking ? '100%' : '0%' }}></div>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
