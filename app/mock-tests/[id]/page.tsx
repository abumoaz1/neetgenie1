// Server Component
import { Suspense } from "react";
import ClientTestDetailsPage from "./client";

export default function TestDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientTestDetailsPage testId={params.id} />
    </Suspense>
  );
} 