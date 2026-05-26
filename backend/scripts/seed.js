import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const sampleJobs = [
  ['Senior Frontend Engineer', 'TechNova Inc', 'Remote', 'Build React applications with TypeScript.', 'https://example.com/1'],
  ['Full Stack Developer', 'CloudScale', 'San Francisco, CA', 'Node.js and React experience.', 'https://example.com/2'],
  ['Backend Engineer', 'DataPipe', 'New York, NY', 'PostgreSQL and REST APIs.', 'https://example.com/3'],
  ['DevOps Engineer', 'InfraWorks', 'Remote', 'CI/CD, Docker, Kubernetes.', 'https://example.com/4'],
  ['Product Designer', 'DesignHub', 'Austin, TX', 'Figma and design systems.', 'https://example.com/5'],
  ['ML Engineer', 'AI Labs', 'Boston, MA', 'Python and LLM fine-tuning.', 'https://example.com/6'],
  ['QA Engineer', 'QualityFirst', 'Remote', 'Playwright and Cypress.', 'https://example.com/7'],
  ['Technical Writer', 'DocuSoft', 'Remote', 'API documentation.', 'https://example.com/8'],
];

async function seed() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
    process.exit(1);
  }

  const rows = sampleJobs.map(([title, company, location, description, url]) => ({
    title,
    company,
    location,
    description,
    url,
    source: 'seed',
  }));

  const { data, error } = await supabase.from('jobs').insert(rows).select('id, title');
  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
  console.log(`Seeded ${data.length} jobs`);
}

seed();
