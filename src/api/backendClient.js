import { CAREER_PATHS } from '@/lib/skillData';

const STORAGE_KEYS = {
  users: 'careerPath_users',
  careerPaths: 'careerPath_careerPaths',
  userProgress: 'careerPath_userProgress',
  quizzes: 'careerPath_quizzes',
  resources: 'careerPath_resources',
  jobs: 'careerPath_jobs',
};

const defaultJobs = [
  {
    _id: 'job-frontend-1',
    title: 'Frontend Developer',
    company: 'BrightLabs',
    location: 'Remote',
    description: 'Build responsive user interfaces with React and Tailwind CSS.',
    career_path: 'Frontend Developer',
    salary_range: '8-12 LPA',
    type: 'job',
    url: 'https://example.com/jobs/frontend-developer',
  },
  {
    _id: 'job-frontend-2',
    title: 'UI Engineer',
    company: 'PixelWave',
    location: 'Bengaluru, India',
    description: 'Design modern web applications and collaborate with product teams.',
    career_path: 'Frontend Developer',
    salary_range: '7-10 LPA',
    type: 'job',
    url: 'https://example.com/jobs/ui-engineer',
  },
  {
    _id: 'job-backend-1',
    title: 'Backend Developer',
    company: 'DataCore',
    location: 'Remote',
    description: 'Create APIs and server-side systems using Node.js and Express.',
    career_path: 'Backend Developer',
    salary_range: '9-13 LPA',
    type: 'job',
    url: 'https://example.com/jobs/backend-developer',
  },
  {
    _id: 'job-backend-2',
    title: 'API Engineer',
    company: 'CloudShift',
    location: 'Hyderabad, India',
    description: 'Build scalable APIs and work with databases and cloud services.',
    career_path: 'Backend Developer',
    salary_range: '10-14 LPA',
    type: 'job',
    url: 'https://example.com/jobs/api-engineer',
  },
  {
    _id: 'job-fullstack-1',
    title: 'Full Stack Developer',
    company: 'NexaTech',
    location: 'Remote',
    description: 'Work across frontend and backend to deliver complete products.',
    career_path: 'Full Stack Developer',
    salary_range: '12-16 LPA',
    type: 'job',
    url: 'https://example.com/jobs/full-stack-developer',
  },
  {
    _id: 'job-devops-1',
    title: 'DevOps Engineer',
    company: 'InfraWorks',
    location: 'Bengaluru, India',
    description: 'Automate deployments, monitor systems, and manage cloud infrastructure.',
    career_path: 'DevOps Engineer',
    salary_range: '14-18 LPA',
    type: 'job',
    url: 'https://example.com/jobs/devops-engineer',
  },
];

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const loadData = (key) => {
  const json = localStorage.getItem(key);
  return json ? JSON.parse(json) : [];
};

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const initializeStore = () => {
  if (!localStorage.getItem(STORAGE_KEYS.users)) {
    saveData(STORAGE_KEYS.users, []);
  }

  if (!localStorage.getItem(STORAGE_KEYS.careerPaths)) {
    saveData(
      STORAGE_KEYS.careerPaths,
      CAREER_PATHS.map((path, index) => ({
        ...path,
        _id: path._id || `career-path-${index + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    );
  }

  if (!localStorage.getItem(STORAGE_KEYS.userProgress)) {
    saveData(STORAGE_KEYS.userProgress, []);
  }

  if (!localStorage.getItem(STORAGE_KEYS.quizzes)) {
    saveData(STORAGE_KEYS.quizzes, []);
  }

  if (!localStorage.getItem(STORAGE_KEYS.resources)) {
    saveData(STORAGE_KEYS.resources, []);
  }

  if (!localStorage.getItem(STORAGE_KEYS.jobs)) {
    saveData(STORAGE_KEYS.jobs, defaultJobs);
  }
};

const findRecordById = (records, id) => records.find(item => item._id === id);

const getQueryParams = (path) => {
  try {
    const url = new URL(path, 'http://localhost');
    return Object.fromEntries(url.searchParams.entries());
  } catch {
    return {};
  }
};

const matchPath = (path, prefix) => {
  if (!path.startsWith(prefix)) return null;
  const remainder = path.slice(prefix.length);
  if (!remainder || remainder === '/') return '';
  return remainder.replace(/^\//, '');
};

initializeStore();

const backend = {
  defaults: {
    headers: {
      common: {},
    },
  },

  get: async (path) => {
    const users = loadData(STORAGE_KEYS.users);
    const careerPaths = loadData(STORAGE_KEYS.careerPaths);
    const progress = loadData(STORAGE_KEYS.userProgress);
    const quizzes = loadData(STORAGE_KEYS.quizzes);
    const resources = loadData(STORAGE_KEYS.resources);
    const jobs = loadData(STORAGE_KEYS.jobs);

    const query = getQueryParams(path);

    if (path.startsWith('/career-paths')) {
      const id = matchPath(path, '/career-paths');
      if (id && !id.startsWith('?')) {
        const record = findRecordById(careerPaths, id);
        return record || null;
      }
      if (query.title) {
        return careerPaths.filter(pathItem => pathItem.title.toLowerCase() === decodeURIComponent(query.title).toLowerCase());
      }
      return careerPaths;
    }

    if (path.startsWith('/user-progress')) {
      if (query.created_by) {
        return progress.filter(item => item.created_by === decodeURIComponent(query.created_by));
      }
      return progress;
    }

    if (path.startsWith('/quizzes')) {
      return quizzes;
    }

    if (path.startsWith('/resources')) {
      if (query.skill_name) {
        return resources.filter(item => item.skill_name === decodeURIComponent(query.skill_name));
      }
      return resources;
    }

    if (path.startsWith('/jobs')) {
      if (query.career_path) {
        return jobs.filter(item => item.career_path === decodeURIComponent(query.career_path));
      }
      return jobs;
    }

    if (path.startsWith('/users')) {
      if (query.email) {
        return users.filter(item => item.email === decodeURIComponent(query.email));
      }
      return users;
    }

    return [];
  },

  post: async (path, body) => {
    const users = loadData(STORAGE_KEYS.users);
    const careerPaths = loadData(STORAGE_KEYS.careerPaths);
    const progress = loadData(STORAGE_KEYS.userProgress);
    const quizzes = loadData(STORAGE_KEYS.quizzes);
    const resources = loadData(STORAGE_KEYS.resources);
    const jobs = loadData(STORAGE_KEYS.jobs);

    if (path === '/users/login') {
      const { email, password } = body || {};
      const user = users.find(item => item.email === email);
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }
      return { user: { ...user, password: undefined }, token: createId() };
    }

    if (path === '/users/register') {
      const { email, password, name } = body || {};
      if (!email || !password || !name) {
        throw new Error('Name, email and password are required');
      }
      if (users.some(item => item.email === email)) {
        throw new Error('Email already registered');
      }
      const newUser = {
        _id: createId(),
        name,
        email,
        password,
        learningProfile: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const nextUsers = [...users, newUser];
      saveData(STORAGE_KEYS.users, nextUsers);
      return { user: { ...newUser, password: undefined }, token: createId() };
    }

    if (path === '/career-paths') {
      const newPath = {
        ...body,
        _id: createId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const nextPaths = [...careerPaths, newPath];
      saveData(STORAGE_KEYS.careerPaths, nextPaths);
      return newPath;
    }

    if (path === '/user-progress') {
      const newProgress = {
        ...body,
        _id: createId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const nextProgress = [...progress, newProgress];
      saveData(STORAGE_KEYS.userProgress, nextProgress);
      return newProgress;
    }

    if (path === '/resources') {
      const items = Array.isArray(body) ? body : [body];
      const created = items.map(item => ({
        ...item,
        _id: item._id || createId(),
        createdAt: new Date().toISOString(),
      }));
      const nextResources = [...resources, ...created];
      saveData(STORAGE_KEYS.resources, nextResources);
      return created;
    }

    if (path === '/quizzes') {
      const items = Array.isArray(body) ? body : [body];
      const created = items.map(item => ({
        ...item,
        _id: item._id || createId(),
        createdAt: new Date().toISOString(),
      }));
      const nextQuizzes = [...quizzes, ...created];
      saveData(STORAGE_KEYS.quizzes, nextQuizzes);
      return created;
    }

    if (path === '/jobs') {
      const items = Array.isArray(body) ? body : [body];
      const created = items.map(item => ({
        ...item,
        _id: item._id || createId(),
        createdAt: new Date().toISOString(),
      }));
      const nextJobs = [...jobs, ...created];
      saveData(STORAGE_KEYS.jobs, nextJobs);
      return created;
    }

    throw new Error(`Unknown POST path: ${path}`);
  },

  put: async (path, body) => {
    const users = loadData(STORAGE_KEYS.users);
    const careerPaths = loadData(STORAGE_KEYS.careerPaths);
    const progress = loadData(STORAGE_KEYS.userProgress);
    const quizzes = loadData(STORAGE_KEYS.quizzes);
    const resources = loadData(STORAGE_KEYS.resources);
    const jobs = loadData(STORAGE_KEYS.jobs);

    const userId = matchPath(path, '/users');
    if (userId && body) {
      const idx = users.findIndex(item => item._id === userId);
      if (idx === -1) throw new Error('User not found');
      const updatedUser = {
        ...users[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      const nextUsers = [...users];
      nextUsers[idx] = updatedUser;
      saveData(STORAGE_KEYS.users, nextUsers);
      return { ...updatedUser, password: undefined };
    }

    const progressId = matchPath(path, '/user-progress');
    if (progressId && body) {
      const idx = progress.findIndex(item => item._id === progressId);
      if (idx === -1) throw new Error('Progress record not found');
      const updatedProg = {
        ...progress[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      const nextProgress = [...progress];
      nextProgress[idx] = updatedProg;
      saveData(STORAGE_KEYS.userProgress, nextProgress);
      return updatedProg;
    }

    const careerPathId = matchPath(path, '/career-paths');
    if (careerPathId && body) {
      const idx = careerPaths.findIndex(item => item._id === careerPathId);
      if (idx === -1) throw new Error('Career path not found');
      const updatedPath = {
        ...careerPaths[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      const nextPaths = [...careerPaths];
      nextPaths[idx] = updatedPath;
      saveData(STORAGE_KEYS.careerPaths, nextPaths);
      return updatedPath;
    }

    const quizId = matchPath(path, '/quizzes');
    if (quizId && body) {
      const idx = quizzes.findIndex(item => item._id === quizId);
      if (idx === -1) throw new Error('Quiz not found');
      const updatedQuiz = {
        ...quizzes[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      const nextQuizzes = [...quizzes];
      nextQuizzes[idx] = updatedQuiz;
      saveData(STORAGE_KEYS.quizzes, nextQuizzes);
      return updatedQuiz;
    }

    const resourceId = matchPath(path, '/resources');
    if (resourceId && body) {
      const idx = resources.findIndex(item => item._id === resourceId);
      if (idx === -1) throw new Error('Resource not found');
      const updatedResource = {
        ...resources[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      const nextResources = [...resources];
      nextResources[idx] = updatedResource;
      saveData(STORAGE_KEYS.resources, nextResources);
      return updatedResource;
    }

    const jobId = matchPath(path, '/jobs');
    if (jobId && body) {
      const idx = jobs.findIndex(item => item._id === jobId);
      if (idx === -1) throw new Error('Job not found');
      const updatedJob = {
        ...jobs[idx],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      const nextJobs = [...jobs];
      nextJobs[idx] = updatedJob;
      saveData(STORAGE_KEYS.jobs, nextJobs);
      return updatedJob;
    }

    throw new Error(`Unknown PUT path: ${path}`);
  },

  delete: async (path) => {
    const users = loadData(STORAGE_KEYS.users);
    const progress = loadData(STORAGE_KEYS.userProgress);
    const quizzes = loadData(STORAGE_KEYS.quizzes);
    const resources = loadData(STORAGE_KEYS.resources);
    const jobs = loadData(STORAGE_KEYS.jobs);

    const userId = matchPath(path, '/users');
    if (userId) {
      const nextUsers = users.filter(item => item._id !== userId);
      saveData(STORAGE_KEYS.users, nextUsers);
      return { success: true };
    }

    const progressId = matchPath(path, '/user-progress');
    if (progressId) {
      const nextProgress = progress.filter(item => item._id !== progressId);
      saveData(STORAGE_KEYS.userProgress, nextProgress);
      return { success: true };
    }

    const quizId = matchPath(path, '/quizzes');
    if (quizId) {
      const nextQuizzes = quizzes.filter(item => item._id !== quizId);
      saveData(STORAGE_KEYS.quizzes, nextQuizzes);
      return { success: true };
    }

    const resourceId = matchPath(path, '/resources');
    if (resourceId) {
      const nextResources = resources.filter(item => item._id !== resourceId);
      saveData(STORAGE_KEYS.resources, nextResources);
      return { success: true };
    }

    const jobId = matchPath(path, '/jobs');
    if (jobId) {
      const nextJobs = jobs.filter(item => item._id !== jobId);
      saveData(STORAGE_KEYS.jobs, nextJobs);
      return { success: true };
    }

    throw new Error(`Unknown DELETE path: ${path}`);
  },
};

export { backend };
