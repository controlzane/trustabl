import { randomUUID } from 'crypto';
import { jobs } from './store';

const GITHUB_REPO_PATTERN = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})\/[a-zA-Z0-9._-]+\/?$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const repoUrl = typeof body?.repo_url === 'string' ? body.repo_url.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';

  if (repoUrl && !GITHUB_REPO_PATTERN.test(repoUrl)) {
    return Response.json({ error_message: 'Enter a valid GitHub repository URL.' }, { status: 400 });
  }
  if (email && !EMAIL_PATTERN.test(email)) {
    return Response.json({ error_message: 'Enter a valid work email.' }, { status: 400 });
  }

  const requestId = randomUUID();
  jobs.set(requestId, { createdAt: Date.now(), repoUrl, email });

  return Response.json({ request_id: requestId, status: 'queued' });
}
