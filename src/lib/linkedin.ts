export async function getLinkedInProfile(accessToken: string) {
  const response = await fetch('https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~:playableStreams))', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'cache-control': 'no-cache',
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch LinkedIn profile');
  }

  return response.json();
}

export async function getLinkedInExperience(accessToken: string) {
  const response = await fetch('https://api.linkedin.com/v2/positions?q=members&projection=(elements*(title,companyName,startDate,endDate,description))', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'cache-control': 'no-cache',
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch LinkedIn experience');
  }

  return response.json();
}

export async function getLinkedInEmail(accessToken: string) {
  const response = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'cache-control': 'no-cache',
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch LinkedIn email');
  }

  return response.json();
} 