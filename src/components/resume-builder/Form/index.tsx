import { useAppDispatch, useAppSelector } from '@lib/redux/hooks';
import { updateBasics, updateWork, updateEducation, updateProjects, updateSkills } from '@/lib/redux/resumeSlice';
import { BasicInfoForm } from './BasicInfoForm';
import { WorkForm } from './WorkForm';
import { EducationForm } from './EducationForm';
import { ProjectsForm } from './ProjectsForm';
import { SkillsForm } from './SkillsForm';

interface FormProps {
  githubData?: any;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Form = ({ githubData, activeSection, onSectionChange }: FormProps) => {
  const dispatch = useAppDispatch();
  const resume = useAppSelector(state => state.resume);

  const sections = [
    {
      id: 'basics',
      title: 'Basic Information',
      description: 'Start with your basic information',
      component: (
        <BasicInfoForm 
          data={resume.basics} 
          onChange={data => dispatch(updateBasics(data))} 
        />
      )
    },
    {
      id: 'work',
      title: 'Work Experience',
      description: 'Add your relevant work experience',
      component: (
        <WorkForm 
          data={resume.work} 
          onChange={data => dispatch(updateWork(data))} 
        />
      )
    },
    {
      id: 'education',
      title: 'Education',
      description: 'Add your educational background',
      component: (
        <EducationForm 
          data={resume.education} 
          onChange={data => dispatch(updateEducation(data))} 
        />
      )
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Highlight your key projects',
      component: (
        <ProjectsForm 
          data={resume.projects} 
          onChange={data => dispatch(updateProjects(data))}
          githubData={githubData}
        />
      )
    },
    {
      id: 'skills',
      title: 'Skills',
      description: 'List your technical and professional skills',
      component: (
        <SkillsForm 
          data={resume.skills} 
          onChange={data => dispatch(updateSkills(data))}
        />
      )
    }
  ];

  return (
    <div className="space-y-8 pb-8">
      {sections.map((section) => (
        <section 
          key={section.id}
          id={section.id}
          className={`space-y-4 scroll-mt-[140px] rounded-lg bg-white p-6 shadow-sm ${
            activeSection === section.id ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="space-y-1">
            <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
            <p className="text-sm text-gray-500">{section.description}</p>
          </div>
          {section.component}
        </section>
      ))}
    </div>
  );
};