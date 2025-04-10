// Server Component
import { Suspense } from "react";
import ClientResultsPage from "./client";

interface ResultsPageProps {
  params: {
    id: string;
  };
}

export default function ResultsPage({ params }: ResultsPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientResultsPage testId={params.id} />
    </Suspense>
  );
} 