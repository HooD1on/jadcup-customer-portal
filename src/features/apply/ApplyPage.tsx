import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { PageShell } from '../../components/layout/PageShell';
import { Button } from '../../components/ui/Button';

export function ApplyPage() {
  return (
    <PageShell narrow>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-jade-100 flex items-center justify-center mb-6">
          <FileText className="text-jade-600" size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Apply for an Account</h1>
        <p className="text-gray-500 max-w-sm mb-2">
          The application form is not yet available in this prototype.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          In the final version, you will be able to submit an account application here.
        </p>
        <Link to="/" className="no-underline">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </PageShell>
  );
}
