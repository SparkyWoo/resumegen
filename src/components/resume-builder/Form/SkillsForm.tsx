import { useEffect, useState } from 'react';
import { ResumeState } from '@/lib/redux/resumeSlice';

interface Props {
  data: ResumeState['skills'];
  onChange: (data: ResumeState['skills']) => void;
  jobData?: {
    skills: string[];
  };
}

export const SkillsForm = ({ data, onChange, jobData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState(data.join(', '));

  // Keep input in sync with external data changes
  useEffect(() => {
    if (!inputText || data.join(', ') !== inputText.replace(/,\s*$/, '')) {
      setInputText(data.join(', '));
    }
  }, [data]);

  // Initialize skills from job posting data if available
  useEffect(() => {
    if (jobData?.skills && data.length === 0) {
      setIsLoading(true);
      try {
        onChange(jobData.skills);
      } finally {
        setIsLoading(false);
      }
    }
  }, [jobData]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    
    // Update skills array without removing trailing comma
    const skills = text
      .split(/[,\n]/)
      .map(skill => skill.trim())
      .filter(Boolean);
    onChange(skills);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Skills
        </label>
        <div className="mt-1 text-sm text-gray-500">
          Enter skills separated by commas
        </div>
        <textarea
          value={inputText}
          onChange={handleChange}
          rows={10}
          placeholder="Product Management, Data Analysis, SQL, Python, A/B Testing"
          className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm ${
            isLoading ? 'bg-gray-50' : ''
          }`}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="mt-2 text-sm text-gray-500">
            Generating skills...
          </div>
        )}
      </div>
    </div>
  );
}; 