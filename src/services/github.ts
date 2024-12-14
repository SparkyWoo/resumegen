export async function fetchGitHubData(username: string) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=stars&per_page=10`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'InstantResume',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const repos = await response.json();
  return {
    repositories: repos.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      url: repo.html_url,
    }))
  };
} 