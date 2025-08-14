// Sample data aligned with backend API responses

export const currentUser = {
    id: "hr_001",
    name: "Priya Sharma",
    email: "priya@techcorpa.com",
    whatsapp: {
      phoneNumber: "+91-9876543210"
    },
    company: {
      name: "TechCorpA",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=entropy"
    },
    role: "Senior HR",
    permissions: {
      canCreateOffers: true,
      canViewAllCandidates: true,
      canInitiateWhatsApp: true,
      canExportData: false
    },
    stats: {
      totalOffersCreated: 25,
      successfulHires: 12,
      whatsappCommunications: 8,
      responseRate: 85
    }
  }
  
  export const dashboardData = {
    overview: {
      totalOffers: 25,
      activeOffers: 8,
      acceptedOffers: 12,
      successRate: 48,
      averageHiringTime: 18
    },
    whatsappMetrics: {
      totalCommunications: 15,
      averageResponseTime: 45,
      resolutionRate: 80,
      collaborationSuccessRate: 87
    },
    trends: {
      offersThisMonth: [
        { date: "2024-01-01", count: 2 },
        { date: "2024-01-02", count: 1 },
        { date: "2024-01-03", count: 3 },
        { date: "2024-01-04", count: 1 },
        { date: "2024-01-05", count: 4 }
      ]
    },
    recentActivity: [
      {
        type: "OFFER_CREATED",
        message: "Created offer for Arjun Kumar",
        timestamp: "2024-01-21T10:00:00.000Z"
      },
      {
        type: "WHATSAPP_RESOLVED",
        message: "Resolved communication with Rahul Gupta",
        timestamp: "2024-01-20T16:00:00.000Z"
      },
      {
        type: "CANDIDATE_ACCEPTED",
        message: "Sneha Patel accepted your offer",
        timestamp: "2024-01-19T14:30:00.000Z"
      }
    ]
  }
  
  export const candidateData = {
    // For duplicate detection demo
    duplicateCandidate: {
      id: "candidate_001",
      name: "Arjun Kumar",
      status: "MULTIPLE_OFFERS",
      profile: {
        currentCompany: "StartupXYZ",
        currentRole: "Software Engineer",
        totalExperience: 36,
        skills: ["React", "Node.js", "MongoDB"],
        salaryRange: { min: 1200000, max: 1800000 }
      },
      metrics: {
        totalOffers: 3,
        activeOffers: 2,
        averageOfferValue: 1550000
      },
      existingOffers: [
        {
          id: "offer_001",
          company: "TechCorpA",
          position: "Senior Software Engineer",
          compensation: { total: 1550000 },
          status: "ACTIVE",
          hrContact: {
            id: "hr_001",
            name: "Priya Sharma",
            whatsappNumber: "+91-9876543210"
          }
        },
        {
          id: "offer_002",
          company: "InnovateBX",
          position: "Tech Lead",
          compensation: { total: 1800000 },
          status: "ACTIVE",
          hrContact: {
            id: "hr_002",
            name: "Rahul Gupta",
            whatsappNumber: "+91-9876543211"
          }
        }
      ]
    }
  }
  
  export const offersData = [
    {
      id: "offer_001",
      candidate: {
        id: "candidate_001",
        name: "Arjun Kumar",
        status: "MULTIPLE_OFFERS"
      },
      position: {
        title: "Senior Software Engineer",
        level: "Senior"
      },
      compensation: { total: 1550000 },
      status: "ACTIVE",
      priority: "HIGH",
      competition: {
        isCompetitive: true,
        competitorCount: 2,
        marketRank: "COMPETITIVE"
      },
      timeline: {
        validTill: "2024-02-15T23:59:59.000Z",
        followUpDate: "2024-02-10T10:00:00.000Z"
      },
      createdAt: "2024-01-15T10:00:00.000Z"
    },
    {
      id: "offer_002",
      candidate: {
        id: "candidate_002",
        name: "Sneha Patel",
        status: "AVAILABLE"
      },
      position: {
        title: "Product Manager",
        level: "Senior"
      },
      compensation: { total: 1800000 },
      status: "ACCEPTED",
      priority: "MEDIUM",
      competition: {
        isCompetitive: false,
        competitorCount: 0,
        marketRank: "EXCLUSIVE"
      },
      timeline: {
        validTill: "2024-02-20T23:59:59.000Z"       
      },
      createdAt: "2024-01-18T14:00:00.000Z"
    },
    {
      id: "offer_003",
      candidate: {
        id: "candidate_003",
        name: "Raj Patel",
        status: "AVAILABLE"
      },
      position: {
        title: "DevOps Engineer",
        level: "Mid"
      },
      compensation: { total: 1200000 },
      status: "PENDING",
      priority: "LOW",
      competition: {
        isCompetitive: false,
        competitorCount: 0,
        marketRank: "FIRST"
      },
      timeline: {
        validTill: "2024-02-25T23:59:59.000Z",
        followUpDate: "2024-02-08T10:00:00.000Z"
      },
      createdAt: "2024-01-20T09:00:00.000Z"
    }
  ]
  
  export const communicationsData = [
    {
      id: "whatsapp_001",
      trackingId: "track_abc123",
      candidate: {
        id: "candidate_001",
        name: "Arjun Kumar"
      },
      otherParty: {
        id: "hr_002",
        name: "Rahul Gupta",
        company: "InnovateBX"
      },
      status: "RESOLVED",
      role: "INITIATOR",
      outcome: {
        result: "TIMELINE_AGREED",
        description: "Agreed on timeline coordination. InnovateBX gets first response by Feb 10, StartupCZ waits until Feb 12.",
        actions: [
          "InnovateBX to get candidate response by Feb 10",
          "StartupCZ will hold offer until Feb 12"
        ]
      },
      metrics: {
        responseTimeMinutes: 25,
        resolutionTimeHours: 1
      },
      createdAt: "2024-01-20T15:00:00.000Z"
    },
    {
      id: "whatsapp_002",
      trackingId: "track_def456",
      candidate: {
        id: "candidate_004",
        name: "Amit Singh"
      },
      otherParty: {
        id: "hr_003",
        name: "Anjali Reddy",
        company: "StartupCZ"
      },
      status: "ACTIVE",
      role: "RECIPIENT",
      metrics: {
        responseTimeMinutes: null,
        resolutionTimeHours: null
      },
      createdAt: "2024-01-21T11:00:00.000Z"
    }
  ]
  
  export const notificationsData = [
    {
      id: "notif_001",
      type: "WHATSAPP_REQUEST",
      title: "WhatsApp Communication Request",
      message: "Anjali Singh from StartupCZ wants to discuss candidate Arjun Kumar",
      priority: "HIGH",
      isRead: false,
      createdAt: "2024-01-20T15:00:00.000Z"
    },
    {
      id: "notif_002",
      type: "OFFER_EXPIRING",
      title: "Offer Expiring Soon",
      message: "Your offer for Arjun Kumar expires in 2 days",
      priority: "MEDIUM",
      isRead: false,
      createdAt: "2024-01-21T09:00:00.000Z"
    }
  ] 