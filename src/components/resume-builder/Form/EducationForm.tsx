import { ResumeState } from '@/lib/redux/resumeSlice';

interface Props {
  data: ResumeState['education'];
  onChange: (data: ResumeState['education']) => void;
}

export const EducationForm = ({ data, onChange }: Props) => {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        institution: '',
        area: '',
        studyType: '',
        startDate: '',
        endDate: '',
        score: ''
      }
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof ResumeState['education'][0]) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: e.target.value
    };
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Education</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Education
        </button>
      </div>

      {data.map((education, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <input
                type="text"
                value={education.institution}
                onChange={handleChange(index, 'institution')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Area of Study</label>
              <input
                type="text"
                value={education.area}
                onChange={handleChange(index, 'area')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Degree</label>
              <input
                type="text"
                value={education.studyType}
                onChange={handleChange(index, 'studyType')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">GPA/Score</label>
              <input
                type="text"
                value={education.score}
                onChange={handleChange(index, 'score')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="text"
                value={education.startDate}
                onChange={handleChange(index, 'startDate')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="text"
                value={education.endDate}
                onChange={handleChange(index, 'endDate')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
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