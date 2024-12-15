import { useEffect } from 'react';
import { ResumeState } from '@/lib/redux/resumeSlice';

interface Props {
  data: ResumeState['skills'];
  onChange: (data: ResumeState['skills']) => void;
  jobData?: {
    skills: string[];
  };
}

export const SkillsForm = ({ data, onChange, jobData }: Props) => {
  // Initialize skills from job posting data if available
  useEffect(() => {
    if (jobData?.skills && data.length === 0) {
      onChange(jobData.skills);
    }
  }, [jobData]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
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
          value={data.join(', ')}
          onChange={handleChange}
          rows={10}
          placeholder="Product Management, Data Analysis, SQL, Python, A/B Testing"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm"
        />
      </div>
    </div>
  );
}; 