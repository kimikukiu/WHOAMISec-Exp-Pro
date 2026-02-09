export enum AppTab {
  DASHBOARD = 'DASHBOARD',
  EXTRACTOR = 'EXTRACTOR',
  SQL_INJECT = 'SQL_INJECT',
  NETWORK = 'NETWORK',
  BOTNET_CORE = 'BOTNET_CORE',
  SETTINGS = 'SETTINGS',
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error' | 'critical';
}

export interface OSINTResult {
  target: string;
  timestamp: string;
  type: 'full' | 'quick' | 'deep';
  emails: string[];
  phones: string[];
  nicknames: string[];
  telegram: string[];
  tiktok: string[];
  socialMedia: string[];
  breaches: string[];
  vulnerabilities: string[];
  scrapedFiles: { name: string; extension: string; size: string; source: string }[];
  exploits: Exploit[];
  metadata: {
    sourceCount: number;
    reliabilityScore: number;
    threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  };
  summary: string;
}

export interface Exploit {
  name: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  type: string;
}

export interface ExploitHistoryItem {
  id: string;
  exploitName: string;
  target: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  leakedData?: LeakedData;
}

export interface LeakedData {
  records: LeakedRecord[];
  adminPanelLink: string;
  databaseName: string;
  extractionLog: string[];
  deepFiles: string[];
}

export interface LeakedRecord {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  role: string;
}

export interface ThreatFeedItem {
  id: string;
  source: string;
  event: string;
  time: string;
}

export interface NetworkConfig {
  threads: number;
  time: number;
  rqs: number;
  proxyScrape: boolean;
  method: string;
  powerLevel: 'Standard' | 'Turbo' | 'Critical' | 'EXTREME_OVERCLOCK';
  payloadSize: number;
  headerJitter: boolean;
}

export interface BotNode {
  id: string;
  country: string;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY';
  latency: number;
  uptime: string;
  type: 'IOT' | 'SERVER' | 'DESKTOP';
}
