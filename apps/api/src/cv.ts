export type Period = {
  start: number;
  end: number | null;
};

export type Experience = {
  company: string;
  role: string;
  location: string;
  period: Period;
  summary: string | null;
  highlights: string[];
  tech: string[];
};

export type Education = {
  school: string;
  program: string;
  location: string;
  period: Period;
};

export type SkillCategory = 'HARD' | 'SOFT';

export type Skill = {
  name: string;
  category: SkillCategory;
  keywords: string[];
};

export type Link = {
  label: string;
  url: string;
};

export const me = {
  name: 'Jonas Stenberg',
  headline: 'I love solving problems with software, mentoring, and leading teams.',
  location: 'Malmö, Sweden',
  about: [
    "Hey there! I'm Jonas Stenberg, a passionate developer and tech enthusiast from Malmö, " +
      'Sweden. My journey into coding started when I was 10, where I wrote .BAT scripts on the ' +
      "school's computer to do silly stuff. It later transitioned into an interest in building " +
      'websites in ASP (the classic version, not .NET) which later led me to PHP and eventually ' +
      "Javascript. Whether it's tinkering with a new programming language or diving deep into " +
      'architecture and design, I love solving problems and building things.',
    "Over the years, I've had the chance to work on some really exciting projects, from leading " +
      'teams of developers to co-founding a company with friends and creating interactive ' +
      "installations for the World Expo in Shanghai. I've held roles like Consultant Manager, " +
      "Architect, and Lead Developer, and I've been fortunate enough to meet some incredibly " +
      "talented people on the way, some of whom I've had the pleasure to mentor and guide.",
    "On the professional side, I'm all about software architecture, frontend or backend " +
      "development, and leading teams to build scalable solutions. Whether it's JavaScript " +
      'frameworks like React, Golang, or cloud infrastructure on AWS and GCP — I enjoy the ' +
      'variety. I also have a soft spot for my homelab setup and tweaking my Neovim config in my ' +
      'free time.',
    'Simply put, I love doing techy stuff and building things.',
  ],
  helloWorld: '1985 — Kalmar, Sweden',
};

export const experience: Experience[] = [
  {
    company: 'Lime Technologies',
    role: 'Cloud Engineer',
    location: 'Lund, Sweden',
    period: { start: 2026, end: null },
    summary: null,
    highlights: [],
    tech: [],
  },
  {
    company: 'Squidler',
    role: 'Developer',
    location: 'Malmö, Sweden',
    period: { start: 2025, end: 2026 },
    summary:
      'Squidler is an AI agent platform built around named specialists that people "hire" and ' +
      'keep as ongoing contacts across Slack, Telegram, email and the web: a QA tester, a ' +
      'project manager, a personal assistant. Each one is an LLM loop in TypeScript on Bun, ' +
      'with tools for browsing, running code, files and search.',
    highlights: [
      'Designed and built the agents’ long-term memory on Postgres and pgvector: semantic, ' +
        'episodic and procedural recall, decay-aware retrieval, and a nightly consolidation ' +
        'pass that abstracts recurring events into durable facts.',
      'Keep the agents predictable: prompt engineering, output validation that rejects or ' +
        'repairs malformed responses, regression checks that catch when a prompt or model ' +
        'change degrades behavior, and permission gates around anything an agent can run.',
      'Built an MCP server that exposes our browser automation to AI coding tools.',
      'Frontend work in Next.js and React, plus infrastructure: GCP managed with Terraform ' +
        '(Cloud KMS for encryption at rest, the CI pipeline) and a self-hosted VPS.',
    ],
    tech: ['TypeScript', 'Bun', 'PostgreSQL', 'pgvector', 'Next.js', 'React', 'GCP', 'Terraform'],
  },
  {
    company: 'Jayway / Devoteam',
    role: 'Consultant Manager & Architect',
    location: 'Malmö, Sweden',
    period: { start: 2022, end: 2025 },
    summary: null,
    highlights: [
      'Led a team of 25 professionals, oversaw recruitment, onboarding, and ongoing personal ' +
        'and professional development.',
      'Regularly held one-on-one meetings and performance reviews, fostering transparency and ' +
        'open communication.',
      'Worked closely on client projects with staffing critical roles and competencies and ' +
        'oversaw architecture.',
    ],
    tech: [],
  },
  {
    company: 'Madefrom',
    role: 'Tech lead & manager of the Swedish office',
    location: 'Malmö, Sweden',
    period: { start: 2020, end: 2022 },
    summary: null,
    highlights: [
      'Built a from-the-ground technical team for a SaaS application which helps extensive ' +
        'supply chain analysis in the production of physical goods.',
      "Managed the team's technology roadmap, goals and individual development.",
    ],
    tech: [],
  },
  {
    company: 'Jayway',
    role: 'Lead Developer',
    location: 'Malmö, Sweden',
    period: { start: 2017, end: 2020 },
    summary: null,
    highlights: [
      'Led the development of frontend search functionality for a major retail company, ' +
        'optimizing performance and user experience.',
      'Built A/B testing tools to measure the impact of changes to customer experience and to ' +
        'increase revenue.',
      'Built data pipelines to allow rapid changes of multi-lingual product data to be ' +
        'ingested, indexed and searched across a global ecommerce multi-platform application.',
    ],
    tech: [],
  },
  {
    company: 'Ductus',
    role: 'Developer',
    location: 'Malmö, Sweden',
    period: { start: 2014, end: 2017 },
    summary: null,
    highlights: ['Development, architecture.'],
    tech: [],
  },
  {
    company: 'Capgemini',
    role: 'Developer',
    location: 'Malmö, Sweden',
    period: { start: 2013, end: 2014 },
    summary: null,
    highlights: ['Development, configuration manager.'],
    tech: [],
  },
  {
    company: 'Ixagon AB',
    role: 'Co-founder, developer and interaction designer',
    location: 'Malmö, Sweden',
    period: { start: 2010, end: 2013 },
    summary: null,
    highlights: [
      'Co-created SHAPED, a projection mapping and sequencing tool for live video mapping and ' +
        'interactive installations. It allowed users to map multiple surfaces with ease and ' +
        'attach dynamic content.',
      'The content was managed in a sequencer interface similar to those found in video-editing ' +
        'and music production software.',
      'Created interactive installations for the World Expo in Shanghai.',
    ],
    tech: ['Java', 'C++'],
  },
  {
    company: 'Malmö University',
    role: 'Programming tutor',
    location: 'Malmö, Sweden',
    period: { start: 2008, end: 2009 },
    summary: null,
    highlights: [],
    tech: [],
  },
];

export const education: Education[] = [
  {
    school: 'Malmö University',
    program: 'Interaction Design',
    location: 'Malmö, Sweden and Berlin, Germany',
    period: { start: 2007, end: 2010 },
  },
];

export const skills: Skill[] = [
  { name: 'Architecture', category: 'HARD', keywords: [] },
  {
    name: 'Javascript/Typescript',
    category: 'HARD',
    keywords: ['Node', 'React', 'Vue', 'Hyperapp'],
  },
  { name: 'Golang', category: 'HARD', keywords: [] },
  { name: 'Python', category: 'HARD', keywords: [] },
  { name: 'Java', category: 'HARD', keywords: [] },
  { name: 'Kotlin', category: 'HARD', keywords: [] },
  { name: 'SQL', category: 'HARD', keywords: ['PostgreSQL', 'MariaDB/MySQL'] },
  {
    name: 'Infrastructure as code',
    category: 'HARD',
    keywords: ['Terraform', 'AWS CDK', 'Cloudformation'],
  },
  {
    name: 'Protocols',
    category: 'HARD',
    keywords: ['Websockets', 'MQTT', 'REST', 'Kafka', 'SNS/SQS on AWS'],
  },
  { name: 'Linux admin', category: 'HARD', keywords: [] },
  { name: 'AWS', category: 'HARD', keywords: [] },
  { name: 'GCP', category: 'HARD', keywords: [] },
  { name: 'Leadership', category: 'SOFT', keywords: [] },
  { name: 'Recruitment & Onboarding', category: 'SOFT', keywords: [] },
  { name: 'Staffing', category: 'SOFT', keywords: [] },
  { name: 'Mentoring', category: 'SOFT', keywords: [] },
  { name: 'Individual Development', category: 'SOFT', keywords: [] },
  { name: 'Strategic Planning', category: 'SOFT', keywords: [] },
  { name: 'Client Communication', category: 'SOFT', keywords: [] },
];

export const links: Link[] = [
  { label: 'Email', url: 'mailto:portfolio@stenberg.io' },
  { label: 'GitHub', url: 'https://github.com/jonasstenberg' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jonasstenberg/' },
  { label: 'Website', url: 'https://stenberg.io' },
];
