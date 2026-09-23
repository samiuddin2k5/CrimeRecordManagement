import { Crime, Suspect, Victim, Witness, Investigation, Officer } from '../types';
import suspectMaleImg from '../assets/images/suspect_profile_male_1790191959916.jpg';
import suspectFemaleImg from '../assets/images/suspect_profile_female_1790191978487.jpg';

const STORAGE_KEYS = {
  OFFICERS: 'police_rms_officers',
  CURRENT_OFFICER: 'police_rms_current_officer',
  CRIMES: 'police_rms_crimes',
  SUSPECTS: 'police_rms_suspects',
  VICTIMS: 'police_rms_victims',
  WITNESSES: 'police_rms_witnesses',
  INVESTIGATIONS: 'police_rms_investigations',
  SUPABASE_CONFIG: 'police_rms_supabase_config',
};

export const INITIAL_OFFICERS: Officer[] = [
  {
    id: 'off-1',
    badgeNumber: 'PD-4921',
    name: 'Marcus Vance',
    email: 'officer@police.gov',
    rank: 'Detective',
    department: 'Major Crimes',
    clearanceLevel: 'Classified',
    joinedDate: '2019-04-12',
  },
  {
    id: 'off-2',
    badgeNumber: 'PD-1088',
    name: 'Sarah Jenkins',
    email: 's.jenkins@police.gov',
    rank: 'Senior Detective',
    department: 'Homicide',
    clearanceLevel: 'Top Secret',
    joinedDate: '2015-08-20',
  },
  {
    id: 'off-3',
    badgeNumber: 'PD-0341',
    name: 'Elena Rostova',
    email: 'e.rostova@police.gov',
    rank: 'Chief Inspector',
    department: 'Cybercrime & Digital Forensics',
    clearanceLevel: 'Top Secret',
    joinedDate: '2012-01-15',
  },
];

export const INITIAL_SUSPECTS: Suspect[] = [
  {
    id: 'susp-1',
    fullName: 'Damian "Apex" Cross',
    alias: 'The Cipher',
    dateOfBirth: '1989-11-04',
    gender: 'Male',
    threatLevel: 'Critical',
    status: 'Wanted',
    primaryOffense: 'Armed Bank Robbery & Digital Vault Exploitation',
    priorConvictions: 4,
    identifyingMarks: 'Spider web tattoo on left forearm, scar above right eyebrow',
    lastKnownLocation: 'Harbor Docks Industrial Strip',
    mugshotUrl: suspectMaleImg,
    notes: 'Ex-military tactical training. Armed and considered extremely dangerous. Multiple federal warrants active.',
    linkedCrimeIds: ['crime-1', 'crime-3'],
    createdAt: '2026-01-14T08:30:00Z',
  },
  {
    id: 'susp-2',
    fullName: 'Elena "Valkyrie" Mercer',
    alias: 'Ghostwire',
    dateOfBirth: '1995-03-22',
    gender: 'Female',
    threatLevel: 'Severe',
    status: 'Under Surveillance',
    primaryOffense: 'High-Value Municipal Cryptographic Extortion',
    priorConvictions: 1,
    identifyingMarks: 'Geometric feather tattoo behind right ear, slight limp on left ankle',
    lastKnownLocation: 'Downtown Financial Sector Penthouse',
    mugshotUrl: suspectFemaleImg,
    notes: 'Primary suspect in metropolitan power grid relay intrusion. Tracking communications via secure channels.',
    linkedCrimeIds: ['crime-2'],
    createdAt: '2026-02-02T14:15:00Z',
  },
  {
    id: 'susp-3',
    fullName: 'Viktor "Hammer" Kozlov',
    alias: 'The Broker',
    dateOfBirth: '1982-07-19',
    gender: 'Male',
    threatLevel: 'Severe',
    status: 'In Custody',
    primaryOffense: 'Narcotics Trafficking & Illicit Firearm Distribution',
    priorConvictions: 6,
    identifyingMarks: 'Bear claw burn mark on right shoulder',
    lastKnownLocation: 'North Ridge Correctional Facility - Block B',
    notes: 'Arrested during raid on Warehouse 14. Currently undergoing interrogation by Major Crimes unit.',
    linkedCrimeIds: ['crime-4'],
    createdAt: '2025-11-20T19:00:00Z',
  },
  {
    id: 'susp-4',
    fullName: 'Arthur Pendelton',
    alias: 'The Architect',
    dateOfBirth: '1976-09-12',
    gender: 'Male',
    threatLevel: 'Elevated',
    status: 'Warrant Active',
    primaryOffense: 'Securities Fraud & International Money Laundering',
    priorConvictions: 0,
    identifyingMarks: 'Prescription titanium rim glasses, silver signet ring',
    lastKnownLocation: 'Suburban Uplands / Private Airfield Area',
    notes: 'Shell company coordinator for syndicate operations. Flight risk alert issued to regional transport hubs.',
    linkedCrimeIds: ['crime-5'],
    createdAt: '2026-02-18T10:00:00Z',
  },
];

export const INITIAL_VICTIMS: Victim[] = [
  {
    id: 'vic-1',
    fullName: 'Julian Hayes',
    age: 44,
    gender: 'Male',
    contactNumber: '(555) 019-4821',
    confidentiality: 'Protected',
    injuryReported: true,
    advocateAssigned: 'Officer Clara Higgins',
    statementGiven: true,
    linkedCrimeId: 'crime-1',
    notes: 'Branch Manager at First Metropolitan Bank. Received outpatient medical treatment for concussion.',
    createdAt: '2026-03-01T10:45:00Z',
  },
  {
    id: 'vic-2',
    fullName: 'City Power & Transit Authority',
    age: 0,
    gender: 'Corporate Entity',
    contactNumber: '(555) 018-9900',
    confidentiality: 'Standard',
    injuryReported: false,
    advocateAssigned: 'Legal Liaison D. Mitchell',
    statementGiven: true,
    linkedCrimeId: 'crime-2',
    notes: 'Municipal SCADA systems affected; emergency protocol restored grid within 45 minutes.',
    createdAt: '2026-03-04T12:00:00Z',
  },
  {
    id: 'vic-3',
    fullName: 'Evelyn Parker',
    age: 31,
    gender: 'Female',
    contactNumber: '(555) 014-3321',
    confidentiality: 'Protected',
    injuryReported: false,
    advocateAssigned: 'Victim Support Services Unit 4',
    statementGiven: true,
    linkedCrimeId: 'crime-3',
    notes: 'Jewelry shop assistant manager during armed robbery. Placed in safe housing temporarily.',
    createdAt: '2026-03-08T16:20:00Z',
  },
];

export const INITIAL_WITNESSES: Witness[] = [
  {
    id: 'wit-1',
    fullName: 'David K. Henderson',
    contactNumber: '(555) 012-7744',
    linkedCrimeId: 'crime-1',
    protectionStatus: 'Requested',
    credibilityRating: 'High',
    statementSummary: 'Observed two masked subjects entering the vault corridor carrying black tactical duffel bags. Distinct blue laser cutters noted.',
    interviewDate: '2026-03-01',
    interviewingOfficer: 'Det. Marcus Vance',
    createdAt: '2026-03-01T13:30:00Z',
  },
  {
    id: 'wit-2',
    fullName: 'Maya Lin',
    contactNumber: '(555) 017-6623',
    linkedCrimeId: 'crime-3',
    protectionStatus: 'Active Protection',
    credibilityRating: 'High',
    statementSummary: 'Confirmed suspect vehicle license plate match (Sedan, silver, partial tag 7X-491) escaping south towards the docks.',
    interviewDate: '2026-03-08',
    interviewingOfficer: 'Senior Det. Sarah Jenkins',
    createdAt: '2026-03-08T18:00:00Z',
  },
  {
    id: 'wit-3',
    fullName: 'Carlos Ramirez',
    contactNumber: '(555) 013-8891',
    linkedCrimeId: 'crime-4',
    protectionStatus: 'None',
    credibilityRating: 'Moderate',
    statementSummary: 'Heard heavy machinery and saw unmarked box vans loading sealed wooden crates at 02:40 AM.',
    interviewDate: '2026-02-28',
    interviewingOfficer: 'Det. Marcus Vance',
    createdAt: '2026-02-28T11:15:00Z',
  },
];

export const INITIAL_CRIMES: Crime[] = [
  {
    id: 'crime-1',
    caseNumber: 'CR-2026-0842',
    title: 'First Metropolitan Bank Vault Breach',
    category: 'Armed Robbery',
    severity: 'Critical',
    status: 'Under Investigation',
    incidentDate: '2026-03-01T09:15:00Z',
    reportedDate: '2026-03-01T09:22:00Z',
    district: 'Downtown Financial Sector',
    locationAddress: '400 Grand Avenue, Suite 100',
    coordinates: { lat: 40.7128, lng: -74.006 },
    reportingOfficerId: 'off-1',
    reportingOfficerName: 'Marcus Vance',
    leadInvestigatorId: 'off-2',
    leadInvestigatorName: 'Sarah Jenkins',
    summary: 'Four armed operatives bypassed physical and electronic countermeasures, compromised main subterranean vault, and stole approx $2.4M in bonds and unmarked currency.',
    evidenceItems: [
      'Encrypted USB drive recovered from terminal 4',
      'Shell casings (9mm Luger)',
      'Security CCTV footage HDD',
      'Discarded thermite canister'
    ],
    suspectIds: ['susp-1'],
    victimIds: ['vic-1'],
    witnessIds: ['wit-1'],
    updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'crime-2',
    caseNumber: 'CR-2026-0914',
    title: 'Municipal Transit SCADA Grid Ransomware',
    category: 'Cybercrime',
    severity: 'Critical',
    status: 'Open',
    incidentDate: '2026-03-04T03:40:00Z',
    reportedDate: '2026-03-04T04:10:00Z',
    district: 'Central Metro Operations Hub',
    locationAddress: '12 Rail Plaza Boulevard',
    coordinates: { lat: 40.7282, lng: -73.9942 },
    reportingOfficerId: 'off-3',
    reportingOfficerName: 'Elena Rostova',
    leadInvestigatorId: 'off-3',
    leadInvestigatorName: 'Elena Rostova',
    summary: 'Zero-day vulnerability exploited to inject ransomware into central traffic dispatch routing systems. Ransom demand of 80 BTC received with countdown timer.',
    evidenceItems: [
      'Infected core switch dump file',
      'Tor network command and control IP trace',
      'Decryption ransom note text file'
    ],
    suspectIds: ['susp-2'],
    victimIds: ['vic-2'],
    witnessIds: [],
    updatedAt: '2026-03-11T09:00:00Z',
  },
  {
    id: 'crime-3',
    caseNumber: 'CR-2026-1029',
    title: 'Crown Fine Jewelers Armed Heist',
    category: 'Armed Robbery',
    severity: 'High',
    status: 'Under Investigation',
    incidentDate: '2026-03-08T15:45:00Z',
    reportedDate: '2026-03-08T15:51:00Z',
    district: 'Harbor Docks Commercial Corridor',
    locationAddress: '782 Shoreline Way',
    coordinates: { lat: 40.7012, lng: -74.015 },
    reportingOfficerId: 'off-1',
    reportingOfficerName: 'Marcus Vance',
    leadInvestigatorId: 'off-1',
    leadInvestigatorName: 'Marcus Vance',
    summary: 'Smash-and-grab execution involving 2 perpetrators armed with high-caliber pistols. Targeted raw uncut diamond consignments valued at $850,000.',
    evidenceItems: [
      'Sledgehammer with partial palm print',
      'Broken glass samples with trace blood',
      'Dashcam video from passing transit bus'
    ],
    suspectIds: ['susp-1'],
    victimIds: ['vic-3'],
    witnessIds: ['wit-2'],
    updatedAt: '2026-03-09T16:00:00Z',
  },
  {
    id: 'crime-4',
    caseNumber: 'CR-2026-0711',
    title: 'Pier 19 Synthetic Narcotics Distribution Ring',
    category: 'Narcotics',
    severity: 'High',
    status: 'Pending Review',
    incidentDate: '2026-02-27T23:30:00Z',
    reportedDate: '2026-02-28T01:00:00Z',
    district: 'Harbor Docks Industrial Strip',
    locationAddress: 'Pier 19, Warehouse C',
    coordinates: { lat: 40.695, lng: -74.022 },
    reportingOfficerId: 'off-1',
    reportingOfficerName: 'Marcus Vance',
    leadInvestigatorId: 'off-2',
    leadInvestigatorName: 'Sarah Jenkins',
    summary: 'Interdiction operation seized 140kg of synthetic opioid precursors concealed in industrial chemical barrels originating from overseas cargo ship.',
    evidenceItems: [
      '14 sealed drums marked "Industrial Solvent"',
      'Counterfeit customs manifest documentation',
      'Burner mobile phones with encrypted chat logs'
    ],
    suspectIds: ['susp-3'],
    victimIds: [],
    witnessIds: ['wit-3'],
    updatedAt: '2026-03-05T11:20:00Z',
  },
  {
    id: 'crime-5',
    caseNumber: 'CR-2026-0550',
    title: 'Aegis Holdings Shell Company Fraud & Embezzlement',
    category: 'Financial Fraud',
    severity: 'Medium',
    status: 'Open',
    incidentDate: '2026-02-15T09:00:00Z',
    reportedDate: '2026-02-17T14:30:00Z',
    district: 'Downtown Financial Sector',
    locationAddress: '120 Wall Street Tower, Fl 34',
    coordinates: { lat: 40.706, lng: -74.009 },
    reportingOfficerId: 'off-2',
    reportingOfficerName: 'Sarah Jenkins',
    leadInvestigatorId: 'off-2',
    leadInvestigatorName: 'Sarah Jenkins',
    summary: 'Investigation into misappropriation of $5.2M in state infrastructure development bonds routed through offshore accounts.',
    evidenceItems: [
      'Forensic accountant audit report (320 pages)',
      'Subpoenaed banking ledgers',
      'Signed authorization memos'
    ],
    suspectIds: ['susp-4'],
    victimIds: [],
    witnessIds: [],
    updatedAt: '2026-03-02T10:15:00Z',
  },
  {
    id: 'crime-6',
    caseNumber: 'CR-2026-0419',
    title: 'North Sector Residential Burglary Spree',
    category: 'Burglary',
    severity: 'Low',
    status: 'Closed',
    incidentDate: '2026-02-08T02:15:00Z',
    reportedDate: '2026-02-08T07:45:00Z',
    district: 'North Sector Residential Hills',
    locationAddress: '144 Highland Crest Drive',
    coordinates: { lat: 40.745, lng: -73.985 },
    reportingOfficerId: 'off-1',
    reportingOfficerName: 'Marcus Vance',
    leadInvestigatorId: 'off-1',
    leadInvestigatorName: 'Marcus Vance',
    summary: 'Series of 3 residential entries via compromised patio sliding locks. Stolen jewelry recovered and suspect sentenced.',
    evidenceItems: [
      'Pry bar tool marks analysis',
      'Recovered pawn shop receipt'
    ],
    suspectIds: [],
    victimIds: [],
    witnessIds: [],
    updatedAt: '2026-02-25T15:00:00Z',
  },
  {
    id: 'crime-7',
    caseNumber: 'CR-2026-0382',
    title: 'Industrial Zone Homicide Investigation',
    category: 'Homicide',
    severity: 'Critical',
    status: 'Under Investigation',
    incidentDate: '2026-02-01T21:40:00Z',
    reportedDate: '2026-02-01T22:05:00Z',
    district: 'South Industrial Yards',
    locationAddress: '900 Foundry Lane',
    coordinates: { lat: 40.688, lng: -73.998 },
    reportingOfficerId: 'off-2',
    reportingOfficerName: 'Sarah Jenkins',
    leadInvestigatorId: 'off-2',
    leadInvestigatorName: 'Sarah Jenkins',
    summary: 'Deceased adult male discovered near rail spur with multiple gunshot trauma. Ballistics indicate specialized armor-piercing ammunition.',
    evidenceItems: [
      'Coroner autopsy report #26-099',
      'Recovered 5.7x28mm shell casings',
      'Victim encrypted personal device'
    ],
    suspectIds: ['susp-1'],
    victimIds: [],
    witnessIds: [],
    updatedAt: '2026-03-07T17:40:00Z',
  },
];

export const INITIAL_INVESTIGATIONS: Investigation[] = [
  {
    id: 'inv-1',
    crimeId: 'crime-1',
    caseNumber: 'CR-2026-0842',
    caseTitle: 'First Metropolitan Bank Vault Breach',
    leadInvestigator: 'Sarah Jenkins',
    department: 'Homicide',
    status: 'Active',
    priority: 'Priority 1 (Urgent)',
    startDate: '2026-03-01',
    targetClosureDate: '2026-04-15',
    evidenceVaultId: 'EV-8842-A',
    milestones: [
      { id: 'm-1', title: 'Crime scene perimeter locked & forensics scan', date: '2026-03-01', completed: true, completedBy: 'Sarah Jenkins' },
      { id: 'm-2', title: 'Witness statements cross-referenced with surveillance', date: '2026-03-03', completed: true, completedBy: 'Marcus Vance' },
      { id: 'm-3', title: 'Thermite residue chemical spectrometry completed', date: '2026-03-06', completed: true, completedBy: 'Forensics Lab' },
      { id: 'm-4', title: 'Execute search warrant on suspect safehouse', date: '2026-03-14', completed: false },
      { id: 'm-5', title: 'Grand jury indictment filing', date: '2026-03-25', completed: false },
    ],
    logs: [
      { id: 'l-1', timestamp: '2026-03-01 10:30', officerName: 'Sarah Jenkins', type: 'Evidence', entry: 'Forensic team secured 4 distinct shell casings and USB hardware token from teller terminal.' },
      { id: 'l-2', timestamp: '2026-03-03 14:15', officerName: 'Marcus Vance', type: 'Interview', entry: 'Bank manager Julian Hayes confirmed alarm system was suppressed internally 12 seconds prior to entry.' },
      { id: 'l-3', timestamp: '2026-03-07 09:45', officerName: 'Elena Rostova', type: 'Forensics', entry: 'Digital trace indicates firmware attack originated from specialized hardware tap on street junction box.' },
      { id: 'l-4', timestamp: '2026-03-10 11:20', officerName: 'Sarah Jenkins', type: 'Warrant', entry: 'Emergency surveillance warrant approved by Judge Miller for 3 cellular IMSI numbers.' },
    ],
  },
  {
    id: 'inv-2',
    crimeId: 'crime-2',
    caseNumber: 'CR-2026-0914',
    caseTitle: 'Municipal Transit SCADA Grid Ransomware',
    leadInvestigator: 'Elena Rostova',
    department: 'Cybercrime & Digital Forensics',
    status: 'Active',
    priority: 'Priority 1 (Urgent)',
    startDate: '2026-03-04',
    targetClosureDate: '2026-03-30',
    evidenceVaultId: 'EV-9914-C',
    milestones: [
      { id: 'm-21', title: 'Air-gap compromised dispatch sub-networks', date: '2026-03-04', completed: true, completedBy: 'Elena Rostova' },
      { id: 'm-22', title: 'Reverse engineer binary malware payload', date: '2026-03-07', completed: true, completedBy: 'Digital Forensics Unit' },
      { id: 'm-23', title: 'Correlate Tor exit nodes with telecommunications logs', date: '2026-03-12', completed: false },
      { id: 'm-24', title: 'Coordinate with Federal Cyber Task Force', date: '2026-03-18', completed: false },
    ],
    logs: [
      { id: 'l-21', timestamp: '2026-03-04 05:00', officerName: 'Elena Rostova', type: 'Forensics', entry: 'Extracted ransomware loader "ShadowLock v3.2". Cryptographic signature matches DarkVector threat actor.' },
      { id: 'l-22', timestamp: '2026-03-06 16:30', officerName: 'Elena Rostova', type: 'Note', entry: 'Identified suspect Elena Mercer IP proxy bounce through local financial district colocation facility.' },
    ],
  },
  {
    id: 'inv-3',
    crimeId: 'crime-4',
    caseNumber: 'CR-2026-0711',
    caseTitle: 'Pier 19 Synthetic Narcotics Distribution Ring',
    leadInvestigator: 'Sarah Jenkins',
    department: 'Major Crimes',
    status: 'Pending Review',
    priority: 'Priority 2 (High)',
    startDate: '2026-02-28',
    targetClosureDate: '2026-04-01',
    evidenceVaultId: 'EV-0711-N',
    milestones: [
      { id: 'm-31', title: 'Warehouse tactical interdiction executed', date: '2026-02-28', completed: true, completedBy: 'Tactical Team A' },
      { id: 'm-32', title: 'Suspect Viktor Kozlov booked into central detention', date: '2026-02-28', completed: true, completedBy: 'Marcus Vance' },
      { id: 'm-33', title: 'DEA chemical analysis certification received', date: '2026-03-05', completed: true, completedBy: 'State Forensics' },
      { id: 'm-34', title: 'Asset forfeiture hearings scheduled', date: '2026-03-20', completed: false },
    ],
    logs: [
      { id: 'l-31', timestamp: '2026-02-28 02:30', officerName: 'Sarah Jenkins', type: 'Note', entry: 'Primary target Kozlov detained without weapon discharge. Seized 3 cellular handsets.' },
    ],
  },
];

export const DISTRICTS = [
  { id: 'dist-1', name: 'Downtown Financial Sector', code: 'DT-1', incidentCount: 18, criticalCount: 6, riskRating: 'High' as const, center: { lat: 40.7128, lng: -74.006 }, svgCoords: { x: 380, y: 220, width: 140, height: 120 } },
  { id: 'dist-2', name: 'Harbor Docks & Industrial Strip', code: 'HB-2', incidentCount: 24, criticalCount: 9, riskRating: 'High' as const, center: { lat: 40.695, lng: -74.022 }, svgCoords: { x: 200, y: 320, width: 160, height: 140 } },
  { id: 'dist-3', name: 'Central Metro Operations Hub', code: 'CM-3', incidentCount: 14, criticalCount: 4, riskRating: 'Moderate' as const, center: { lat: 40.7282, lng: -73.9942 }, svgCoords: { x: 370, y: 90, width: 130, height: 110 } },
  { id: 'dist-4', name: 'North Sector Residential Hills', code: 'NS-4', incidentCount: 8, criticalCount: 1, riskRating: 'Low' as const, center: { lat: 40.745, lng: -73.985 }, svgCoords: { x: 520, y: 60, width: 150, height: 130 } },
  { id: 'dist-5', name: 'South Industrial Yards', code: 'SY-5', incidentCount: 21, criticalCount: 7, riskRating: 'High' as const, center: { lat: 40.688, lng: -73.998 }, svgCoords: { x: 390, y: 360, width: 150, height: 130 } },
  { id: 'dist-6', name: 'Westside Transit & Market District', code: 'WM-6', incidentCount: 11, criticalCount: 2, riskRating: 'Moderate' as const, center: { lat: 40.718, lng: -74.020 }, svgCoords: { x: 210, y: 160, width: 140, height: 130 } },
];

export class LocalStorageDB {
  static getOfficers(): Officer[] {
    const data = localStorage.getItem(STORAGE_KEYS.OFFICERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.OFFICERS, JSON.stringify(INITIAL_OFFICERS));
      return INITIAL_OFFICERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_OFFICERS;
    }
  }

  static saveOfficers(officers: Officer[]): void {
    localStorage.setItem(STORAGE_KEYS.OFFICERS, JSON.stringify(officers));
  }

  static getCurrentOfficer(): Officer | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_OFFICER);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  static setCurrentOfficer(officer: Officer | null): void {
    if (officer) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_OFFICER, JSON.stringify(officer));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_OFFICER);
    }
  }

  static getCrimes(): Crime[] {
    const data = localStorage.getItem(STORAGE_KEYS.CRIMES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CRIMES, JSON.stringify(INITIAL_CRIMES));
      return INITIAL_CRIMES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CRIMES;
    }
  }

  static saveCrimes(crimes: Crime[]): void {
    localStorage.setItem(STORAGE_KEYS.CRIMES, JSON.stringify(crimes));
  }

  static addCrime(crime: Omit<Crime, 'id' | 'updatedAt'>): Crime {
    const crimes = this.getCrimes();
    const newCrime: Crime = {
      ...crime,
      id: `crime-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    };
    crimes.unshift(newCrime);
    this.saveCrimes(crimes);
    return newCrime;
  }

  static updateCrime(id: string, updates: Partial<Crime>): Crime | null {
    const crimes = this.getCrimes();
    const index = crimes.findIndex(c => c.id === id);
    if (index === -1) return null;
    crimes[index] = {
      ...crimes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveCrimes(crimes);
    return crimes[index];
  }

  static deleteCrime(id: string): boolean {
    const crimes = this.getCrimes();
    const filtered = crimes.filter(c => c.id !== id);
    if (filtered.length === crimes.length) return false;
    this.saveCrimes(filtered);
    return true;
  }

  static getSuspects(): Suspect[] {
    const data = localStorage.getItem(STORAGE_KEYS.SUSPECTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SUSPECTS, JSON.stringify(INITIAL_SUSPECTS));
      return INITIAL_SUSPECTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_SUSPECTS;
    }
  }

  static saveSuspects(suspects: Suspect[]): void {
    localStorage.setItem(STORAGE_KEYS.SUSPECTS, JSON.stringify(suspects));
  }

  static addSuspect(suspect: Omit<Suspect, 'id' | 'createdAt'>): Suspect {
    const suspects = this.getSuspects();
    const newSuspect: Suspect = {
      ...suspect,
      id: `susp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    suspects.unshift(newSuspect);
    this.saveSuspects(suspects);
    return newSuspect;
  }

  static updateSuspect(id: string, updates: Partial<Suspect>): Suspect | null {
    const suspects = this.getSuspects();
    const index = suspects.findIndex(s => s.id === id);
    if (index === -1) return null;
    suspects[index] = { ...suspects[index], ...updates };
    this.saveSuspects(suspects);
    return suspects[index];
  }

  static deleteSuspect(id: string): boolean {
    const suspects = this.getSuspects();
    const filtered = suspects.filter(s => s.id !== id);
    if (filtered.length === suspects.length) return false;
    this.saveSuspects(filtered);
    return true;
  }

  static getVictims(): Victim[] {
    const data = localStorage.getItem(STORAGE_KEYS.VICTIMS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.VICTIMS, JSON.stringify(INITIAL_VICTIMS));
      return INITIAL_VICTIMS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_VICTIMS;
    }
  }

  static saveVictims(victims: Victim[]): void {
    localStorage.setItem(STORAGE_KEYS.VICTIMS, JSON.stringify(victims));
  }

  static addVictim(victim: Omit<Victim, 'id' | 'createdAt'>): Victim {
    const victims = this.getVictims();
    const newVictim: Victim = {
      ...victim,
      id: `vic-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    victims.unshift(newVictim);
    this.saveVictims(victims);
    return newVictim;
  }

  static updateVictim(id: string, updates: Partial<Victim>): Victim | null {
    const victims = this.getVictims();
    const index = victims.findIndex(v => v.id === id);
    if (index === -1) return null;
    victims[index] = { ...victims[index], ...updates };
    this.saveVictims(victims);
    return victims[index];
  }

  static deleteVictim(id: string): boolean {
    const victims = this.getVictims();
    const filtered = victims.filter(v => v.id !== id);
    if (filtered.length === victims.length) return false;
    this.saveVictims(filtered);
    return true;
  }

  static getWitnesses(): Witness[] {
    const data = localStorage.getItem(STORAGE_KEYS.WITNESSES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.WITNESSES, JSON.stringify(INITIAL_WITNESSES));
      return INITIAL_WITNESSES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_WITNESSES;
    }
  }

  static saveWitnesses(witnesses: Witness[]): void {
    localStorage.setItem(STORAGE_KEYS.WITNESSES, JSON.stringify(witnesses));
  }

  static addWitness(witness: Omit<Witness, 'id' | 'createdAt'>): Witness {
    const witnesses = this.getWitnesses();
    const newWitness: Witness = {
      ...witness,
      id: `wit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    witnesses.unshift(newWitness);
    this.saveWitnesses(witnesses);
    return newWitness;
  }

  static updateWitness(id: string, updates: Partial<Witness>): Witness | null {
    const witnesses = this.getWitnesses();
    const index = witnesses.findIndex(w => w.id === id);
    if (index === -1) return null;
    witnesses[index] = { ...witnesses[index], ...updates };
    this.saveWitnesses(witnesses);
    return witnesses[index];
  }

  static deleteWitness(id: string): boolean {
    const witnesses = this.getWitnesses();
    const filtered = witnesses.filter(w => w.id !== id);
    if (filtered.length === witnesses.length) return false;
    this.saveWitnesses(filtered);
    return true;
  }

  static getInvestigations(): Investigation[] {
    const data = localStorage.getItem(STORAGE_KEYS.INVESTIGATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INVESTIGATIONS, JSON.stringify(INITIAL_INVESTIGATIONS));
      return INITIAL_INVESTIGATIONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_INVESTIGATIONS;
    }
  }

  static saveInvestigations(investigations: Investigation[]): void {
    localStorage.setItem(STORAGE_KEYS.INVESTIGATIONS, JSON.stringify(investigations));
  }

  static addInvestigation(inv: Omit<Investigation, 'id'>): Investigation {
    const investigations = this.getInvestigations();
    const newInv: Investigation = {
      ...inv,
      id: `inv-${Date.now()}`,
    };
    investigations.unshift(newInv);
    this.saveInvestigations(investigations);
    return newInv;
  }

  static updateInvestigation(id: string, updates: Partial<Investigation>): Investigation | null {
    const list = this.getInvestigations();
    const index = list.findIndex(i => i.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    this.saveInvestigations(list);
    return list[index];
  }

  static resetToDefaultData(): void {
    localStorage.setItem(STORAGE_KEYS.OFFICERS, JSON.stringify(INITIAL_OFFICERS));
    localStorage.setItem(STORAGE_KEYS.CRIMES, JSON.stringify(INITIAL_CRIMES));
    localStorage.setItem(STORAGE_KEYS.SUSPECTS, JSON.stringify(INITIAL_SUSPECTS));
    localStorage.setItem(STORAGE_KEYS.VICTIMS, JSON.stringify(INITIAL_VICTIMS));
    localStorage.setItem(STORAGE_KEYS.WITNESSES, JSON.stringify(INITIAL_WITNESSES));
    localStorage.setItem(STORAGE_KEYS.INVESTIGATIONS, JSON.stringify(INITIAL_INVESTIGATIONS));
  }
}
