import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { updateBasics, updateWork, updateEducation, updateProjects, updateSkills } from '@/lib/redux/resumeSlice';
import { BasicInfoForm } from './BasicInfoForm';
import { WorkForm } from './WorkForm';
import { EducationForm } from './EducationForm';
import { ProjectsForm } from './ProjectsForm';
import { SkillsForm } from './SkillsForm';

interface Props {
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
  jobData?: {
    skills: string[];
  };
}

export const Form = ({ githubData, jobData }: Props) => {
  const dispatch = useAppDispatch();
  const resume = useAppSelector(state => state.resume);

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <BasicInfoForm 
        data={resume.basics}
        onChange={data => dispatch(updateBasics(data))}
      />
      
      <WorkForm
        data={resume.work}
        onChange={data => dispatch(updateWork(data))} 
      />

      <EducationForm
        data={resume.education}
        onChange={data => dispatch(updateEducation(data))}
      />

      <ProjectsForm 
        data={resume.projects}
        onChange={data => dispatch(updateProjects(data))}
        githubData={githubData}
      />

      <SkillsForm
        data={resume.skills}
        onChange={data => dispatch(updateSkills(data))}
        jobData={jobData}
      />
    </div>
  );
};