import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import emailjs from '@emailjs/browser';
import './ContactModal.css';

const ContactModal = ({ isOpen, onClose, ctaId }) => {
  const [ctaData, setCtaData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Initialize EmailJS once when component mounts
  useEffect(() => {
    if (window.APP_CONFIG?.EMAILJS_PUBLIC_KEY) {
      emailjs.init(window.APP_CONFIG.EMAILJS_PUBLIC_KEY);
    }
  }, []);

  // Load CTA data from JSON
  useEffect(() => {
    if (isOpen && ctaId) {
      fetch(`cta/${ctaId}.json`)
        .then(res => res.json())
        .then(data => {
          setCtaData(data);
          setFormData(prev => ({
            ...prev,
            message: data.prefillMessage || ''
          }));
        })
        .catch(error => {
          console.error('Error loading CTA data:', error);
          // Fallback data if JSON fails to load
          setCtaData({
            title: "Let's Connect",
            subtitle: "We'd love to hear from you",
            submitButtonText: "Send Message",
            successMessage: "Thank you! We'll be in touch soon.",
            fields: {
              name: { placeholder: "Your Name", required: true },
              email: { placeholder: "Email Address", required: true },
              phone: { placeholder: "Phone Number (Optional)", required: false },
              message: { placeholder: "Tell us about your needs", required: true }
            }
          });
        });
    }
  }, [isOpen, ctaId]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      
      // Focus first input after animation
      setTimeout(() => {
        const firstInput = modalRef.current?.querySelector('input');
        firstInput?.focus();
      }, 300);
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      resetForm();
    }, 200);
  }, [onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ctaData?.prefillMessage || ''
    });
    setErrors({});
    setShowSuccess(false);
  };

  const formatPhone = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length === 0) return '';
    if (phone.length < 4) return phone;
    if (phone.length < 7) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      setFormData(prev => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation (optional)
    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 0 && phoneDigits.length !== 10) {
        newErrors.phone = 'Please enter a 10-digit phone number';
      }
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Send email via EmailJS
      const templateParams = {
        from_name: formData.name,
        reply_to: formData.email,
        phone: formData.phone || 'Not provided',
        message: formData.message,
        source: ctaData?.title || ctaId,
        timestamp: new Date().toLocaleString()
      };
      
      const response = await emailjs.send(
        window.APP_CONFIG.EMAILJS_SERVICE_ID,
        window.APP_CONFIG.EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      if (response.status === 200) {
        setShowSuccess(true);
        
        // Analytics event (if applicable)
        if (window.gtag) {
          window.gtag('event', 'form_submit', {
            form_id: ctaId,
            form_destination: 'contact'
          });
        }
        
        // Close modal after showing success message
        setTimeout(() => {
          handleClose();
        }, 3000);
      }
    } catch (error) {
      console.error('EmailJS error:', error);
      setErrors({ 
        submit: 'Failed to send message. Please try again or contact us directly.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen && !isClosing) return null;
  
  return ReactDOM.createPortal(
    <div 
      className={`contact-modal-backdrop ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-subtitle"
    >
      <div 
        className={`contact-modal-container ${isClosing ? 'closing' : ''}`}
        ref={modalRef}
      >
        {showSuccess ? (
          <div className="contact-modal-success">
            <div className="success-icon">✓</div>
            <h2>{ctaData?.successMessage || "Thank you! We'll be in touch soon."}</h2>
          </div>
        ) : (
          <>
            <button
              className="contact-modal-close"
              onClick={handleClose}
              aria-label="Close modal"
            >
              ×
            </button>
            
            <div className="contact-modal-header">
              <h1 id="modal-title" className="contact-modal-title">
                {ctaData?.title || "Let's Connect"}
              </h1>
              {ctaData?.subtitle && (
                <p id="modal-subtitle" className="contact-modal-subtitle">
                  {ctaData.subtitle}
                </p>
              )}
            </div>

            <form className="contact-modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={ctaData?.fields?.name?.placeholder || "Your Name"}
                  className={errors.name ? 'error' : ''}
                  aria-label="Name"
                  required
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={ctaData?.fields?.email?.placeholder || "Email Address"}
                  className={errors.email ? 'error' : ''}
                  aria-label="Email"
                  required
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={ctaData?.fields?.phone?.placeholder || "Phone Number (Optional)"}
                  className={errors.phone ? 'error' : ''}
                  aria-label="Phone"
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={ctaData?.fields?.message?.placeholder || "Tell us about your needs"}
                  className={errors.message ? 'error' : ''}
                  rows="4"
                  aria-label="Message"
                  required
                />
                {errors.message && (
                  <span className="error-message">{errors.message}</span>
                )}
              </div>

              {errors.submit && (
                <div className="contact-modal-error">
                  {errors.submit}
                </div>
              )}

              <div className="contact-modal-actions">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : (ctaData?.submitButtonText || 'Send Message')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ContactModal;