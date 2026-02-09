
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';

interface TerminalProps {
  logs: LogEntry[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-[#050505] border border-[#1a1a1a] rounded-lg overflow-hidden flex flex-col h-full relative group">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]"></div>
      <div className="bg-[#0a0a0a] px-3 py-1.5 border-b border-[#111] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[9px] font-black font-mono text-gray-500 tracking-tighter">SECURE_OPERATIONS_FEED_V4</span>
        </div>
        <span className="text-[8px] font-mono text-gray-700">PID: {Math.floor(Math.random() * 9000) + 1000}</span>
      </div>
      <div className="p-3 font-mono text-[10px] overflow-y-auto flex-1 space-y-0.5 custom-scroll">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 leading-tight">
            <span className="text-gray-700 shrink-0">[{log.timestamp.split(' ')[0]}]</span>
            <span className={`font-bold shrink-0 ${
              log.level === 'success' ? 'text-emerald-500' : 
              log.level === 'error' ? 'text-red-500' : 
              log.level === 'warning' ? 'text-yellow-600' : 'text-blue-500'
            }`}>
              {log.level.toUpperCase()}
            </span>
            <span className="text-gray-400 break-all">{log.message}</span>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

export default Terminal;
