export type FeaturedProject = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  features: string[];
  tools: string[];
  impact: string;
  mockup: "nestfind" | "automation" | "mobile" | "evaluation" | "analytics";
  image: {
    src: string;
    alt: string;
  };
  caseStudy: {
    overview: string;
    goal: string;
    role: string;
    process: string[];
    challenges: string[];
    solution: string;
    result: string;
    lessons: string;
  };
};

export type ProjectVisual = {
  label: string;
  focus: string;
  trend: string;
  stats: ReadonlyArray<{ value: string; label: string }>;
  bars: ReadonlyArray<number>;
  insight: string;
};

export const profile = {
  name: "Brian Dara",
  initials: "BD",
  title: "AI & Software Developer",
  email: "darabrian23@gmail.com",
  avatar: "/portfolio/optimized/brian-dara-avatar.webp",
  whatsapp: "https://wa.me/2349050551807",
  location: "Available for remote and hybrid work",
  socialLinks: [
    { label: "GitHub", href: "https://github.com/MrBri-an" },
    { label: "LinkedIn", href: "https://linkedin.com/in/brian-dara-52493a222" },
    { label: "WhatsApp", href: "https://wa.me/2349050551807" },
  ],
};

export const workShowcase = [
  {
    title: "Mobile Analytics Portal",
    category: "Mobile Dashboard",
    src: "/portfolio/optimized/mobile-analytics.webp",
    alt: "Mobile analytics dashboard shown on a phone in a workspace",
  },
  {
    title: "Product Systems Collage",
    category: "Apps and Dashboards",
    src: "/portfolio/optimized/product-grid.webp",
    alt: "Collage of mobile and web product interfaces",
  },
  {
    title: "NestFind Premium",
    category: "Real Estate MVP",
    src: "/portfolio/optimized/nestfind-premium.webp",
    alt: "Premium NestFind real estate marketplace dashboard and mobile interface",
  },
  {
    title: "RoutePilot",
    category: "Logistics Dashboard",
    src: "/portfolio/optimized/routepilot.webp",
    alt: "RoutePilot logistics tracking and fleet operations dashboard",
  },
  {
    title: "ShopLift",
    category: "Commerce Platform",
    src: "/portfolio/optimized/shoplift.webp",
    alt: "ShopLift ecommerce storefront and operations dashboard",
  },
  {
    title: "TaskBridge Light",
    category: "Productivity SaaS",
    src: "/portfolio/optimized/taskbridge-light.webp",
    alt: "TaskBridge team productivity dashboard in a light interface",
  },
  {
    title: "PayFlow",
    category: "Fintech Wallet",
    src: "/portfolio/optimized/payflow.webp",
    alt: "PayFlow fintech wallet and payments platform dashboard",
  },
  {
    title: "CareSync",
    category: "Healthcare Booking",
    src: "/portfolio/optimized/caresync.webp",
    alt: "CareSync healthcare booking and patient management platform",
  },
  {
    title: "TaskBridge Dark",
    category: "Client MVP",
    src: "/portfolio/optimized/taskbridge-dark.webp",
    alt: "TaskBridge productivity MVP displayed on laptop and phone",
  },
  {
    title: "NestFind Dark",
    category: "Property Marketplace",
    src: "/portfolio/optimized/nestfind-dark.webp",
    alt: "NestFind property marketplace MVP displayed on laptop and mobile",
  },
  {
    title: "RoutePilot Command Center",
    category: "Logistics Operations",
    src: "/portfolio/optimized/routepilot-command.webp",
    alt: "RoutePilot logistics command center displayed across laptop, phone, and tablet",
  },
  {
    title: "ShopLift Premium Commerce",
    category: "E-commerce Platform",
    src: "/portfolio/optimized/shoplift-premium.webp",
    alt: "ShopLift premium commerce platform shown across mobile, tablet, and laptop",
  },
  {
    title: "NestFind Device Suite",
    category: "Real Estate Marketplace",
    src: "/portfolio/optimized/nestfind-devices.webp",
    alt: "NestFind real estate marketplace across phone, desktop, and tablet screens",
  },
  {
    title: "Landing Page Builder Desktop",
    category: "No-code Builder",
    src: "/portfolio/optimized/landing-page-builder-desktop.webp",
    alt: "Landing Page Builder editor across desktop, tablet, and mobile screens",
  },
  {
    title: "CareSync Product Suite",
    category: "Healthcare Platform",
    src: "/portfolio/optimized/caresync-devices.webp",
    alt: "CareSync healthcare platform displayed on laptop, phone, and tablet",
  },
  {
    title: "Finance Tracker Product Suite",
    category: "Finance App",
    src: "/portfolio/optimized/finance-tracker-devices.webp",
    alt: "Finance Tracker dashboard across tablet, phone, and laptop",
  },
];

export const galleryItems = [
  ...workShowcase.map((item) => ({
    ...item,
    type: "Product visual",
  })),
  {
    title: "Finance Tracker Mobile",
    category: "Mobile App",
    type: "Mobile product",
    src: "/portfolio/optimized/finance-tracker.webp",
    alt: "Finance Tracker App mobile dashboard on a phone",
  },
  {
    title: "Landing Page Builder Mobile",
    category: "No-code Builder",
    type: "Mobile product",
    src: "/portfolio/optimized/landing-page-builder.webp",
    alt: "Landing Page Builder mobile app interface on a phone",
  },
] as const;

export const trustIndicators = [
  "AI & Software Development",
  "Web & Mobile Apps",
  "MVPs & Dashboards",
  "Automation Systems",
  "Product Strategy",
];

export const featuredProjects: FeaturedProject[] = [
  {
    slug: "nestfind",
    title: "NestFind",
    category: "Real Estate / Marketplace / PropTech",
    summary:
      "A real estate marketplace designed to connect renters, buyers, and property seekers directly with property owners, reducing unnecessary agent friction and improving transparency.",
    problem:
      "Property discovery is often fragmented, repetitive, and unclear. Seekers need better visibility into listings, owner credibility, inspection feedback, and location fit before they spend time or money.",
    features: [
      "Property listings",
      "Owner profiles",
      "Direct messaging",
      "Location-based search",
      "Verified property indicators",
      "Inspection review concept",
      "Featured listings",
      "Mobile-first experience",
    ],
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "Data modeling", "Direct messaging", "Maps"],
    impact:
      "Creates a more transparent search journey and a clearer business model around verified inventory, featured listings, and direct owner communication.",
    mockup: "nestfind",
    image: {
      src: "/portfolio/optimized/nestfind-premium.webp",
      alt: "NestFind real estate marketplace dashboard and mobile screens",
    },
    caseStudy: {
      overview:
        "NestFind is a property marketplace concept focused on reducing friction between property seekers and legitimate property owners while making the search experience faster and more trustworthy.",
      goal:
        "Design a modern real estate product that supports discovery, trust signals, direct communication, and a mobile-first browsing flow.",
      role:
        "Product strategy, system architecture, marketplace UX, listing flows, trust indicators, and full-stack implementation planning.",
      process: [
        "Mapped the buyer and renter journey from discovery to inspection.",
        "Defined the listing model, profile trust signals, and communication flow.",
        "Designed mobile-first cards, filters, and listing details around fast comparison.",
        "Planned verification, reviews, and featured inventory as product levers.",
      ],
      challenges: [
        "Balancing trust and speed in a market where bad listings create real user risk.",
        "Keeping discovery simple while supporting categories, locations, prices, and saved actions.",
      ],
      solution:
        "A structured marketplace interface with owner context, location filters, verification language, review concepts, and direct messaging so users can evaluate listings before committing effort.",
      result:
        "A credible PropTech foundation that can grow into a production marketplace with monetization through featured listings, verification, and premium owner tools.",
      lessons:
        "Trust is a product feature. In marketplace systems, data quality, verification, and user confidence matter as much as visual polish.",
    },
  },
  {
    slug: "ai-business-automation-dashboard",
    title: "AI Business Automation Dashboard",
    category: "AI / Automation / SaaS",
    summary:
      "A dashboard concept that helps businesses automate repetitive workflows, track tasks, generate insights, and improve operational efficiency using AI-assisted automation.",
    problem:
      "Small teams lose hours to manual reporting, task routing, follow-ups, and status checks. They need a command center that makes operations visible and repeatable.",
    features: [
      "Workflow dashboard",
      "AI task suggestions",
      "Analytics cards",
      "Automation status tracking",
      "Clean admin interface",
      "Business productivity metrics",
    ],
    tools: ["React", "Next.js", "LLM Workflows", "REST APIs", "Dashboards", "Automation"],
    impact:
      "Helps teams reduce repetitive work, improve accountability, and identify high-value automation opportunities from one operational dashboard.",
    mockup: "automation",
    image: {
      src: "/portfolio/optimized/routepilot.webp",
      alt: "RoutePilot operations dashboard used as an automation and logistics command center",
    },
    caseStudy: {
      overview:
        "This SaaS-style dashboard turns common operational workflows into visible, measurable automation pipelines that a business owner can understand quickly.",
      goal:
        "Create a practical AI automation interface that suggests actions, tracks workflow health, and reports productivity impact.",
      role:
        "AI workflow design, dashboard UX, information architecture, data modeling, and product positioning.",
      process: [
        "Identified repetitive business workflows with clear time-saving potential.",
        "Grouped metrics into operational health, pending work, and automation performance.",
        "Designed AI suggestions as assistive recommendations with human review.",
        "Defined status patterns for active, paused, failed, and optimized workflows.",
      ],
      challenges: [
        "Making AI assistance feel reliable instead of magical or vague.",
        "Showing automation value without overwhelming operators with technical details.",
      ],
      solution:
        "A focused admin dashboard with workflow status, impact metrics, suggested next actions, and concise analytics that connect automation directly to business outcomes.",
      result:
        "A product direction suitable for operations teams, agencies, founders, and service businesses that need automation without losing oversight.",
      lessons:
        "The best AI tools expose judgment points clearly. Automation should remove busywork while keeping important decisions understandable.",
    },
  },
  {
    slug: "mobile-app-mvp-builder",
    title: "Mobile App MVP Builder",
    category: "Mobile App / React Native / MVP",
    summary:
      "A mobile-first MVP system showing how fast product ideas can be transformed into usable app experiences for startups and businesses.",
    problem:
      "Founders often need a believable first product quickly, but early mobile builds can become slow, inconsistent, or hard to iterate.",
    features: [
      "Onboarding flow",
      "User onboarding screens",
      "User dashboard",
      "Reusable UI components",
      "App store-ready design direction",
      "Clean mobile UX",
    ],
    tools: ["React Native", "Expo", "TypeScript", "Firebase", "Mobile UX", "Design Systems"],
    impact:
      "Provides a reusable foundation for validating app ideas with real screens, real flows, and a product structure that can evolve beyond prototype quality.",
    mockup: "mobile",
    image: {
      src: "/portfolio/optimized/mobile-analytics.webp",
      alt: "Mobile analytics MVP displayed on a smartphone",
    },
    caseStudy: {
      overview:
        "The Mobile App MVP Builder is a reusable approach for turning early product ideas into mobile experiences that feel real enough to test, pitch, and iterate.",
      goal:
        "Create a repeatable product foundation with onboarding, user access states, dashboard states, and reusable components.",
      role:
        "Mobile product architecture, UX flows, component planning, and MVP delivery strategy.",
      process: [
        "Separated core MVP flows from nice-to-have features.",
        "Planned screens around first-run experience, retention, and daily use.",
        "Built reusable interface patterns for cards, actions, forms, and empty states.",
        "Prepared the design direction for future store assets and production hardening.",
      ],
      challenges: [
        "Keeping MVP scope disciplined while still making the product feel convincing.",
        "Designing screens that can support multiple business categories without becoming generic.",
      ],
      solution:
        "A modular mobile system that starts with core user journeys and lets teams validate the product before investing in a heavier production build.",
      result:
        "A faster path from idea to working mobile experience, with enough structure to support pilots, demos, and investor conversations.",
      lessons:
        "Good MVPs are not unfinished products. They are focused products that answer the right business question quickly.",
    },
  },
  {
    slug: "ai-evaluation-prompt-engineering-system",
    title: "AI Evaluation & Prompt Engineering System",
    category: "AI Training / Prompt Engineering / Evaluation",
    summary:
      "A structured AI evaluation and prompt engineering workflow designed to improve model responses through better prompts, rubrics, quality checks, and response analysis.",
    problem:
      "AI output quality is difficult to improve without repeatable evaluation criteria, prompt history, and disciplined comparison across responses.",
    features: [
      "Prompt quality framework",
      "Rubric-based evaluation",
      "Response comparison",
      "Model behavior improvement",
      "Quality assurance process",
      "Documentation-driven workflow",
    ],
    tools: ["Prompt Engineering", "LLM Evaluation", "Rubrics", "QA", "Documentation", "Analysis"],
    impact:
      "Improves response reliability by replacing guesswork with structured evaluation, traceable prompts, and clear quality standards.",
    mockup: "evaluation",
    image: {
      src: "/portfolio/optimized/taskbridge-light.webp",
      alt: "Structured dashboard interface representing evaluation workflows and task quality",
    },
    caseStudy: {
      overview:
        "This system structures prompt design and AI evaluation so outputs can be compared, scored, and improved with repeatable criteria.",
      goal:
        "Build a practical evaluation workflow for improving AI model behavior across accuracy, reasoning, safety, helpfulness, and domain fit.",
      role:
        "Prompt strategy, rubric design, response evaluation, quality assurance, and documentation.",
      process: [
        "Defined evaluation dimensions and scoring language.",
        "Created prompt patterns for instruction clarity, constraints, examples, and failure handling.",
        "Compared model responses against rubrics and documented quality gaps.",
        "Iterated prompts based on observed behavior rather than vague preference.",
      ],
      challenges: [
        "Maintaining consistency when model outputs vary across attempts.",
        "Separating subjective taste from measurable response quality.",
      ],
      solution:
        "A repeatable evaluation framework with rubrics, comparison views, prompt versions, and documentation that helps teams improve AI behavior intentionally.",
      result:
        "More reliable prompts, clearer quality conversations, and a stronger process for AI training, evaluation, and product integration.",
      lessons:
        "Prompt engineering is strongest when it is paired with evaluation discipline. Better prompts come from better feedback loops.",
    },
  },
  {
    slug: "business-analytics-dashboard",
    title: "Business Analytics Dashboard",
    category: "Web App / Dashboard / Data",
    summary:
      "A modern analytics dashboard for businesses to track performance, revenue, users, tasks, or operations in a clean visual interface.",
    problem:
      "Business teams need fast insight, but raw data often lives across tools and spreadsheets without a clear operational story.",
    features: [
      "KPI cards",
      "Charts",
      "Activity feed",
      "Filterable data",
      "Responsive dashboard layout",
      "Business-focused insights",
    ],
    tools: ["Next.js", "TypeScript", "Chart UI", "APIs", "Tailwind CSS", "Data UX"],
    impact:
      "Turns scattered metrics into a clear operating picture so leaders can see trends, risks, and next actions without digging through raw data.",
    mockup: "analytics",
    image: {
      src: "/portfolio/optimized/shoplift.webp",
      alt: "ShopLift analytics and ecommerce operations dashboard",
    },
    caseStudy: {
      overview:
        "The Business Analytics Dashboard translates business activity into readable metrics, trends, and decisions for founders and operators.",
      goal:
        "Design a dashboard that makes performance, revenue, tasks, and activity easy to scan across desktop and mobile.",
      role:
        "Dashboard strategy, data visualization, frontend architecture, metric grouping, and responsive UX.",
      process: [
        "Identified the core questions a business user needs answered quickly.",
        "Grouped KPIs, trends, filters, and activity into a hierarchy for scanning.",
        "Designed charts and cards around comparison rather than decoration.",
        "Built responsive states for mobile review and desktop operations.",
      ],
      challenges: [
        "Preventing the interface from becoming a wall of numbers.",
        "Choosing visual patterns that communicate priority without visual clutter.",
      ],
      solution:
        "A clean analytics interface with prioritized KPIs, trend visuals, filters, and activity context that connects metrics to business decisions.",
      result:
        "A dashboard foundation suitable for SaaS products, internal tools, marketplaces, and founder reporting systems.",
      lessons:
        "Data products work best when the interface answers business questions, not just when it displays charts.",
    },
  },
];

export const additionalProjects = [
  {
    title: "Real Estate Listing Platform",
    category: "PropTech",
    description: "Searchable listing flows with owner profiles, saved properties, and location-aware discovery.",
    tags: ["Next.js", "Data UX", "Maps"],
    mockup: "nestfind",
    visual: {
      label: "Listing intelligence",
      focus: "Verified homes",
      trend: "+31%",
      stats: [
        { value: "148", label: "Listings" },
        { value: "92%", label: "Verified" },
      ],
      bars: [58, 76, 64, 88],
      insight: "Owner response time down 42%",
    },
  },
  {
    title: "AI Resume Analyzer",
    category: "AI Tool",
    description: "A candidate feedback tool that reviews resumes against role requirements and improvement rubrics.",
    tags: ["AI", "Prompting", "PDF"],
    mockup: "evaluation",
    visual: {
      label: "Candidate scoring",
      focus: "Resume fit",
      trend: "+24%",
      stats: [
        { value: "86%", label: "Match" },
        { value: "12", label: "Gaps" },
      ],
      bars: [62, 48, 82, 74],
      insight: "Rubric-backed feedback in 90 sec",
    },
  },
  {
    title: "E-commerce Admin Dashboard",
    category: "Commerce",
    description: "Inventory, orders, customers, and revenue tracking for lean online stores.",
    tags: ["React", "Charts", "Admin"],
    mockup: "analytics",
    visual: {
      label: "Store operations",
      focus: "Order flow",
      trend: "+18%",
      stats: [
        { value: "$18k", label: "Sales" },
        { value: "1.2k", label: "Orders" },
      ],
      bars: [44, 61, 78, 92],
      insight: "Best sellers and low stock flagged",
    },
  },
  {
    title: "Inventory Management System",
    category: "Internal Tool",
    description: "Stock levels, supplier tracking, alerts, and team activity for small business operations.",
    tags: ["CRUD", "Dashboard", "API"],
    mockup: "analytics",
    visual: {
      label: "Inventory control",
      focus: "Stock health",
      trend: "+16%",
      stats: [
        { value: "312", label: "SKUs" },
        { value: "18", label: "Alerts" },
      ],
      bars: [52, 68, 46, 77],
      insight: "Reorder points synced by supplier",
    },
  },
  {
    title: "Landing Page Builder",
    category: "No-code Tool",
    description: "Reusable sections, live previews, lead capture, and publishing-ready page structures.",
    tags: ["React", "Builder", "CMS"],
    mockup: "mobile",
    image: {
      src: "/portfolio/optimized/landing-page-builder.webp",
      alt: "Landing Page Builder mobile app interface on a phone",
    },
  },
  {
    title: "Finance Tracker App",
    category: "Mobile App",
    description: "Budget categories, spending insights, reminders, and simple financial habit tracking.",
    tags: ["React Native", "Charts", "UX"],
    mockup: "mobile",
    image: {
      src: "/portfolio/optimized/finance-tracker.webp",
      alt: "Finance Tracker App mobile dashboard on a phone",
    },
  },
] as const;

export const experience = [
  {
    role: "AI Trainer & Prompt Evaluator",
    description:
      "I create prompts, evaluate AI model responses, design rubrics, test reasoning quality, and improve output reliability across different domains.",
    responsibilities: [
      "Prompt design and refinement",
      "Rubric-based response evaluation",
      "Model behavior analysis",
      "Quality assurance documentation",
    ],
    tools: ["Prompt Engineering", "LLM Evaluation", "Rubrics", "QA"],
    impact:
      "Improves answer quality, reasoning consistency, and practical usefulness for AI-assisted products.",
  },
  {
    role: "Web Developer",
    description:
      "I build responsive web applications, dashboards, landing systems, marketplace flows, and admin tools with modern frontend and backend patterns.",
    responsibilities: [
      "Frontend architecture",
      "Reusable component systems",
      "API integration",
      "Performance and accessibility tuning",
    ],
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    impact:
      "Turns business requirements into fast, maintainable interfaces that users can understand and teams can extend.",
  },
  {
    role: "Mobile App Developer",
    description:
      "I design and build mobile-first MVPs with clean onboarding, user flows, dashboards, and reusable UI patterns.",
    responsibilities: [
      "Mobile UX planning",
      "React Native screens",
      "User access flows",
      "MVP iteration support",
    ],
    tools: ["React Native", "Expo", "Firebase", "Mobile UI"],
    impact:
      "Helps founders validate mobile product ideas quickly with polished, usable app experiences.",
  },
  {
    role: "Automation & Dashboard Builder",
    description:
      "I design internal tools that automate repetitive workflows and give teams clearer visibility into metrics, tasks, and operations.",
    responsibilities: [
      "Workflow mapping",
      "Dashboard design",
      "Automation logic",
      "Operational reporting",
    ],
    tools: ["APIs", "AI Workflows", "Dashboards", "Analytics"],
    impact:
      "Reduces manual work, improves decision speed, and creates better operating systems for growing teams.",
  },
];

export const skills = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    category: "Mobile",
    items: ["React Native", "Mobile UI/UX", "App MVPs", "Cross-platform development"],
  },
  {
    category: "Backend Awareness",
    items: ["Supabase", "Firebase", "REST APIs", "API integration", "Data modeling"],
  },
  {
    category: "AI / Automation",
    items: [
      "Prompt Engineering",
      "AI Evaluation",
      "AI Agents",
      "Workflow Automation",
      "LLM Testing",
      "AI-assisted product building",
    ],
  },
  {
    category: "Product / Business",
    items: [
      "MVP Strategy",
      "Product Thinking",
      "User Experience",
      "SaaS Concepts",
      "Dashboard Design",
      "Marketplace Platforms",
    ],
  },
  {
    category: "Tools",
    items: ["GitHub", "VS Code", "Lovable", "Codex", "Figma", "Framer Motion", "Vercel", "Docker basics"],
  },
];

export const processSteps = [
  "Discover the business goal",
  "Define the product scope",
  "Plan the MVP",
  "Design the user experience",
  "Build clean, scalable features",
  "Test and improve",
  "Launch and iterate",
];

export const testimonials = [
  {
    quote:
      "Brian was able to translate a loose product idea into a clear build plan. What stood out was how quickly he connected the technical decisions to the business outcome.",
    name: "Charles",
    role: "Founder, operations-focused MVP",
    avatar: "/testimonials/stephanie.webp",
    metric: "Idea to scoped MVP",
  },
  {
    quote:
      "The dashboard direction felt practical, not decorative. He prioritized the data people actually need to act on and kept the experience clean across devices.",
    name: "Kingsley",
    role: "Product lead, analytics workflow",
    avatar: "/testimonials/kingsley.webp",
    metric: "Cleaner reporting flow",
  },
  {
    quote:
      "Working with Brian felt structured and calm. He asks the right product questions, explains tradeoffs clearly, and keeps the work focused on useful execution.",
    name: "Stephanie",
    role: "Product collaborator, AI workflow",
    avatar: "/testimonials/charle.webp",
    metric: "Sharper product decisions",
  },
];
