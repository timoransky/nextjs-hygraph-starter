'use client';

import { notFound } from 'next/navigation';
import { useHygraphSdk } from '@/lib/hygraph/client';
import { use } from 'react';
import { RichText } from '@graphcms/rich-text-react-renderer';
import Link from 'next/link';

export default function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  // This is an example of how to use the useHygraphSdk hook in a client component
  // to fetch data from Hygraph. The useHygraphSdk hook is a custom hook
  // that uses SWR to fetch data from the Hygraph API.
  const { slug } = use(params);
  const { data, isLoading, error } = useHygraphSdk('singlePage', {
    slug: slug.join('/'),
  });

  if (error) {
    console.error('Error fetching pages:', error);
    return <div>Error loading pages</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.page) {
    return notFound();
  }

  const page = data.page;

  return (
    <div className="relative isolate flex min-h-svh items-center justify-center overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="mx-auto max-w-2xl px-4 py-32">
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            {page.title}
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            {page.subtitle}
          </p>
          <div className="mx-auto mt-8 max-w-xl text-base/7 text-gray-700">
            <RichText content={page.content.raw} />
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="https://github.com/timoransky/nextjs-hygraph-starter"
              target="_blank"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
