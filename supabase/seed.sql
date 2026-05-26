-- Sample jobs seed (run after migration)
INSERT INTO public.jobs (title, company, location, description, url, source) VALUES
  ('Senior Frontend Engineer', 'TechNova Inc', 'Remote', 'Build React applications with TypeScript and modern tooling. 5+ years experience required.', 'https://example.com/jobs/1', 'seed'),
  ('Full Stack Developer', 'CloudScale', 'San Francisco, CA', 'Node.js and React experience. Work on scalable APIs and dashboards.', 'https://example.com/jobs/2', 'seed'),
  ('Backend Engineer', 'DataPipe', 'New York, NY', 'Design PostgreSQL schemas and REST APIs. Experience with Supabase a plus.', 'https://example.com/jobs/3', 'seed'),
  ('DevOps Engineer', 'InfraWorks', 'Remote', 'CI/CD pipelines, Docker, Kubernetes. AWS or GCP experience.', 'https://example.com/jobs/4', 'seed'),
  ('Product Designer', 'DesignHub', 'Austin, TX', 'Figma, user research, design systems. Collaborate with engineering teams.', 'https://example.com/jobs/5', 'seed'),
  ('Machine Learning Engineer', 'AI Labs', 'Boston, MA', 'Python, PyTorch, LLM fine-tuning. Deploy models to production.', 'https://example.com/jobs/6', 'seed'),
  ('QA Automation Engineer', 'QualityFirst', 'Remote', 'Playwright, Cypress, test strategy for web apps.', 'https://example.com/jobs/7', 'seed'),
  ('Technical Writer', 'DocuSoft', 'Remote', 'API documentation, developer guides, open source contributions.', 'https://example.com/jobs/8', 'seed')
ON CONFLICT DO NOTHING;
