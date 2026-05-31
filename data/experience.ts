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
    period: "March 2025 - Present",
    current: true,
    location: "Jakarta, Indonesia",
    summary:
      "Building data and ML infrastructure for a multi-brand consumer aggregator. Pipelines, recommendation systems, AI-driven automation across 11+ brands.",
    highlights: [
      "Designed L0–L2 ETL pipelines ingesting order and customer data from 4 marketplace APIs & Google Sheets to BigQuery for 11+ brands, with Flask-based token management on Cloud Run and PostgreSQL for API authentication, enabling unified analytics and reporting.",
      "Optimized scalable product recommendation systems on Shopee Marketplace (NCF, Replenishment, and Baby Cloth) using TensorFlow/Keras, scikit-learn, and FastAPI on GCP (Vertex AI), driving approximately IDR 300M/month GMV.",
      "Created an end-to-end pipeline for a smart voucher optimization system using K-Means clustering and linear programming for budget-constrained allocation, achieving 200× average monthly ROI per brand.",
      "Automated financial workflows for 3 brands by integrating Jubelio (OMS) with Jurnal.id via API, reducing invoice processing from days to <5 minutes for hundreds of daily invoices, and accelerating cash flow through faster AR recognition.",
      "Engineered an AI-based OCR system using GCP Document AI (evaluated against Mistral AI), automating invoice and receipt processing, reducing extraction time from 8 hours to 5 minutes (96× faster) with 90%+ accuracy.",
      "Delivered Metabase dashboards for Finance, Data Science, and Business Operations teams to monitor catalog performance, advertising AI, and customer data platform.",
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
    title: "Data Engineer and Analytics / ETL Developer",
    period: "July 2022 - March 2025",
    location: "Jakarta, Indonesia",
    summary:
      "Built telco-scale data platforms processing 1B+ daily records with Medallion architecture, plus partner-facing analytics products.",
    highlights: [
      "Developed an end-to-end telco user behavior & credit scoring platform using a Medallion Architecture (Bronze/Silver/Gold) on Snowflake; built PySpark ETL pipelines on AWS (S3, EC2, Lambda) processing 1B+ daily records with schema evolution, partition pruning, and data quality gates enforced at each layer.",
      "Built a monthly PySpark-based lead generation pipeline to process and enrich millions of XL Axiata subscriber profiles for targeted bank product acquisition.",
      "Designed a dashboard to monitor XL's API Economy performance for external partners, improving API response times by 30%, success rates by 15%, and driving 10% revenue growth from API transactions.",
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
    period: "February 2021 - August 2021",
    internship: true,
    location: "Jakarta, Indonesia",
    summary:
      "Supported exploratory data analysis and product modeling for digital products including T-Money and KALISA blockchain waqf platform.",
    highlights: [
      "Support data cleansing, analyzed an exploratory dataset, reported, and interpreted the results to drive insights and data-driven decision-making on T-Money within 1 month.",
      "Developed a business model for new digital products, KALISA, a waqf blockchain system, and the result was implemented into the new KALISA business model within three months.",
    ],
    stack: ["Python", "Pandas", "Business Modeling"],
  },
];
