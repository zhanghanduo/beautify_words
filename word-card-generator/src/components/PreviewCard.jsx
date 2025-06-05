import React, { useEffect, forwardRef } from 'react';

// Wrap component with forwardRef
const PreviewCard = forwardRef(({
  englishTerm,
  phoneticUK,
  phoneticUS,
  chineseTranslation,
  chineseExplanation,
  isVisible,
  backgroundImageUrl,
  onBackgroundReady
}, ref) => {
  // const cardRef = useRef(null); // Internal ref for direct manipulation if needed, but background is on `ref`

  useEffect(() => {
    if (!ref || !ref.current) {
      if (onBackgroundReady) onBackgroundReady(false);
      return;
    }
    const cardContainer = ref.current;

    if (isVisible && (englishTerm?.trim() || chineseTranslation?.trim())) {
      const fallbackImageUrl = `https://placehold.co/800x600/2E7D32/FFFFFF?text=背景加载失败&font=notosanssc`;
      
      const setBg = (url, success) => {
        if (cardContainer) cardContainer.style.backgroundImage = `url('${url}')`;
        if (onBackgroundReady) onBackgroundReady(success);
      };

      if (backgroundImageUrl) {
        const img = new Image();
        img.onload = () => setBg(backgroundImageUrl, true);
        img.onerror = () => setBg(fallbackImageUrl, true); // Still ready, but with fallback
        img.src = backgroundImageUrl;
      } else {
        // No specific URL, use fallback. Considered ready with fallback.
        setBg(fallbackImageUrl, true); 
      }
    } else {
      cardContainer.style.backgroundImage = 'none'; 
      if (onBackgroundReady) onBackgroundReady(false); // Not visible or no content, so not ready for download
    }
  }, [isVisible, englishTerm, chineseTranslation, ref, backgroundImageUrl, onBackgroundReady]);

  if (!isVisible || (!englishTerm?.trim() && !chineseTranslation?.trim())) {
    return (
      <div 
        data-clone-id="preview-card-clone"
        style={{
          width: '100%',
          maxWidth: '500px',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '32px',
          borderRadius: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
        
        {/* Decorative background pattern */}
        <div style={{
          position: 'absolute',
          inset: '0',
          opacity: '0.03',
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.3) 1px, transparent 0), radial-gradient(circle at 60px 60px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '80px 80px'
        }}></div>
        
        {/* Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <svg style={{width: '32px', height: '32px', color: '#cbd5e1'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        {/* Text */}
        <p style={{
          color: '#cbd5e1',
          fontSize: '16px',
          lineHeight: '1.6',
          margin: '0',
          maxWidth: '320px',
          position: 'relative',
          zIndex: '1'
        }}>
          Enter your word details and click <span style={{color: '#a855f7', fontWeight: '500'}}>"Generate Preview"</span> to see your card here.
        </p>
        
        {/* Subtle glow effect */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}></div>
      </div>
    );
  }

  // Format phonetics display with proper comma separation
  const formatPhonetics = () => {
    const parts = [];
    
    if (phoneticUK?.trim()) {
      parts.push(`UK: ${phoneticUK.trim()}`);
    }
    if (phoneticUS?.trim()) {
      parts.push(`US: ${phoneticUS.trim()}`);
    }
    
    const result = parts.length > 0 ? parts.join(', ') : '';
    return result;
  };

  // Actual card rendering (with forced inline text colors from previous step)
  return (
    <div
      ref={ref}
      data-clone-id="preview-card-clone"
      className="w-full max-w-[500px] min-h-[300px] bg-cover bg-center rounded-2xl shadow-2xl p-7 relative overflow-hidden mx-auto flex flex-col justify-center items-center text-center"
      style={{ 
        fontFamily: "'Arial', sans-serif"
      }}
    >
      {/* Overlay with backdrop blur and darkening */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-[0.45] rounded-2xl z-0"
        style={{ 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)' // Safari support
        }}
      ></div>

      {/* Content container ensuring it's above the overlay */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <div
          className="term text-[2.25rem] font-bold mb-3 leading-tight break-words"
          style={{ color: 'white' }}
        >
          {englishTerm}
        </div>

        {formatPhonetics() && (
          <div
            className="phonetics text-lg mb-2 font-['Arial',_sans-serif] block"
            style={{ color: '#e0e0e0' }}
          >
            <span className="ipa-label font-medium" style={{ color: '#c0c0c0' }}></span>{formatPhonetics()}
          </div>
        )}

        {/* Divider shown if there are phonetics AND (translation OR explanation) */}
        {formatPhonetics() && (chineseTranslation || chineseExplanation) && (
          <div className="divider h-px bg-white bg-opacity-30 my-5 w-3/5 mx-auto"></div>
        )}

        {chineseTranslation && (
          <div
            className="translation font-['KaiTi',_'SimKai',_'Noto_Sans_SC',_sans-serif] text-xl font-medium mt-3 leading-relaxed break-words"
            style={{ color: 'white' }}
          >
            {chineseTranslation}
          </div>
        )}

        {chineseExplanation && (
          <div
            className="explanation font-['KaiTi',_'SimKai',_'Noto_Sans_SC',_sans-serif] text-base mt-3 leading-relaxed break-words"
            style={{ color: '#f0f0f0', whiteSpace: 'pre-line' }}
          >
            {chineseExplanation}
          </div>
        )}
      </div>
    </div>
  );
});

export default PreviewCard; 