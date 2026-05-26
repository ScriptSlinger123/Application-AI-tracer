-- Sample jobs for demo (idempotent by title+company)
INSERT INTO public.jobs (title, company, location, description, url, source)
SELECT * FROM (VALUES
  (
    'Senior Frontend Engineer',
    'TechFlow Inc',
    'Remote',
    'Build React applications with TypeScript. 5+ years experience with modern frontend tooling.',
    'https://example.com/jobs/1',
    'seed'
  ),
  (
    'Full Stack Developer',
    'DataNova',
    'New York, NY',
    'Node.js and PostgreSQL. Experience with REST APIs and cloud deployment.',
    'https://example.com/jobs/2',
    'seed'
  ),
  (
    'DevOps Engineer',
    'CloudScale',
    'San Francisco, CA',
    'Kubernetes, CI/CD, AWS. Automate infrastructure and improve reliability.',
    'https://example.com/jobs/3',
    'seed'
  ),
  (
    'Product Manager',
    'InnovateLab',
    'Austin, TX',
    'Own roadmap for B2B SaaS. Work with engineering and design on user outcomes.',
    'https://example.com/jobs/4',
    'seed'
  ),
  (
    'UX Designer',
    'PixelCraft',
    'Remote',
    'Figma, user research, design systems. Portfolio required.',
    'https://example.com/jobs/5',
    'seed'
  ),
  (
    'Backend Engineer (Python)',
    'AI Ventures',
    'Boston, MA',
    'FastAPI, ML pipelines integration. Strong SQL and API design skills.',
    'https://example.com/jobs/6',
    'seed'
  ),
  (
    'Mobile Developer',
    'AppWorks',
    'Chicago, IL',
    'React Native or Flutter. Ship features to iOS and Android stores.',
    'https://example.com/jobs/7',
    'seed'
  ),
  (
    'Data Analyst',
    'MetricsCo',
    'Remote',
    'SQL, dashboards, stakeholder communication. dbt experience a plus.',
    'https://example.com/jobs/8',
    'seed'
  )
) AS v(title, company, location, description, url, source)
WHERE NOT EXISTS (
  SELECT 1 FROM public.jobs j
  WHERE j.title = v.title AND j.company = v.company AND j.source = 'seed'
);
