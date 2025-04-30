# Next.js Hygraph Starter

This is a modern [Next.js](https://nextjs.org) starter template integrated with [Hygraph CMS](https://hygraph.com), designed to be easily forkable and adjustable to your project needs. It features a complete setup with shadcn/ui, Hygraph live preview support, and GraphQL code generation.

## Features

- **Next.js 15+**: Utilizes the latest App Router architecture
- **Hygraph CMS Integration**: Ready-to-use GraphQL client and query setup
- **TypeScript**: Fully typed codebase with GraphQL type generation
- **Live Preview**: Real-time content preview with Draft Mode support
- **shadcn/ui**: Pre-configured component library with Tailwind CSS
- **GraphQL Codegen**: Automated type generation from GraphQL schemas

## Getting Started

### Prerequisites

Before you start, make sure you have a Hygraph account and project set up

### Environment Setup

Create a `.env` file in the root of your project with the following variables:

```bash
# Required: Your Hygraph API endpoint
HYGRAPH_ENDPOINT="https://api-xx-xxx.hygraph.com/v2/your-project-id/master"

# Required for Preview Mode: Your Hygraph Content API token with appropriate permissions
HYGRAPH_PREVIEW_TOKEN="your-preview-token"

# Required for Preview Mode: A secret string used to secure preview requests
HYGRAPH_PREVIEW_SECRET="your-random-secret-string"
```

### Installation

```bash
# Install dependencies
npm install
# or
yarn
# or
pnpm install
# or
bun install

# Generate GraphQL types (requires environment variables)
npm run codegen
# or
yarn codegen
# or
pnpm codegen
# or
bun codegen

# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── codegen.ts               # GraphQL code generation configuration
├── components.json          # shadcn/ui configuration
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── actions.ts       # Server actions (for Draft Mode)
│   │   ├── api/
│   │   │   └── draft/       # Draft mode API route
│   │   │       └── route.ts
│   ├── components/
│   │   ├── draft-mode-toast.tsx  # UI component for Draft Mode indication
│   │   └── ui/              # shadcn/ui components
│   └── lib/
│       ├── utils.ts         # Utility functions
│       └── hygraph/         # Hygraph integration
│           ├── __generated/ # Auto-generated GraphQL types
│           ├── queries/     # GraphQL query files
│           └── index.ts     # GraphQL client setup
```

## How Hygraph Integration Works

### GraphQL Client

#### Server side (recommended)

The GraphQL server client is set up in `src/lib/hygraph/index.ts` and provides:

- Automatic environment-based configuration
- Draft mode support through preview tokens
- Type-safe SDK generation from GraphQL operations

```
import { getHygraphSdk } from "@/lib/hygraph";
...
const sdk = getHygraphSdk();
const { page } = await sdk.singlePage({ slug });
```

#### Client side

The client-side hook is provided in `src/lib/hygraph/useHygraphSdk.ts` and offers type-safe data fetching for client components using SWR:

```tsx
'use client';

import { useHygraphSdk } from '@/lib/hygraph/useHygraphSdk';

function ClientComponent({ slug }: { slug: string }) {
  const { data, error, isLoading } = useHygraphSdk('singlePage', {
    slug,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading page</p>;

  return <h1>{data?.page?.title}</h1>;
}
```

**Features:**

- **Type Safety**: The hook maintains full type safety with your GraphQL operations. TypeScript will enforce required variables and provide proper return types.
- **Automatic Fetching**: Uses SWR under the hood for data fetching with caching, revalidation, and focus tracking.
- **Smart Variable Handling**: The hook distinguishes between operations that require variables and those where variables are optional.
- **Optimized for Development**: Disables revalidation on focus during development for a smoother experience.

The hook calls the `/api/hygraph` endpoint which proxies requests to your Hygraph API, ensuring your API tokens remain secure on the server.

### GraphQL Code Generation

The project uses GraphQL Code Generator to create TypeScript types from your GraphQL schema and operations:

1. Write your GraphQL queries in `.graphql` files under `src/lib/hygraph/queries/`
2. Run `npm run codegen` to generate TypeScript types
3. Import and use the generated types and operations in your components

The codegen configuration (`codegen.ts`) is set up to:

- Read your schema from the Hygraph endpoint
- Process all `.graphql` files in the queries directory
- Generate fully typed GraphQL operations and SDK

### Live Preview Mode

The starter includes a complete implementation of Hygraph's Live Preview feature:

1. The `/api/draft/route.ts` endpoint enables draft mode when requested from Hygraph
2. The `DraftModeToast` component shows when draft mode is active
3. The Hygraph client detects draft mode and sends the preview token when needed

## Deployment

This starter can be deployed on any platform that supports Next.js, such as Vercel, Netlify, or a custom server.

Make sure to add your environment variables to your deployment platform.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Hygraph Documentation](https://hygraph.com/docs)
- [GraphQL Code Generator](https://www.graphql-code-generator.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
