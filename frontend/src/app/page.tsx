"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para o dashboard
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <img 
            src="/logo.jpg" 
            alt="Contratuz Logo" 
            className="w-16 h-16 rounded-lg object-cover shadow-lg"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">eiDocuments</h1>
        <p className="text-gray-600">Redirecionando para o dashboard...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
