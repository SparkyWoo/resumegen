import { useAppSelector } from '@/lib/redux/hooks';
import { PDFViewer } from './PDFViewer';

export const Resume = () => {
  const resume = useAppSelector(state => state.resume);

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
        <button 
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          onClick={() => window.print()}
        >
          Download PDF
        </button>
      </div>
      <div className="h-[calc(100%-3rem)] overflow-auto rounded-lg border border-gray-200">
        <PDFViewer data={resume} />
      </div>
    </div>
  );
}; 