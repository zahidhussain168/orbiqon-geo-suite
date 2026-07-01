import { describe, expect, it } from 'vitest';
import { EntityResolver } from '../resolver.js';

const resolver = new EntityResolver();

describe('EntityResolver.resolve', () => {
  it('detects a cited brand and its competitors, in order', () => {
    const text =
      'For project management, top picks are Notion, Asana, and ClickUp. Notion is very flexible.';
    const r = resolver.resolve(text, 'Notion');
    expect(r.cited).toBe(true);
    expect(r.position).toBe(1); // Notion appears first
    expect(r.competitors).toEqual(expect.arrayContaining(['Asana', 'ClickUp']));
    expect(r.competitors).not.toContain('Notion');
  });

  it('reports not cited when the brand is absent', () => {
    const r = resolver.resolve('I recommend Asana and Trello.', 'Notion');
    expect(r.cited).toBe(false);
    expect(r.position).toBeNull();
    expect(r.competitors).toEqual(expect.arrayContaining(['Asana', 'Trello']));
  });

  it('matches a product name against its domain form (notion.so ↔ Notion)', () => {
    const r = resolver.resolve('Check out notion.so and asana.com.', 'Notion');
    expect(r.cited).toBe(true);
    expect(r.competitors.map((c) => c.toLowerCase())).toContain('asana.com');
  });

  it('distinguishes "Monday.com" the product from "Monday" the weekday', () => {
    const cited = resolver.resolve(
      'I recommend Monday.com for project management; monday mornings are hard though.',
      'Monday.com',
      { aliases: ['monday'] },
    );
    expect(cited.cited).toBe(true);

    const weekdayOnly = resolver.resolve('I hate Monday mornings but love Fridays.', 'Monday.com');
    expect(weekdayOnly.cited).toBe(false);
  });

  it('tolerates a near-miss misspelling of a longer brand', () => {
    const r = resolver.resolve('Many teams love Notin for docs.', 'Notion');
    expect(r.cited).toBe(true);
  });

  it('does not fuzzy-match short brand names (avoids noise)', () => {
    // "Aha" (3 chars) must not match "Asa" etc.
    const r = resolver.resolve('We use Jira and Trello.', 'Aha');
    expect(r.cited).toBe(false);
  });

  it('reads sentiment around the mention', () => {
    const pos = resolver.resolve('Notion is an excellent, powerful choice.', 'Notion');
    expect(pos.sentiment).toBe('positive');
    const neg = resolver.resolve('Notion feels clunky and limited these days.', 'Notion');
    expect(neg.sentiment).toBe('negative');
  });

  it('passes citations through and works as a MentionDetector shape', () => {
    const answer = { text: 'Notion (https://notion.so) is great.', citations: ['https://notion.so'] };
    const r = resolver.resolveAnswer(answer, 'Notion');
    expect(r.cited).toBe(true);
    expect(r.citations).toEqual(['https://notion.so']);
    // structurally a MentionSignal
    expect(typeof r.cited).toBe('boolean');
    expect(Array.isArray(r.competitors)).toBe(true);
  });
});
