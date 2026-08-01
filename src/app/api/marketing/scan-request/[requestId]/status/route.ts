import { jobs } from '../../store';

const QUEUE_MS = 2500;
const SCAN_MS = 9000;
const TOTAL_FILES = 128;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const { requestId } = await params;
  const job = jobs.get(requestId);

  if (!job) {
    return Response.json({ error_message: 'Scan request not found.' }, { status: 404 });
  }

  const elapsed = Date.now() - job.createdAt;

  if (elapsed < QUEUE_MS) {
    return Response.json({ status: 'queued', queue_position: 1, queue_total: 1 });
  }

  if (elapsed < QUEUE_MS + SCAN_MS) {
    const scanElapsed = elapsed - QUEUE_MS;
    const filesScanned = Math.min(TOTAL_FILES, Math.floor((scanElapsed / SCAN_MS) * TOTAL_FILES));
    return Response.json({ status: 'scanning', files_scanned: filesScanned, files_total: TOTAL_FILES });
  }

  return Response.json({ status: 'sent' });
}
