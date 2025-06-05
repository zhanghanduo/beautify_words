import React from 'react';

function InputForm({ rawInputText, setRawInputText }) {
  const textareaStyle = {
    display: 'block',
    width: '100%',
    padding: '16px 24px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
    outline: 'none',
    fontSize: '16px',
    minHeight: '180px',
    resize: 'vertical',
    color: 'white',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      {/* Format guide */}
      <div style={{
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(71, 85, 105, 0.3)',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{fontSize: '14px', color: '#cbd5e1'}}>
          <div style={{fontWeight: '500', color: 'white', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px'}}>
            Format Guide
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{color: '#60a5fa', fontWeight: '500'}}>Line 1:</span>
              <span>English Term</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{color: '#a855f7', fontWeight: '500'}}>Line 2:</span>
              <span>Phonetics (UK, US)</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{color: '#34d399', fontWeight: '500'}}>Line 3:</span>
              <span>Chinese Translation</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{color: '#fb923c', fontWeight: '500'}}>Line 4+:</span>
              <span>Explanation</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{position: 'relative'}}>
        <textarea
          id="rawInputText"
          value={rawInputText}
          onChange={(e) => setRawInputText(e.target.value)}
          style={{
            ...textareaStyle,
            '::placeholder': {color: '#94a3b8'}
          }}
          placeholder="Example:
Serendipity
/ˌser.ənˈdɪp.ə.ti/, /ˌser.ənˈdɪp.ə.t̬i/
意外发现
The luck of finding useful things by chance."
          rows="7"
        />
        
        {/* Status indicator */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px'}}>
          <div style={{fontSize: '12px', color: '#94a3b8'}}>
            {rawInputText.length} characters
          </div>
          {rawInputText.trim() && (
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px'}}>
              <div style={{width: '8px', height: '8px', backgroundColor: '#34d399', borderRadius: '50%', animation: 'pulse 2s infinite'}}></div>
              <span style={{color: '#34d399', fontWeight: '500'}}>Ready to generate</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InputForm; 