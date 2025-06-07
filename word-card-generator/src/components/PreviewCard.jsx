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
  onBackgroundReady,
  currentBatchIndex,
  totalBatchCount,
  isDownloading
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
        if (cardContainer) {
          cardContainer.style.backgroundImage = `url('${url}')`;
          // 确保背景图片始终以固定方式显示
          cardContainer.style.backgroundSize = 'cover';
          cardContainer.style.backgroundPosition = 'center';
          cardContainer.style.backgroundRepeat = 'no-repeat';
        }
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
          height: '400px', // 固定高度
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
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
      style={{ 
        fontFamily: "'Arial', sans-serif",
        width: '100%',
        maxWidth: '500px',
        height: '400px', // 固定高度，确保一致性
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        padding: '30px',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {/* 增强的遮罩层 - 双层遮罩提高文字可读性 */}
      <div 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '20px',
          zIndex: 0,
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.35) 100%)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)' // Safari support
        }}
      ></div>

      {/* 额外的文字背景遮罩 */}
      <div 
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '20px',
          zIndex: 1,
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.05) 70%, transparent 100%)'
        }}
      ></div>

      {/* Content container ensuring it's above the overlay */}
      <div style={{position: 'relative', zIndex: 10, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        {/* 批量模式标识 */}
        {totalBatchCount > 1 && !isDownloading && (
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            backgroundColor: 'rgba(168, 85, 247, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 20
          }}>
            {currentBatchIndex + 1}/{totalBatchCount}
          </div>
        )}
        
        <div
          className="term"
          style={{ 
            color: 'white',
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', // 响应式字体大小
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9), 1px 1px 4px rgba(0, 0, 0, 0.8)', // 增强文字阴影
            fontWeight: 'bold',
            marginBottom: '12px',
            lineHeight: '1.2',
            wordBreak: 'break-word'
          }}
        >
          {englishTerm}
        </div>

        {formatPhonetics() && (
          <div
            className="phonetics"
            style={{ 
              color: '#e0e0e0',
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', // 响应式字体大小
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.9), 0px 0px 2px rgba(0, 0, 0, 0.8)', // 增强文字阴影
              marginBottom: '8px',
              fontFamily: "'Arial', sans-serif",
              display: 'block'
            }}
          >
            <span style={{ fontWeight: '500', color: '#c0c0c0' }}></span>{formatPhonetics()}
          </div>
        )}

        {/* Divider shown if there are phonetics AND (translation OR explanation) */}
        {formatPhonetics() && (chineseTranslation || chineseExplanation) && (
          <div 
            style={{
              height: '1px',
              background: 'rgba(255, 255, 255, 0.6)',
              width: '60%',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
              margin: '20px auto'
            }}
          ></div>
        )}

        {chineseTranslation && (
          <div
            className="translation"
            style={{ 
              color: 'white',
              fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', // 响应式字体大小
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9), 1px 1px 4px rgba(0, 0, 0, 0.8)', // 增强文字阴影
              fontFamily: "'KaiTi', 'SimKai', 'Noto Sans SC', sans-serif",
              fontWeight: '500',
              marginTop: '12px',
              lineHeight: '1.6',
              wordBreak: 'break-word'
            }}
          >
            {chineseTranslation}
          </div>
        )}

        {chineseExplanation && (
          <div
            className="explanation"
            style={{ 
              color: '#f0f0f0',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', // 响应式字体大小
              whiteSpace: 'pre-line',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.9), 0px 0px 2px rgba(0, 0, 0, 0.8)', // 增强文字阴影
              fontFamily: "'KaiTi', 'SimKai', 'Noto Sans SC', sans-serif",
              marginTop: '12px',
              lineHeight: '1.6',
              wordBreak: 'break-word'
            }}
          >
            {chineseExplanation}
          </div>
        )}
      </div>
    </div>
  );
});

export default PreviewCard; 