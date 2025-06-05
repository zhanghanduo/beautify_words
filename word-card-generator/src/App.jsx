import { useState, useRef, useEffect } from 'react'
import InputForm from './components/InputForm'
import PreviewCard from './components/PreviewCard'
import Controls from './components/Controls'

// Import images directly
import img1 from './assets/File 1.jpg'
import img2 from './assets/File 2.jpg'
import img3 from './assets/File 3.jpg'
import img4 from './assets/File 4.jpg'
import img5 from './assets/File 5.jpg'
import img6 from './assets/File 6.jpg'
import img7 from './assets/File 7.jpg'
import img8 from './assets/File 8.jpg'
import img9 from './assets/File 9.jpg'
import img10 from './assets/File 10.jpg'
import img11 from './assets/File 11.jpg'
import img12 from './assets/File 12.jpg'
import img13 from './assets/File 13.jpg'

function App() {
  const [rawInputText, setRawInputText] = useState('')

  const [englishTerm, setEnglishTerm] = useState('')
  const [phoneticUK, setPhoneticUK] = useState('')
  const [phoneticUS, setPhoneticUS] = useState('')
  const [chineseTranslation, setChineseTranslation] = useState('')
  const [chineseExplanation, setChineseExplanation] = useState('')

  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [currentBackgroundImageUrl, setCurrentBackgroundImageUrl] = useState('')
  const [isBackgroundReady, setIsBackgroundReady] = useState(false)

  const previewCardRef = useRef(null)

  // Static array of imported images
  const availableImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13]

  const getRandomBackgroundImage = () => {
    if (availableImages.length === 0) return ''
    const randomIndex = Math.floor(Math.random() * availableImages.length)
    const selectedImage = availableImages[randomIndex]
    return selectedImage
  }

  const parseAndSetFields = (text) => {
    const lines = text.split('\n')
    
    setEnglishTerm(lines[0]?.trim() || '')
    
    const phoneticsLine = lines[1]?.trim() || ''
    
    // Better parsing for phonetics - split by comma and handle spacing
    const phoneticsParts = phoneticsLine.split(/[,，]/).map(p => p.trim()).filter(p => p)
    
    setPhoneticUK(phoneticsParts[0] || '')
    setPhoneticUS(phoneticsParts.length > 1 ? phoneticsParts[1] : '')
    
    setChineseTranslation(lines[2]?.trim() || '')
    setChineseExplanation(lines.slice(3).join('\n').trim() || '')
  }

  const handleGeneratePreview = () => {
    setIsBackgroundReady(false)
    if (rawInputText.trim() === '') {
      alert("Please enter some text into the input field.")
      setIsPreviewVisible(false)
      setCurrentBackgroundImageUrl('')
      // Clear structured fields if raw input is empty
      setEnglishTerm('')
      setPhoneticUK('')
      setPhoneticUS('')
      setChineseTranslation('')
      setChineseExplanation('')
      return
    }

    parseAndSetFields(rawInputText)
    
    // Check if essential fields (term or translation) got populated after parsing
    // This requires a slight delay or a check after state updates, using a temporary variable for now.
    const tempLines = rawInputText.split('\n')
    const tempEnglishTerm = tempLines[0]?.trim() || ''
    const tempChineseTranslation = tempLines[2]?.trim() || ''

    if (!tempEnglishTerm && !tempChineseTranslation) {
        alert("Couldn\'t extract an English term or Chinese translation from the input. Please check formatting.")
        setIsPreviewVisible(false)
        setCurrentBackgroundImageUrl('')
        return
    }

    // Use random local image instead of picsum
    const newImageUrl = getRandomBackgroundImage()
    setCurrentBackgroundImageUrl(newImageUrl)
    setIsPreviewVisible(true)
  }

  const handleChangeBackground = () => {
    if (isPreviewVisible) {
      setIsBackgroundReady(false)
      const newImageUrl = getRandomBackgroundImage()
      setCurrentBackgroundImageUrl(newImageUrl)
    }
  }

  const handleBackgroundReady = (isReady) => {
    setIsBackgroundReady(isReady)
  }

  useEffect(() => {
    if (rawInputText.trim() === '' && isPreviewVisible) {
      setEnglishTerm('')
      setPhoneticUK('')
      setPhoneticUS('')
      setChineseTranslation('')
      setChineseExplanation('')
      setIsBackgroundReady(false)
    }
  }, [rawInputText, isPreviewVisible])

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)', minHeight: '100vh'}}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2%, transparent 0%)',
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header style={{paddingTop: '32px', paddingBottom: '32px', paddingLeft: '16px', paddingRight: '16px'}}>
          <div style={{maxWidth: '1024px', margin: '0 auto', textAlign: 'center'}}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
            }}>
              <span style={{color: 'white', fontSize: '24px', fontWeight: 'bold'}}>LC</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
              letterSpacing: '-0.025em',
              margin: '0 0 16px 0'
            }}>
              LexiCard <span style={{
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Creator</span>
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#cbd5e1',
              maxWidth: '512px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Transform your vocabulary into beautiful, shareable cards with stunning backgrounds
            </p>
          </div>
        </header>

        <div className="px-4 pb-12">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Input Card */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #60a5fa, #3730a3)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}>
                  <svg style={{width: '24px', height: '24px', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div>
                  <h2 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0'}}>Input Your Word</h2>
                  <p style={{color: '#cbd5e1', margin: '0'}}>Enter the word details to get started</p>
                </div>
              </div>
              <InputForm
                rawInputText={rawInputText} 
                setRawInputText={setRawInputText}
              />
            </div>

            {/* Preview Card */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #34d399, #059669)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}>
                  <svg style={{width: '24px', height: '24px', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0'}}>Preview Card</h2>
                  <p style={{color: '#cbd5e1', margin: '0'}}>See how your vocabulary card looks</p>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                borderRadius: '16px',
                padding: '24px',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(71, 85, 105, 0.5)'
              }}>
                <PreviewCard
                  ref={previewCardRef}
                  englishTerm={englishTerm}
                  phoneticUK={phoneticUK}
                  phoneticUS={phoneticUS}
                  chineseTranslation={chineseTranslation}
                  chineseExplanation={chineseExplanation}
                  isVisible={isPreviewVisible}
                  backgroundImageUrl={currentBackgroundImageUrl}
                  onBackgroundReady={handleBackgroundReady}
                />
              </div>
            </div>

            {/* Actions Card */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                }}>
                  <svg style={{width: '24px', height: '24px', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 style={{fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0'}}>Generate & Download</h2>
                  <p style={{color: '#cbd5e1', margin: '0'}}>Create and save your vocabulary card</p>
                </div>
              </div>
              <Controls 
                previewCardRef={previewCardRef} 
                onGeneratePreview={handleGeneratePreview}
                onChangeBackground={handleChangeBackground}
                isPreviewing={isPreviewVisible && (englishTerm.trim() !== '' || chineseTranslation.trim() !== '') && isBackgroundReady}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{padding: '32px 16px'}}>
          <div style={{maxWidth: '1024px', margin: '0 auto', textAlign: 'center'}}>
            <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8'}}>
              <svg style={{width: '16px', height: '16px'}} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span style={{color: '#94a3b8'}}>Made with love • © {new Date().getFullYear()} LexiCard Creator</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
