// Single source of truth for fulltime work experience.

export type Role = {
  id: string;
  company: string;
  placement?: string;
  title: string;
  period: string;
  current?: boolean;
  internship?: boolean;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export const ROLES: Role[] = [
  {
    id: "hypefast",
    company: "PT Hypefast Karya Nusantara",
    title: "Data Engineer",
    period: "March 2025 — Present",
    current: true,
    location: "Jakarta, Indonesia",
    summary:
      "Building data and ML infrastructure for a multi-brand consumer aggregator. Pipelines, recommendation systems, AI-driven automation across 11+ brands.",
    highlights: [
      "Designed L0–L2 ETL pipelines ingesting orders and customer data from 4 marketplace APIs and Google Sheets to BigQuery for 11+ brands. Flask-based token management on Cloud Run with PostgreSQL for API authentication.",
      "Built scalable product recommendation systems on Shopee Marketplace (NCF, Replenishment, Baby Cloth) using TensorFlow/Keras, scikit-learn, and FastAPI on GCP Vertex AI. Approximately IDR 300M/month GMV impact.",
      "Built an end-to-end smart voucher optimization system using K-Means clustering and linear programming for budget-constrained allocation. 200x average monthly ROI per brand.",
      "Automated financial workflows for 3 brands by integrating Jubelio (OMS) with Jurnal.id via API. Invoice processing reduced from days to under 10 minutes, accelerating AR recognition.",
      "Built an AI-based OCR system using GCP Document AI (evaluated against Mistral AI), reducing invoice and receipt extraction time from 8 hours to 5 minutes with 90%+ accuracy.",
      "Built Metabase dashboards for Finance, Data Science, and Business Operations teams to monitor catalog performance, advertising AI, and customer data platform.",
    ],
    stack: [
      "Google Cloud Platform (GCP)",
      "Composer (Airflow)",
      "BigQuery",
      "Vertex AI",
      "Cloud Run",
      "Document AI",
      "Flask",
      "FastAPI",
      "TensorFlow",
      "scikit-learn",
      "PostgreSQL",
      "Metabase",
      "Mistral AI"
    ],
  },
  {
    id: "idstar",
    company: "PT IDstar Cipta Teknologi",
    placement: "Placement in PT XL Axiata Tbk.",
    title: "Data Engineer / ETL Developer",
    period: "July 2022 — March 2025",
    location: "Jakarta, Indonesia",
    summary:
      "Built telco-scale data platforms processing 1B+ daily records with Medallion architecture, plus partner-facing analytics products.",
    highlights: [
      "Developed an end-to-end telco user behavior and credit scoring platform using Medallion Architecture (Bronze/Silver/Gold) on Snowflake. PySpark ETL pipelines on AWS (S3, EC2, Lambda) processing 1B+ daily records with schema evolution, partition pruning, and data quality gates at each layer.",
      "Built a monthly PySpark-based lead generation pipeline to process and enrich millions of XL Axiata subscriber profiles for targeted bank product acquisition.",
      "Developed a dashboard to monitor XL's API Economy performance for external partners. API response time improved 30%, success rate +15%, driving 10% revenue growth from API transactions.",
    ],
    stack: [
      "AWS",
      "Snowflake",
      "PySpark",
      "Hadoop",
      "Airflow",
      "Cloudera",
      "Kafka",
      "Hive",
      "Impala",
      "Shell Script"
    ],
  },
  {
    id: "telkom",
    company: "Telkom Indonesia",
    title: "Data Scientist Internship",
    period: "February 2021 — August 2021",
    internship: true,
    location: "Jakarta, Indonesia",
    summary:
      "Supported exploratory data analysis and product modeling for digital products including T-Money and KALISA blockchain waqf platform.",
    highlights: [
      "Supported data cleansing, analyzed exploratory dataset using Python, reported and interpreted results for data-driven decision-making on T-Money within 1 month.",
      "Created a business model for KALISA, a waqf blockchain system, collaborating with 2 teams. Result implemented into the new KALISA business model within 3 months.",
    ],
    stack: ["Python", "Pandas", "Jupyter", "Business Modeling"],
  },
  {
    id: "arindo",
    company: "PT Arindo Cipta Perkasa",
    title: "Production Systems and Business Analyst Internship",
    period: "November 2020 — April 2021",
    internship: true,
    location: "Bogor Regency, Indonesia",
    summary:
      "Production operations analysis and scheduling optimization for manufacturing operations.",
    highlights: [
      "Analyzed data and identified root causes of potential problems to recommend improvements in production operations.",
      "Recommended solution ideas to minimize total time on production scheduling optimization by heuristic algorithm based on analysis data to management, reducing total time by 10.84% (996 minutes) using the NEH Nawaz, Enscore, and Ham algorithm.",
    ],
    stack: ["Production Scheduling", "Heuristic Algorithm", "Python", "Data Analysis"],
  },
  {
    id: "banopolis",
    company: "Banopolis Inovasi Kendara",
    title: "Business Development Internship",
    period: "June 2020 — August 2020",
    internship: true,
    location: "Bandung, Indonesia",
    summary:
      "Business development for GETBIKE ride sharing product. Proposed B2B and B2B2G models, designed partnership scheme with PT Telkom Indonesia.",
    highlights: [
      "Proposed a new business model of GETBIKE B2B and B2B2G ride sharing using 3 tools (Business Model Canvas, Value Proposition Canvas, Lean Canvas). Management implemented the ideas for the product within 1 month.",
      "Ideated solutions using How Might We Question method for every element in the Business Model Canvas in 2 weeks.",
      "Designed the partnership model scheme with PT Telkom Indonesia in 2 weeks.",
      "Devised application of agile methods in 2 critical business processes related to the Covid-19 pandemic situation in 1 month.",
    ],
    stack: ["Business Model Canvas", "Value Proposition Canvas", "Lean Canvas", "Agile"],
  },
];
