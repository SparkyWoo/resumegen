import { ResumeState } from '@/lib/redux/resumeSlice';

interface Props {
  data: ResumeState['work'];
  onChange: (data: ResumeState['work']) => void;
}

export const WorkForm = ({ data, onChange }: Props) => {
  const handleAdd = () => {
    onChange([
      ...data,
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        highlights: []
      }
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof ResumeState['work'][0]) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: e.target.value
    };
    onChange(newData);
  };

  const handleHighlightChange = (index: number) => (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      highlights: e.target.value.split('\n')
    };
    onChange(newData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Work Experience</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Experience
        </button>
      </div>

      {data.map((work, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                value={work.company}
                onChange={handleChange(index, 'company')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={work.position}
                onChange={handleChange(index, 'position')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="text"
                value={work.startDate}
                onChange={handleChange(index, 'startDate')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="text"
                value={work.endDate}
                onChange={handleChange(index, 'endDate')}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Highlights (one per line)
            </label>
            <div className="mt-1 text-sm text-gray-500">
              Start each bullet point on a new line. Empty lines will be preserved.
            </div>
            <textarea
              value={work.highlights.join('\n')}
              onChange={handleHighlightChange(index)}
              rows={6}
              placeholder="Each new line will be a bullet point in your resume"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm"
            />
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