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

  const renderSection = () => {
    switch (activeSection) {
      case 'basics':
        return (
          <BasicInfoForm 
            data={resume.basics} 
            onChange={data => {
              dispatch(updateBasics(data));
              if (data.name && data.email) {
                onSectionChange('work');
              }
            }} 
          />
        );
      case 'work':
        return (
          <WorkForm 
            data={resume.work} 
            onChange={data => {
              dispatch(updateWork(data));
              if (data.length > 0 && data[0].company) {
                onSectionChange('education');
              }
            }} 
          />
        );
      case 'education':
        return (
          <EducationForm 
            data={resume.education} 
            onChange={data => {
              dispatch(updateEducation(data));
              if (data.length > 0 && data[0].institution) {
                onSectionChange('projects');
              }
            }} 
          />
        );
      case 'projects':
        return (
          <ProjectsForm 
            data={resume.projects} 
            onChange={data => {
              dispatch(updateProjects(data));
              if (data.length > 0 && data[0].name) {
                onSectionChange('skills');
              }
            }}
            githubData={githubData}
          />
        );
      case 'skills':
        return (
          <SkillsForm 
            data={resume.skills} 
            onChange={data => dispatch(updateSkills(data))}
          />
        );
      default:
        return null;
    }
  };

  const getSectionStatus = (section: string) => {
    switch (section) {
      case 'basics':
        return resume.basics.name && resume.basics.email ? 'complete' : 'incomplete';
      case 'work':
        return resume.work.length > 0 && resume.work[0].company ? 'complete' : 'incomplete';
      case 'education':
        return resume.education.length > 0 && resume.education[0].institution ? 'complete' : 'incomplete';
      case 'projects':
        return resume.projects.length > 0 && resume.projects[0].name ? 'complete' : 'incomplete';
      case 'skills':
        return resume.skills.length > 0 ? 'complete' : 'incomplete';
      default:
        return 'incomplete';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {renderSection()}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => {
            const sections = ['basics', 'work', 'education', 'projects', 'skills'];
            const currentIndex = sections.indexOf(activeSection);
            if (currentIndex > 0) {
              onSectionChange(sections[currentIndex - 1]);
            }
          }}
          className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md"
          disabled={activeSection === 'basics'}
        >
          Previous
        </button>
        <button
          onClick={() => {
            const sections = ['basics', 'work', 'education', 'projects', 'skills'];
            const currentIndex = sections.indexOf(activeSection);
            if (currentIndex < sections.length - 1) {
              onSectionChange(sections[currentIndex + 1]);
            }
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          disabled={activeSection === 'skills'}
        >
          Next
        </button>
      </div>
    </div>
  );
};