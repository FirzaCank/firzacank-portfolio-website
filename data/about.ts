// Static content for the /about page. Sourced from CV.

export const BIO_PARAGRAPHS = [
  "I&rsquo;m a Data Engineer, AI Engineer, and ML Engineer with around four years of expertise building end-to-end data pipelines and scalable MLOps frameworks. My focus is on the evolution of data infrastructure into intelligent automation, especially the deployment and optimization of ML models that accelerate workflows.",
  "I&rsquo;ve spent the last several years inside Telco and consumer brand environments, where the systems I designed had to run reliably at scale, with proven impact: processing 1B+ daily records, driving IDR 300M/month GMV via recommendation systems, achieving 200x ROI per brand through optimization, and cutting OCR extraction time from 8 hours to 5 minutes.",
  "Beyond my core engineering role, I deliver project highlights spanning data analysis, dashboard visualization, pitch decks, and AI engineering. The work I take on lets me ship end-to-end, from raw data to a deliverable a stakeholder can act on.",
];

export type EducationItem = {
  institution: string;
  degree: string;
  detail?: string;
  period?: string;
};

export const EDUCATION: EducationItem[] = [
  {
    institution: "Bandung Institute of Technology (ITB)",
    degree: "Bachelor's Degree, Industrial Engineering",
    detail:
      "Paid assistant at Production System Laboratory (LSP), Faculty of Industrial Technology",
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
      "GCP (Vertex AI, BigQuery, Cloud Run, Document AI)",
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
    items: ["Metabase", "Looker Studio", "Power BI", "Tableau", "seaborn", "matplotlib"],
  },
  {
    group: "Infra & DevOps",
    items: ["Docker", "Kubernetes", "BitBucket CI/CD", "Linux", "Git"],
  },
  {
    group: "Languages",
    items: ["Python", "SQL", "JavaScript", "Java"],
  },
];
