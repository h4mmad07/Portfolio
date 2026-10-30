export * from '../types/portfolio';
import { PortfolioSchema } from '../types/portfolio';

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
    resumeUrl: "",
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
      borderColor: "group-hover:border-cyan-500/50",
      displayOrder: 1,
      isVisible: true
    },
    {
      id: "ai-ml",
      title: "AI & Machine Learning Systems",
      description: "Building intelligent systems with Python, OpenCV, and modern ML algorithms for predictive modeling, computer vision, and automation pipelines.",
      technologies: ["Python", "Machine Learning", "OpenCV", "Data Analysis", "Algorithms"],
      gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
      borderColor: "group-hover:border-purple-500/50",
      displayOrder: 2,
      isVisible: true
    },
    {
      id: "game-dev",
      title: "Interactive 3D & Game Development",
      description: "Creating immersive interactive simulations and games leveraging Unity Engine, Blender 3D modeling, C# scripting, and optimized render pipelines.",
      technologies: ["Unity 3D", "C# Scripting", "Blender", "Physics Simulation", "Game Design"],
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderColor: "group-hover:border-emerald-500/50",
      displayOrder: 3,
      isVisible: true
    },
    {
      id: "database-systems",
      title: "Database Architecture & Systems",
      description: "Designing normalized relational databases, transactional schemas, and high-performance SQL queries for mission-critical record management.",
      technologies: ["SQL Server", "MySQL", "Database Design", "Schema Architecture", "Data Integrity"],
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      borderColor: "group-hover:border-amber-500/50",
      displayOrder: 4,
      isVisible: true
    }
  ],

  projects: [
    {
      id: "blood-pressure-app",
      title: "Blood Pressure Management System",
      year: "2026",
      category: "Desktop App",
      description: "A desktop software for tracking cardiovascular health metrics, calculating mean arterial pressure, and providing health trend alerts with robust local file storage.",
      technologies: ["C#", "Windows Forms", ".NET Framework", "Data Persistence", "Medical Logic"],
      githubUrl: "https://github.com/h4mmad07",
      liveUrl: "",
      thumbnailUrl: "",
      screenshots: [],
      status: "Completed",
      featured: true,
      highlights: [
        "Structured file-based persistence engine storing time-stamped clinical measurements",
        "Dynamic Mean Arterial Pressure (MAP) and pulse pressure calculation algorithms",
        "Color-coded systolic/diastolic risk zone classification adhering to AHA guidelines",
        "Built-in trend visualization for multi-week cardiovascular history"
      ],
      gradient: "from-cyan-600/30 to-blue-600/20",
      displayOrder: 1,
      isPublished: true
    },
    {
      id: "supermarket-system",
      title: "Supermarket Management System",
      year: "2025",
      category: "Desktop App",
      description: "A point-of-sale inventory and transaction suite built with C++ and OOP, featuring customer invoicing, product cataloging, and sales reporting.",
      technologies: ["C++", "Object-Oriented Programming", "File Handling", "Data Structures"],
      githubUrl: "https://github.com/h4mmad07",
      liveUrl: "",
      thumbnailUrl: "",
      screenshots: [],
      status: "Completed",
      featured: true,
      highlights: [
        "Modular OOP structure with robust encapsulation and polymorphism",
        "Fast binary file serialization for inventory items and customer receipts",
        "Automated billing engine with tiered discount and tax calculation algorithms",
        "Comprehensive administrative dashboard for product threshold stock alerts"
      ],
      gradient: "from-blue-600/30 to-indigo-600/20",
      displayOrder: 2,
      isPublished: true
    },
    {
      id: "portfolio-interactive",
      title: "Interactive 3D Developer Portfolio & CMS",
      year: "2026",
      category: "Game Dev",
      description: "High-performance personal web platform integrating real-time 3D Three.js visualizers, Supabase cloud CMS data administration, and ATS-compliant PDF generation.",
      technologies: ["React 18", "TypeScript", "Three.js", "Supabase", "Tailwind CSS", "Framer Motion"],
      githubUrl: "https://github.com/h4mmad07/Portfolio",
      liveUrl: "https://h4mmad07-portfolio.vercel.app/",
      thumbnailUrl: "",
      screenshots: [],
      status: "Production",
      featured: true,
      highlights: [
        "Real-time dynamic 3D lighting shaders, mouse tracking, and GLTF model rendering",
        "Cloud-synchronized private administration panel with Row Level Security",
        "ATS-compliant PDF resume engine with DOM element page-break avoidance",
        "Full cloud object storage integration for profile media and resume assets"
      ],
      gradient: "from-purple-600/30 to-cyan-600/20",
      displayOrder: 3,
      isPublished: true
    },
    {
      id: "database-university",
      title: "University Academic Portal Database",
      year: "2025",
      category: "Database System",
      description: "Relational database architecture designed for managing student enrollment, faculty workloads, grading cycles, and departmental prerequisites.",
      technologies: ["SQL Server", "Relational Schemas", "Database Normalization", "Stored Procedures"],
      githubUrl: "https://github.com/h4mmad07",
      liveUrl: "",
      thumbnailUrl: "",
      screenshots: [],
      status: "Completed",
      featured: false,
      highlights: [
        "3NF normalized database tables completely eliminating redundant data anomalies",
        "Complex stored procedures enforcing automated GPA and prerequisite validation",
        "Optimized foreign key indices and transaction triggers ensuring zero data corruption",
        "Administrative query reports for term-by-term departmental grading statistics"
      ],
      gradient: "from-emerald-600/30 to-teal-600/20",
      displayOrder: 4,
      isPublished: true
    },
    {
      id: "ai-prediction-model",
      title: "Predictive Analytics & ML Pipeline",
      year: "2025",
      category: "AI & ML",
      description: "Machine learning pipeline for data preprocessing, feature engineering, and predictive classification modeling utilizing Python data science libraries.",
      technologies: ["Python", "NumPy", "Pandas", "Scikit-Learn", "Matplotlib"],
      githubUrl: "https://github.com/h4mmad07",
      liveUrl: "",
      thumbnailUrl: "",
      screenshots: [],
      status: "Completed",
      featured: false,
      highlights: [
        "Automated missing-value imputation, outlier detection, and min-max feature scaling",
        "Cross-validated classification models with hyperparameter grid search tuning",
        "Interactive confusion matrix and ROC curve visualizations for model evaluation",
        "Exportable serializable model weights for seamless production inference"
      ],
      gradient: "from-pink-600/30 to-purple-600/20",
      displayOrder: 5,
      isPublished: true
    }
  ],

  certifications: [
    {
      id: "cert-cs50-ai",
      title: "Computer Science & AI Architecture",
      issuer: "Academic & Systems Development",
      issueDate: "2025",
      credentialId: "MNSUAM-CS-2025",
      credentialUrl: "https://github.com/h4mmad07",
      badgeUrl: "",
      description: "Demonstrated advanced competence in algorithmic problem solving, object-oriented systems engineering, and machine learning pipelines.",
      skills: ["C++", "Python", "Algorithms", "AI"],
      displayOrder: 1,
      isVisible: true
    },
    {
      id: "cert-unity-foundations",
      title: "Interactive Simulation & 3D Realtime Systems",
      issuer: "Game Dev & Creative Systems",
      issueDate: "2025",
      credentialId: "UNITY-3D-DEV-2025",
      credentialUrl: "https://github.com/h4mmad07",
      badgeUrl: "",
      description: "Certified proficiency in real-time interactive simulation, C# scripting, and 3D asset modeling integration with Blender.",
      skills: ["Unity 3D", "C#", "Blender", "Physics Simulation"],
      displayOrder: 2,
      isVisible: true
    }
  ],

  experience: [
    {
      id: "exp-lead-editor",
      role: "Lead Video Editor & Content Creator",
      company: "Directorate of Student Affairs, MNSUAM",
      period: "Nov 2025 – Present",
      location: "Multan, Pakistan",
      responsibilities: [
        "Directing and producing official institutional multimedia broadcasts, event highlights, and documentary reels.",
        "Managing post-production workflows including 4K video editing, color grading, motion graphics, and audio mastering.",
        "Collaborating with university faculty and student leadership to elevate digital campus outreach and engagement."
      ],
      tags: ["Premiere Pro", "Video Production", "Creative Direction", "Storyboarding", "Motion Graphics"],
      displayOrder: 1,
      isVisible: true
    }
  ],

  education: [
    {
      id: "edu-bscs",
      degree: "Bachelor of Science in Computer Science (BSCS)",
      institution: "MNS University of Agriculture, Multan (MNSUAM)",
      period: "2023 – 2027",
      location: "Multan, Punjab, Pakistan",
      badge: "In Progress",
      description: "Rigorous study across Data Structures, Algorithms, Object-Oriented Software Design, Artificial Intelligence, Database Management Systems, and Computer Networks.",
      displayOrder: 1,
      isVisible: true
    }
  ],

  skillCategories: [
    {
      title: "Languages & Core",
      skills: [
        { name: "C++", level: 90, icon: "code" },
        { name: "Python", level: 85, icon: "terminal" },
        { name: "C#", level: 85, icon: "cpu" },
        { name: "SQL", level: 80, icon: "database" }
      ]
    },
    {
      title: "Game Dev & 3D Interactive",
      skills: [
        { name: "Unity 3D", level: 80, icon: "gamepad-2" },
        { name: "Blender", level: 75, icon: "box" },
        { name: "Three.js", level: 75, icon: "sparkles" },
        { name: "Physics & Shaders", level: 70, icon: "layers" }
      ]
    },
    {
      title: "Software & Systems Architecture",
      skills: [
        { name: "OOP & Design Patterns", level: 90, icon: "layout" },
        { name: "Data Structures & Algos", level: 85, icon: "binary" },
        { name: "File Persistence & Serialization", level: 85, icon: "file-code" },
        { name: "Git & Version Control", level: 85, icon: "git-branch" }
      ]
    },
    {
      title: "AI, ML & Creative Production",
      skills: [
        { name: "Machine Learning (Scikit)", level: 75, icon: "brain" },
        { name: "Data Analysis (Pandas/NumPy)", level: 80, icon: "bar-chart" },
        { name: "Premiere Pro & Video Editing", level: 90, icon: "video" },
        { name: "Color Grading & Motion Graphics", level: 85, icon: "film" }
      ]
    }
  ],

  marqueeSkills: [
    "C++", "Python", "C#", "Unity 3D", "SQL Server", "Blender",
    "Three.js", "Machine Learning", "React", "TypeScript",
    "OOP Architecture", "Git & GitHub", "Premiere Pro", "Data Structures"
  ],

  socialLinks: [
    { name: "GitHub", url: "https://github.com/h4mmad07", icon: "github", label: "github.com/h4mmad07" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/muhammad-hammad-5b233a2a0/", icon: "linkedin", label: "Muhammad Hammad" },
    { name: "Email", url: "mailto:mh9456605@gmail.com", icon: "mail", label: "mh9456605@gmail.com" },
    { name: "WhatsApp", url: "https://wa.me/923084098287", icon: "phone", label: "+92 308 4098287" }
  ],

  settings: {
    siteTitle: "Muhammad Hammad | Software Engineer & AI Enthusiast",
    metaDescription: "Personal Portfolio & Cloud CMS of Muhammad Hammad — Systems, AI & 3D Experiences.",
    logoText: "MH",
    themeAccent: "cyan",
    sectionsVisibility: {
      hero: true,
      about: true,
      services: true,
      skills: true,
      projects: true,
      certifications: true,
      experience: true,
      contact: true
    }
  }
};
