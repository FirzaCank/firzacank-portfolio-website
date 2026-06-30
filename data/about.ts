// Static content for the /about page. Sourced from CV.

export const BIO_PARAGRAPHS = [
  "I&rsquo;m a Data Engineer, AI Engineer, and ML Engineer with ~4 years of expertise in building end-to-end data pipelines and scalable MLOps frameworks. I focus on the evolution of data infrastructure into intelligent automation, specializing in the deployment and optimization of ML models that accelerate workflows.",
  "I&rsquo;ve spent the last several years inside Telco and consumer brand environments, where the systems I designed had to run reliably at scale, with proven impact: processing 1B+ daily records, driving IDR 300M/month GMV via recommendation systems, achieving 200× average monthly ROI per brand through optimization, and cutting OCR extraction time from 8 hours to 5 minutes (96&times; faster).",
  "Beyond my core engineering role, I deliver project highlights spanning data analysis, dashboard visualization, pitch decks, and AI engineering. The work I take on lets me ship end-to-end, from raw data to a deliverable a stakeholder can act on.",
];

export type EducationItem = {
  institution: string;
  degree: string;
  faculty: string;
  detail?: string;
  period?: string;
  thesis?: {
    title: string;
    url: string;
  };
};

export const EDUCATION: EducationItem[] = [
  {
    institution: "Bandung Institute of Technology (ITB), Indonesia",
    degree: "Bachelor's Degree",
    faculty: "Faculty of Industrial Technology, Industrial Engineering",
    detail:
      "Contributed at paid assistant at Production System Laboratory (LSP), Faculty of Industrial Technology",
    period: "August 2017 - July 2021",
    thesis: {
      title:
        "A Proposed Improvement to Flow Shop Production Scheduling for Makespan Minimization",
      url: "https://digilib.itb.ac.id/gdl/view/79335/Firza-Chandra-Sandjaya-Putra",
    },
  },
];

export type CertificationItem = {
  name: string;
  issuer: string;
};

export const CERTIFICATIONS: CertificationItem[] = [
  {
    name: "Python for Data Science and Artificial Intelligence (AI)",
    issuer: "Coursera",
  },
  {
    name: "Data Descriptors, Statistical Distributions, and Application to Business Decisions",
    issuer: "Rice University",
  },
  {
    name: "JLPT N3 Japanese Proficiency",
    issuer: "Japan Foundation",
  },
];

export type LanguageItem = {
  name: string;
  level: string;
};

export const LANGUAGES: LanguageItem[] = [
  { name: "Bahasa Indonesia", level: "Native" },
  { name: "English", level: "Professional" },
  { name: "Japanese", level: "JLPT N3" },
];

export type LeadershipItem = {
  organization: string;
  role: string;
  context: string;
  highlights: string[];
};

export const LEADERSHIP: LeadershipItem[] = [
  {
    organization: "INFINITY ITB",
    context: "ITB Dance and Performance Art Community",
    role: "Vice President and Head of the General Secretary Department",
    highlights: [
      "Oversaw all organizational activities, set vision, mission, and OKRs, drove budget allocation decisions, and represented the organization in external partnerships. Achieved 95% program execution success across all divisions.",
      "Led the General Secretariat Department, managing three divisions: Treasury, Administration, and Secretary Management.",
    ],
  },
  {
    organization: "Keluarga Mahasiswa Teknik Industri (MTI ITB)",
    context: "Industrial Engineering Student Association",
    role: "Head of Staff, People Management & Measurement",
    highlights: [
      "Performed the Social Mapping project for MTI 2018 students to identify the 10 best group combinations.",
      "Produced appreciation cards for every member at the end of the management period, with 100% staff coverage.",
    ],
  },
];

export type AchievementItem = {
  title: string;
  context: string;
  issuer: string;
};

export const ACHIEVEMENTS: AchievementItem[] = [
  {
    title: "Top Finalist",
    context: "Java Business Case National Competition 2019",
    issuer: "Telkom University",
  },
  {
    title: "Scholarship Awardee",
    context: "Rumah Sahabat Muda Salman 2.0 ITB Scholarship 2017-2018",
    issuer: "Salman Mosque in Bandung Institute of Technology (ITB)",
  },
];

// Skills grouped for the About page. More compact than the full CV list.
export const SKILL_GROUPS = [
  {
    group: "AI / LLM",
    items: [
      "LangChain",
      "LangGraph",
      "OpenAI API",
      "Anthropic Claude API",
      "Gemini API",
      "FAISS",
      "RAG",
      "SentenceTransformer",
      "OpenCV",
    ],
  },
  {
    group: "ML / Data Science",
    items: [
      "TensorFlow / Keras",
      "PyTorch",
      "scikit-learn",
      "pandas",
      "numpy",
      "PySpark",
      "seaborn",
      "matplotlib",
    ],
  },
  {
    group: "Backend",
    items: ["FastAPI", "Flask", "SQLAlchemy", "REST API"],
  },
  {
    group: "Cloud",
    items: [
      "AWS (EC2, S3, Lambda, ECS/ECR)",
      "GCP (Vertex AI, BigQuery, Cloud Run, Document AI, Pub/Sub, Composer)",
      "Snowflake",
    ],
  },
  {
    group: "On-Premise",
    items: [
      "Cloudera (CDH)",
      "Apache Airflow",
      "Kafka",
      "Hive",
      "Impala",
      "Hadoop (HDFS, YARN)",
    ],
  },
  {
    group: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB Atlas"],
  },
  {
    group: "BI & Visualization",
    items: ["Metabase", "Looker Studio", "Power BI", "Tableau", "Google Sheets/Excel"],
  },
  {
    group: "Infra & DevOps",
    items: ["Docker", "Kubernetes", "BitBucket CI/CD", "Linux", "Git"],
  },
  {
    group: "Tools",
    items: ["Jira", "Confluence", "Apps Script", "N8N", "dbt"],
  },
  {
    group: "Languages",
    items: ["Python", "SQL", "JavaScript", "Shell Script"],
  },
];
