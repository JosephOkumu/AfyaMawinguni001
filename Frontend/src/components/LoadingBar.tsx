import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingBar = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 animate-pulse">
      <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600 animate-[loading_1s_ease-in-out]" />
    </div>
  );
};

export default LoadingBar;
