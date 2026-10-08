import weatherImg from '../assets/images/weather_app.jpg';
import todoImg from '../assets/images/todo_app.jpg';
import webProjectsImg from '../assets/images/web_projects.jpg';
import project1Img from '../assets/images/project1.jpg';
import project2Img from '../assets/images/project2.jpg';
import project3Img from '../assets/images/project3.jpg';

export const projects = [
  {
    id: 'insiteverse',
    title: 'InsiteVerse',
    tagline: 'The Modern Journal of Ideas, Culture & Technology',
    subtitle: 'Full Stack Modern Blogging & Publishing Platform',
    description: 'A modern, high-performance web journal and content publishing platform engineered with React, Vite, and responsive typography for elegant reading experiences.',
    overview: 'InsiteVerse is a modern digital magazine and blog engineered to celebrate thought leadership, creative perspectives, and digital culture. Built with a clean editorial design language, fast navigation, and responsive typography, InsiteVerse offers a distraction-free, elegant reading and writing space.',
    image: project1Img,
    featured: true,
    category: 'Full Stack & React',
    technologies: ['React.js', 'Vite', 'TailwindCSS', 'JavaScript (ES6+)', 'Vercel Deployment'],
    features: [
      'Editorial Layout Design: Curated magazine-style article views with custom typography pairings',
      'Fast Dynamic Routing: Instant page transitions and category-based article navigation',
      'High-Speed Image Loading: Optimized asset pipeline supporting external media and lazy decoding',
      'Responsive Fluid Viewports: Pixel-perfect scaling from smartphone reading views to 4K displays',
      'Zero-Latency Client Rendering: Built with Vite for rapid hydration and smooth interactions'
    ],
    liveUrl: 'https://insiteverse.vercel.app',
    sourceUrl: 'https://github.com/Ahad2356/InsiteVerse',
    detailsPath: '/projects/insiteverse',
    role: 'Lead Frontend & React Developer',
    timeline: '2025 – 2026',
    status: 'Live & Active'
  },
  {
    id: 'weather-app',
    title: 'Weather Pulse',
    tagline: 'Real-Time Atmospheric Insights & Dynamic Forecasts',
    subtitle: 'Interactive Weather Forecasting & Geolocation Application',
    description: 'Real-time weather data forecasting application with multi-city search, auto-updating metrics, and responsive climate visualizations.',
    overview: 'Weather Pulse provides instant, accurate atmospheric data across global cities. Engineered with modular React components and responsive CSS Grid/Flexbox layouts, users can query major global hubs or inspect local humidity, wind speeds, UV index, and atmospheric pressure at a glance.',
    image: weatherImg,
    featured: true,
    category: 'React & APIs',
    technologies: ['React.js', 'State Hooks', 'CSS Grid', 'REST APIs', 'LocalStorage'],
    features: [
      'Live City Search: Instant lookup with multi-city quick-select pills (Lahore, London, New York, Tokyo, Dubai)',
      'Atmospheric Metrics: Real-time rendering of temperature, humidity, wind velocity, UV index, and air pressure',
      'Responsive Climate Cards: High-contrast dark neon interface designed for optimal readability day and night',
      'Interactive Live Demo: Built-in interactive widget accessible directly in the portfolio'
    ],
    liveUrl: '',
    sourceUrl: 'https://github.com/Ahad2356',
    detailsPath: '/projects/weather-app',
    interactiveRoute: '/weather-app',
    role: 'Frontend Developer',
    timeline: '2025',
    status: 'Production Prototype'
  },
  {
    id: 'todo-app',
    title: 'TaskFlow Todo',
    tagline: 'High-Efficiency Task Dashboard with Local Persistence',
    subtitle: 'Productivity Application with LocalStorage Synchronization',
    description: 'An ultra-responsive task management dashboard engineered for daily productivity, category tags, priority tracking, and local storage data persistence.',
    overview: 'TaskFlow Todo is a productivity-first web utility built to help developers and students organize their goals. Featuring real-time completion tracking, instant task creation, animated progress bars, and reliable LocalStorage persistence across browser sessions.',
    image: todoImg,
    featured: true,
    category: 'React State Management',
    technologies: ['React.js', 'LocalStorage API', 'State Reducer Logic', 'Custom Hooks'],
    features: [
      'Persistent Storage: All task additions, deletions, and toggle states are serialized to LocalStorage',
      'Dynamic Completion Analytics: Real-time calculation of completed items and animated progress bar',
      'Instant Keyboard Input: Enter key shortcuts and responsive touch actions with smooth transitions',
      'Dark Neon Aesthetic: High-contrast color hierarchy for comfortable extended workflow sessions'
    ],
    liveUrl: '',
    sourceUrl: 'https://github.com/Ahad2356',
    detailsPath: '/projects/todo-app',
    interactiveRoute: '/todo-app',
    role: 'Frontend Developer',
    timeline: '2025',
    status: 'Production Utility'
  },
  {
    id: 'web-projects',
    title: 'Web Projects Hub',
    tagline: 'Modern Responsive Client & Startup Web Solutions',
    subtitle: 'Suite of Production Web Platforms & Portfolios',
    description: 'A suite of modern responsive websites built for businesses, personal portfolios, and startup platforms featuring custom animations and SEO optimization.',
    overview: 'A collection of tailored web experiences crafted with HTML5, CSS3, modern JavaScript, and WordPress Elementor Pro. Focused on mobile-first responsive architecture, high Lighthouse audit scores, and high-converting layouts.',
    image: webProjectsImg,
    featured: false,
    category: 'Full Stack & WordPress',
    technologies: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'WordPress', 'Elementor Pro'],
    features: [
      '100% Responsive Viewport Layouts across all device widths',
      'Cross-Browser Consistency across Chrome, Safari, Firefox, and Edge',
      'On-Page SEO Optimization with structured semantic markup',
      'Smooth Scroll Dynamics & micro-interaction styling'
    ],
    liveUrl: 'https://github.com/Ahad2356',
    sourceUrl: 'https://github.com/Ahad2356',
    detailsPath: '/projects/web-projects',
    role: 'Full Stack Developer',
    timeline: '2024 – 2025',
    status: 'Completed Suite'
  },
  {
    id: 'quizoff-ai',
    title: 'QuizOff AI Platform',
    tagline: 'National Competitive AI Examination & Assessment',
    subtitle: 'Large-Scale Academic Competition Credential',
    description: 'National competitive AI quiz system tested against 5.25+ lakh students from 48,500+ institutions, recognizing technical excellence in artificial intelligence.',
    overview: 'QuizOff 2026 is recognized as one of the largest competitive AI quizzes. Abdul Ahad successfully completed and ranked among top competitors across 525,000+ participating students and 48,500+ educational institutions nationwide.',
    image: project1Img,
    featured: false,
    category: 'AI & Competitive Tech',
    technologies: ['AI Foundations', 'Prompt Engineering', 'Machine Learning', 'Logic Systems'],
    features: [
      'National Scale: Competed against 5.25+ lakh candidates across 48,500+ colleges',
      'Deep AI Concepts: Assessed on Generative AI, security fundamentals, neural networks, and algorithmic problem solving',
      'Official Credential: Demonstrates verified academic and algorithmic capability'
    ],
    liveUrl: '',
    sourceUrl: 'https://github.com/Ahad2356',
    detailsPath: '/projects/quizoff-ai',
    role: 'Top Competitor & Contributor',
    timeline: '2026',
    status: 'Verified Achievement'
  },
  {
    id: 'urban-styles',
    title: 'Urban Styles Store',
    tagline: 'Luxury Apparel E-Commerce & Checkout Experience',
    subtitle: 'Modern WooCommerce & Digital Storefront',
    description: 'Luxury apparel e-commerce store layout with modern shopping cart UI, product showcase galleries, and streamlined checkout workflow.',
    overview: 'An e-commerce storefront tailored for urban fashion brands. Integrates product filters, responsive card galleries, high-conversion product detail pages, and smooth cart interactions.',
    image: project2Img,
    featured: false,
    category: 'E-Commerce & WordPress',
    technologies: ['WordPress', 'WooCommerce', 'Custom CSS', 'Elementor Pro'],
    features: [
      'Product Showcase Grid with hover previews and category filters',
      'Seamless Shopping Cart workflow and checkout optimization',
      'Retina-ready high DPI product imagery and responsive mobile viewports'
    ],
    liveUrl: '',
    sourceUrl: 'https://github.com/Ahad2356',
    detailsPath: '/projects/urban-styles',
    role: 'E-Commerce Developer',
    timeline: '2024',
    status: 'Client Showcase'
  },
  {
    id: 'creative-studio',
    title: 'Creative Studio UI',
    tagline: 'FinTech Banking & Real-Time Analytics Dashboard',
    subtitle: 'Dark Mode High-Contrast Mobile Interface',
    description: 'Dark mode digital mobile banking & analytics dashboard interface created for seamless UX, clear metrics, and intuitive touch interaction.',
    overview: 'Designed for financial analytics and account management, this interface features dark glassmorphism cards, data visualization widgets, and accessible mobile touch controls.',
    image: project3Img,
    featured: false,
    category: 'UI/UX & Mobile Design',
    technologies: ['Figma', 'CSS Grid', 'Flexbox', 'Modern JavaScript'],
    features: [
      'Dark Mode Glassmorphism with neon accents and subtle blur filters',
      'Touch-Optimized Controls: 44px minimum target sizes and intuitive spacing',
      'Interactive Metric Cards for spending analytics and asset tracking'
    ],
    liveUrl: '',
    sourceUrl: 'https://github.com/Ahad2356',
    detailsPath: '/projects/creative-studio',
    role: 'UI/UX & Interface Designer',
    timeline: '2024',
    status: 'Case Study'
  }
];

export const certificates = [
  {
    id: 'fcc-responsive',
    title: 'Responsive Web Design',
    issuer: 'FreeCodeCamp',
    date: 'Verified',
    description: 'HTML5 semantic architecture, CSS3 Grid, Flexbox, media queries, accessibility standards.'
  },
  {
    id: 'fcc-js',
    title: 'JavaScript Basics & Algorithms',
    issuer: 'FreeCodeCamp',
    date: 'Verified',
    description: 'ES6+ syntax, arrays & object manipulation, DOM scripting, functional programming.'
  },
  {
    id: 'web-dev-online',
    title: 'Full Stack Web Development',
    issuer: 'Online Certified Course',
    date: 'Verified',
    description: 'Component architecture, REST API integration, Git version control, deployment.'
  }
];

export const servicesData = [
  {
    id: 'full-stack',
    title: 'Full Stack Web Dev',
    description: 'Custom web application development using React.js, JavaScript (ES6+), HTML5, CSS3, and Node.js REST APIs.',
    deliverables: [
      'Custom Component Architecture',
      'State Management & Dynamic Routing',
      'Fast Execution & Clean Structure'
    ]
  },
  {
    id: 'wordpress',
    title: 'WordPress & Elementor',
    description: 'Tailored WordPress site creation, custom theme configuration, landing page creation, and CMS setup.',
    deliverables: [
      'Elementor Pro Page Building',
      'Plugin Integration & Custom Styling',
      'Easy Client Content Editing'
    ]
  },
  {
    id: 'ui-ux',
    title: 'Responsive UI/UX Design',
    description: 'Crafting pixel-perfect layouts that look stunning across desktop, tablet, and mobile smartphone displays.',
    deliverables: [
      'Mobile-First Flexbox & Grid',
      'Dark Mode & Modern Aesthetics',
      'High-DPI Retina Optimization'
    ]
  },
  {
    id: 'rest-api',
    title: 'REST API Integration',
    description: 'Connecting external weather APIs, data feeds, auth services, and backends to dynamic frontend interfaces.',
    deliverables: [
      'JSON Payload Parsing',
      'Asynchronous Data Fetching',
      'Error Handling & Fallbacks'
    ]
  },
  {
    id: 'speed-optimization',
    title: 'Speed Optimization',
    description: 'Optimizing web asset loading times, image file compression, code minification, and browser caching.',
    deliverables: [
      'Lighthouse Score Improvement',
      'Lazy Loading & Asset Bundling',
      'Instant Render Execution'
    ]
  },
  {
    id: 'seo-deployment',
    title: 'SEO & Deployment',
    description: 'Implementing semantic HTML tags, metadata structure, domain deployment on Vercel, Netlify, or hosting servers.',
    deliverables: [
      'On-Page SEO Optimization',
      'Git & Continuous Deployment',
      'Domain & SSL Setup Support'
    ]
  }
];

export const workflowSteps = [
  { step: '01', title: 'DISCOVER', desc: 'Understand client goals, target audience & requirements.' },
  { step: '02', title: 'RESEARCH', desc: 'Market analysis, competitor study & UX planning.' },
  { step: '03', title: 'STRATEGY', desc: 'Select tech stack, wireframes & database schema.' },
  { step: '04', title: 'BUILD', desc: 'Clean frontend code, API wiring & responsive styling.' },
  { step: '05', title: 'DELIVER', desc: 'Cross-browser QA testing & continuous deployment.' }
];
