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
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <p className="text-sm text-zinc-500">Start with your basic information</p>
        </div>
        <BasicInfoForm 
          data={resume.basics} 
          onChange={data => dispatch(updateBasics(data))} 
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Work Experience</h2>
          <p className="text-sm text-zinc-500">Add your relevant work experience</p>
        </div>
        <WorkForm 
          data={resume.work} 
          onChange={data => dispatch(updateWork(data))} 
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Education</h2>
          <p className="text-sm text-zinc-500">Add your educational background</p>
        </div>
        <EducationForm 
          data={resume.education} 
          onChange={data => dispatch(updateEducation(data))} 
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Projects</h2>
          <p className="text-sm text-zinc-500">Highlight your key projects</p>
        </div>
        <ProjectsForm 
          data={resume.projects} 
          onChange={data => dispatch(updateProjects(data))} 
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Skills</h2>
          <p className="text-sm text-zinc-500">List your technical and professional skills</p>
        </div>
        <SkillsForm 
          data={resume.skills} 
          onChange={data => dispatch(updateSkills(data))}
          jobData={jobData}
        />
      </section>
    </div>
  );
};