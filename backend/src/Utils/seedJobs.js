import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { supabase, isSupabaseConfigured } from '../Config/SupabaseConfig.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedPath = join(__dirname, '../../../supabase/migrations/002_seed_jobs.sql');

const SAMPLE_JOBS = [
  {
    title: 'Senior Frontend Engineer',
    company: 'TechFlow Inc',
    location: 'Remote',
    description: 'Build React applications with TypeScript.',
    url: 'https://example.com/jobs/1',
    source: 'seed',
  },
  {
    title: 'Full Stack Developer',
    company: 'DataNova',
    location: 'New York, NY',
    description: 'Node.js and PostgreSQL.',
    url: 'https://example.com/jobs/2',
    source: 'seed',
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'San Francisco, CA',
    description: 'Kubernetes, CI/CD, AWS.',
    url: 'https://example.com/jobs/3',
    source: 'seed',
  },
  {
    title: 'Product Manager',
    company: 'InnovateLab',
    location: 'Austin, TX',
    description: 'Own roadmap for B2B SaaS.',
    url: 'https://example.com/jobs/4',
    source: 'seed',
  },
  {
    title: 'UX Designer',
    company: 'PixelCraft',
    location: 'Remote',
    description: 'Figma, user research, design systems.',
    url: 'https://example.com/jobs/5',
    source: 'seed',
  },
];

async function seed() {
  if (!isSupabaseConfigured()) {
    console.error('Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
    process.exit(1);
  }

  console.log('Seeding jobs...');
  for (const job of SAMPLE_JOBS) {
    const { data: existing } = await supabase
      .from('jobs')
      .select('id')
      .eq('title', job.title)
      .eq('company', job.company)
      .maybeSingle();

    if (existing) {
      console.log(`Skip (exists): ${job.title} @ ${job.company}`);
      continue;
    }

    const { error } = await supabase.from('jobs').insert(job);
    if (error) {
      console.error(`Failed: ${job.title}`, error.message);
    } else {
      console.log(`Inserted: ${job.title}`);
    }
  }
  console.log('Done. SQL seed file also at:', seedPath);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
