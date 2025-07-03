// AI Service for Healthcare Platform
// This service provides intelligent responses for health-related queries and platform navigation

export interface HealthCondition {
  symptoms: string[];
  recommendedSpecialist: string;
  urgencyLevel: "low" | "medium" | "high" | "emergency";
  description: string;
  additionalInfo?: string;
}

export interface PlatformFeature {
  keywords: string[];
  title: string;
  description: string;
  steps: string[];
  relatedFeatures?: string[];
}

class AIService {
  private healthConditions: HealthCondition[] = [
    {
      symptoms: [
        "chest pain",
        "heart attack",
        "heart palpitations",
        "irregular heartbeat",
        "cardiac",
      ],
      recommendedSpecialist: "Cardiologist",
      urgencyLevel: "high",
      description: "Heart and cardiovascular system specialist",
      additionalInfo:
        "⚠️ If experiencing severe chest pain, seek emergency care immediately!",
    },
    {
      symptoms: [
        "brain",
        "headache",
        "migraine",
        "seizure",
        "stroke",
        "memory loss",
        "neurological",
      ],
      recommendedSpecialist: "Neurologist",
      urgencyLevel: "medium",
      description: "Brain and nervous system specialist",
    },
    {
      symptoms: [
        "bone",
        "joint",
        "fracture",
        "back pain",
        "knee pain",
        "arthritis",
        "sports injury",
      ],
      recommendedSpecialist: "Orthopedic Specialist",
      urgencyLevel: "medium",
      description: "Bone, joint, and musculoskeletal specialist",
    },
    {
      symptoms: [
        "skin",
        "rash",
        "acne",
        "mole",
        "eczema",
        "dermatitis",
        "psoriasis",
      ],
      recommendedSpecialist: "Dermatologist",
      urgencyLevel: "low",
      description: "Skin, hair, and nail specialist",
    },
    {
      symptoms: [
        "stomach",
        "digestive",
        "nausea",
        "vomiting",
        "diarrhea",
        "constipation",
        "gastro",
      ],
      recommendedSpecialist: "Gastroenterologist",
      urgencyLevel: "medium",
      description: "Digestive system specialist",
    },
    {
      symptoms: [
        "eye",
        "vision",
        "blurry vision",
        "eye pain",
        "glaucoma",
        "cataract",
      ],
      recommendedSpecialist: "Ophthalmologist",
      urgencyLevel: "medium",
      description: "Eye and vision specialist",
    },
    {
      symptoms: ["ear", "hearing", "throat", "nose", "sinus", "tonsils", "ent"],
      recommendedSpecialist: "ENT Specialist",
      urgencyLevel: "medium",
      description: "Ear, Nose, and Throat specialist",
    },
    {
      symptoms: [
        "mental health",
        "depression",
        "anxiety",
        "stress",
        "psychological",
        "mood",
      ],
      recommendedSpecialist: "Psychiatrist/Psychologist",
      urgencyLevel: "medium",
      description: "Mental health and psychological disorders specialist",
    },
    {
      symptoms: [
        "lung",
        "breathing",
        "asthma",
        "cough",
        "respiratory",
        "pneumonia",
      ],
      recommendedSpecialist: "Pulmonologist",
      urgencyLevel: "medium",
      description: "Lung and respiratory system specialist",
    },
    {
      symptoms: [
        "kidney",
        "urinary",
        "bladder",
        "urology",
        "prostate",
        "reproductive",
      ],
      recommendedSpecialist: "Urologist",
      urgencyLevel: "medium",
      description: "Urinary system and male reproductive system specialist",
    },
    {
      symptoms: [
        "pregnancy",
        "gynecology",
        "women health",
        "menstrual",
        "reproductive health",
      ],
      recommendedSpecialist: "Gynecologist/Obstetrician",
      urgencyLevel: "medium",
      description: "Women's reproductive health specialist",
    },
    {
      symptoms: [
        "child",
        "pediatric",
        "baby",
        "infant",
        "vaccination",
        "growth",
      ],
      recommendedSpecialist: "Pediatrician",
      urgencyLevel: "medium",
      description: "Children's health specialist",
    },
    {
      symptoms: ["diabetes", "thyroid", "hormone", "endocrine", "metabolism"],
      recommendedSpecialist: "Endocrinologist",
      urgencyLevel: "medium",
      description: "Hormone and metabolic disorders specialist",
    },
    {
      symptoms: ["cancer", "tumor", "oncology", "chemotherapy", "radiation"],
      recommendedSpecialist: "Oncologist",
      urgencyLevel: "high",
      description: "Cancer treatment specialist",
    },
    {
      symptoms: [
        "fever",
        "cold",
        "flu",
        "general illness",
        "checkup",
        "routine",
      ],
      recommendedSpecialist: "General Practitioner",
      urgencyLevel: "low",
      description: "Primary care physician for general health concerns",
    },
  ];

  private platformFeatures: PlatformFeature[] = [
    {
      keywords: [
        "book appointment",
        "schedule",
        "doctor appointment",
        "consultation",
      ],
      title: "Book Doctor Appointment",
      description: "Schedule a consultation with qualified doctors",
      steps: [
        "Go to your Patient Dashboard",
        'Click on "Doctor Consultation"',
        "Browse available doctors by specialty",
        "Select your preferred doctor",
        "Choose available date and time",
        "Fill in consultation details",
        "Confirm and pay for appointment",
      ],
      relatedFeatures: [
        "video consultation",
        "in-person visit",
        "specialist referral",
      ],
    },
    {
      keywords: ["nursing service", "home nursing", "home care", "nurse"],
      title: "Home Nursing Services",
      description: "Professional nursing care in the comfort of your home",
      steps: [
        'Navigate to "Home Nursing" section',
        "Browse qualified nursing providers",
        "View services, ratings, and prices",
        "Select required nursing services",
        "Choose appointment date and time",
        "Provide home address details",
        "Confirm booking and payment",
      ],
      relatedFeatures: [
        "elderly care",
        "post-surgery care",
        "medication management",
      ],
    },
    {
      keywords: [
        "lab test",
        "laboratory",
        "blood test",
        "medical test",
        "diagnostic",
      ],
      title: "Laboratory Tests",
      description: "Comprehensive diagnostic and laboratory services",
      steps: [
        'Go to "Lab Tests" section',
        "Browse test categories or search specific tests",
        "Select required tests",
        "Choose home collection or lab visit",
        "Schedule convenient time slot",
        "Complete payment",
        "Receive results online",
      ],
      relatedFeatures: [
        "home sample collection",
        "health packages",
        "result tracking",
      ],
    },
    {
      keywords: ["medicine", "pharmacy", "prescription", "drug", "medication"],
      title: "Online Pharmacy",
      description: "Order medicines with home delivery",
      steps: [
        'Visit "Pharmacy" section',
        "Upload prescription or search medicines",
        "Add medicines to cart",
        "Review order and dosage",
        "Choose delivery or pickup option",
        "Complete secure payment",
        "Track your order delivery",
      ],
      relatedFeatures: [
        "prescription upload",
        "medicine reminders",
        "generic alternatives",
      ],
    },
    {
      keywords: ["payment", "billing", "insurance", "cost", "price"],
      title: "Payment & Billing",
      description: "Secure payment options and transparent pricing",
      steps: [
        "View service pricing before booking",
        "Choose from multiple payment methods",
        "Apply insurance if applicable",
        "Review bill breakdown",
        "Complete secure payment",
        "Download receipt and invoice",
      ],
      relatedFeatures: ["insurance claims", "payment history", "refund policy"],
    },
    {
      keywords: [
        "profile",
        "account",
        "personal information",
        "medical history",
      ],
      title: "Manage Profile",
      description: "Update your personal and medical information",
      steps: [
        "Go to Profile Settings",
        "Update personal details",
        "Add medical history",
        "Upload documents if needed",
        "Set communication preferences",
        "Save changes",
      ],
      relatedFeatures: [
        "medical records",
        "emergency contacts",
        "privacy settings",
      ],
    },
  ];

  /**
   * Get doctor recommendation based on symptoms
   */
  getDoctorRecommendation(symptoms: string): string {
    const input = symptoms.toLowerCase();

    // Check for emergency keywords
    const emergencyKeywords = [
      "emergency",
      "urgent",
      "severe",
      "sudden",
      "intense",
      "can't breathe",
      "unconscious",
    ];
    if (emergencyKeywords.some((keyword) => input.includes(keyword))) {
      return this.getEmergencyResponse();
    }

    // Find matching health condition
    const matchedCondition = this.healthConditions.find((condition) =>
      condition.symptoms.some((symptom) => input.includes(symptom)),
    );

    if (matchedCondition) {
      return this.formatDoctorRecommendation(matchedCondition);
    }

    return this.getGenericHealthResponse();
  }

  /**
   * Get platform navigation help
   */
  getPlatformHelp(query: string): string {
    const input = query.toLowerCase();

    const matchedFeature = this.platformFeatures.find((feature) =>
      feature.keywords.some((keyword) => input.includes(keyword)),
    );

    if (matchedFeature) {
      return this.formatPlatformHelp(matchedFeature);
    }

    return this.getGenericPlatformResponse();
  }

  /**
   * Generate intelligent response based on user input
   */
  generateResponse(userInput: string): string {
    const input = userInput.toLowerCase();

    // Extract context if provided
    let context = "";
    let actualQuery = input;
    if (input.includes("user asks:")) {
      const parts = input.split("user asks:");
      context = parts[0].trim();
      actualQuery = parts[1].trim();
    }

    // Add context-aware responses
    if (context.includes("nursing services") && actualQuery.includes("help")) {
      return this.getNursingContextHelp();
    }
    if (
      context.includes("doctor consultation") &&
      actualQuery.includes("help")
    ) {
      return this.getDoctorContextHelp();
    }
    if (
      context.includes("laboratory services") &&
      actualQuery.includes("help")
    ) {
      return this.getLabContextHelp();
    }
    if (context.includes("pharmacy") && actualQuery.includes("help")) {
      return this.getPharmacyContextHelp();
    }
    if (context.includes("patient dashboard") && actualQuery.includes("help")) {
      return this.getDashboardContextHelp();
    }

    // Check if it's a health-related query
    const healthKeywords = [
      "pain",
      "hurt",
      "feel",
      "symptom",
      "sick",
      "doctor",
      "specialist",
      "medical",
      "health",
    ];
    const isHealthQuery = healthKeywords.some((keyword) =>
      actualQuery.includes(keyword),
    );

    // Check if it's a platform navigation query
    const platformKeywords = [
      "how to",
      "book",
      "schedule",
      "find",
      "use",
      "navigate",
      "help",
      "where",
    ];
    const isPlatformQuery = platformKeywords.some((keyword) =>
      actualQuery.includes(keyword),
    );

    if (isHealthQuery) {
      return this.getDoctorRecommendation(actualQuery);
    }

    if (isPlatformQuery) {
      return this.getPlatformHelp(actualQuery);
    }

    // Greeting responses
    if (
      actualQuery.includes("hello") ||
      actualQuery.includes("hi") ||
      actualQuery.includes("hey")
    ) {
      return this.getGreetingResponse();
    }

    // Thank you responses
    if (actualQuery.includes("thank") || actualQuery.includes("thanks")) {
      return this.getThankYouResponse();
    }

    return this.getGenericResponse();
  }

  private formatDoctorRecommendation(condition: HealthCondition): string {
    const urgencyEmoji = {
      low: "💚",
      medium: "💛",
      high: "🧡",
      emergency: "🚨",
    };

    let response = `${urgencyEmoji[condition.urgencyLevel]} **${condition.recommendedSpecialist}**\n\n`;
    response += `${condition.description}\n\n`;

    if (
      condition.urgencyLevel === "emergency" ||
      condition.urgencyLevel === "high"
    ) {
      response += `⚠️ **Important**: This seems to require prompt medical attention. `;
    }

    response += `I recommend consulting with a **${condition.recommendedSpecialist}** who specializes in these types of conditions.\n\n`;

    if (condition.additionalInfo) {
      response += condition.additionalInfo + "\n\n";
    }

    response += `📅 You can book an appointment through our platform:\n`;
    response += `• Go to "Doctor Consultation"\n`;
    response += `• Filter by specialty: ${condition.recommendedSpecialist}\n`;
    response += `• Choose your preferred doctor and time slot`;

    return response;
  }

  private formatPlatformHelp(feature: PlatformFeature): string {
    let response = `📋 **${feature.title}**\n\n${feature.description}\n\n`;
    response += `**How to ${feature.title.toLowerCase()}:**\n`;

    feature.steps.forEach((step, index) => {
      response += `${index + 1}. ${step}\n`;
    });

    if (feature.relatedFeatures && feature.relatedFeatures.length > 0) {
      response += `\n**Related services:** ${feature.relatedFeatures.join(", ")}`;
    }

    return response;
  }

  private getEmergencyResponse(): string {
    return `🚨 **EMERGENCY ALERT**\n\nIf this is a medical emergency, please:\n\n• **Call 911 or your local emergency number immediately**\n• Go to the nearest emergency room\n• Contact emergency medical services\n\n⚠️ Do not wait for online consultations in emergency situations!\n\nFor urgent but non-emergency care, you can:\n• Book a same-day appointment\n• Contact our 24/7 support line\n• Visit an urgent care provider`;
  }

  private getGreetingResponse(): string {
    const greetings = [
      "👋 Hello! I'm your AI health assistant. How can I help you today?",
      "Hi there! I'm here to help you with health questions and platform navigation. What would you like to know?",
      "Hello! I can help you find the right doctor, book appointments, or answer questions about our services. How may I assist you?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private getThankYouResponse(): string {
    const responses = [
      "You're very welcome! I'm always here to help with your healthcare needs. 😊",
      "Happy to help! Feel free to ask me anything else about your health or our platform.",
      "You're welcome! Take care of your health, and don't hesitate to reach out if you need more assistance. 💚",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getGenericHealthResponse(): string {
    return `🩺 **Health Consultation Needed**\n\nBased on your symptoms, I recommend consulting with a healthcare professional for proper evaluation.\n\n**General recommendations:**\n• **General Practitioner** - for initial assessment\n• **Specialist** - if referred by your GP\n\n📅 **Book an appointment:**\n• Browse our qualified doctors\n• Choose based on specialty and availability\n• Schedule at your convenience\n\n⚠️ If symptoms are severe or worsening, seek immediate medical attention.`;
  }

  private getGenericPlatformResponse(): string {
    return `🤝 **I'm here to help!**\n\nI can assist you with:\n\n🏥 **Healthcare Services:**\n• Finding the right doctor for your symptoms\n• Booking appointments and consultations\n• Home nursing services\n• Laboratory tests\n• Pharmacy services\n\n💻 **Platform Navigation:**\n• How to use our services\n• Account management\n• Payment and billing\n• Technical support\n\n**What would you like to know more about?**`;
  }

  private getGenericResponse(): string {
    return `🤔 I'd love to help you! Could you please tell me more about:\n\n• **Health concerns** - Any symptoms you're experiencing?\n• **Platform help** - What service are you trying to use?\n• **General questions** - About our healthcare platform?\n\nYou can also try the quick action buttons below for common questions!`;
  }

  /**
   * Context-specific help responses
   */
  private getNursingContextHelp(): string {
    return `🏠 **Home Nursing Services Help**\n\nI see you're on the nursing services page! I can help you with:\n\n**Current Page Actions:**\n• How to select a nursing provider\n• Understanding service pricing\n• Booking nursing appointments\n• Comparing provider qualifications\n\n**Available Services:**\n• General home nursing care\n• Specialized medical care\n• Elderly care assistance\n• Post-surgery recovery support\n\n**Need help with something specific on this page?**`;
  }

  private getDoctorContextHelp(): string {
    return `👩‍⚕️ **Doctor Consultation Help**\n\nI see you're looking for doctor consultations! I can help you with:\n\n**Current Page Actions:**\n• How to find the right specialist\n• Booking consultation appointments\n• Understanding consultation types\n• Comparing doctor profiles\n\n**Consultation Options:**\n• Video consultations\n• In-person visits\n• Specialist referrals\n• Emergency consultations\n\n**What would you like help with?**`;
  }

  private getLabContextHelp(): string {
    return `🔬 **Laboratory Services Help**\n\nI see you're on the lab services page! I can help you with:\n\n**Current Page Actions:**\n• Selecting the right tests\n• Booking sample collection\n• Understanding test procedures\n• Interpreting test requirements\n\n**Available Options:**\n• Home sample collection\n• Lab visit appointments\n• Health check packages\n• Specialized diagnostic tests\n\n**How can I assist you with lab services?**`;
  }

  private getPharmacyContextHelp(): string {
    return `💊 **Pharmacy Services Help**\n\nI see you're on the pharmacy page! I can help you with:\n\n**Current Page Actions:**\n• Uploading prescriptions\n• Finding medications\n• Understanding delivery options\n• Comparing medicine prices\n\n**Available Services:**\n• Prescription medicines\n• Over-the-counter drugs\n• Home delivery\n• Medicine reminders\n\n**What pharmacy assistance do you need?**`;
  }

  private getDashboardContextHelp(): string {
    return `📊 **Patient Dashboard Help**\n\nWelcome to your dashboard! I can help you navigate:\n\n**Dashboard Features:**\n• View upcoming appointments\n• Access medical records\n• Book new services\n• Track order status\n• Manage your profile\n\n**Quick Actions:**\n• Book doctor consultation\n• Schedule home nursing\n• Order lab tests\n• Browse pharmacy\n\n**Where would you like to go next?**`;
  }

  /**
   * Get contextual suggestions based on user input
   */
  getSuggestions(input: string): string[] {
    const suggestions: string[] = [];
    const inputLower = input.toLowerCase();

    // Health-related suggestions
    if (inputLower.includes("pain") || inputLower.includes("hurt")) {
      suggestions.push("Which part of your body is hurting?");
      suggestions.push("How long have you had this pain?");
      suggestions.push("Is the pain severe or mild?");
    }

    // Platform suggestions
    if (inputLower.includes("book") || inputLower.includes("appointment")) {
      suggestions.push("How to book a doctor appointment?");
      suggestions.push("How to book nursing services?");
      suggestions.push("How to schedule lab tests?");
    }

    return suggestions;
  }
}

export const aiService = new AIService();
export default aiService;
