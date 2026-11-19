import weatherImg from '../assets/images/weather_app.jpg';
import todoImg from '../assets/images/todo_app.jpg';
import webProjectsImg from '../assets/images/web_projects.jpg';
import project1Img from '../assets/images/project1.jpg';
import project2Img from '../assets/images/project2.jpg';
import project3Img from '../assets/images/project3.jpg';

/**
 * Single source of truth for every project rendered by the site.
 *
 * Consumed by: FeaturedProjects (the three SHOWCASE_IDS cards), pages/Projects
 * (full grid + category filter) and pages/ProjectDetails (case study).
 *
 * Conventions worth keeping:
 * - `image` is the default preview; when `experiences` exists it is overridden by
 *   the selected experience's `preview`, so keep the first experience in sync.
 * - Two image strategies are used on purpose: large client screenshots live in
 *   `public/images/projects/*.webp` and are referenced by URL (kept out of the JS
 *   bundle), while smaller screenshots are imported from `src/assets/images/` so
 *   Vite fingerprints them.
 * - `liveUrl` is only set when the deployment is verified; the UI hides the live
 *   action otherwise instead of linking to a guess.
 */
export const projects = [
  {
    id: 'lhs-cut',
    title: 'LHS Cut',
    tagline: 'One address, two salons — Hair & Beauty',
    subtitle: 'Business Website for a Lahore Salon Group',
    category: 'Barbershop / Hair & Beauty Salon Website',
    location: 'Main Boulevard, Gulshan-e-Ravi, Lahore',
    description: 'A modern two-part website for LHS Cut on Main Boulevard, Gulshan-e-Ravi: a barbering side run by Zeeshan and a ladies’ hair, skin and bridal studio run by Rida, published under one domain with appointment requests that reach the salon on WhatsApp.',
    overview: 'LHS Cut asked for an online presence that matched what customers say about the floor — a neighbourhood salon that reads like a studio. The site splits that into two experiences on one address: the gents’ barbering side and the ladies’ hair, skin and bridal side, each with its own services, posted deal boards, on-site photography and WhatsApp appointment desk. It was built with React and Vite so both routes share a single fast bundle, and it carries real information only — the salon’s own prices, hours, plus code, Google listing and reviews.',
    image: '/images/projects/lhs_hair-fold.webp',
    screenshots: [
      { src: '/images/projects/lhs_hair-hero.webp', label: 'Hair salon hero' },
      { src: '/images/projects/lhs_hair-services.webp', label: 'Posted services & deal boards' },
      { src: '/images/projects/lhs_hair-gallery.webp', label: 'Gallery photographed on site' },
      { src: '/images/projects/lhs_hair-visit.webp', label: 'Visit — address, hours, map' },
    ],
    fullCapture: '/images/projects/lhs_hair.webp',
    featured: true,
    liveUrl: 'https://lhs-cut.vercel.app/',
    detailsPath: '/projects/lhs-cut',
    role: 'Frontend Developer & Designer',
    timeline: '2025 – 2026',
    status: 'Live & Active',
    experiences: [
      {
        id: 'hair',
        label: 'Hair Experience',
        preview: '/images/projects/lhs_hair-fold.webp',
        screenshots: [
          { src: '/images/projects/lhs_hair-hero.webp', label: 'Barber floor hero' },
          { src: '/images/projects/lhs_hair-services.webp', label: 'Services & posted deal boards' },
          { src: '/images/projects/lhs_hair-gallery.webp', label: 'Gallery on site' },
          { src: '/images/projects/lhs_hair-visit.webp', label: 'Address, hours, map' },
        ],
        fullCapture: '/images/projects/lhs_hair.webp',
      },
      {
        id: 'beauty',
        label: 'Beauty Experience',
        preview: '/images/projects/lhs_beauty-fold.webp',
        screenshots: [
          { src: '/images/projects/lhs_beauty-hero.webp', label: 'Beauty studio hero' },
          { src: '/images/projects/lhs_beauty-services.webp', label: 'Hair, skin & bridal services' },
          { src: '/images/projects/lhs_beauty-book.webp', label: 'Appointment request' },
        ],
        fullCapture: '/images/projects/lhs_beauty.webp',
      },
    ],
    technologies: ['React.js', 'Vite', 'CSS3 Layouts', 'WebP Imagery', 'Vercel'],
    features: [
      'Two salon experiences, one deployment: Hair (barbering, colour, treatments) and Beauty (ladies’ hair, skin, bridal, nails) with cross-links and a data-salon theme switch',
      'Appointment request form — name, mobile, service, date, time and notes — that reaches the salon as a WhatsApp message; no account, no payment, no card details',
      'Posted prices transcribed from the salon’s own boards: nine everyday deals and five groom packages (Rs 1,300 – Rs 8,500), with single services quoted on request',
      'On-site gallery plus silent studio loops, so the floor itself does the selling',
      'Local-business wiring: Google Maps directions, click-to-call, WhatsApp deep links, opening-hours notes and Instagram handles for both salons'
    ]
  },
  {
    id: 'pioneer-solar',
    title: 'Pioneer Solar Energy',
    tagline: 'Solar equipment, made easy to ask about',
    subtitle: 'Product Catalogue & WhatsApp Enquiry Website',
    category: 'Solar Energy / Business Website',
    location: 'MET-1 Society, Mughalpura, Lahore',
    description: 'A business website for a solar equipment supplier in Mughalpura, Lahore, presenting inverters, hybrid inverters, lithium batteries, panels and accessories, the brands customers ask for, and a direct WhatsApp enquiry route.',
    overview: 'Pioneer Solar Energy supplies solar inverters, hybrid inverters, lithium batteries and the accessories that tie a system together, and stock changes week to week in the Pakistani solar market. Rather than a catalogue that goes stale, the site is built around one behaviour: pick a category, send the question, and the business answers on WhatsApp with what is actually available and at what price. It ships as a static HTML, CSS and JavaScript build on Vercel — no framework runtime — with scroll reveals, a brand marquee, a Google Maps panel and an inquiry form that composes the WhatsApp message in the visitor’s own app.',
    image: '/images/projects/pioneer-fold.webp',
    screenshots: [
      { src: '/images/projects/pioneer-hero.webp', label: 'Hero & product entry points' },
      { src: '/images/projects/pioneer-products.webp', label: 'Four product categories' },
      { src: '/images/projects/pioneer-brands.webp', label: 'Brands marquee' },
      { src: '/images/projects/pioneer-visit.webp', label: 'Visit — map, address, hours' },
    ],
    fullCapture: '/images/projects/pioneer.webp',
    featured: true,
    liveUrl: 'https://pioneer-solar-energy.vercel.app/',
    detailsPath: '/projects/pioneer-solar',
    role: 'Web Developer',
    timeline: '2025',
    status: 'Live & Active',
    technologies: ['HTML5', 'CSS3', 'Vanilla JavaScript', 'Google Maps Embed', 'Vercel'],
    features: [
      'Four product categories — solar inverters, hybrid inverters, lithium batteries, panels & accessories — each with its own pre-written WhatsApp enquiry',
      'Brand list customers ask for (GoodWe, Growatt, Solis, Inverex, Knox, Dyness, Maxpower, ITEL) with an explicit availability disclaimer instead of fake stock or pricing',
      'Inquiry form that opens WhatsApp with the message already composed — nothing is stored on the website',
      'Google Maps panel, plus code and call/email/social links, with a “call before visiting” note',
      'Static build: plain CSS and a small vanilla-JS script for scroll reveals, reduced-motion handling and the brand marquee'
    ]
  },
  {
    id: '32-dental',
    title: '32 Dental Clinic & Implant Center',
    tagline: 'Examination first, then treatment',
    subtitle: 'Healthcare Website with an Interactive 3D Smile Planner',
    category: 'Healthcare / Dental Clinic Website',
    location: 'Main Defence Road, Lahore',
    description: 'A healthcare website for Dr M & M Rehman’s 32 Dental Clinic and Implant Center on Main Defence Road, Lahore — examination-first positioning, eleven listed treatments, clinic case records and an appointment request that reaches the clinic on WhatsApp.',
    overview: 'The clinic’s listing reads as open around the clock, and its work runs from scaling and fillings through root canals, crowns, braces, implants and dentures. The site presents that as a single practice — examine first, then propose — and gives patients two things dentistry websites usually don’t: an interactive 3D tooth model and an arch set-up, both clearly labelled as illustrative teaching tools rather than treatment promises. Treatment prices are deliberately absent because the clinic only publishes some rates on undated social graphics. Case records are the clinic’s own photographs, lettering and all, left exactly as supplied.',
    image: '/images/projects/dental-fold.webp',
    screenshots: [
      { src: '/images/projects/dental-hero.webp', label: 'Hero — open around the clock' },
      { src: '/images/projects/dental-treatments.webp', label: 'Eleven treatments listed' },
      { src: '/images/projects/dental-cases.webp', label: 'Clinic case records' },
      { src: '/images/projects/dental-visit.webp', label: 'Visit — address, numbers, hours' },
    ],
    fullCapture: '/images/projects/dental.webp',
    featured: true,
    liveUrl: 'https://32-dental.vercel.app/',
    detailsPath: '/projects/32-dental',
    role: 'Frontend Developer & 3D Web Developer',
    timeline: '2026',
    status: 'Live & Active',
    technologies: ['React.js', 'Vite', 'Three.js (WebGL)', 'Responsive CSS', 'Vercel'],
    features: [
      'Interactive 3D smile planner: pick a goal, a method and a tooth (FDI notation, 28 teeth) and the panel re-orders how a case of that shape typically runs',
      'Illustrative arch set-up with shade, width, alignment and incisal-curve sliders, labelled as a teaching toy rather than a clinical outcome',
      'Eleven listed treatments with what each appointment involves — consultation, scaling & polishing, fillings, root canal, crowns & bridges, implants, braces, dentures, children’s dentistry, oral surgery',
      'Appointment form (name, phone, date, time of day, treatment area, notes) that composes a WhatsApp message; confirmation happens when the clinic replies',
      'Real practice details only: two phone numbers, email, address with plus code, Google rating and review count linked out to the live listing, and the clinic’s own hours presented beside the 24-hour listing'
    ]
  },
  {
    // InsiteVerse preview is a genuine full-page capture of the deployed site
    // (https://insiteverse.vercel.app), not a stock or generated mockup.
    id: 'insiteverse',
    title: 'InsiteVerse',
    tagline: 'The Modern Journal of Ideas, Culture & Technology',
    subtitle: 'Full Stack Modern Blogging & Publishing Platform',
    description: 'A modern, high-performance web journal and content publishing platform engineered with React, Vite, and responsive typography for elegant reading experiences.',
    overview: 'InsiteVerse is a modern digital magazine and blog engineered to celebrate thought leadership, creative perspectives, and digital culture. Built with a clean editorial design language, fast navigation, and responsive typography, InsiteVerse offers a distraction-free, elegant reading and writing space.',
    // Authentic captures of the deployed site (1440px viewport crops plus a
    // 1432px full-page shot) — not a stock or generated mockup. The live page
    // title reads "InsightVerse"; the project is listed as InsiteVerse.
    image: '/images/projects/insiteverse-fold.webp',
    screenshots: [
      { src: '/images/projects/insiteverse-hero.webp', label: 'Homepage hero' },
      { src: '/images/projects/insiteverse-content.webp', label: 'Featured articles' },
      { src: '/images/projects/insiteverse-lower.webp', label: 'Latest perspectives' },
    ],
    fullCapture: '/images/projects/insiteverse.webp',
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
