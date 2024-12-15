import * as cheerio from 'cheerio';
import { extractSkills } from '@/utils/skills';

interface JobData {
  title: string;
  description: string;
  requirements: string[];
  skills: string[];
}

function getLeverJobData($: cheerio.Root): JobData {
  const description = $('.posting-description').text().trim();
  const requirements = $('.posting-requirements li').map((_, el) => $(el).text().trim()).get();
  const combinedText = description + ' ' + requirements.join(' ');
  
  return {
    title: $('.posting-headline h2').text().trim(),
    description,
    requirements,
    skills: extractSkills(combinedText).map(skill => skill.trim()).filter(Boolean),
  };
}

function getGreenhouseJobData($: cheerio.Root): JobData {
  // Get title and location
  const title = $('h1.app-title').text().trim() || $('h1').text().trim() || 'Untitled Position';
  
  // Get job content sections
  const content = $('#content');
  
  // Extract description and requirements more precisely
  let description = '';
  let requirements: string[] = [];
  
  // Find all content sections
  content.find('div').each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();
    
    // Skip empty sections
    if (!text) return;
    
    // Look for common section headers
    const headerText = $el.prev('h3').text().toLowerCase();
    
    if (headerText.includes('what you')) {
      requirements.push(text);
    } else if (!headerText.includes('apply') && !headerText.includes('benefits') && !headerText.includes('perks')) {
      description += text + '\n';
    }
  });

  description = description.trim();
  
  // Extract skills from both description and requirements
  const combinedText = description + ' ' + requirements.join(' ');
  const skills = extractSkills(combinedText).map(skill => skill.trim()).filter(Boolean);

  return {
    title,
    description,
    requirements,
    skills,
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