import { useEffect } from 'react';
import { ResumeState } from '@/lib/redux/resumeSlice';

interface Props {
  data: ResumeState['projects'];
  onChange: (data: ResumeState['projects']) => void;
  githubData?: {
    repositories: Array<{
      name: string;
      description: string;
      url: string;
      language: string;
      stars: number;
      topics: string[];
    }>;
  };
}

export const ProjectsForm = ({ data, onChange, githubData }: Props) => {
  // Initialize projects from GitHub data if available
  useEffect(() => {
    if (githubData && data.length === 0) {
      const githubProjects = githubData.repositories.map(repo => ({
        name: repo.name,
        description: repo.description || '',
        url: repo.url,
        highlights: [
          `Built with ${repo.language}`,
          `${repo.stars} GitHub stars`,
          ...repo.topics || []
        ]
      }));
      onChange(githubProjects);
    }
  }, [githubData]);

  const handleAdd = () => {
    onChange([
      ...data,
      {
        name: '',
        description: '',
        url: '',
        highlights: []
      }
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof ResumeState['projects'][0]) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: e.target.value
    };
    onChange(newData);
  };

  const handleHighlightChange = (index: number) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      highlights: e.target.value.split('\n').filter(Boolean)
    };
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Project
        </button>
      </div>

      {data.map((project, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={handleChange(index, 'name')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">URL</label>
              <input
                type="url"
                value={project.url}
                onChange={handleChange(index, 'url')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={project.description}
              onChange={handleChange(index, 'description')}
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Highlights (one per line)
            </label>
            <textarea
              value={project.highlights.join('\n')}
              onChange={handleHighlightChange(index)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            onClick={() => handleRemove(index)}
            className="px-4 py-2 text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}; 