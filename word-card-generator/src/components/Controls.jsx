import React from 'react';

function Controls({ 
  onGeneratePreview, 
  onChangeBackground, 
  onDownload,
  isPreviewing,
  isGenerating,
  wordCount,
  onNext,
  onPrevious,
  currentIndex
}) {

  const hasMultipleWords = wordCount > 1;

  // Button styles
  const baseButtonStyle = {
    position: 'relative',
    overflow: 'hidden',
    fontWeight: '500',
    padding: '10px 16px',
    borderRadius: '10px',
    boxShadow: '0 6px 10px -3px rgba(0, 0, 0, 0.3)',
    outline: 'none',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flex: '1',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid',
    fontSize: '14px'
  };
  
  const generateButtonStyle = {
    ...baseButtonStyle,
    color: 'white',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(147, 51, 234, 0.8))',
    borderColor: 'rgba(99, 102, 241, 0.3)'
  };
  
  const downloadButtonActiveStyle = {
    ...baseButtonStyle,
    color: 'white',
    background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.8), rgba(20, 184, 166, 0.8))',
    borderColor: 'rgba(52, 211, 153, 0.3)'
  };
  
  const downloadButtonDisabledStyle = {
    ...baseButtonStyle,
    color: '#94a3b8',
    background: 'rgba(71, 85, 105, 0.5)',
    borderColor: 'rgba(71, 85, 105, 0.3)',
    cursor: 'not-allowed'
  };
  
  const changeBackgroundActiveStyle = {
    ...baseButtonStyle,
    color: 'white',
    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.8), rgba(244, 63, 94, 0.8))',
    borderColor: 'rgba(236, 72, 153, 0.3)'
  };
  
  const changeBackgroundDisabledStyle = {
    ...baseButtonStyle,
    color: '#94a3b8',
    background: 'rgba(71, 85, 105, 0.5)',
    borderColor: 'rgba(71, 85, 105, 0.3)',
    cursor: 'not-allowed'
  };

  const navButtonStyle = {
    ...baseButtonStyle,
    flex: '0 1 auto', // Don't grow, allow shrinking
    padding: '10px 12px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.7), rgba(129, 91, 238, 0.7))',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    color: 'white',
  }

  const navButtonDisabledStyle = {
    ...navButtonStyle,
    background: 'rgba(71, 85, 105, 0.5)',
    borderColor: 'rgba(71, 85, 105, 0.3)',
    color: '#94a3b8',
    cursor: 'not-allowed',
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
      <div style={{display: 'flex', gap: '12px'}}>
        <button
          onClick={onGeneratePreview}
          style={generateButtonStyle}
          disabled={isGenerating}
          title="Generate or update the card preview"
        >
          {isGenerating ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px'}}>
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.443-2.437L4.5 8.5H2.25A.75.75 0 001.5 9.25v1.5A.75.75 0 002.25 11.5h2.699A5.504 5.504 0 0010 14.5a5.48 5.48 0 004.04-1.825l.07-.086a.75.75 0 00-1.138-.976l-.07.086A4.002 4.002 0 0110 13a3.999 3.999 0 01-3.928-3.008L5.77 9.976A.75.75 0 004.87 9.5H3V8.71l1.105.008A4.002 4.002 0 0110 5.5a3.982 3.982 0 012.713 1.03l-.01.012-.002.002A.75.75 0 1013.83 7.7l.01-.012.002-.002A5.483 5.483 0 0010 4.5a5.504 5.504 0 00-5.23 3.552L1.5 8.052V7.25A.75.75 0 012.25 6.5h2.652a5.5 5.5 0 019.443 2.437l1.367.012V10.5h-.25l-1.151-.012z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <span style={{fontWeight: '600'}}>{isGenerating ? 'Generating...' : 'Generate'}</span>
        </button>
        
        <button
          onClick={onChangeBackground}
          style={isPreviewing ? changeBackgroundActiveStyle : changeBackgroundDisabledStyle}
          disabled={!isPreviewing || isGenerating}
          title={isPreviewing ? "Change background image" : "Generate a preview first"}
        >
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: isPreviewing ? 'rgba(255, 255, 255, 0.2)' : 'rgba(71, 85, 105, 0.5)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px'}}>
              <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span style={{fontWeight: '600'}}>Change BG</span>
        </button>
        
        <button
          onClick={onDownload}
          style={isPreviewing ? downloadButtonActiveStyle : downloadButtonDisabledStyle}
          disabled={!isPreviewing || isGenerating}
          title={isPreviewing ? (hasMultipleWords ? `Download all ${wordCount} cards as ZIP` : "Download card as PNG") : "Generate a preview first"}
        >
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: isPreviewing ? 'rgba(255, 255, 255, 0.2)' : 'rgba(71, 85, 105, 0.5)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '14px', height: '14px'}}>
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
          </div>
          <span style={{fontWeight: '600'}}>
            {hasMultipleWords ? `Download All (${wordCount})` : 'Download'}
          </span>
        </button>
      </div>

      {hasMultipleWords && isPreviewing && (
        <div style={{display: 'flex', gap: '12px', marginTop: '10px'}}>
          <button
            onClick={onPrevious}
            disabled={currentIndex === 0 || isGenerating}
            style={currentIndex === 0 || isGenerating ? navButtonDisabledStyle : navButtonStyle}
            title="Previous word"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px'}}>
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </button>
          <div style={{
            flex: 1,
            textAlign: 'center',
            color: 'white',
            fontSize: '14px',
            alignSelf: 'center'
          }}>
            Card {currentIndex + 1} of {wordCount}
          </div>
          <button
            onClick={onNext}
            disabled={currentIndex >= wordCount - 1 || isGenerating}
            style={currentIndex >= wordCount - 1 || isGenerating ? navButtonDisabledStyle : navButtonStyle}
            title="Next word"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{width: '16px', height: '16px'}}>
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default Controls; 