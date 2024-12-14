export function extractSkills(text: string): string[] {
  const commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'react', 'node.js',
    'aws', 'docker', 'kubernetes', 'sql', 'nosql', 'mongodb',
    'rest api', 'graphql', 'git', 'ci/cd', 'agile'
  ];

  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
} 