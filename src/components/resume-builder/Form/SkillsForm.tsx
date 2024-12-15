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
  const [inputValue, setInputValue] = useState(data.join(', '));

  // Update input value when data changes externally
  useEffect(() => {
    setInputValue(data.join(', '));
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
    setInputValue(text);

    // Process the input into skills array on certain conditions
    if (text.endsWith(',') || text.endsWith('\n') || text === '') {
      const skills = text
        .split(/[,\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      onChange(skills);
    }
  };

  // Process skills on blur to catch any unprocessed input
  const handleBlur = () => {
    const skills = inputValue
      .split(/[,\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
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
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
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