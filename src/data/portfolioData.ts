export interface Project {
  id: string;
  title: string;
  year: string;
  category: 'Game Dev' | 'Desktop App' | 'AI & ML' | 'Database System' | 'Software Arch';
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  highlights: string[];
  gradient: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  description?: string;
  badge: string;
}

export interface Experience {
  id?: string;
  role: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
  tags: string[];
}

export interface SkillCategory {
  title: string;
  skills: { name: string; level: number; icon: string }[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  gradient: string;
  borderColor: string;
}

export interface PersonalInfo {
  fullName: string;
  firstName: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  address: string;
  timeZone: string;
  avatarImg: string;
  avatarDigitalImg: string;
  profilePhoto: string;
  availability: string;
  summary: string;
}

export interface StatItem {
  label: string;
  value: string;
  suffix: string;
}

export interface PortfolioSchema {
  personal: PersonalInfo;
  stats: StatItem[];
  services: Service[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skillCategories: SkillCategory[];
  marqueeSkills: string[];
  socialLinks: { name: string; url: string; icon: string; label: string }[];
}

export const initialPortfolioData: PortfolioSchema = {
  personal: {
    fullName: "Muhammad Hammad",
    firstName: "Hammad",
    title: "Software Engineer & AI Enthusiast",
    tagline: "Crafting High-Performance Systems, AI Solutions & 3D Interactive Experiences",
    email: "mh9456605@gmail.com",
    phone: "+92 308 4098287",
    whatsapp: "+923084098287",
    location: "Multan, Punjab, Pakistan",
    address: "Chak No. 2/KMR P/O Kot Abbas Shaheed, Multan",
    timeZone: "Asia/Karachi",
    avatarImg: "/images/avatar.png",
    avatarDigitalImg: "/images/avatar-digital.png",
    profilePhoto: "/images/profile-photo.jpg",
    availability: "Open to Opportunities & Collaborations",
    summary: "An enthusiastic Computer Science undergraduate at MNS University of Agriculture, Multan, passionate about software development, AI, and problem-solving. Skilled in C++, Python, C#, SQL, and video editing, with a strong interest in exploring new technologies and contributing to impactful projects."
  },

  stats: [
    { label: "Core Projects Completed", value: "5+", suffix: "Built" },
    { label: "Core Languages", value: "4+", suffix: "Languages" },
    { label: "Undergraduate Degree", value: "BSCS", suffix: "2023-27" },
    { label: "Creative Media Experience", value: "Nov 2025", suffix: "Present" }
  ],

  services: [
    {
      id: "software-eng",
      title: "Software Engineering & OOP",
      description: "Architecting clean, modular desktop and systems software using Object-Oriented Principles, robust file handling, and scalable design patterns.",
      technologies: ["C++", "C#", "OOP", "Software Architecture", "Data Structures"],
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      borderColor: "group-hover:border-cyan-500/50"
    },
    {
      id: "ai-ml",
      title: "AI & Machine Learning",
      description: "Developing intelligent diagnostic models, automated analytics, and prediction pipelines utilizing modern deep learning and ML toolkits.",
      technologies: ["Python", "TensorFlow", "Scikit-Learn", "Machine Learning", "Streamlit"],
      gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
      borderColor: "group-hover:border-purple-500/50"
    },
    {
      id: "game-dev",
      title: "3D Game Development",
      description: "Creating immersive 3D gameplay mechanics, AI enemy pathfinding, custom shaders, and physics-driven environments in Unity.",
      technologies: ["Unity Engine", "C# Scripting", "Shader Graph", "3D Sound Physics", "NavMesh"],
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderColor: "group-hover:border-emerald-500/50"
    },
    {
      id: "database-systems",
      title: "Database Architecture & SQL",
      description: "Designing normalized relational database structures, stored procedures, indexing, and data access layers for enterprise systems.",
      technologies: ["Microsoft SQL Server", "MySQL", "Relational Modeling", "CRUD Architecture"],
      gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
      borderColor: "group-hover:border-blue-500/50"
    },
    {
      id: "creative-media",
      title: "Visual Storytelling & Media",
      description: "Supervising brand visual language, camera operations, creative media workflows, and high-impact video post-production.",
      technologies: ["Video Editing", "Photography", "Canva", "Visual Design", "Creative Direction"],
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      borderColor: "group-hover:border-amber-500/50"
    }
  ],

  projects: [
    {
      id: "living-dead-fps",
      title: "Living Dead FPS Game",
      year: "2026",
      category: "Game Dev",
      description: "An action-packed 3D first-person shooter game built in Unity Engine. Features sophisticated enemy AI navigation, physics-based weapon recoil & reloading mechanics, responsive gunplay, and atmospheric cinematic lighting.",
      technologies: ["Unity Engine", "C#", "Shader Graph", "3D Sound Physics", "NavMesh AI", "Post-Processing"],
      githubUrl: "",
      liveUrl: "",
      featured: true,
      highlights: [
        "Complex enemy AI behavior states and pathfinding",
        "Physics-based weapon recoil, impact, and particle FX",
        "Custom shaders and atmospheric horror lighting",
        "3D spatial audio and immersive soundscapes"
      ],
      gradient: "from-red-600/30 to-amber-600/20"
    },
    {
      id: "cmailer-engine",
      title: "CMailer — Desktop Mailer Engine",
      year: "2026",
      category: "Desktop App",
      description: "A high-performance automated email dispatching and notification engine built with C++ / C#. Features SMTP protocol handling, batch recipient scheduling, template rendering, and robust error logging.",
      technologies: ["C++", "C#", "SMTP Protocol", "File I/O", "Data Structures", "Desktop Architecture"],
      githubUrl: "https://github.com/h4mmad07/CMailer",
      liveUrl: "",
      featured: true,
      highlights: [
        "Multi-threaded SMTP email dispatch and delivery status tracking",
        "Custom template rendering with dynamic field substitution",
        "Local relational storage for recipient lists and delivery logs",
        "Robust exception handling and queue retry architecture"
      ],
      gradient: "from-blue-600/30 to-cyan-600/20"
    },
    {
      id: "desktop-resume-builder",
      title: "Desktop Resume Builder",
      year: "2026",
      category: "Desktop App",
      description: "A smart client-side desktop application designed to build CVs instantly. Supports local database caching, customized schema templating, and automated dynamic PDF document generation.",
      technologies: ["C#", "Windows Forms", "Microsoft SQL Server", "iTextSharp", "PDF Engine"],
      githubUrl: "https://github.com/ResumeBuilder-Desktop",
      liveUrl: "",
      featured: true,
      highlights: [
        "Dynamic CV rendering with multiple template layouts",
        "Automated high-resolution PDF generation via iTextSharp",
        "Local relational SQL Server database for profile management",
        "Instant real-time resume preview"
      ],
      gradient: "from-cyan-600/30 to-blue-600/20"
    },
    {
      id: "smart-health-advisor",
      title: "Smart Health Advisor",
      year: "2026",
      category: "AI & ML",
      description: "An AI-powered diagnostic and symptom-checking application providing personalized health assessments, medical insights, and preliminary guidance using trained machine learning models.",
      technologies: ["Python", "Machine Learning", "Streamlit", "TensorFlow", "Pandas", "Scikit-Learn"],
      githubUrl: "https://github.com/Smart-Health-Advisor",
      liveUrl: "",
      featured: true,
      highlights: [
        "Machine Learning symptom-disease predictive modeling",
        "Interactive Streamlit web interface with immediate feedback",
        "Personalized health recommendations & triage guidelines",
        "Secure local processing of user health inputs"
      ],
      gradient: "from-purple-600/30 to-indigo-600/20"
    },
    {
      id: "hospital-management-system",
      title: "Hospital Management System",
      year: "2025",
      category: "Database System",
      description: "A comprehensive hospital administration suite for managing patient admissions, doctor appointments, automated billing, room allocations, and medical pharmacy inventories.",
      technologies: ["C++", "SQL Server", "OOP", "Database Design", "Relational Schema"],
      githubUrl: "https://github.com/Hospital-Management-System",
      liveUrl: "",
      featured: false,
      highlights: [
        "Patient admission, diagnostics, and prescription tracking",
        "Doctor roster management and automated appointment slots",
        "Room allocation & billing calculations with SQL persistence",
        "Clean Object-Oriented architecture with robust exception handling"
      ],
      gradient: "from-emerald-600/30 to-cyan-600/20"
    },
    {
      id: "library-management-system",
      title: "Library Management System",
      year: "2025",
      category: "Software Arch",
      description: "A high-performance management application for automated book cataloging, member subscriptions, fine calculations, and instant search algorithms powered by optimized data structures.",
      technologies: ["C++", "File Handling", "Data Structures", "Algorithms", "Binary Search"],
      githubUrl: "https://github.com/Library-Management-System",
      liveUrl: "",
      featured: false,
      highlights: [
        "Efficient binary search & hashing for instant book retrieval",
        "Persistent file storage and data serialization",
        "Automated overdue fine computation and member records",
        "Memory-safe data structure implementations"
      ],
      gradient: "from-blue-600/30 to-teal-600/20"
    }
  ],

  experience: [
    {
      id: "cbs-lead",
      role: "Videographer / Video Editor",
      company: "Character Building Society (CBS)",
      period: "Nov 2025 — Present",
      location: "Multan, Pakistan",
      responsibilities: [
        "Supervise branding, visual styling, and media design language across university initiatives.",
        "Manage end-to-end creative workflow systems for digital and event media operations.",
        "Execute high-standard video coverage, audio mastering, and creative post-production.",
        "Collaborate with marketing teams to craft compelling visual storytelling content."
      ],
      tags: ["Video Editing", "Creative Direction", "Visual Storytelling", "Brand Design", "Canva"]
    }
  ],

  education: [
    {
      id: "edu-bscs",
      degree: "Bachelor of Science in Computer Science (BSCS)",
      institution: "Muhammad Nawaz Sharif University of Agriculture, Multan (MNSUAM)",
      period: "2023 — 2027",
      location: "Multan, Pakistan",
      badge: "In Progress",
      description: "Focusing on Software Engineering, Data Structures & Algorithms, Artificial Intelligence, Database Management Systems, and Object-Oriented Programming."
    },
    {
      id: "edu-ics",
      degree: "Intermediate (ICS - Computer Science)",
      institution: "Nishat College of Science, Multan",
      period: "2021 — 2023",
      location: "Multan, Pakistan",
      badge: "Completed",
      description: "Studied core Computer Science principles, Mathematics, Physics, and foundational programming."
    },
    {
      id: "edu-matric",
      degree: "Matriculation (Science)",
      institution: "Govt. High School 2/KMR, Multan",
      period: "2019 — 2021",
      location: "Multan, Pakistan",
      badge: "Completed",
      description: "Secondary school education with high academic distinction in Science and Mathematics."
    }
  ],

  skillCategories: [
    {
      title: "Programming Languages",
      skills: [
        { name: "C++", level: 90, icon: "Code2" },
        { name: "Python", level: 85, icon: "Terminal" },
        { name: "C#", level: 85, icon: "FileCode" },
        { name: "SQL", level: 88, icon: "Database" },
        { name: "HTML / CSS", level: 90, icon: "Layout" },
        { name: "JavaScript", level: 80, icon: "Cpu" }
      ]
    },
    {
      title: "Core Computer Science",
      skills: [
        { name: "Object-Oriented Programming", level: 95, icon: "Layers" },
        { name: "Data Structures & Algorithms", level: 88, icon: "Workflow" },
        { name: "Problem Solving", level: 90, icon: "Zap" },
        { name: "Software Architecture", level: 82, icon: "Boxes" },
        { name: "File Handling & I/O", level: 88, icon: "FolderArchive" }
      ]
    },
    {
      title: "Databases & Engines",
      skills: [
        { name: "Microsoft SQL Server", level: 85, icon: "Database" },
        { name: "MySQL", level: 82, icon: "Server" },
        { name: "Unity Engine", level: 85, icon: "Gamepad2" },
        { name: "Streamlit", level: 84, icon: "Sparkles" },
        { name: "TensorFlow / ML", level: 78, icon: "Brain" }
      ]
    },
    {
      title: "Creative & Visual Media",
      skills: [
        { name: "Video Editing", level: 92, icon: "Video" },
        { name: "Photography & Cinematography", level: 88, icon: "Camera" },
        { name: "Canva & Graphic Design", level: 90, icon: "Palette" },
        { name: "Visual Storytelling", level: 88, icon: "Film" }
      ]
    }
  ],

  marqueeSkills: [
    "C++", "Python", "C#", "Unity Engine 3D", "TensorFlow", "Machine Learning", 
    "Microsoft SQL Server", "MySQL", "Streamlit", "Data Structures", 
    "Algorithms", "OOP Architecture", "Shader Graph", "Video Editing", 
    "Photography", "Canva", "HTML5 & CSS3", "iTextSharp", "Desktop Engineering"
  ],

  socialLinks: [
    { name: "Email", url: "mailto:mh9456605@gmail.com", icon: "Mail", label: "mh9456605@gmail.com" },
    { name: "Phone / WhatsApp", url: "https://wa.me/923084098287", icon: "Phone", label: "+92 308 4098287" },
    { name: "GitHub", url: "https://github.com/", icon: "Github", label: "GitHub Profile" },
    { name: "Location", url: "#contact", icon: "MapPin", label: "Multan, Pakistan" }
  ]
};
