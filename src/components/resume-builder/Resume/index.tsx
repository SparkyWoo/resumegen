import { useAppSelector } from '@/lib/redux/hooks';
import { PDFViewer } from './PDFViewer';

export const Resume = () => {
  const resume = useAppSelector(state => state.resume);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Preview</h2>
        <button 
          onClick={() => window.print()}
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          Download PDF
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow">
        <PDFViewer data={resume} />
      </div>
    </div>
  );
}; 