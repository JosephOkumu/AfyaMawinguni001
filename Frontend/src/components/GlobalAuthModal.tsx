import React, { useState, useEffect } from 'react';
import AuthModal from './auth/AuthModal';

const GlobalAuthModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const handleOpenAuthModal = (event: CustomEvent) => {
      setDefaultTab(event.detail.tab || 'signin');
      setIsOpen(true);
    };

    window.addEventListener('openAuthModal', handleOpenAuthModal as EventListener);

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal as EventListener);
    };
  }, []);

  return (
    <AuthModal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
      defaultTab={defaultTab}
    />
  );
};

export default GlobalAuthModal;
