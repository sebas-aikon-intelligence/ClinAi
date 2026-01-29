import { Suspense } from 'react';
import MessagesView from '@/features/messages/components/MessagesView';
import { Loader2 } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="h-full">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      }>
        <MessagesView />
      </Suspense>
    </div>
  );
}
