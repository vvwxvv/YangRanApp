import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Mail } from 'lucide-react';
import { subscribeSchema } from '@/schemas/subscribe_schema';
import { subscribeConfig } from '@/components/configs/subscribeConfig';
import { getSubscribeLabel } from '@/components/labels/subscribe_labels';
import { useFormState } from '@/hooks/useFormState';
import { useFormSubmission } from '@/hooks/useFormSubmission';
import { usePathname } from 'next/navigation';
import useFont from '@/hooks/useFont';
import { getSystemLabel } from '@/components/labels/system_labels';

// Mock LanguageContext for demo
const LanguageContext = React.createContext({ isCn: false });

const NewsletterPopup = ({ focusOnOpen = false, onClose }) => {
  const pathname = usePathname();
  if (pathname && pathname.includes('manager')) return null;
  const [isVisible, setIsVisible] = useState(true); // Set to true for demo
  const [isAnimating, setIsAnimating] = useState(false);
  const { isCn } = useContext(LanguageContext);
  const { style, inputFontFamily, buttonFontFamily } = useFont();
  const nameInputRef = React.useRef(null);

  // Form setup with validation
  const form = useForm({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      name: '',
      email: '',
      isActive: true,
    },
    mode: 'onChange',
  });

  // Form state and submission
  const formState = useFormState();
  const { handleSubmit, isSubmitting } = useFormSubmission(form, formState, getSubscribeLabel, subscribeConfig);

  // Callback ref to combine register and local ref
  const setNameInputRef = (el) => {
    nameInputRef.current = el;
    if (el) form.register('name').ref(el);
  };

  // Custom submit handler for popup
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    try {
      formState.setLoading(true);
      formState.clearError();

      const formData = form.getValues();
      const isValid = await form.trigger();

      if (!isValid) {
        formState.setError(getSubscribeLabel('formErrorsMessage', isCn ? 'cn' : 'en'));
        return;
      }

      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        formState.setSuccess(getSubscribeLabel('successMessage', isCn ? 'cn' : 'en'));
        form.reset();
        
        // Close popup after success
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        formState.setError(result.message || getSubscribeLabel('errorMessage', isCn ? 'cn' : 'en'));
      }
    } catch (error) {
      formState.setError(getSubscribeLabel('submissionErrorMessage', isCn ? 'cn' : 'en'));
    } finally {
      formState.setLoading(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      if (focusOnOpen && nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }
  }, [isVisible, focusOnOpen]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 transition-all duration-500 ${
        isAnimating ? 'bg-black bg-opacity-20' : 'bg-transparent'
      }`}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div 
        className={`relative w-full min-w-[280px] max-w-[320px] sm:max-w-[350px] md:max-w-[380px] lg:max-w-[400px] transform transition-all duration-500 ease-out ${
          isAnimating 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-8 opacity-0 scale-95'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          minHeight: '500px',
          maxHeight: '60vh',
          height: 'auto',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Glassmorphism overlay */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 0
          }}
        />
        
        <div className="relative rounded-2xl overflow-hidden z-10 flex flex-col justify-center h-full">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 hover:bg-white hover:bg-opacity-10 transition-all duration-200 z-20 rounded-full"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </button>

          {/* Content */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 pt-5 sm:pt-6 md:pt-7 lg:pt-8 flex flex-col h-full">
            {/* Text */}
            <div className="text-center mb-3 sm:mb-4 md:mb-5">
              <div>
                <h2 className="text-sm sm:text-base md:text-lg font-light text-white mb-1 tracking-wide" style={style}>订阅最新资讯</h2>
                <div className="mb-2" style={{fontSize: '13px', fontWeight: 400, color: 'white', letterSpacing: '0.02em'}}>
                  Subscribe to Artist Newsletter
                </div>
                <div className="w-10 h-0.5 mx-auto mb-3 sm:mb-4" style={{background: 'white', opacity: 0.8, borderRadius: '2px'}} />
                <div style={{marginBottom: '20px'}} />
              </div>
            </div>

            {/* Success/Error Messages */}
            {formState.state.successMessage && (
              <div className="mb-2 sm:mb-3 p-2 bg-green-500 bg-opacity-20 border border-green-400 rounded-lg">
                <p className="text-xs text-green-100 font-light" style={style}>
                  {formState.state.successMessage}
                </p>
              </div>
            )}

            {formState.state.errorMessage && (
              <div className="mb-2 sm:mb-3 p-2 bg-red-500 bg-opacity-20 border border-red-400 rounded-lg">
                <p className="text-xs text-red-100 font-light" style={style}>
                  {formState.state.errorMessage}
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col flex-1 justify-center space-y-2 sm:space-y-3 md:space-y-4">
              <div>
                <input
                  type="text"
                  {...form.register('name')}
                  ref={setNameInputRef}
                  placeholder={getSystemLabel('yourName', isCn)}
                  className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-light placeholder-white placeholder-opacity-70 transition-all duration-300 focus:outline-none bg-transparent text-white rounded-lg"
                  style={{
                    fontFamily: inputFontFamily,
                    ...style,
                    border: form.formState.errors.name 
                      ? '1px solid rgba(0, 0, 0, 0.8)' 
                      : '1px solid rgba(255, 255, 255, 0.8)'
                  }}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-200 mt-1 ml-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  {...form.register('email')}
                  placeholder={getSystemLabel('enterEmail', isCn)}
                  className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-light placeholder-white placeholder-opacity-70 transition-all duration-300 focus:outline-none bg-transparent text-white rounded-lg"
                  style={{
                    fontFamily: inputFontFamily,
                    ...style,
                    border: form.formState.errors.email 
                      ? '1px solid rgba(0, 0, 0, 0.8)' 
                      : '1px solid rgba(255, 255, 255, 0.8)'
                  }}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-200 mt-1 ml-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg text-xs sm:text-sm font-light uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center"
                style={{
                  fontFamily: buttonFontFamily,
                  ...style,
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#333',
                  backdropFilter: 'blur(5px)',
                  WebkitBackdropFilter: 'blur(5px)'
                }}
              >
                {isSubmitting ? (
                  <>
                    <span>{getSystemLabel('subscribing', isCn)}</span>
                    <span className="text-xs mt-0.5">{getSystemLabel('subscribing', false)}</span>
                  </>
                ) : (
                  <>
                    <span>{getSystemLabel('subscribe', isCn)}</span>
                    <span className="text-xs mt-0.5">{getSystemLabel('subscribe', false)}</span>
                  </>
                )}
              </button>
              <div style={{marginBottom: '20px'}} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
