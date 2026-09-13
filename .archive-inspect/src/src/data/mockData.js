export const initialWorkoutLevels = {
  "Workout 1": {
    name: "Workout 1 (Beginner)",
    description: "Introductory conditioning and basic movement mechanics.",
    exercises: [
      { id: "w1_ex1", name: "Bodyweight Squats", sets: 3, reps: 15, image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=60" },
      { id: "w1_ex2", name: "Incline Push-ups", sets: 3, reps: 10, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format&fit=crop&q=60" },
      { id: "w1_ex3", name: "Dumbbell Rows (Light)", sets: 3, reps: 12, image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&auto=format&fit=crop&q=60" },
      { id: "w1_ex4", name: "Plank Hold", sets: 3, reps: 30, isTime: true, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  "Workout 2": {
    name: "Workout 2 (Novice)",
    description: "Building foundational strength with light dumbbells and machines.",
    exercises: [
      { id: "w2_ex1", name: "Goblet Squats", sets: 3, reps: 12, image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=60" },
      { id: "w2_ex2", name: "Flat Push-ups", sets: 3, reps: 12, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format&fit=crop&q=60" },
      { id: "w2_ex3", name: "Lat Pulldown", sets: 3, reps: 12, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60" },
      { id: "w2_ex4", name: "Dumbbell Shoulder Press", sets: 3, reps: 10, image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  "Workout 3": {
    name: "Workout 3 (Intermediate)",
    description: "Standard compound barbell training for muscle growth.",
    exercises: [
      { id: "w3_ex1", name: "Barbell Back Squat", sets: 4, reps: 10, image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=60" },
      { id: "w3_ex2", name: "Barbell Bench Press", sets: 4, reps: 10, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60" },
      { id: "w3_ex3", name: "Barbell Rows", sets: 4, reps: 10, image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&auto=format&fit=crop&q=60" },
      { id: "w3_ex4", name: "Hanging Leg Raises", sets: 3, reps: 12, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  "Workout 4": {
    name: "Workout 4 (Advanced-Intermediate)",
    description: "Increased intensity and introduction to deadlifts.",
    exercises: [
      { id: "w4_ex1", name: "Deadlift", sets: 4, reps: 8, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60" },
      { id: "w4_ex2", name: "Overhead Press (Barbell)", sets: 4, reps: 8, image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=60" },
      { id: "w4_ex3", name: "Bodyweight Pull-ups", sets: 4, reps: 8, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format&fit=crop&q=60" },
      { id: "w4_ex4", name: "Incline Dumbbell Bench", sets: 4, reps: 10, image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  "Workout 5": {
    name: "Workout 5 (Advanced)",
    description: "High volume isolation and specialized compound work.",
    exercises: [
      { id: "w5_ex1", name: "Front Squats", sets: 4, reps: 8, image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=60" },
      { id: "w5_ex2", name: "Weighted Chest Dips", sets: 4, reps: 8, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format&fit=crop&q=60" },
      { id: "w5_ex3", name: "Barbell Hip Thrusts", sets: 4, reps: 10, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60" },
      { id: "w5_ex4", name: "Cable Crossovers", sets: 3, reps: 12, image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&auto=format&fit=crop&q=60" }
    ]
  },
  "Workout 6": {
    name: "Workout 6 (Elite)",
    description: "Maximum athletic development, power lifts, and heavy targets.",
    exercises: [
      { id: "w6_ex1", name: "Clean & Jerk", sets: 5, reps: 5, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60" },
      { id: "w6_ex2", name: "Heavy Dumbbell Bench Press", sets: 4, reps: 6, image: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&auto=format&fit=crop&q=60" },
      { id: "w6_ex3", name: "Weighted Pull-ups", sets: 4, reps: 6, image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format&fit=crop&q=60" },
      { id: "w6_ex4", name: "Romanian Deadlift", sets: 4, reps: 8, image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=60" }
    ]
  }
};

export const initialMembers = [
  {
    id: "mem_1",
    name: "Rahul Sharma",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+91 98765 43210",
    email: "rahul.sharma@example.com",
    role: "customer",
    membership: {
      type: "Premium Yearly",
      status: "Active",
      startDate: "2026-01-15",
      endDate: "2027-01-14",
      price: 24000
    },
    workoutLevel: "Workout 3",
    attendance: [
      { date: "2026-06-25", status: "Present", checkIn: "08:15 AM", checkOut: "09:45 AM" },
      { date: "2026-06-26", status: "Present", checkIn: "08:10 AM", checkOut: "09:30 AM" },
      { date: "2026-06-27", status: "Present", checkIn: "08:22 AM", checkOut: "09:50 AM" },
      { date: "2026-06-29", status: "Present", checkIn: "08:05 AM", checkOut: "09:30 AM" }
    ],
    ptPackage: {
      package: "Personal Training Lite",
      trainerName: "Coach Vikram",
      sessionsPurchased: 24,
      completed: 18,
      remaining: 6,
      history: [
        { date: "2026-06-20", checkIn: "08:30 AM", checkOut: "09:30 AM", notes: "Worked on squat form and depth. Keep heels down.", memberSig: "Rahul S.", trainerSig: "Coach V." },
        { date: "2026-06-22", checkIn: "08:30 AM", checkOut: "09:30 AM", notes: "Upper body chest/shoulder push session. Good energy.", memberSig: "Rahul S.", trainerSig: "Coach V." },
        { date: "2026-06-25", checkIn: "08:30 AM", checkOut: "09:30 AM", notes: "Deadlift posture and back engagement. Lifted 100kg.", memberSig: "Rahul S.", trainerSig: "Coach V." }
      ]
    },
    fitnessTestHistory: [
      {
        date: "2026-04-10",
        general: { height: 178, weight: 82, bmi: 25.9, bodyFat: 22.4, muscleMass: 60.5, bmr: 1810, visceralFat: 8 },
        measurements: { neck: 38, chest: 104, waist: 92, hips: 101, thigh: 58, biceps: 36, forearm: 29, calf: 38, shoulder: 118 },
        strength: { benchPress: 70, latPulldown: 60, legPress: 180, sitAndReach: 14 },
        cardio: { vo2Max: 38, restingHR: 72 }
      },
      {
        date: "2026-05-15",
        general: { height: 178, weight: 80.5, bmi: 25.4, bodyFat: 20.8, muscleMass: 61.2, bmr: 1825, visceralFat: 7 },
        measurements: { neck: 38, chest: 105, waist: 89, hips: 100, thigh: 58.5, biceps: 36.5, forearm: 29.5, calf: 38, shoulder: 120 },
        strength: { benchPress: 75, latPulldown: 65, legPress: 200, sitAndReach: 16 },
        cardio: { vo2Max: 40, restingHR: 68 }
      },
      {
        date: "2026-06-18",
        general: { height: 178, weight: 79.2, bmi: 25.0, bodyFat: 19.1, muscleMass: 61.8, bmr: 1835, visceralFat: 6 },
        measurements: { neck: 37.5, chest: 106, waist: 86, hips: 98, thigh: 59, biceps: 37, forearm: 30, calf: 38, shoulder: 121 },
        strength: { benchPress: 82.5, latPulldown: 70, legPress: 220, sitAndReach: 18 },
        cardio: { vo2Max: 42, restingHR: 64 }
      }
    ],
    todaysWorkoutAdjustment: null,
    referralCode: "RAHUL987",
    upcomingTest: "2026-07-18",
    todayTrainer: "Coach Vikram"
  },
  {
    id: "mem_2",
    name: "Aditi Rao",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    phone: "+91 91234 56789",
    email: "aditi.rao@example.com",
    role: "customer",
    membership: {
      type: "Monthly Basic",
      status: "Active",
      startDate: "2026-06-01",
      endDate: "2026-07-01",
      price: 3000
    },
    workoutLevel: "Workout 1",
    attendance: [
      { date: "2026-06-24", status: "Present", checkIn: "07:00 AM", checkOut: "08:15 AM" },
      { date: "2026-06-26", status: "Present", checkIn: "07:15 AM", checkOut: "08:30 AM" }
    ],
    ptPackage: null,
    fitnessTestHistory: [
      {
        date: "2026-06-01",
        general: { height: 162, weight: 68, bmi: 25.9, bodyFat: 31.5, muscleMass: 42.2, bmr: 1390, visceralFat: 9 },
        measurements: { neck: 32, chest: 94, waist: 82, hips: 104, thigh: 54, biceps: 29, forearm: 23, calf: 34, shoulder: 102 },
        strength: { benchPress: 20, latPulldown: 25, legPress: 60, sitAndReach: 12 },
        cardio: { vo2Max: 30, restingHR: 78 }
      }
    ],
    todaysWorkoutAdjustment: null,
    referralCode: "ADITI123",
    upcomingTest: "2026-07-01",
    todayTrainer: "Coach Sarah"
  },
  {
    id: "mem_3",
    name: "Rohit Deshmukh",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+91 99887 76655",
    email: "rohit.deshmukh@example.com",
    role: "customer",
    membership: {
      type: "Premium Half-Yearly",
      status: "Active",
      startDate: "2026-03-10",
      endDate: "2026-09-10",
      price: 13500
    },
    workoutLevel: "Workout 5",
    attendance: [
      { date: "2026-06-24", status: "Present", checkIn: "06:15 PM", checkOut: "07:45 PM" },
      { date: "2026-06-25", status: "Present", checkIn: "06:30 PM", checkOut: "08:00 PM" },
      { date: "2026-06-26", status: "Present", checkIn: "06:00 PM", checkOut: "07:30 PM" },
      { date: "2026-06-29", status: "Present", checkIn: "06:05 PM", checkOut: "07:35 PM" }
    ],
    ptPackage: {
      package: "Personal Training Elite",
      trainerName: "Coach Rohan",
      sessionsPurchased: 48,
      completed: 32,
      remaining: 16,
      history: [
        { date: "2026-06-22", checkIn: "06:00 PM", checkOut: "07:00 PM", notes: "Heavy front squat progression. 80kg.", memberSig: "Rohit D.", trainerSig: "Coach R." },
        { date: "2026-06-24", checkIn: "06:00 PM", checkOut: "07:00 PM", notes: "Dips with +15kg. Excellent chest drive.", memberSig: "Rohit D.", trainerSig: "Coach R." },
        { date: "2026-06-26", checkIn: "06:00 PM", checkOut: "07:00 PM", notes: "Hip thrust peak contraction hold focus.", memberSig: "Rohit D.", trainerSig: "Coach R." }
      ]
    },
    fitnessTestHistory: [
      {
        date: "2026-03-12",
        general: { height: 182, weight: 88, bmi: 26.6, bodyFat: 24.2, muscleMass: 63.8, bmr: 1910, visceralFat: 10 },
        measurements: { neck: 40, chest: 108, waist: 96, hips: 106, thigh: 61, biceps: 38, forearm: 31, calf: 40, shoulder: 122 },
        strength: { benchPress: 80, latPulldown: 70, legPress: 220, sitAndReach: 12 },
        cardio: { vo2Max: 35, restingHR: 75 }
      },
      {
        date: "2026-06-15",
        general: { height: 182, weight: 84.5, bmi: 25.5, bodyFat: 18.5, muscleMass: 65.5, bmr: 1945, visceralFat: 7 },
        measurements: { neck: 39.5, chest: 110, waist: 88, hips: 103, thigh: 61.5, biceps: 39.5, forearm: 32, calf: 40, shoulder: 126 },
        strength: { benchPress: 100, latPulldown: 85, legPress: 280, sitAndReach: 15 },
        cardio: { vo2Max: 41, restingHR: 66 }
      }
    ],
    todaysWorkoutAdjustment: null,
    referralCode: "ROHIT776",
    upcomingTest: "2026-09-12",
    todayTrainer: "Coach Rohan"
  },
  {
    id: "mem_4",
    name: "Samantha Lopez",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    phone: "+91 88776 65544",
    email: "samantha.l@example.com",
    role: "customer",
    membership: {
      type: "Premium Monthly",
      status: "Active",
      startDate: "2026-05-20",
      endDate: "2026-06-20",
      price: 4500
    },
    workoutLevel: "Workout 4",
    attendance: [
      { date: "2026-06-18", status: "Present", checkIn: "10:00 AM", checkOut: "11:15 AM" },
      { date: "2026-06-20", status: "Present", checkIn: "10:15 AM", checkOut: "11:30 AM" }
    ],
    ptPackage: null,
    fitnessTestHistory: [
      {
        date: "2026-05-20",
        general: { height: 168, weight: 65, bmi: 23.0, bodyFat: 25.8, muscleMass: 45.6, bmr: 1450, visceralFat: 6 },
        measurements: { neck: 34, chest: 92, waist: 74, hips: 98, thigh: 52, biceps: 28, forearm: 22, calf: 35, shoulder: 104 },
        strength: { benchPress: 35, latPulldown: 40, legPress: 100, sitAndReach: 20 },
        cardio: { vo2Max: 36, restingHR: 70 }
      }
    ],
    todaysWorkoutAdjustment: null,
    referralCode: "SAM887",
    upcomingTest: "2026-06-20",
    todayTrainer: "Coach Sarah"
  },
  {
    id: "mem_5",
    name: "Vikram Malhotra",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+91 77665 54433",
    email: "vikram.m@example.com",
    role: "customer",
    membership: {
      type: "Regular Quarterly",
      status: "Active",
      startDate: "2026-04-01",
      endDate: "2026-07-01",
      price: 8500
    },
    workoutLevel: "Workout 2",
    attendance: [
      { date: "2026-06-15", status: "Present", checkIn: "07:30 PM", checkOut: "08:45 PM" },
      { date: "2026-06-17", status: "Present", checkIn: "07:30 PM", checkOut: "09:00 PM" }
    ],
    ptPackage: null,
    fitnessTestHistory: [
      {
        date: "2026-04-02",
        general: { height: 175, weight: 85, bmi: 27.8, bodyFat: 28.0, muscleMass: 58.0, bmr: 1720, visceralFat: 11 },
        measurements: { neck: 39, chest: 106, waist: 98, hips: 104, thigh: 57, biceps: 34, forearm: 28, calf: 39, shoulder: 114 },
        strength: { benchPress: 50, latPulldown: 45, legPress: 120, sitAndReach: 8 },
        cardio: { vo2Max: 32, restingHR: 80 }
      }
    ],
    todaysWorkoutAdjustment: null,
    referralCode: "VIK776",
    upcomingTest: "2026-07-02",
    todayTrainer: "Coach Rohan"
  }
];

export const initialEnquiries = [
  {
    id: "enq_1",
    name: "Pooja Hegde",
    age: 26,
    gender: "Female",
    phone: "+91 96543 21098",
    email: "pooja.hegde@example.com",
    occupation: "Software Engineer",
    goal: "Weight Loss",
    source: "Instagram",
    preferredTime: "Morning",
    salesNotes: "Wants to lose 10 kg for an upcoming wedding. Inquired about PT charges.",
    followUpDate: "2026-06-30",
    status: "Contacted",
    dateCreated: "2026-06-28"
  },
  {
    id: "enq_2",
    name: "Karan Johar",
    age: 38,
    gender: "Male",
    phone: "+91 95432 10987",
    email: "karan.johar@example.com",
    occupation: "Business Owner",
    goal: "General Fitness",
    source: "Website",
    preferredTime: "Evening",
    salesNotes: "Very busy schedule, wants a flexible package and steam room amenities.",
    followUpDate: "2026-06-29",
    status: "New",
    dateCreated: "2026-06-29"
  },
  {
    id: "enq_3",
    name: "Deepak Chahar",
    age: 22,
    gender: "Male",
    phone: "+91 94321 09876",
    email: "deepak.c@example.com",
    occupation: "Student",
    goal: "Muscle Gain",
    source: "Referral",
    preferredTime: "Afternoon",
    salesNotes: "Referred by Rahul Sharma. Interested in student discount on annual package.",
    followUpDate: "2026-07-02",
    status: "Trial",
    dateCreated: "2026-06-27"
  },
  {
    id: "enq_4",
    name: "Simran Kaur",
    age: 30,
    gender: "Female",
    phone: "+91 93210 98765",
    email: "simran.k@example.com",
    occupation: "HR Manager",
    goal: "General Fitness",
    source: "Walk-in",
    preferredTime: "Morning",
    salesNotes: "Walked in during morning hours. Showed around facilities, loves cycling studio.",
    followUpDate: "2026-06-29",
    status: "Joined",
    dateCreated: "2026-06-25"
  }
];

export const initialComplaints = [
  {
    id: "comp_1",
    memberName: "Rahul Sharma",
    category: "Equipment",
    description: "The primary bench press cable machine feels sticky and needs lubrication.",
    date: "2026-06-28",
    status: "In Progress"
  },
  {
    id: "comp_2",
    memberName: "Samantha Lopez",
    category: "Hygiene",
    description: "Women's lockers are occasionally short of dry towels during peak hours (10 AM).",
    date: "2026-06-24",
    status: "Resolved"
  },
  {
    id: "comp_3",
    memberName: "Vikram Malhotra",
    category: "Service",
    description: "Water dispenser near cardio section has slow flow rate.",
    date: "2026-06-29",
    status: "Pending"
  }
];

export const initialTrainers = [
  { id: "trn_1", name: "Coach Vikram", photo: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&auto=format&fit=crop&q=80", rating: 4.8, activeMembers: 8, checkIns: 12 },
  { id: "trn_2", name: "Coach Sarah", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", rating: 4.9, activeMembers: 11, checkIns: 18 },
  { id: "trn_3", name: "Coach Rohan", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", rating: 4.7, activeMembers: 9, checkIns: 15 }
];

export const initialAnnouncements = [
  { id: "ann_1", title: "Sunday Power Yoga Special", content: "Join Coach Anjali this Sunday at 8 AM for an intense flexibility and breathwork session. Free for all members!", date: "2026-06-28", category: "Event" },
  { id: "ann_2", title: "Maintenance Scheduled", content: "Steam rooms will be closed for quarterly sanitization and maintenance on July 2nd, from 10 AM to 4 PM.", date: "2026-06-27", category: "Notice" },
  { id: "ann_3", title: "Referral Bonus Extended", content: "Refer a friend this month and get 15 days of free membership extension instead of 7! Use your referral code.", date: "2026-06-25", category: "Offer" }
];

export const initialNotifications = [
  { id: "not_1", type: "Birthday", message: "🎂 Happy Birthday, Rahul Sharma! Celebrate with a free protein shake at the juice bar today!", time: "Today, 08:00 AM", unread: true },
  { id: "not_2", type: "Fitness Test Reminder", message: "📋 Aditi Rao's monthly fitness test is due tomorrow. Coach Sarah is scheduled.", time: "Today, 11:30 AM", unread: true },
  { id: "not_3", type: "Membership Renewal", message: "⚠️ Samantha Lopez's membership expired on June 20th. Renewal pending.", time: "Yesterday, 04:15 PM", unread: false },
  { id: "not_4", type: "Absent 5 Days", message: "🚨 Vikram Malhotra has been absent for 12 consecutive days. Consider follow-up call.", time: "2 days ago", unread: false },
  { id: "not_5", type: "Referral Reward", message: "🎁 Rohit Deshmukh's referral Deepak joined! 100 reward points credited.", time: "3 days ago", unread: false },
  { id: "not_6", type: "Gym Announcement", message: "📢 Maintenance scheduled for Steam Rooms on July 2nd.", time: "4 days ago", unread: false }
];

export const initialChartData = {
  attendanceTrend: [
    { name: "Mon", count: 145 },
    { name: "Tue", count: 130 },
    { name: "Wed", count: 155 },
    { name: "Thu", count: 140 },
    { name: "Fri", count: 160 },
    { name: "Sat", count: 95 },
    { name: "Sun", count: 40 }
  ],
  peakHours: [
    { time: "6 AM", count: 45 },
    { time: "8 AM", count: 78 },
    { time: "10 AM", count: 32 },
    { time: "12 PM", count: 15 },
    { time: "2 PM", count: 18 },
    { time: "4 PM", count: 40 },
    { time: "6 PM", count: 92 },
    { time: "8 PM", count: 85 }
  ],
  membershipGrowth: [
    { month: "Jan", Basic: 40, Premium: 80 },
    { month: "Feb", Basic: 45, Premium: 85 },
    { month: "Mar", Basic: 50, Premium: 95 },
    { month: "Apr", Basic: 55, Premium: 105 },
    { month: "May", Basic: 60, Premium: 120 },
    { month: "Jun", Basic: 65, Premium: 135 }
  ],
  revenueSplit: [
    { name: "Membership Fees", value: 345000 },
    { name: "Personal Training", value: 180000 },
    { name: "Juice Bar/Merch", value: 45000 },
    { name: "Locker Rentals", value: 25000 }
  ]
};
