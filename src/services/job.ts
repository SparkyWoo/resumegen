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

function getGenericJobData($: cheerio.Root): JobData {
  // Get title from common patterns
  const title = 
    $('h1').first().text().trim() || 
    $('[data-automation-id="jobTitle"]').text().trim() ||
    $('[class*="title" i]').first().text().trim() ||
    'Untitled Position';

  let description = '';
  let requirements: string[] = [];
  
  // Common section headers for requirements
  const requirementHeaders = [
    'requirements',
    'qualifications',
    'what you need',
    'what you\'ll need',
    'what we\'re looking for',
    'minimum qualifications',
    'basic qualifications',
    'required qualifications',
    'who you are'
  ];

  // Common section headers to exclude
  const excludeHeaders = [
    'benefits',
    'perks',
    'about us',
    'about the company',
    'apply',
    'how to apply'
  ];

  // Function to check if text matches any pattern
  const matchesPattern = (text: string, patterns: string[]) => 
    patterns.some(pattern => text.toLowerCase().includes(pattern.toLowerCase()));

  // Process all potential content sections
  $('div, section').each((_, element) => {
    const $el = $(element);
    const headerText = $el.find('h1, h2, h3, h4, strong').first().text().trim();
    const content = $el.text().trim();

    if (!content) return;

    // Check if this section is a requirements section
    if (matchesPattern(headerText, requirementHeaders)) {
      // Extract list items if they exist, otherwise use the whole text
      const listItems = $el.find('li').map((_, li) => $(li).text().trim()).get();
      if (listItems.length > 0) {
        requirements.push(...listItems);
      } else {
        requirements.push(content);
      }
    }
    // Add to description if it's not a requirements section and not excluded
    else if (!matchesPattern(headerText, excludeHeaders)) {
      description += content + '\n';
    }
  });

  // Clean up the text
  description = description.trim();
  requirements = requirements
    .map(req => req.trim())
    .filter(req => req.length > 10); // Filter out very short items

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

function detectJobBoard(url: string): 'lever' | 'greenhouse' | 'generic' {
  if (url.includes('lever.co')) return 'lever';
  if (url.includes('greenhouse.io')) return 'greenhouse';
  return 'generic';
}

export async function fetchJobData(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Referer': 'https://www.google.com/'
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
      return getGenericJobData($);
  }
} 