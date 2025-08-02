import { useState, useCallback } from 'react';

export const useContactModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [ctaId, setCtaId] = useState(null);
  
  const openModal = useCallback((ctaIdentifier) => {
    setCtaId(ctaIdentifier);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);
  
  const closeModal = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, []);
  
  return {
    isOpen,
    ctaId,
    openModal,
    closeModal
  };
};