import React from 'react';

function InputForm({ rawInputText, setRawInputText, placeholderText }) {
  return (
    <div>
      {/* Input Textarea */}
      <textarea
        value={rawInputText}
        onChange={(e) => setRawInputText(e.target.value)}
        placeholder={placeholderText || "Enter a word like 'serendipity', or multiple words separated by commas: 'ephemeral, ubiquitous, sublime'"}
        style={{
          width: '100%',
          height: '140px',
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          color: 'white',
          fontSize: '14px',
          fontFamily: 'inherit',
          resize: 'vertical',
          outline: 'none',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxSizing: 'border-box'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(168, 85, 247, 0.5)';
          e.target.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.target.style.boxShadow = 'none';
        }}
      />

      {/* Character Count */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px'
      }}>
        <span style={{
          fontSize: '12px',
          color: '#94a3b8'
        }}>
          {rawInputText.length} characters
        </span>
        
        {rawInputText.trim() && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#10b981',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }}></div>
            Ready to generate
          </div>
        )}
      </div>
    </div>
  );
}

export default InputForm; 