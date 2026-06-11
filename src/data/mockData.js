// Mock data for Federated Biobank Library Management System (iLIMS & iTracker)

export const FILTER_OPTIONS = {
  genders: ['Male', 'Female', 'Other', 'All'],
  ageGroups: ['18-35', '36-50', '51-65', '66+', 'All'],
  cancerTypes: [
    'Breast Cancer',
    'Lung Cancer (NSCLC)',
    'Colorectal Cancer',
    'Prostate Cancer',
    'Melanoma',
    'Ovarian Cancer',
    'Pancreatic Cancer',
    'All'
  ],
  cancerStages: ['Stage I', 'Stage II', 'Stage III', 'Stage IV', 'All'],
  demographies: ['Caucasian', 'African American', 'Asian', 'Hispanic', 'Native American', 'All'],
  tissueTypes: ['Fresh Frozen (FF)', 'FFPE Block', 'FFPE Scroll', 'Liquid Biopsy (Plasma)', 'Serum']
};

export const MOCK_LABS = [
  {
    id: 'dana-farber',
    name: 'Dana-Farber Cancer Biobank',
    code: 'DFCI',
    location: 'Boston, MA',
    contact: 'specimens@dfci.harvard.edu',
    logo: '🧬',
    color: '#00f2fe'
  },
  {
    id: 'md-anderson',
    name: 'MD Anderson Biospecimen Repository',
    code: 'MDAB',
    location: 'Houston, TX',
    contact: 'biobank@mdanderson.org',
    logo: '🧪',
    color: '#4facfe'
  },
  {
    id: 'mayo-clinic',
    name: 'Mayo Clinic Tissue Sharing Hub',
    code: 'MCTH',
    location: 'Rochester, MN',
    contact: 'tissues@mayo.edu',
    logo: '🔬',
    color: '#10b981'
  }
];

// Initial mock requests from researchers
export const INITIAL_REQUESTS = [
  {
    id: 'REQ-101',
    title: 'Triple-Negative Breast Cancer Cohort Study',
    researcherName: 'Dr. Sarah Jenkins',
    institution: 'Broad Institute',
    dateCreated: '2026-06-02',
    criteria: {
      gender: 'Female',
      ageGroup: '36-50',
      cancerType: 'Breast Cancer',
      cancerStage: 'Stage III',
      demography: 'African American',
      tissueType: 'Fresh Frozen (FF)'
    },
    targetQuantity: 5,
    budget: 12500,
    status: 'Paid & Processing', // 'Awaiting Estimates', 'Paid & Processing', 'Fully Fulfilled', 'Delivered'
    paymentStatus: 'Paid', // 'Unpaid', 'Paid'
    selectedLabId: 'dana-farber',
    estimates: [
      { labId: 'dana-farber', price: 12500, samplesCount: 5, notes: 'Full cohort matched in our cryo-storage.' }
    ],
    fulfilledSamples: [
      {
        id: 'SMP-DFCI-904',
        labId: 'dana-farber',
        gender: 'Female',
        age: 42,
        cancerType: 'Breast Cancer',
        cancerStage: 'Stage III',
        demography: 'African American',
        tissueType: 'Fresh Frozen (FF)',
        rinScore: 8.6,
        collectedDate: '2026-06-03',
        shipmentId: 'SHIP-901'
      },
      {
        id: 'SMP-MDAB-058',
        labId: 'md-anderson',
        gender: 'Female',
        age: 48,
        cancerType: 'Breast Cancer',
        cancerStage: 'Stage III',
        demography: 'African American',
        tissueType: 'Fresh Frozen (FF)',
        rinScore: 7.9,
        collectedDate: '2026-06-04',
        shipmentId: 'SHIP-902'
      }
    ]
  },
  {
    id: 'REQ-102',
    title: 'Late Stage NSCLC Demographically Diverse Panel',
    researcherName: 'Dr. Aris Vance',
    institution: 'Stanford Medicine',
    dateCreated: '2026-06-08',
    criteria: {
      gender: 'Male',
      ageGroup: '51-65',
      cancerType: 'Lung Cancer (NSCLC)',
      cancerStage: 'Stage IV',
      demography: 'Asian',
      tissueType: 'FFPE Block'
    },
    targetQuantity: 3,
    budget: 9000,
    status: 'Awaiting Estimates',
    paymentStatus: 'Unpaid',
    selectedLabId: null,
    estimates: [
      { labId: 'md-anderson', price: 9000, samplesCount: 3, notes: 'Can supply within 5 days.' }
    ],
    fulfilledSamples: []
  },
  {
    id: 'REQ-103',
    title: 'Early Stage Ovarian Cancer FFPE Panel',
    researcherName: 'Dr. Elena Rostova',
    institution: 'Johns Hopkins University',
    dateCreated: '2026-06-10',
    criteria: {
      gender: 'Female',
      ageGroup: '51-65',
      cancerType: 'Ovarian Cancer',
      cancerStage: 'Stage I',
      demography: 'Caucasian',
      tissueType: 'FFPE Scroll'
    },
    targetQuantity: 4,
    budget: 10000,
    status: 'Awaiting Estimates',
    paymentStatus: 'Unpaid',
    selectedLabId: null,
    estimates: [
      { labId: 'mayo-clinic', price: 10000, samplesCount: 4, notes: 'Can fulfill early stage ovarian panel in full.' },
      { labId: 'dana-farber', price: 11000, samplesCount: 4, notes: 'Includes clinical annotations.' }
    ],
    fulfilledSamples: []
  }
];

// Master library of biosamples available in local LIMS inventories
export const MOCK_INVENTORIES = {
  'dana-farber': [
    {
      id: 'SMP-DFCI-012',
      gender: 'Female',
      age: 45,
      cancerType: 'Breast Cancer',
      cancerStage: 'Stage III',
      demography: 'African American',
      tissueType: 'Fresh Frozen (FF)',
      rinScore: 8.2,
      locationCode: 'FRZ-B2-S4',
      temp: '-80°C'
    },
    {
      id: 'SMP-DFCI-025',
      gender: 'Female',
      age: 38,
      cancerType: 'Breast Cancer',
      cancerStage: 'Stage III',
      demography: 'African American',
      tissueType: 'Fresh Frozen (FF)',
      rinScore: 8.9,
      locationCode: 'FRZ-B2-S5',
      temp: '-80°C'
    },
    {
      id: 'SMP-DFCI-088',
      gender: 'Male',
      age: 62,
      cancerType: 'Lung Cancer (NSCLC)',
      cancerStage: 'Stage IV',
      demography: 'Asian',
      tissueType: 'FFPE Block',
      rinScore: 6.8,
      locationCode: 'CAB-A1-P2',
      temp: '22°C'
    },
    {
      id: 'SMP-DFCI-104',
      gender: 'Female',
      age: 58,
      cancerType: 'Ovarian Cancer',
      cancerStage: 'Stage I',
      demography: 'Caucasian',
      tissueType: 'FFPE Scroll',
      rinScore: 7.2,
      locationCode: 'CAB-A4-P9',
      temp: '22°C'
    },
    {
      id: 'SMP-DFCI-205',
      gender: 'Female',
      age: 52,
      cancerType: 'Colorectal Cancer',
      cancerStage: 'Stage II',
      demography: 'Hispanic',
      tissueType: 'Liquid Biopsy (Plasma)',
      rinScore: 9.1,
      locationCode: 'LN2-T1-A4',
      temp: '-196°C'
    }
  ],
  'md-anderson': [
    {
      id: 'SMP-MDAB-291',
      gender: 'Male',
      age: 55,
      cancerType: 'Lung Cancer (NSCLC)',
      cancerStage: 'Stage IV',
      demography: 'Asian',
      tissueType: 'FFPE Block',
      rinScore: 7.0,
      locationCode: 'CAB-W12-D2',
      temp: '20°C'
    },
    {
      id: 'SMP-MDAB-292',
      gender: 'Male',
      age: 64,
      cancerType: 'Lung Cancer (NSCLC)',
      cancerStage: 'Stage IV',
      demography: 'Asian',
      tissueType: 'FFPE Block',
      rinScore: 7.3,
      locationCode: 'CAB-W12-D3',
      temp: '20°C'
    },
    {
      id: 'SMP-MDAB-304',
      gender: 'Female',
      age: 49,
      cancerType: 'Breast Cancer',
      cancerStage: 'Stage III',
      demography: 'African American',
      tissueType: 'Fresh Frozen (FF)',
      rinScore: 8.5,
      locationCode: 'FRZ-MDA-08',
      temp: '-80°C'
    },
    {
      id: 'SMP-MDAB-512',
      gender: 'Female',
      age: 60,
      cancerType: 'Ovarian Cancer',
      cancerStage: 'Stage I',
      demography: 'Caucasian',
      tissueType: 'FFPE Scroll',
      rinScore: 6.9,
      locationCode: 'CAB-W05-E1',
      temp: '20°C'
    }
  ],
  'mayo-clinic': [
    {
      id: 'SMP-MCTH-111',
      gender: 'Female',
      age: 56,
      cancerType: 'Ovarian Cancer',
      cancerStage: 'Stage I',
      demography: 'Caucasian',
      tissueType: 'FFPE Scroll',
      rinScore: 7.5,
      locationCode: 'ROOM-D3-B4',
      temp: '21°C'
    },
    {
      id: 'SMP-MCTH-112',
      gender: 'Female',
      age: 63,
      cancerType: 'Ovarian Cancer',
      cancerStage: 'Stage I',
      demography: 'Caucasian',
      tissueType: 'FFPE Scroll',
      rinScore: 7.8,
      locationCode: 'ROOM-D3-B5',
      temp: '21°C'
    },
    {
      id: 'SMP-MCTH-724',
      gender: 'Female',
      age: 41,
      cancerType: 'Breast Cancer',
      cancerStage: 'Stage III',
      demography: 'African American',
      tissueType: 'Fresh Frozen (FF)',
      rinScore: 9.2,
      locationCode: 'ULT-M1-C8',
      temp: '-80°C'
    },
    {
      id: 'SMP-MCTH-809',
      gender: 'Male',
      age: 59,
      cancerType: 'Lung Cancer (NSCLC)',
      cancerStage: 'Stage IV',
      demography: 'Asian',
      tissueType: 'FFPE Block',
      rinScore: 7.1,
      locationCode: 'CAB-M03-G2',
      temp: '21°C'
    }
  ]
};

// Initial Shipment database for iTracker
export const INITIAL_SHIPMENTS = [
  {
    id: 'SHIP-901',
    requestId: 'REQ-101',
    requestTitle: 'Triple-Negative Breast Cancer Cohort Study',
    sampleId: 'SMP-DFCI-904',
    labId: 'dana-farber',
    carrier: 'BioExpress Logistics',
    trackingNumber: 'BIO-DFCI-4482-TX',
    steps: [
      { name: 'Request Assigned', status: 'completed', date: '2026-06-03 09:12' },
      { name: 'Sample Collection & Barcoding', status: 'completed', date: '2026-06-03 11:30' },
      { name: 'LIMS Quality Control (RIN > 7.0)', status: 'completed', date: '2026-06-03 14:15' },
      { name: 'Dry Ice Pack & Ready', status: 'completed', date: '2026-06-03 16:30' },
      { name: 'Carrier Dispatch', status: 'completed', date: '2026-06-04 10:00' },
      { name: 'In Transit (Cold-Chain Active)', status: 'current', date: '2026-06-04 15:45' },
      { name: 'Delivered & Confirmed', status: 'pending', date: null }
    ],
    currentStepIndex: 5, // index in steps
    tempMonitoring: [
      { time: '10:00', temp: -79.2 },
      { time: '11:00', temp: -78.9 },
      { time: '12:00', temp: -79.4 },
      { time: '13:00', temp: -79.1 },
      { time: '14:00', temp: -78.8 },
      { time: '15:00', temp: -79.0 }
    ],
    lat: 34.0522, // Mock lat/lng for visual map or position
    lng: -118.2437
  },
  {
    id: 'SHIP-902',
    requestId: 'REQ-101',
    requestTitle: 'Triple-Negative Breast Cancer Cohort Study',
    sampleId: 'SMP-MDAB-058',
    labId: 'md-anderson',
    carrier: 'ColdChain Express',
    trackingNumber: 'CCX-MDA-8831-MA',
    steps: [
      { name: 'Request Assigned', status: 'completed', date: '2026-06-04 08:30' },
      { name: 'Sample Collection & Barcoding', status: 'completed', date: '2026-06-04 10:15' },
      { name: 'LIMS Quality Control (RIN > 7.0)', status: 'completed', date: '2026-06-04 13:00' },
      { name: 'Dry Ice Pack & Ready', status: 'current', date: '2026-06-04 15:00' },
      { name: 'Carrier Dispatch', status: 'pending', date: null },
      { name: 'In Transit (Cold-Chain Active)', status: 'pending', date: null },
      { name: 'Delivered & Confirmed', status: 'pending', date: null }
    ],
    currentStepIndex: 3,
    tempMonitoring: [
      { time: '13:00', temp: -81.2 },
      { time: '14:00', temp: -80.5 },
      { time: '15:00', temp: -80.8 }
    ],
    lat: 29.7604,
    lng: -95.3698
  }
];
