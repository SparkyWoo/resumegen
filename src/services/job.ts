import * as cheerio from 'cheerio';
import { extractSkills } from '@/utils/skills';

export async function fetchJobData(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Job fetch error: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  return {
    title: $('.posting-headline h2').text().trim(),
    description: $('.posting-description').text().trim(),
    requirements: $('.posting-requirements li').map((_, el) => $(el).text().trim()).get(),
    skills: extractSkills($('.posting-description').text()),
  };
} 