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
        "heart",
      ],
      recommendedSpecialist: "Cardiology",
      urgencyLevel: "high",
      description: "Heart and cardiovascular system specialist",
      additionalInfo:
        "⚠️ If you are experiencing severe chest pain, seek emergency care immediately!",
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
        "abdominal pain",
      ],
      recommendedSpecialist: "Gastroenterology",
      urgencyLevel: "medium",
      description: "Digestive system specialist",
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
        "muscle pain",
      ],
      recommendedSpecialist: "Orthopedics",
      urgencyLevel: "medium",
      description: "Bone, joint, and musculoskeletal specialist",
    },
    {
      symptoms: [
        "child",
        "pediatric",
        "baby",
        "infant",
        "vaccination",
        "growth",
        "kids",
      ],
      recommendedSpecialist: "Pediatrics",
      urgencyLevel: "medium",
      description: "Children's health specialist",
    },
    {
      symptoms: ["cancer", "tumor", "oncology", "chemotherapy", "radiation"],
      recommendedSpecialist: "Oncology",
      urgencyLevel: "high",
      description: "Cancer treatment specialist",
    },
    {
      symptoms: [
        "mental health",
        "depression",
        "anxiety",
        "stress",
        "psychological",
        "mood",
        "counseling",
      ],
      recommendedSpecialist: "Counselling",
      urgencyLevel: "medium",
      description: "Mental health and psychological disorders specialist",
    },
    {
      symptoms: [
        "nutrition",
        "diet",
        "weight loss",
        "eating disorder",
        "obesity",
        "malnutrition",
      ],
      recommendedSpecialist: "Nutrition & Dietetics",
      urgencyLevel: "low",
      description: "Nutrition and dietary specialist",
    },
    {
      symptoms: [
        "internal medicine",
        "diabetes",
        "hypertension",
        "chronic disease",
        "adult medicine",
      ],
      recommendedSpecialist: "Internal Medicine",
      urgencyLevel: "medium",
      description: "Internal medicine specialist for adult health",
    },
    {
      symptoms: [
        "fever",
        "cold",
        "flu",
        "general illness",
        "checkup",
        "routine",
        "primary care",
      ],
      recommendedSpecialist: "General Practitioner",
      urgencyLevel: "low",
      description: "Primary care physician for general health concerns",
    },
    {
      symptoms: ["ear", "hearing", "throat", "nose", "sinus", "tonsils", "ent"],
      recommendedSpecialist: "Otolaryngology",
      urgencyLevel: "medium",
      description: "Ear, Nose, and Throat specialist",
    },
    {
      symptoms: ["diabetes", "thyroid", "hormone", "endocrine", "metabolism"],
      recommendedSpecialist: "Endocrinology",
      urgencyLevel: "medium",
      description: "Hormone and metabolic disorders specialist",
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
      recommendedSpecialist: "Urology",
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
        "obstetrics",
      ],
      recommendedSpecialist: "Obstetrics & Gynecology",
      urgencyLevel: "medium",
      description: "Women's reproductive health specialist",
    },
    {
      symptoms: [
        "speech",
        "speech therapy",
        "communication disorder",
        "language delay",
        "stuttering",
        "voice problems",
      ],
      recommendedSpecialist: "Speech Therapy",
      urgencyLevel: "low",
      description: "Speech and communication disorders specialist",
    },
    {
      symptoms: [
        "family medicine",
        "primary care",
        "preventive care",
        "health maintenance",
        "routine check",
      ],
      recommendedSpecialist: "Family Medicine",
      urgencyLevel: "low",
      description: "Comprehensive primary care for all ages",
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
        "Make Payment",
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

    // PRIORITY 1: Enhanced quick action responses - exact match for button text (MUST BE FIRST!)
    // These are the exact strings from the quick action buttons
    if (actualQuery === "i have fever and headache") {
      return `🌡️ **General Practitioner (Family Doctor)**\n\nFor fever and headaches, I recommend seeing a General Practitioner first. These symptoms could indicate:\n\n• Common viral infections (flu, cold)\n• Bacterial infections\n• Stress or tension headaches\n• Dehydration\n\n**Immediate care:**\n• Rest and stay hydrated\n• Monitor your temperature\n• Take over-the-counter pain relievers if needed\n\n📅 **Book appointment:**\n• Go to "Doctor Consultation"\n• Filter by "General Practice"\n• Choose available time slot\n\n⚠️ If fever exceeds 103°F (39.4°C) or symptoms worsen, seek immediate medical attention!`;
    }

    if (actualQuery === "chest pain and breathing issues") {
      return `❤️ **URGENT - Cardiologist or Emergency Care**\n\n⚠️ **This requires immediate attention!**\n\nChest pain with breathing issues could indicate:\n• Heart problems (requires Cardiologist)\n• Lung issues (requires Pulmonologist)\n• Emergency conditions\n\n**Immediate action:**\n• If severe or sudden: Call 999 immediately\n• If mild but persistent: See a Cardiologist today\n• Don't wait - chest pain needs prompt evaluation\n\n📅 **Book urgent appointment:**\n• Go to "Doctor Consultation"\n• Filter by "Cardiology" or "Emergency"\n• Select same-day or urgent slots\n\n🚨 When in doubt, always choose emergency care for chest pain!`;
    }

    if (actualQuery === "stomach pain and nausea") {
      return `🏥 **Gastroenterologist or General Practitioner**\n\nStomach pain with nausea suggests digestive issues. This could be:\n\n• Food poisoning or gastroenteritis\n• Acid reflux or GERD\n• Irritable bowel syndrome (IBS)\n• Gastric ulcers\n\n**Immediate care:**\n• Stay hydrated with small sips of water\n• Avoid solid foods temporarily\n• Try clear liquids (broth, electrolyte solutions)\n\n**See a doctor if:**\n• Symptoms persist over 24 hours\n• Severe abdominal pain\n• Blood in vomit or stool\n• High fever\n\n📅 **Book appointment:**\n• Start with "General Practice" for initial assessment\n• May refer to "Gastroenterology" if needed`;
    }

    if (actualQuery === "back pain after exercise") {
      return `🦴 **Orthopedic Specialist or Sports Medicine**\n\nBack pain after exercise is common and could indicate:\n\n• Muscle strain or sprain\n• Poor form during exercise\n• Overexertion or sudden movement\n• Possible disc issues (if severe)\n\n**Immediate care:**\n• Rest and avoid aggravating activities\n• Apply ice for first 24-48 hours\n• Gentle stretching if tolerable\n• Over-the-counter anti-inflammatory medication\n\n**Red flags - seek immediate care:**\n• Severe pain radiating to legs\n• Numbness or tingling\n• Loss of bladder/bowel control\n\n📅 **Book appointment:**\n• "Orthopedic Specialist" for bone/joint issues\n• "Sports Medicine" for exercise-related injuries\n• "Physical Therapy" for rehabilitation`;
    }

    if (actualQuery === "skin rash and itching") {
      return `🧴 **Dermatologist**\n\nSkin rash with itching needs dermatological evaluation. This could be:\n\n• Allergic reactions (contact dermatitis)\n• Eczema or atopic dermatitis\n• Fungal infections\n• Psoriasis\n• Drug reactions\n\n**Immediate care:**\n• Avoid scratching to prevent infection\n• Use cool, damp cloths for relief\n• Gentle, fragrance-free moisturizers\n• Avoid known irritants\n\n**Seek urgent care if:**\n• Rash spreads rapidly\n• Difficulty breathing (allergic reaction)\n• Signs of infection (pus, red streaks)\n• Fever with rash\n\n📅 **Book appointment:**\n• Go to "Doctor Consultation"\n• Filter by "Dermatology"\n• Consider same-day appointment if spreading`;
    }

    if (actualQuery === "how do i book an appointment?") {
      return `📅 **How to Book an Appointment**\n\n**Step-by-step process:**\n\n1. **Choose your service:**\n   • Doctor Consultation\n   • Home Nursing Services\n   • Laboratory Tests\n   • Pharmacy Services\n\n2. **Select your provider:**\n   • Browse available doctors/services\n   • Check ratings and reviews\n   • View specialties and qualifications\n\n3. **Pick date and time:**\n   • See real-time availability\n   • Choose convenient time slot\n   • Select in-person or virtual consultation\n\n4. **Complete booking:**\n   • Fill in patient details\n   • Choose payment method\n   • Confirm appointment\n\n💡 **Pro tip:** Book in advance for better availability!`;
    }

    if (actualQuery === "how to find nursing services?") {
      return `🏠 **How to Find Nursing Services**\n\n**Home Nursing Services available:**\n\n**Medical Care:**\n• Wound care and dressing\n• Medication administration\n• Vital signs monitoring\n• Post-operative care\n\n**Personal Care:**\n• Bathing and hygiene assistance\n• Mobility support\n• Companionship\n• Meal preparation\n\n**How to book:**\n1. Go to "Home Nursing Services"\n2. Select type of care needed\n3. Choose qualified nurse\n4. Schedule home visit\n5. Complete booking\n\n📞 **24/7 availability** for urgent nursing needs!`;
    }

    if (actualQuery === "emergency - need help now") {
      return this.getEmergencyResponse();
    }

    // PRIORITY 2: Other response types (greetings, thanks, emergency)
    // Immediate greeting responses
    if (
      actualQuery.includes("hello") ||
      actualQuery.includes("hi") ||
      actualQuery.includes("hey") ||
      actualQuery.includes("good morning") ||
      actualQuery.includes("good afternoon") ||
      actualQuery.includes("good evening")
    ) {
      return this.getGreetingResponse();
    }

    // Thank you responses
    if (actualQuery.includes("thank") || actualQuery.includes("thanks")) {
      return this.getThankYouResponse();
    }

    // Emergency responses - highest priority
    if (
      actualQuery.includes("emergency") ||
      actualQuery.includes("urgent") ||
      actualQuery.includes("999") ||
      actualQuery.includes("need help now")
    ) {
      return this.getEmergencyResponse();
    }

    // Emergency number queries
    if (
      actualQuery.includes("emergency number") ||
      actualQuery.includes("ambulance number") ||
      actualQuery.includes("what number") ||
      actualQuery.includes("which number") ||
      actualQuery.includes("emergency contact") ||
      actualQuery.includes("call in emergency") ||
      actualQuery.includes("999") ||
      actualQuery.includes("emergency services")
    ) {
      return this.getEmergencyNumberResponse();
    }

    // PRIORITY 3: Partial matches for symptoms (still recognize variations)
    if (actualQuery.includes("fever") && actualQuery.includes("headache")) {
      return `🌡️ **General Practitioner (Family Doctor)**\n\nFor fever and headaches, I recommend seeing a General Practitioner first. These symptoms could indicate:\n\n• Common viral infections (flu, cold)\n• Bacterial infections\n• Stress or tension headaches\n• Dehydration\n\n**Immediate care:**\n• Rest and stay hydrated\n• Monitor your temperature\n• Take over-the-counter pain relievers if needed\n\n📅 **Book appointment:**\n• Go to "Doctor Consultation"\n• Filter by "General Practice"\n• Choose available time slot\n\n⚠️ If fever exceeds 103°F (39.4°C) or symptoms worsen, seek immediate medical attention!`;
    }

    if (
      actualQuery.includes("chest pain") &&
      actualQuery.includes("breathing")
    ) {
      return `❤️ **URGENT - Cardiologist or Emergency Care**\n\n⚠️ **This requires immediate attention!**\n\nChest pain with breathing issues could indicate:\n• Heart problems (requires Cardiologist)\n• Lung issues (requires Pulmonologist)\n• Emergency conditions\n\n**Immediate action:**\n• If severe or sudden: Call 999 immediately\n• If mild but persistent: See a Cardiologist today\n• Don't wait - chest pain needs prompt evaluation\n\n📅 **Book urgent appointment:**\n• Go to "Doctor Consultation"\n• Filter by "Cardiology" or "Emergency"\n• Select same-day or urgent slots\n\n🚨 When in doubt, always choose emergency care for chest pain!`;
    }

    if (
      actualQuery.includes("stomach pain") &&
      actualQuery.includes("nausea")
    ) {
      return `🏥 **Gastroenterologist or General Practitioner**\n\nStomach pain with nausea suggests digestive issues. This could be:\n\n• Food poisoning or gastroenteritis\n• Acid reflux or GERD\n• Irritable bowel syndrome (IBS)\n• Gastric ulcers\n\n**Immediate care:**\n• Stay hydrated with small sips of water\n• Avoid solid foods temporarily\n• Try clear liquids (broth, electrolyte solutions)\n\n**See a doctor if:**\n• Symptoms persist over 24 hours\n• Severe abdominal pain\n• Blood in vomit or stool\n• High fever\n\n📅 **Book appointment:**\n• Start with "General Practice" for initial assessment\n• May refer to "Gastroenterology" if needed`;
    }

    if (actualQuery.includes("back pain") && actualQuery.includes("exercise")) {
      return `🦴 **Orthopedic Specialist or Sports Medicine**\n\nBack pain after exercise is common and could indicate:\n\n• Muscle strain or sprain\n• Poor form during exercise\n• Overexertion or sudden movement\n• Possible disc issues (if severe)\n\n**Immediate care:**\n• Rest and avoid aggravating activities\n• Apply ice for first 24-48 hours\n• Gentle stretching if tolerable\n• Over-the-counter anti-inflammatory medication\n\n**Red flags - seek immediate care:**\n• Severe pain radiating to legs\n• Numbness or tingling\n• Loss of bladder/bowel control\n\n📅 **Book appointment:**\n• "Orthopedic Specialist" for bone/joint issues\n• "Sports Medicine" for exercise-related injuries\n• "Physical Therapy" for rehabilitation`;
    }

    if (actualQuery.includes("skin rash") && actualQuery.includes("itching")) {
      return `🧴 **Dermatologist**\n\nSkin rash with itching needs dermatological evaluation. This could be:\n\n• Allergic reactions (contact dermatitis)\n• Eczema or atopic dermatitis\n• Fungal infections\n• Psoriasis\n• Drug reactions\n\n**Immediate care:**\n• Avoid scratching to prevent infection\n• Use cool, damp cloths for relief\n• Gentle, fragrance-free moisturizers\n• Avoid known irritants\n\n**Seek urgent care if:**\n• Rash spreads rapidly\n• Difficulty breathing (allergic reaction)\n• Signs of infection (pus, red streaks)\n• Fever with rash\n\n📅 **Book appointment:**\n• Go to "Doctor Consultation"\n• Filter by "Dermatology"\n• Consider same-day appointment if spreading`;
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

    // Enhanced single word recognition for health symptoms
    const singleWordHealthResponses: { [key: string]: string } = {
      heart: `❤️ **Heart Health Concerns**\n\nFor heart-related issues, I recommend:\n\n**Cardiologist** - Heart specialist for:\n• Chest pain or discomfort\n• Irregular heartbeat\n• High blood pressure\n• Heart palpitations\n• Shortness of breath\n\n**When to seek immediate care:**\n• Chest pain with breathing difficulty\n• Severe chest pressure\n• Pain radiating to arm, jaw, or back\n\n📅 **Book appointment:**\n• Go to "Doctor Consultation"\n• Filter by "Cardiology"\n• Choose your preferred time slot\n\n🚨 **Emergency:** Call 999 for severe chest pain!`,
      pain: `🩺 **Pain Assessment**\n\nI can help you find the right specialist for your pain:\n\n**Common pain specialists:**\n• **General Practitioner** - For general pain assessment\n• **Orthopedic** - For bone, joint, muscle pain\n• **Neurologist** - For nerve-related pain\n• **Rheumatologist** - For arthritis, joint inflammation\n\n**Tell me more specifically:**\n• Where is the pain? (head, back, chest, etc.)\n• How long have you had it?\n• What triggers it?\n\n📅 **Quick booking:** Use our "Doctor Consultation" service`,
      headache: `🧠 **Headache Help**\n\nFor headaches, I recommend:\n\n**Neurologist** - For:\n• Frequent or severe headaches\n• Migraines\n• Chronic headaches\n• Headaches with vision changes\n\n**General Practitioner** - For:\n• Occasional headaches\n• Tension headaches\n• Headaches with fever\n\n**Immediate care tips:**\n• Rest in a quiet, dark room\n• Stay hydrated\n• Apply cold/warm compress\n\n📅 **Book appointment** if headaches are frequent or severe`,
      stomach: `🏥 **Stomach Issues**\n\nFor stomach problems, consult:\n\n**Gastroenterologist** - For:\n• Chronic stomach pain\n• Digestive issues\n• Acid reflux\n• Ulcers\n\n**General Practitioner** - For:\n• Acute stomach pain\n• Nausea and vomiting\n• Food poisoning symptoms\n\n**Immediate care:**\n• Stay hydrated\n• Avoid solid foods temporarily\n• Rest\n\n📅 **Book consultation** for persistent symptoms`,
      back: `🦴 **Back Pain Relief**\n\nFor back pain, see:\n\n**Orthopedic Specialist** - For:\n• Chronic back pain\n• Spine issues\n• Disc problems\n• Joint pain\n\n**Physical Therapist** - For:\n• Muscle strain\n• Rehabilitation\n• Exercise-related injuries\n\n**Immediate care:**\n• Rest and avoid heavy lifting\n• Apply ice or heat\n• Gentle stretching\n\n📅 **Book appointment** for proper diagnosis`,
      fever: `🌡️ **Fever Management**\n\nFor fever, consult:\n\n**General Practitioner** - For:\n• Fever with other symptoms\n• Persistent fever\n• High fever (over 101°F)\n\n**Immediate care:**\n• Stay hydrated\n• Rest\n• Monitor temperature\n• Take fever reducers if needed\n\n**Seek immediate care if:**\n• Fever over 103°F (39.4°C)\n• Difficulty breathing\n• Severe headache\n• Persistent vomiting\n\n📅 **Book urgent appointment** if fever persists`,
      cough: `😷 **Cough Treatment**\n\nFor cough issues, see:\n\n**General Practitioner** - For:\n• Persistent cough\n• Cough with fever\n• Dry or productive cough\n\n**Pulmonologist** - For:\n• Chronic cough\n• Breathing difficulties\n• Lung-related issues\n\n**Immediate care:**\n• Stay hydrated\n• Use humidifier\n• Avoid irritants\n• Rest\n\n📅 **Book appointment** for cough lasting over 2 weeks`,
      breathing: `🫁 **Breathing Issues**\n\n⚠️ **Important:** Breathing problems can be serious!\n\n**Pulmonologist** - For:\n• Chronic breathing issues\n• Asthma\n• Lung problems\n\n**Cardiologist** - For:\n• Breathing issues with chest pain\n• Heart-related breathing problems\n\n**Emergency Care** - If:\n• Severe shortness of breath\n• Cannot speak in full sentences\n• Bluish lips or face\n\n🚨 **Seek immediate care** for severe breathing difficulty!`,
      skin: `🧴 **Skin Care**\n\nFor skin issues, consult:\n\n**Dermatologist** - For:\n• Skin rashes\n• Acne\n• Moles or growths\n• Skin infections\n• Allergic reactions\n\n**General Practitioner** - For:\n• Minor skin issues\n• Cuts and wounds\n• Basic skin care\n\n**Immediate care:**\n• Keep affected area clean\n• Avoid scratching\n• Use gentle, fragrance-free products\n\n📅 **Book dermatology appointment** for persistent skin issues`,
      sleep: `😴 **Sleep Issues**\n\nFor sleep problems, see:\n\n**Sleep Specialist** - For:\n• Sleep apnea\n• Chronic insomnia\n• Sleep disorders\n\n**General Practitioner** - For:\n• Occasional sleep issues\n• Sleep hygiene advice\n• Stress-related sleep problems\n\n**Sleep tips:**\n• Maintain regular sleep schedule\n• Create comfortable sleep environment\n• Avoid screens before bed\n• Limit caffeine\n\n📅 **Book consultation** for persistent sleep issues`,
    };

    // Enhanced single word recognition for platform/service queries
    const singleWordPlatformResponses: { [key: string]: string } = {
      book: `📅 **How to Book Services**\n\nI can help you book:\n\n**Available Services:**\n• **Doctor Consultation** - Video or in-person\n• **Home Nursing** - Professional care at home\n• **Laboratory Tests** - Sample collection or lab visits\n• **Pharmacy Services** - Medicine delivery\n\n**Quick booking steps:**\n1. Choose your service type\n2. Select provider/doctor\n3. Pick date and time\n4. Make Payment\n5. Receive confirmation\n\n**What would you like to book?**`,
      appointment: `📅 **Appointment Booking**\n\nLet me help you schedule an appointment:\n\n**Available Appointments:**\n• **Doctor Consultations** - All specialties\n• **Home Nursing** - Professional care\n• **Lab Tests** - Sample collection\n• **Specialist Consultations** - Expert care\n\n**Booking Process:**\n1. Go to "Doctor Consultation"\n2. Filter by specialty or location\n3. Choose available time slot\n4. Fill patient details\n5. Confirm booking\n\n**Need help with a specific type of appointment?**`,
      doctor: `👩‍⚕️ **Doctor Consultation**\n\nFind the right doctor for your needs:\n\n**Available Specialties:**\n• **General Practitioner** - Primary care\n• **Cardiologist** - Heart specialist\n• **Dermatologist** - Skin specialist\n• **Orthopedic** - Bone & joint specialist\n• **Neurologist** - Brain & nerve specialist\n• **Gastroenterologist** - Digestive specialist\n\n**Consultation Types:**\n• Video consultations\n• In-person visits\n• Emergency consultations\n\n**Ready to book a consultation?**`,
      nursing: `🏠 **Home Nursing Services**\n\nProfessional care at your home:\n\n**Available Services:**\n• **Medical Care** - Wound care, medication\n• **Personal Care** - Bathing, mobility support\n• **Elderly Care** - Specialized senior care\n• **Post-Surgery Care** - Recovery support\n• **Chronic Care** - Long-term assistance\n\n**How to book:**\n1. Go to "Home Nursing Services"\n2. Select type of care needed\n3. Choose qualified nurse\n4. Schedule home visit\n5. Confirm booking\n\n**Available 24/7 for urgent needs!**`,
      lab: `🔬 **Laboratory Services**\n\nComplete diagnostic testing:\n\n**Available Tests:**\n• **Blood Tests** - Complete blood count, lipid profile\n• **Urine Tests** - Routine and microscopic\n• **Imaging** - X-rays, ultrasounds\n• **Health Packages** - Comprehensive checkups\n• **Specialized Tests** - As prescribed\n\n**Service Options:**\n• **Home Collection** - Sample pickup\n• **Lab Visits** - Visit our facilities\n• **Reports** - Online and printed\n\n**Book your lab tests today!**`,
      pharmacy: `💊 **Pharmacy Services**\n\nMedicine delivery and more:\n\n**Available Services:**\n• **Prescription Medicines** - Upload prescription\n• **OTC Medications** - Over-the-counter drugs\n• **Health Products** - Supplements, devices\n• **Medicine Reminders** - Never miss a dose\n• **Home Delivery** - Fast and reliable\n\n**How to order:**\n1. Upload prescription or browse catalog\n2. Add items to cart\n3. Enter delivery address\n4. Choose payment method\n5. Track your order\n\n**Order your medicines now!**`,
      help: `🤝 **How Can I Help You?**\n\nI'm here to assist with:\n\n**Health Guidance:**\n• Find the right doctor for symptoms\n• Understand medical conditions\n• Emergency guidance\n• Health tips and advice\n\n**Platform Services:**\n• Book appointments\n• Navigate services\n• Account management\n• Technical support\n\n**Quick Actions:**\n• Tell me your symptoms\n• Ask "How do I book an appointment?"\n• Say "I need a doctor"\n• Ask about specific services\n\n**What specifically can I help you with?**`,
      payment: `💳 **Payment & Billing**\n\nPayment information and support:\n\n**Accepted Payment Methods:**\n• **Credit/Debit Cards** - Visa, Mastercard\n• **Digital Wallets** - PayPal, Apple Pay\n• **Bank Transfer** - Direct bank payment\n• **Insurance** - Health insurance coverage\n\n**Billing Support:**\n• View payment history\n• Download receipts\n• Payment plan options\n• Insurance claim assistance\n\n**Payment Issues:**\n• Contact our billing support\n• Dispute resolution\n• Refund requests\n\n**Need help with a specific payment issue?**`,
      account: `👤 **Account Management**\n\nManage your healthcare account:\n\n**Account Features:**\n• **Personal Profile** - Update information\n• **Medical History** - View past consultations\n• **Appointments** - Manage bookings\n• **Prescriptions** - Digital prescription history\n• **Payment Methods** - Saved cards and billing\n\n**Account Actions:**\n• Update profile information\n• Change password\n• Privacy settings\n• Notification preferences\n\n**Account Issues:**\n• Login problems\n• Password reset\n• Account verification\n\n**Go to your dashboard to manage your account!**`,
    };

    // Check for single word health queries first
    if (singleWordHealthResponses[actualQuery]) {
      return singleWordHealthResponses[actualQuery];
    }

    // Check for single word platform queries
    if (singleWordPlatformResponses[actualQuery]) {
      return singleWordPlatformResponses[actualQuery];
    }

    // Enhanced word recognition for health symptoms
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
      "ache",
      "sore",
      "trouble",
      "problem",
      "illness",
      "disease",
      "condition",
      "dizzy",
      "nausea",
      "vomit",
      "fever",
      "headache",
      "cough",
      "cold",
      "flu",
      "tired",
      "fatigue",
      "swollen",
      "rash",
      "bleeding",
      "bruise",
      "injury",
      "infection",
      "allergy",
      "heart",
      "stomach",
      "back",
      "breathing",
      "skin",
      "sleep",
    ];
    const isHealthQuery = healthKeywords.some((keyword) =>
      actualQuery.includes(keyword),
    );

    // Enhanced platform navigation keywords
    const platformKeywords = [
      "how to",
      "book",
      "schedule",
      "find",
      "use",
      "navigate",
      "help",
      "where",
      "appointment",
      "service",
      "nursing",
      "pharmacy",
      "lab",
      "test",
      "payment",
      "account",
      "login",
      "register",
      "dashboard",
      "profile",
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

    return this.getGenericResponse();
  }

  private formatDoctorRecommendation(condition: HealthCondition): string {
    const urgencyEmoji = {
      low: "💚",
      medium: "💛",
      high: "🧡",
      emergency: "🚨",
    };

    let response = `${urgencyEmoji[condition.urgencyLevel]} **Let me help you with this!**\n\n`;
    response += `Based on what you've described, I think you'd really benefit from seeing a **${condition.recommendedSpecialist}**. ${condition.description.toLowerCase()}, and they're absolutely the best people to help you feel better!\n\n`;

    if (
      condition.urgencyLevel === "emergency" ||
      condition.urgencyLevel === "high"
    ) {
      response += `⚠️ I want to make sure you know - this sounds like something that needs attention sooner rather than later. Please don't put it off! `;
    } else if (condition.urgencyLevel === "medium") {
      response += `It's a good idea to get this checked out when you can - no need to panic, but definitely worth addressing! `;
    } else {
      response += `This is something you can schedule at your convenience, but it's still worth getting looked at! `;
    }

    if (condition.additionalInfo) {
      response += condition.additionalInfo + "\n\n";
    }

    response += `📅 **Ready to book? It's super easy:**\n`;
    response += `• Head over to "Doctor Consultation"\n`;
    response += `• Look for specialty: **${condition.recommendedSpecialist}**\n`;
    response += `• Pick a doctor and time that works perfectly for you\n\n`;
    response += `I'm here if you need any help with the booking process! 😊`;

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
    return `🚨 **EMERGENCY ALERT**\n\nIf this is a medical emergency, please:\n\n• **Call 999 for ambulance services immediately**\n• Go to the nearest emergency room\n• Contact emergency medical services\n\n⚠️ Do not wait for online consultations in emergency situations!\n\nFor urgent but non-emergency care, you can:\n• Book a same-day appointment\n• Contact our 24/7 support line\n• Visit an urgent care provider`;
  }

  private getEmergencyNumberResponse(): string {
    return `🚨 **Emergency Contact Numbers**\n\n**In case of medical emergency:**\n• **Ambulance: 999**\n• **Police: 999**\n• **Fire: 999**\n\n**How to use:**\n• Dial 999 from any phone\n• Tell them you need an ambulance\n• Provide your location clearly\n• Stay on the line until help arrives\n\n**When to call 999:**\n• Severe chest pain\n• Difficulty breathing\n• Severe bleeding\n• Unconsciousness\n• Suspected stroke or heart attack\n• Severe allergic reactions\n\n⚠️ **Remember:** 999 is for life-threatening emergencies only!`;
  }

  private getGreetingResponse(): string {
    const greetings = [
      "Hey there! 👋 I'm Alex, and I'm really excited to help you today!\n\nI'm here to make your healthcare journey as smooth as possible. Whether you're feeling under the weather or just need to navigate our platform, I've got your back!\n\n🩺 **I can help you:**\n• Find the perfect specialist for what you're experiencing\n• Give you personalized doctor recommendations\n• Help you understand if something needs urgent attention\n\n💻 **Plus, I'll guide you through:**\n• Booking appointments (it's easier than you think!)\n• Finding the right services for you\n• Answering any questions about our platform\n\nSo, what's on your mind today? I'm all ears! 😊",
      "Hi! 🌟 I'm Alex, your health assistant!\n\nI'm here to make healthcare feel less overwhelming and more approachable. Think of me as your personal guide through everything health-related!\n\n**Here's how I can help:**\n• Share your symptoms with me, and I'll point you toward the right specialist\n• Need to book something? I'll walk you through it step by step\n• Got questions about our services? I love answering those!\n\nDon't worry about asking the 'right' questions - just tell me what's going on, and we'll figure it out together! What can I help you with?",
      "Hello! 😊 I'm Alex, and I'm genuinely happy you're here!\n\nI know dealing with health concerns can feel overwhelming sometimes, but that's exactly why I'm here - to make things easier and less stressful for you.\n\n**I'm really good at:**\n• Listening to your symptoms and connecting you with the right specialist\n• Making appointment booking feel like a breeze\n• Explaining our services in a way that actually makes sense\n• Being available whenever you need me (seriously, 24/7!)\n\nSo, what brings you here today? Whether it's a health concern or you just need help finding your way around, I'm ready to help! 🤗",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private getThankYouResponse(): string {
    const responses = [
      "You're so welcome! 😊 It genuinely makes me happy when I can help make your healthcare journey a little easier.\n\nPlease don't hesitate to come back anytime - whether it's for health questions, booking help, or just to chat about our services. I'm always here for you!",
      "You're absolutely welcome! 🌟 That's exactly what I'm here for - to make your life a bit easier when it comes to healthcare.\n\nRemember, I'm available 24/7, so whenever something comes up (big or small), just give me a shout. I love helping out!",
      "It was my pleasure helping you! 💚 Seriously, this is what I love doing - making healthcare feel less complicated and more approachable.\n\nTake good care of yourself, and remember I'm just a message away whenever you need anything. Looking forward to our next chat!",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getGenericHealthResponse(): string {
    return `🩺 **Let's get you the right care!**\n\nFrom what you've shared, I think it would be really beneficial for you to chat with a healthcare professional who can give you a proper evaluation and peace of mind.\n\n**Here's what I'd suggest:**\n• Start with a **General Practitioner** - they're fantastic for getting a complete picture of what's going on\n• If needed, they might connect you with a **Specialist** who focuses on your specific concern\n\n📅 **Ready to book? Here's how easy it is:**\n• Browse through our amazing doctors (they're all highly qualified!)\n• Pick someone based on their specialty and when they're available\n• Schedule at whatever time works best for you\n\n⚠️ Just a gentle reminder - if your symptoms feel severe or are getting worse, please don't wait. Seek immediate medical attention. Your health and safety come first! 💙`;
  }

  private getGenericPlatformResponse(): string {
    return `🤝 **I'm absolutely here to help you!**\n\nHonestly, I love helping people navigate healthcare - it can feel overwhelming sometimes, but it doesn't have to be! Let me show you around.\n\n🏥 **Healthcare Services I can help you with:**\n• Finding the perfect doctor for whatever you're experiencing\n• Making appointment booking super simple\n• Connecting you with amazing home nursing services\n• Getting lab tests scheduled (easier than you'd think!)\n• Helping with pharmacy needs\n\n💻 **Platform stuff (I promise it's not complicated!):**\n• Walking you through how everything works\n• Helping with your account (no tech headaches!)\n• Explaining payment and billing clearly\n• Solving any technical hiccups\n\nSo, what's on your mind? I'm genuinely excited to help you out! 😊`;
  }

  private getGenericResponse(): string {
    return `🤔 **I'm really excited to help, but I want to make sure I give you exactly what you need!**\n\nCould you help me understand a bit more about what's going on? I'm here for whatever you need:\n\n• **Health stuff** - Are you experiencing any symptoms or have health questions?\n• **Platform help** - Trying to book something or navigate our services?\n• **Just curious** - Want to know more about what we offer?\n\nDon't worry about being too detailed or asking the 'perfect' question - just share what's on your mind! And if you're not sure how to start, those quick action buttons below are super helpful too! 😊`;
  }

  /**
   * Context-specific help responses
   */
  private getNursingContextHelp(): string {
    return `🏠 **Perfect! You're looking at our nursing services!**\n\nI'm so glad you're here - our home nursing services are absolutely wonderful, and I'd love to help you find exactly what you need!\n\n**I can help you figure out:**\n• Which nursing provider would be the best fit for you\n• What the pricing looks like (no surprises!)\n• How to book your nursing appointment easily\n• What makes each provider special\n\n**We've got amazing services available:**\n• Caring general home nursing\n• Specialized medical care when you need it\n• Wonderful elderly care assistance\n• Supportive post-surgery recovery help\n\nWhat specific thing can I help you with? I'm excited to make this as easy as possible for you! 😊`;
  }

  private getDoctorContextHelp(): string {
    return `👩‍⚕️ **Awesome! You're in the right place for doctor consultations!**\n\nI'm really excited to help you find the perfect doctor - we have some truly amazing healthcare professionals on our platform!\n\n**Let me help you with:**\n• Finding the ideal specialist for what you're going through\n• Making booking your consultation super straightforward\n• Understanding all your consultation options\n• Checking out doctor profiles (they're all fantastic!)\n\n**You've got great options:**\n• Convenient video consultations from home\n• Traditional in-person visits\n• Specialist referrals when you need them\n• Emergency consultations for urgent needs\n\nWhat would you like me to help you with first? I'm here to make this whole process feel easy and stress-free! 🌟`;
  }

  private getLabContextHelp(): string {
    return `🔬 **Great choice! Our lab services are top-notch!**\n\nI'm here to make getting your lab work done as smooth and stress-free as possible - no more worrying about complicated medical stuff!\n\n**I'd love to help you with:**\n• Picking exactly the right tests for you\n• Setting up sample collection (we can even come to you!)\n• Explaining test procedures in plain English\n• Making sense of what tests you actually need\n\n**You've got some really convenient options:**\n• Home sample collection (so much easier!)\n• Lab visit appointments if you prefer\n• Complete health check packages\n• Specialized diagnostic tests when needed\n\nWhat part of the lab process can I help make easier for you? I promise it's not as complicated as it might seem! 😊`;
  }

  private getPharmacyContextHelp(): string {
    return `💊 **Perfect! You're checking out our pharmacy services!**\n\nI absolutely love helping people with their medication needs - it's so important to make this part of healthcare simple and convenient for you!\n\n**I'm here to help you with:**\n• Getting your prescriptions uploaded easily\n• Finding exactly the medications you need\n• Understanding all your delivery options (including home delivery!)\n• Making sure you get the best prices\n\n**We've got everything you need:**\n• All your prescription medicines\n• Over-the-counter drugs when you need them\n• Super convenient home delivery\n• Helpful medicine reminders so you never miss a dose\n\nWhat can I help you with today? Whether it's uploading a prescription or just browsing, I'm here to make it easy! 🌟`;
  }

  private getDashboardContextHelp(): string {
    return `📊 **Welcome to your personal healthcare hub!**\n\nI'm so excited you're here! Your dashboard is like your healthcare command center - everything you need is right at your fingertips, and I'm here to help you make the most of it!\n\n**Here's all the cool stuff you can do:**\n• Check out your upcoming appointments\n• Access all your medical records easily\n• Book any new services you need\n• Keep track of your orders\n• Update your profile whenever you want\n\n**Want to jump into action? Here are some popular things:**\n• Book a doctor consultation\n• Schedule some home nursing care\n• Get lab tests ordered\n• Browse our pharmacy\n\nWhat sounds most interesting to you right now? I'm here to guide you through anything you'd like to explore! 😊`;
  }

  /**
   * Get contextual suggestions based on user input
   */
  getSuggestions(input: string): string[] {
    const suggestions: string[] = [];
    const inputLower = input.toLowerCase();

    // Health-related suggestions
    if (inputLower.includes("pain") || inputLower.includes("hurt")) {
      suggestions.push("I have fever and headache");
      suggestions.push("Chest pain and breathing issues");
      suggestions.push("Back pain after exercise");
    }

    if (inputLower.includes("fever") || inputLower.includes("headache")) {
      suggestions.push("How do I book an appointment?");
      suggestions.push("Emergency - need help now");
      suggestions.push("Stomach pain and nausea");
    }

    if (inputLower.includes("skin") || inputLower.includes("rash")) {
      suggestions.push("Skin rash and itching");
      suggestions.push("How do I book an appointment?");
      suggestions.push("How to find nursing services?");
    }

    // Platform suggestions
    if (inputLower.includes("book") || inputLower.includes("appointment")) {
      suggestions.push("How do I book an appointment?");
      suggestions.push("How to find nursing services?");
      suggestions.push("How to schedule lab tests?");
    }

    // General health suggestions
    if (inputLower.includes("help") || inputLower.includes("need")) {
      suggestions.push("I have fever and headache");
      suggestions.push("How do I book an appointment?");
      suggestions.push("Emergency - need help now");
    }

    // Emergency suggestions
    if (inputLower.includes("emergency") || inputLower.includes("urgent")) {
      suggestions.push("Emergency - need help now");
      suggestions.push("Chest pain and breathing issues");
      suggestions.push("How do I book an appointment?");
    }

    // Default suggestions if no specific match
    if (suggestions.length === 0) {
      suggestions.push("I have fever and headache");
      suggestions.push("How do I book an appointment?");
      suggestions.push("How to find nursing services?");
    }

    return suggestions;
  }
}

export const aiService = new AIService();
export default aiService;
