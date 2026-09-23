export type OfficerRank = 
  | 'Detective' 
  | 'Senior Detective' 
  | 'Inspector' 
  | 'Chief Inspector' 
  | 'Captain' 
  | 'Forensic Analyst' 
  | 'Sergeant';

export type OfficerDepartment = 
  | 'Homicide' 
  | 'Major Crimes' 
  | 'Cybercrime & Digital Forensics' 
  | 'Narcotics & Vice' 
  | 'Financial Fraud' 
  | 'Special Investigations' 
  | 'Patrol & Tactical';

export interface Officer {
  id: string;
  badgeNumber: string;
  name: string;
  email: string;
  rank: OfficerRank;
  department: OfficerDepartment;
  avatarUrl?: string;
  clearanceLevel: 'Standard' | 'Classified' | 'Top Secret';
  joinedDate: string;
}

export type CrimeSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type CrimeStatus = 
  | 'Open' 
  | 'Under Investigation' 
  | 'Pending Review' 
  | 'Closed' 
  | 'Cold Case';

export type CrimeCategory = 
  | 'Homicide' 
  | 'Cybercrime' 
  | 'Armed Robbery' 
  | 'Narcotics' 
  | 'Aggravated Assault' 
  | 'Financial Fraud' 
  | 'Burglary' 
  | 'Kidnapping';

export interface Crime {
  id: string;
  caseNumber: string;
  title: string;
  category: CrimeCategory;
  severity: CrimeSeverity;
  status: CrimeStatus;
  incidentDate: string; // ISO date
  reportedDate: string; // ISO date
  district: string; // e.g., 'Downtown Sector', 'Harbor Docks', 'North Hills'
  locationAddress: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  reportingOfficerId: string;
  reportingOfficerName: string;
  leadInvestigatorId?: string;
  leadInvestigatorName?: string;
  summary: string;
  evidenceItems: string[];
  suspectIds: string[];
  victimIds: string[];
  witnessIds: string[];
  updatedAt: string;
}

export type SuspectStatus = 
  | 'In Custody' 
  | 'Warrant Active' 
  | 'Under Surveillance' 
  | 'Wanted' 
  | 'Released' 
  | 'Acquitted';

export type ThreatLevel = 'Critical' | 'Severe' | 'Elevated' | 'Guarded' | 'Low';

export interface Suspect {
  id: string;
  fullName: string;
  alias: string;
  dateOfBirth: string;
  gender: string;
  threatLevel: ThreatLevel;
  status: SuspectStatus;
  primaryOffense: string;
  priorConvictions: number;
  identifyingMarks: string;
  lastKnownLocation: string;
  mugshotUrl?: string;
  notes: string;
  linkedCrimeIds: string[];
  createdAt: string;
}

export interface Victim {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  contactNumber: string;
  confidentiality: 'Standard' | 'Protected' | 'Sealed';
  injuryReported: boolean;
  advocateAssigned?: string;
  statementGiven: boolean;
  linkedCrimeId: string;
  notes: string;
  createdAt: string;
}

export interface Witness {
  id: string;
  fullName: string;
  contactNumber: string;
  linkedCrimeId: string;
  protectionStatus: 'None' | 'Requested' | 'Active Protection';
  credibilityRating: 'High' | 'Moderate' | 'Questionable';
  statementSummary: string;
  interviewDate: string;
  interviewingOfficer: string;
  createdAt: string;
}

export interface InvestigationMilestone {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  completedBy?: string;
}

export interface InvestigationLog {
  id: string;
  timestamp: string;
  officerName: string;
  entry: string;
  type: 'Note' | 'Evidence' | 'Interview' | 'Warrant' | 'Ballistics' | 'Forensics';
}

export interface Investigation {
  id: string;
  crimeId: string;
  caseNumber: string;
  caseTitle: string;
  leadInvestigator: string;
  department: OfficerDepartment;
  status: 'Active' | 'Suspended' | 'Pending Review' | 'Concluded';
  priority: 'Priority 1 (Urgent)' | 'Priority 2 (High)' | 'Priority 3 (Routine)';
  startDate: string;
  targetClosureDate: string;
  milestones: InvestigationMilestone[];
  logs: InvestigationLog[];
  evidenceVaultId: string;
}

export interface HeatmapDistrict {
  id: string;
  name: string;
  code: string;
  incidentCount: number;
  criticalCount: number;
  riskRating: 'High' | 'Moderate' | 'Low';
  center: { lat: number; lng: number };
  svgCoords: { x: number; y: number; width: number; height: number };
}
