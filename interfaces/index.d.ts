interface Icon {
  size: number;
  color: string;
  style?: string;
}

interface NavLink {
  id: string;
  title: string;
  label: string;
  link: string;
}

interface JobCategories {
  "00-warning": string;
  "0-legal-notice": string;
  "job-count": number;
  "total-job-count": number;
  jobs: {
    id: number;
    name: string;
    slug: string;
  }[];
}
