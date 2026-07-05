import { render } from '@react-email/components';
import { Resend } from 'resend';
import { brand } from '@orbiqon/config';
import { ReportEmail } from '@/components/email/ReportEmail';
import type { ScanResult } from '@/lib/types';

/**
 * Sends the AmICited report email. Graceful degradation matches the rest of the app: with no
 * RESEND_API_KEY set, this logs and returns instead of throwing, so local dev and the lead
 * capture flow keep working without an email provider configured.
 */
export async function sendReportEmail(to: string, result: ScanResult): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[amicited] report email skipped (no RESEND_API_KEY configured) for ${to}`);
    return { sent: false };
  }

  const reportUrl = result.id ? `${brand.url}/results/${result.id}` : `${brand.url}/check`;
  const html = await render(ReportEmail({ result, reportUrl }));
  const from = process.env.EMAIL_FROM ?? 'AmICited <reports@geostudio.ai>';

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject: `${result.brand} scored ${result.score} out of 100 on AI visibility`,
    html,
  });

  if (error) {
    console.error('[amicited] report email failed to send:', error);
    return { sent: false };
  }
  return { sent: true };
}
