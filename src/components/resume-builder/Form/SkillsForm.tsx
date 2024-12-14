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
    const skills = e.target.value.split('\n').filter(Boolean);
    onChange(skills);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Skills</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Skills (one per line)
        </label>
        <textarea
          value={data.join('\n')}
          onChange={handleChange}
          rows={6}
          placeholder="Enter your skills..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>
    </div>
  );
}; 