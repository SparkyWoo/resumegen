import * as cheerio from 'cheerio';
import { extractSkills } from '@/utils/skills';

interface JobData {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
}

function getLeverJobData($: cheerio.Root): JobData {
  return {
    title: $('.posting-headline h2').text().trim(),
    description: $('.posting-description').text().trim(),
    requirements: $('.posting-requirements li').map((_, el) => $(el).text().trim()).get(),
    skills: extractSkills($('.posting-description').text()),
  };
}

function getGreenhouseJobData($: cheerio.Root): JobData {
  // Get title and location
  const title = $('h1').text().trim() || 'Untitled Position';
  const location = $('.location').text().trim();
  
  // Get full content
  const content = $('#content');
  const description = content.text().trim() || 'No description available';
  
  // Get requirements from bullet points
  const requirements = content.find('li').map((_, el) => $(el).text().trim()).get();

  return {
    title,
    description,
    requirements,
    skills: extractSkills(description + ' ' + requirements.join(' ')),
  };
}

function detectJobBoard(url: string): 'lever' | 'greenhouse' | 'unknown' {
  if (url.includes('lever.co')) return 'lever';
  if (url.includes('greenhouse.io')) return 'greenhouse';
  return 'unknown';
}

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

  const jobBoard = detectJobBoard(url);
  
  switch (jobBoard) {
    case 'lever':
      return getLeverJobData($);
    case 'greenhouse':
      return getGreenhouseJobData($);
    default:
      throw new Error('Unsupported job board platform');
  }
} 