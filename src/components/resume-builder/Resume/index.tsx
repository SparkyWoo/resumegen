import { useAppSelector } from '@/lib/redux/hooks';
import { PDFViewer } from './PDFViewer';

export const Resume = () => {
  const resume = useAppSelector(state => state.resume);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <PDFViewer data={resume} />
    </div>
  );
}; 