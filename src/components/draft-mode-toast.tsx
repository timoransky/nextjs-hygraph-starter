'use client';

import { disableDraftMode } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { toast } from 'sonner';

export const DraftModeToast = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    // Show the toast only if we are not in the Hygraph live preview iframe
    const isIframe =
      typeof window !== 'undefined' && window.self !== window.top;

    if (!isIframe) {
      const toastId = toast('Draft Mode Enabled', {
        description: 'You are currently previewing drafts',
        duration: Infinity,
        action: {
          label: 'Disable',
          onClick: async () => {
            await disableDraftMode();
            startTransition(() => {
              router.refresh();
            });
          },
        },
      });
      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [router]);

  useEffect(() => {
    if (pending) {
      const toastId = toast.loading('Disabling draft mode...');
      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [pending]);

  return null;
};
