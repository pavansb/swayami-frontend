import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    // Redirect to the external static landing page
    window.location.href = 'https://swayami-spark-bliss.lovable.app';
  }, []);

  // Show a brief loading message while redirecting
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6FCC7F] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Swayami...</p>
      </div>
    </div>
  );
};

export default Index;
