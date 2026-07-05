import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { scoreVerdict } from '@/lib/verdict';
import type { ScanResult } from '@/lib/types';

/**
 * The AmICited report email. Built with react-email's table-based primitives (not Tailwind
 * classes, not flexbox/grid) since that is what actually renders consistently across Gmail,
 * Outlook, and Apple Mail. Verdict copy and thresholds are imported from ScoreGauge so the
 * email and the on-screen report can never drift apart. No em dashes anywhere in this file.
 */

const ink = '#0d253d';
const muted = '#5b6b84';
const dim = '#8a97ac';
const hair = '#e3e8ee';
const surfaceAlt = '#f6f9fc';
const brand = '#533afd';

export function ReportEmail({ result, reportUrl }: { result: ScanResult; reportUrl: string }) {
  const { color, verdict } = scoreVerdict(result.score);
  const eligible = result.engines.filter((e) => e.status === 'ok');
  const citedCount = eligible.filter((e) => e.citedCount > 0).length;
  const promptCount = result.prompts.length;
  const topCompetitors = result.competitors.slice(0, 5);
  const previewText = `${result.brand} scored ${result.score} out of 100. Cited by ${citedCount} of ${eligible.length} AI engines.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: '32px 24px' }}>
          {/* Wordmark */}
          <Text style={{ fontSize: 13, fontWeight: 700, color: ink, letterSpacing: '0.02em', margin: '0 0 32px' }}>
            AmICited
          </Text>

          <Heading as="h1" style={{ fontSize: 22, fontWeight: 500, color: ink, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            Your AI visibility report for {result.brand}
          </Heading>
          <Text style={{ fontSize: 14, color: muted, margin: '0 0 32px', lineHeight: '22px' }}>
            We checked whether ChatGPT, Claude, Perplexity, and Gemini recommend {result.brand}{' '}
            across {promptCount} buyer {promptCount === 1 ? 'prompt' : 'prompts'}, sampled{' '}
            {result.meta.samples} times each.
          </Text>

          {/* Score card */}
          <Section
            style={{
              border: `1px solid ${hair}`,
              borderRadius: 12,
              padding: '24px 28px',
              marginBottom: 32,
            }}
          >
            <Row>
              <Column style={{ width: 96 }}>
                <Text style={{ fontSize: 40, fontWeight: 700, color: ink, margin: 0, lineHeight: '40px' }}>
                  {result.score}
                </Text>
                <Text style={{ fontSize: 12, color: dim, margin: '2px 0 0' }}>out of 100</Text>
              </Column>
              <Column>
                <Text style={{ fontSize: 15, fontWeight: 700, color, margin: '0 0 4px' }}>{verdict}</Text>
                <Text style={{ fontSize: 13, color: muted, margin: 0, lineHeight: '20px' }}>
                  Cited by {citedCount} of {eligible.length} engines
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Per engine breakdown */}
          <Text style={{ fontSize: 12, fontWeight: 700, color: dim, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
            By engine
          </Text>
          {eligible.map((engine, i) => {
            const rate = Math.round(engine.citationRate * 100);
            const cited = engine.citedCount > 0;
            return (
              <Row key={engine.engine} style={{ borderTop: i === 0 ? 'none' : `1px solid ${hair}`, padding: '10px 0' }}>
                <Column style={{ width: '40%', padding: '10px 0' }}>
                  <Text style={{ fontSize: 14, color: ink, margin: 0 }}>{engine.displayName}</Text>
                </Column>
                <Column style={{ width: '30%', padding: '10px 0' }}>
                  <Text style={{ fontSize: 13, color: cited ? '#0e9f6e' : '#ea2261', margin: 0, fontWeight: 600 }}>
                    {cited ? 'Cited' : 'Not cited'}
                  </Text>
                </Column>
                <Column style={{ width: '30%', padding: '10px 0', textAlign: 'right' as const }}>
                  <Text style={{ fontSize: 13, color: muted, margin: 0 }}>
                    {rate}% of runs
                    {engine.bestPosition != null ? `, rank ${engine.bestPosition}` : ''}
                  </Text>
                </Column>
              </Row>
            );
          })}

          {topCompetitors.length > 0 && (
            <>
              <Hr style={{ borderColor: hair, margin: '28px 0' }} />
              <Text style={{ fontSize: 12, fontWeight: 700, color: dim, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
                Named instead of you
              </Text>
              {topCompetitors.map((c, i) => (
                <Row key={c.name} style={{ borderTop: i === 0 ? 'none' : `1px solid ${hair}` }}>
                  <Column style={{ padding: '8px 0' }}>
                    <Text style={{ fontSize: 14, color: ink, margin: 0 }}>{c.name}</Text>
                  </Column>
                  <Column style={{ padding: '8px 0', textAlign: 'right' as const }}>
                    <Text style={{ fontSize: 13, color: muted, margin: 0 }}>
                      named {c.count} {c.count === 1 ? 'time' : 'times'}
                    </Text>
                  </Column>
                </Row>
              ))}
            </>
          )}

          {/* CTA */}
          <Section style={{ textAlign: 'center' as const, margin: '36px 0 8px' }}>
            <Button
              href={reportUrl}
              style={{
                backgroundColor: brand,
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 9999,
                padding: '12px 28px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              View the full interactive report
            </Button>
          </Section>

          <Hr style={{ borderColor: hair, margin: '32px 0 20px' }} />

          <Text style={{ fontSize: 12, color: dim, margin: 0, lineHeight: '18px' }}>
            AmICited is a free tool that checks whether AI assistants cite your brand. We sample
            every prompt several times per engine and report the rate, never a one shot answer.
          </Text>
          <Text style={{ fontSize: 12, color: dim, margin: '12px 0 0' }}>
            You are receiving this because you asked for the full report for {result.brand} at{' '}
            <Link href={reportUrl} style={{ color: muted }}>
              geostudio.ai
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ReportEmail;
