import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { updateBasics, updateWork, updateEducation, updateProjects, updateSkills } from '@/lib/redux/resumeSlice';
import { BasicInfoForm } from './BasicInfoForm';
import { WorkForm } from './WorkForm';
import { EducationForm } from './EducationForm';
import { ProjectsForm } from './ProjectsForm';
import { SkillsForm } from './SkillsForm';

export const Form = ({ jobData }: { jobData?: any }) => {
  const dispatch = useAppDispatch();
  const resume = useAppSelector(state => state.resume);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        <p className="text-sm text-gray-500">Start with your basic information</p>
        <BasicInfoForm 
          data={resume.basics} 
          onChange={data => dispatch(updateBasics(data))} 
        />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
        <p className="text-sm text-gray-500">Add your work experience</p>
        <WorkForm 
          data={resume.work} 
          onChange={data => dispatch(updateWork(data))} 
        />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Education</h2>
        <p className="text-sm text-gray-500">Add your educational background</p>
        <EducationForm 
          data={resume.education} 
          onChange={data => dispatch(updateEducation(data))} 
        />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
        <p className="text-sm text-gray-500">Highlight your key projects</p>
        <ProjectsForm 
          data={resume.projects} 
          onChange={data => dispatch(updateProjects(data))} 
        />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        <p className="text-sm text-gray-500">List your technical and professional skills</p>
        <SkillsForm 
          data={resume.skills} 
          onChange={data => dispatch(updateSkills(data))}
          jobData={jobData}
        />
      </div>
    </div>
  );
};