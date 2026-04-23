// Predefined skill help / contextual Q&A
export const SKILL_HELP = {
  "HTML": {
    what: "HTML (HyperText Markup Language) is the standard language for creating web pages. It defines the structure and content of a webpage using elements like headings, paragraphs, images, and links.",
    why: "HTML is the foundation of all web development. Every website starts with HTML — it's the skeleton that holds everything together. You must learn it first before CSS or JavaScript.",
    where: "Used in every website, web application, email template, and mobile hybrid app. Companies like Google, Facebook, and Amazon all rely on HTML."
  },
  "CSS": {
    what: "CSS (Cascading Style Sheets) controls the visual presentation of HTML elements — colors, layouts, fonts, spacing, animations, and responsive design.",
    why: "After learning HTML structure, CSS lets you make it beautiful and responsive. It's essential for creating professional-looking interfaces.",
    where: "Every website and web app uses CSS for styling. It's critical for roles in frontend development, UI/UX engineering, and web design."
  },
  "JavaScript": {
    what: "JavaScript is a programming language that adds interactivity to websites — handling clicks, form validation, animations, API calls, and dynamic content updates.",
    why: "JavaScript brings websites to life. It's the most popular programming language in the world and is required for any frontend role.",
    where: "Used in web browsers, Node.js servers, mobile apps (React Native), desktop apps (Electron), and even IoT devices."
  },
  "React": {
    what: "React is a JavaScript library by Facebook for building user interfaces using reusable components. It uses a virtual DOM for efficient rendering.",
    why: "React is the most in-demand frontend framework. Learning it opens doors to top tech companies and modern web development.",
    where: "Used by Facebook, Instagram, Netflix, Airbnb, Uber, and thousands of startups for building dynamic web applications."
  },
  "TypeScript": {
    what: "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static type checking to catch errors early.",
    why: "TypeScript reduces bugs, improves code quality, and is increasingly required by companies. Most modern React projects use TypeScript.",
    where: "Used in large-scale applications at Microsoft, Google, Slack, and most enterprise companies building with JavaScript."
  },
  "Node.js": {
    what: "Node.js is a JavaScript runtime that lets you run JavaScript on the server side. It's built on Chrome's V8 engine and is great for building APIs.",
    why: "Node.js lets you use one language (JavaScript) for both frontend and backend, making you a full-stack developer.",
    where: "Used by Netflix, LinkedIn, Walmart, and PayPal for building fast, scalable server-side applications and APIs."
  },
  "Python": {
    what: "Python is a versatile, beginner-friendly programming language known for its clean syntax. It's used in web development, data science, AI, and automation.",
    why: "Python is the #1 language for data science and machine learning. It's also great for backend web development and scripting.",
    where: "Used at Google, Instagram, Spotify, Dropbox, and NASA. Essential for data science, AI/ML, and backend development."
  },
  "SQL": {
    what: "SQL (Structured Query Language) is the standard language for managing and querying relational databases like MySQL, PostgreSQL, and SQLite.",
    why: "Almost every application stores data in databases. SQL is fundamental for retrieving, updating, and managing that data.",
    where: "Used in every industry — finance, healthcare, e-commerce, social media. Every backend developer needs SQL skills."
  },
  "Git": {
    what: "Git is a version control system that tracks changes in your code. It lets you collaborate with others, create branches, and roll back mistakes.",
    why: "Git is essential for any developer job. It's how teams collaborate on code and manage project history.",
    where: "Used by virtually every software company in the world. GitHub, GitLab, and Bitbucket are built on Git."
  },
  "REST APIs": {
    what: "REST APIs are a way for applications to communicate over HTTP. They use standard methods (GET, POST, PUT, DELETE) to exchange data.",
    why: "Understanding APIs is crucial for connecting frontend to backend, integrating third-party services, and building modern applications.",
    where: "Every web and mobile application uses APIs. They power social media feeds, payment systems, maps, and more."
  },
  "Docker": {
    what: "Docker is a platform for building, shipping, and running applications in containers — lightweight, portable environments that include everything needed to run.",
    why: "Docker ensures your app runs the same everywhere. It's essential for DevOps, deployment, and working in teams.",
    where: "Used by most tech companies for deployment, CI/CD pipelines, and microservices architecture."
  },
  "AWS": {
    what: "AWS (Amazon Web Services) is the world's largest cloud computing platform offering servers, databases, storage, AI services, and more.",
    why: "Cloud computing is the backbone of modern applications. AWS skills are highly valued and open up DevOps and cloud engineering roles.",
    where: "Used by Netflix, Airbnb, NASA, and millions of companies for hosting, computing, and scaling applications."
  },
  "MongoDB": {
    what: "MongoDB is a NoSQL database that stores data in flexible JSON-like documents instead of traditional tables and rows.",
    why: "MongoDB is popular for modern web apps due to its flexibility and scalability. It pairs perfectly with Node.js.",
    where: "Used by companies like eBay, Adobe, and Cisco for content management, real-time analytics, and IoT applications."
  },
  "GraphQL": {
    what: "GraphQL is a query language for APIs that lets clients request exactly the data they need, reducing over-fetching and under-fetching.",
    why: "GraphQL is becoming the modern alternative to REST APIs, offering more flexibility and efficiency for complex applications.",
    where: "Used by Facebook, GitHub, Shopify, and Twitter for their APIs and data-heavy applications."
  },
  "TensorFlow": {
    what: "TensorFlow is an open-source machine learning framework by Google for building and deploying ML models.",
    why: "TensorFlow is the industry standard for deep learning. It's essential for anyone pursuing AI/ML engineering.",
    where: "Used at Google, Uber, Airbnb, and in healthcare, finance, and autonomous vehicles for ML applications."
  },
  "Pandas": {
    what: "Pandas is a Python library for data manipulation and analysis. It provides data structures like DataFrames for working with structured data.",
    why: "Pandas is the go-to tool for data cleaning, exploration, and transformation — essential for any data science workflow.",
    where: "Used in data science, finance, research, and analytics across virtually every industry."
  },
  "Scikit-learn": {
    what: "Scikit-learn is a Python library for machine learning that provides simple tools for classification, regression, clustering, and more.",
    why: "It's the best starting point for machine learning — simple API, great documentation, and covers most ML algorithms.",
    where: "Used in academia, startups, and enterprises for building predictive models, recommendations, and data analysis."
  },
  "Figma": {
    what: "Figma is a collaborative design tool for creating user interfaces, prototypes, and design systems in the browser.",
    why: "Understanding design tools helps developers collaborate with designers and build better UIs.",
    where: "Used by design teams at Google, Microsoft, Airbnb, and most tech companies for UI/UX design."
  },
  "Redux": {
    what: "Redux is a state management library for JavaScript apps, commonly used with React to manage complex application state.",
    why: "As React apps grow, managing state becomes complex. Redux provides a predictable, centralized way to handle it.",
    where: "Used in large-scale React applications at companies like Instagram, Bloomberg, and Robinhood."
  },
  "Next.js": {
    what: "Next.js is a React framework that adds server-side rendering, static generation, API routes, and other production features.",
    why: "Next.js is the most popular React framework for production. It improves performance, SEO, and developer experience.",
    where: "Used by Vercel, TikTok, Hulu, Nike, and thousands of companies for production React applications."
  },
  "Kubernetes": {
    what: "Kubernetes is an open-source platform for automating deployment, scaling, and management of containerized applications.",
    why: "As applications grow, Kubernetes helps manage containers at scale. It's essential for DevOps and cloud engineering.",
    where: "Used by Google, Spotify, The New York Times, and most large-scale cloud-native applications."
  },
  "CI/CD": {
    what: "CI/CD (Continuous Integration/Continuous Deployment) automates testing and deploying code changes, ensuring faster and more reliable releases.",
    why: "CI/CD is a core DevOps practice. It catches bugs early and enables rapid, confident deployments.",
    where: "Used by every mature software team — from startups to enterprises — for automated testing and deployment pipelines."
  },
  "Linux": {
    what: "Linux is an open-source operating system used for servers, development environments, and cloud infrastructure.",
    why: "Most web servers run Linux. Understanding it is essential for backend development, DevOps, and cloud computing.",
    where: "Powers most of the internet's servers, Android phones, supercomputers, and cloud platforms like AWS and Google Cloud."
  },
  "Tailwind CSS": {
    what: "Tailwind CSS is a utility-first CSS framework that lets you build custom designs directly in your HTML using pre-defined classes.",
    why: "Tailwind speeds up development dramatically and ensures consistent styling without writing custom CSS.",
    where: "Used by Shopify, GitHub, and many modern startups for rapid, beautiful UI development."
  },
  "Vue.js": {
    what: "Vue.js is a progressive JavaScript framework for building user interfaces, known for its gentle learning curve and flexibility.",
    why: "Vue is a popular alternative to React, especially in Asia and Europe. It's great for both small and large applications.",
    where: "Used by Alibaba, GitLab, Nintendo, and many companies for building interactive web applications."
  },
  "Express.js": {
    what: "Express.js is a minimal web framework for Node.js that simplifies building APIs and web servers.",
    why: "Express is the most popular Node.js framework. It's essential for building backends and APIs with JavaScript.",
    where: "Used by IBM, Accenture, and thousands of companies for building RESTful APIs and microservices."
  }
};

// Career paths with required skills in learning order
export const CAREER_PATHS = [
  {
    title: "Frontend Developer",
    description: "Build beautiful, interactive user interfaces for web applications",
    icon: "Monitor",
    required_skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Redux", "Next.js", "Git", "REST APIs"],
    skill_order: ["HTML", "CSS", "JavaScript", "Git", "React", "Tailwind CSS", "TypeScript", "Redux", "REST APIs", "Next.js"]
  },
  {
    title: "Backend Developer",
    description: "Build server-side logic, APIs, and database systems",
    icon: "Server",
    required_skills: ["JavaScript", "Node.js", "Express.js", "SQL", "MongoDB", "REST APIs", "Git", "Docker", "Linux", "AWS"],
    skill_order: ["JavaScript", "Git", "Node.js", "Express.js", "SQL", "REST APIs", "MongoDB", "Linux", "Docker", "AWS"]
  },
  {
    title: "Full Stack Developer",
    description: "Master both frontend and backend development",
    icon: "Layers",
    required_skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js", "SQL", "MongoDB", "Git", "REST APIs", "Docker", "TypeScript"],
    skill_order: ["HTML", "CSS", "JavaScript", "Git", "React", "Node.js", "Express.js", "SQL", "REST APIs", "MongoDB", "TypeScript", "Docker"]
  },
  {
    title: "Data Scientist",
    description: "Analyze data and build machine learning models",
    icon: "BarChart3",
    required_skills: ["Python", "SQL", "Pandas", "Scikit-learn", "TensorFlow", "Git", "Docker", "AWS", "REST APIs", "MongoDB"],
    skill_order: ["Python", "SQL", "Git", "Pandas", "Scikit-learn", "REST APIs", "TensorFlow", "MongoDB", "Docker", "AWS"]
  },
  {
    title: "DevOps Engineer",
    description: "Automate deployment, scaling, and infrastructure",
    icon: "Settings",
    required_skills: ["Linux", "Git", "Docker", "Kubernetes", "AWS", "CI/CD", "Python", "SQL", "REST APIs", "MongoDB"],
    skill_order: ["Linux", "Git", "Python", "SQL", "REST APIs", "Docker", "CI/CD", "AWS", "Kubernetes", "MongoDB"]
  }
];

// All available skills for selection
export const ALL_SKILLS = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue.js", "Next.js",
  "Tailwind CSS", "Redux", "Node.js", "Express.js", "Python", "SQL",
  "MongoDB", "GraphQL", "Git", "Docker", "Kubernetes", "AWS", "Linux",
  "CI/CD", "REST APIs", "TensorFlow", "Pandas", "Scikit-learn", "Figma"
];

// Resume keyword extraction
export const RESUME_KEYWORDS = {
  "html": "HTML",
  "html5": "HTML",
  "css": "CSS",
  "css3": "CSS",
  "tailwind": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "javascript": "JavaScript",
  "js": "JavaScript",
  "es6": "JavaScript",
  "typescript": "TypeScript",
  "ts": "TypeScript",
  "react": "React",
  "reactjs": "React",
  "react.js": "React",
  "vue": "Vue.js",
  "vuejs": "Vue.js",
  "vue.js": "Vue.js",
  "next": "Next.js",
  "nextjs": "Next.js",
  "next.js": "Next.js",
  "redux": "Redux",
  "node": "Node.js",
  "nodejs": "Node.js",
  "node.js": "Node.js",
  "express": "Express.js",
  "expressjs": "Express.js",
  "express.js": "Express.js",
  "python": "Python",
  "sql": "SQL",
  "mysql": "SQL",
  "postgresql": "SQL",
  "postgres": "SQL",
  "mongodb": "MongoDB",
  "mongo": "MongoDB",
  "graphql": "GraphQL",
  "git": "Git",
  "github": "Git",
  "gitlab": "Git",
  "docker": "Docker",
  "kubernetes": "Kubernetes",
  "k8s": "Kubernetes",
  "aws": "AWS",
  "amazon web services": "AWS",
  "linux": "Linux",
  "ubuntu": "Linux",
  "ci/cd": "CI/CD",
  "cicd": "CI/CD",
  "jenkins": "CI/CD",
  "rest": "REST APIs",
  "rest api": "REST APIs",
  "restful": "REST APIs",
  "api": "REST APIs",
  "tensorflow": "TensorFlow",
  "pandas": "Pandas",
  "scikit-learn": "Scikit-learn",
  "sklearn": "Scikit-learn",
  "figma": "Figma"
};

export function extractSkillsFromText(text) {
  const lower = text.toLowerCase();
  const found = new Set();
  Object.entries(RESUME_KEYWORDS).forEach(([keyword, skill]) => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lower)) {
      found.add(skill);
    }
  });
  return Array.from(found);
}