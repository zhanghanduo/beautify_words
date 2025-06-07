import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai";
import html2canvas from 'html2canvas';
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
  const [isLoading, setIsLoading] = useState(false)

  const [englishTerm, setEnglishTerm] = useState('')
  const [phoneticUK, setPhoneticUK] = useState('')
  const [phoneticUS, setPhoneticUS] = useState('')
  const [chineseTranslation, setChineseTranslation] = useState('')
  const [chineseExplanation, setChineseExplanation] = useState('')

  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [currentBackgroundImageUrl, setCurrentBackgroundImageUrl] = useState('')
  const [isBackgroundReady, setIsBackgroundReady] = useState(false)

  const [batchWords, setBatchWords] = useState([])
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)

  const previewCardRef = useRef(null)

  // Static array of imported images
  const availableImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13]

  const getRandomBackgroundImage = () => {
    if (availableImages.length === 0) return ''
    const randomIndex = Math.floor(Math.random() * availableImages.length)
    const selectedImage = availableImages[randomIndex]
    return selectedImage
  }

  const generateBatchWordData = async (words) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is not set in the .env file.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      For each English word or phrase in the following list: [${words.join(', ')}], provide a JSON array of objects.
      Each object must have the following keys: "englishTerm", "phoneticUK", "phoneticUS", "chineseTranslation", "chineseExplanation".
      - phoneticUK: The UK phonetic transcription.
      - phoneticUS: The US phonetic transcription.
      - chineseTranslation: A common Chinese translation.
      - chineseExplanation: A concise Chinese explanation of its meaning and usage.

      IMPORTANT: Respond with only the JSON array text. Do not include any markdown formatting like \`\`\`json.

      Example for input ["ephemeral", "sublime"]:
      [
        {
          "englishTerm": "ephemeral",
          "phoneticUK": "/ɪˈfem.ər.əl/",
          "phoneticUS": "/əˈfem.ər.əl/",
          "chineseTranslation": "短暂的",
          "chineseExplanation": "Lasting for a very short time."
        },
        {
          "englishTerm": "sublime",
          "phoneticUK": "/səˈblaɪm/",
          "phoneticUS": "/səˈblaɪm/",
          "chineseTranslation": "崇高的",
          "chineseExplanation": "Of such excellence, grandeur, or beauty as to inspire great admiration or awe."
        }
      ]
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      // Clean the response to ensure it's valid JSON
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);

      if (!Array.isArray(parsedData)) {
        throw new Error("API did not return a JSON array.");
      }
      return parsedData;
    } catch (error) {
      console.error('Failed to generate or parse data for words:', error);
      // Create a more informative error to show to the user
      const errorMessage = `Failed to process words. The AI model might have returned an unexpected format, or a network error occurred. Please check the console for details. (Error: ${error.message})`;
      // We'll throw this so the calling function can catch it
      throw new Error(errorMessage);
    }
  };

  const handleNextWord = () => {
    if (currentBatchIndex < batchWords.length - 1) {
      setCurrentBatchIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePreviousWord = () => {
    if (currentBatchIndex > 0) {
      setCurrentBatchIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleGeneratePreview = async () => {
    if (!rawInputText.trim()) {
      alert("Please enter at least one English word or phrase.");
      return;
    }

    setIsLoading(true);
    setIsPreviewVisible(false);
    setIsBackgroundReady(false);

    const words = rawInputText.split(/[,;]/).map(w => w.trim()).filter(Boolean);
    if (words.length === 0) {
      alert("No valid words found to generate.");
      setIsLoading(false);
      return;
    }
    
    try {
      const generatedWordsData = await generateBatchWordData(words);
      
      // The new function returns the full array or throws an error
      setBatchWords(generatedWordsData);

      if (generatedWordsData.length > 0) {
        const firstWord = generatedWordsData[0];
        setEnglishTerm(firstWord.englishTerm);
        setPhoneticUK(firstWord.phoneticUK);
        setPhoneticUS(firstWord.phoneticUS);
        setChineseTranslation(firstWord.chineseTranslation);
        setChineseExplanation(firstWord.chineseExplanation);
        setCurrentBatchIndex(0);

        const newImageUrl = getRandomBackgroundImage();
        setCurrentBackgroundImageUrl(newImageUrl);
        setIsPreviewVisible(true);
      } else {
        alert("The AI model did not return any data for the words provided.");
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (batchWords.length === 0 || !previewCardRef.current) {
      alert("No words to download or preview not ready.");
      return;
    }

    if (batchWords.length === 1) {
      // Single image download
      await downloadSingleCard(batchWords[0]);
    } else {
      // Batch download as zip
      await downloadBatchCards();
    }
  };

  const getCanvas = async () => {
    const cardElement = previewCardRef.current;
    if (!cardElement) return null;
    
    return await html2canvas(cardElement, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      scale: 2,
      foreignObjectRendering: false,
      removeContainer: true,
      imageTimeout: 15000,
      onclone: (clonedDocument) => {
        const clonedCard = clonedDocument.querySelector('[data-clone-id="preview-card-clone"]');
        if (clonedCard && cardElement.style.backgroundImage) {
          clonedCard.style.backgroundImage = cardElement.style.backgroundImage;
          clonedCard.style.backgroundSize = 'cover';
          clonedCard.style.backgroundPosition = 'center';
          clonedCard.style.backgroundRepeat = 'no-repeat';
        }
        
        const textElements = clonedCard?.querySelectorAll('.term, .phonetics, .translation, .explanation') || [];
        textElements.forEach(el => {
          const shadowConfig = {
            '.term': '2px 2px 8px rgba(0, 0, 0, 0.9), 1px 1px 4px rgba(0, 0, 0, 0.8)',
            '.translation': '2px 2px 8px rgba(0, 0, 0, 0.9), 1px 1px 4px rgba(0, 0, 0, 0.8)',
            '.phonetics': '1px 1px 4px rgba(0, 0, 0, 0.9), 0px 0px 2px rgba(0, 0, 0, 0.8)',
            '.explanation': '1px 1px 4px rgba(0, 0, 0, 0.9), 0px 0px 2px rgba(0, 0, 0, 0.8)',
          };
          for (const selector in shadowConfig) {
            if (el.matches(selector)) {
              el.style.textShadow = shadowConfig[selector];
            }
          }
        });
      }
    });
  };

  const downloadSingleCard = async (word) => {
    // Ensure the card is showing the correct word
    setEnglishTerm(word.englishTerm);
    setPhoneticUK(word.phoneticUK);
    setPhoneticUS(word.phoneticUS);
    setChineseTranslation(word.chineseTranslation);
    setChineseExplanation(word.chineseExplanation);
    
    // Wait for state to update and re-render
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await getCanvas();
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${word.englishTerm.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadBatchCards = async () => {
    try {
      setIsDownloading(true); // 开始下载，隐藏批次计数器
      
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      const progressDiv = document.createElement('div');
      progressDiv.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8); color: white; padding: 20px;
        border-radius: 10px; z-index: 10000; font-family: inherit;
      `;
      document.body.appendChild(progressDiv);

      const originalWordState = { englishTerm, phoneticUK, phoneticUS, chineseTranslation, chineseExplanation };

      for (let i = 0; i < batchWords.length; i++) {
        const word = batchWords[i];
        progressDiv.textContent = `Generating Card ${i + 1}/${batchWords.length} for "${word.englishTerm}"`;
        
        // Temporarily update card content for capturing
        setEnglishTerm(word.englishTerm);
        setPhoneticUK(word.phoneticUK);
        setPhoneticUS(word.phoneticUS);
        setChineseTranslation(word.chineseTranslation);
        setChineseExplanation(word.chineseExplanation);
        
        // Wait for DOM to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await getCanvas();
        if (canvas) {
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
          const fileName = `${word.englishTerm.replace(/[^a-zA-Z0-9]/g, '_')}_${i + 1}.png`;
          zip.file(fileName, blob);
        }
      }
      
      // Restore original preview
      setEnglishTerm(originalWordState.englishTerm);
      setPhoneticUK(originalWordState.phoneticUK);
      setPhoneticUS(originalWordState.phoneticUS);
      setChineseTranslation(originalWordState.chineseTranslation);
      setChineseExplanation(originalWordState.chineseExplanation);
      
      progressDiv.textContent = 'Creating ZIP file...';
      const content = await zip.generateAsync({type: 'blob'});
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `LexiCards_Batch_${new Date().getTime()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      document.body.removeChild(progressDiv);
    } catch (error) {
      console.error('Batch download failed:', error);
      alert('Batch download failed. See console for details.');
    } finally {
        setIsDownloading(false); // 下载完成，恢复批次计数器显示
        const progressDiv = document.querySelector('div[style*="z-index: 10000"]');
        if (progressDiv) {
            document.body.removeChild(progressDiv);
        }
    }
  };


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

  useEffect(() => {
    if (batchWords.length > 0) {
      const word = batchWords[currentBatchIndex];
      setEnglishTerm(word.englishTerm);
      setPhoneticUK(word.phoneticUK);
      setPhoneticUS(word.phoneticUS);
      setChineseTranslation(word.chineseTranslation);
      setChineseExplanation(word.chineseExplanation);
    }
  }, [currentBatchIndex, batchWords]);

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)', minHeight: '100vh'}}>
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          color: 'white',
          fontFamily: 'inherit',
          gap: '12px'
        }}>
           <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Generating with Gemini...</p>
          <p style={{fontSize: '12px', color: '#cbd5e1'}}>This may take a moment</p>
        </div>
      )}
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2%, transparent 0)',
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Compact Header */}
        <header style={{paddingTop: '12px', paddingBottom: '12px', paddingLeft: '16px', paddingRight: '16px'}}>
          <div style={{maxWidth: '1400px', margin: '0 auto', textAlign: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                borderRadius: '8px',
                boxShadow: '0 6px 10px -3px rgba(0, 0, 0, 0.3)'
              }}>
                <span style={{color: 'white', fontSize: '16px', fontWeight: 'bold'}}>LC</span>
              </div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                margin: '0',
                letterSpacing: '-0.025em'
              }}>
                LexiCard <span style={{
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Creator</span>
              </h1>
              <span style={{
                fontSize: '12px',
                color: '#cbd5e1',
                fontWeight: '400'
              }}>
                Transform your vocabulary into beautiful, shareable cards
              </span>
            </div>
          </div>
        </header>

        {/* Main Content - Two Column Layout */}
        <div className="px-4 pb-6">
          <div style={{maxWidth: '1400px', margin: '0 auto'}}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* Left Column - Input and Controls */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                
                {/* Input Card */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px'}}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #60a5fa, #3730a3)',
                      borderRadius: '8px',
                      boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.3)'
                    }}>
                      <svg style={{width: '16px', height: '16px', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div>
                      <h2 style={{fontSize: '18px', fontWeight: 'bold', color: 'white', margin: '0 0 2px 0'}}>Input Your Word</h2>
                      <p style={{color: '#cbd5e1', margin: '0', fontSize: '12px'}}>Enter the word details to get started</p>
                    </div>
                  </div>
                  <InputForm
                    rawInputText={rawInputText} 
                    setRawInputText={setRawInputText}
                    placeholderText="Enter a word like 'serendipity', or multiple words separated by commas: 'ephemeral, ubiquitous, sublime'"
                  />
                </div>

                {/* Actions Card */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px'}}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                      borderRadius: '8px',
                      boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.3)'
                    }}>
                      <svg style={{width: '16px', height: '16px', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 style={{fontSize: '18px', fontWeight: 'bold', color: 'white', margin: '0 0 2px 0'}}>Generate & Download</h2>
                      <p style={{color: '#cbd5e1', margin: '0', fontSize: '12px'}}>Create and save your vocabulary card</p>
                    </div>
                  </div>
                  <Controls 
                    onGeneratePreview={handleGeneratePreview}
                    onChangeBackground={handleChangeBackground}
                    isPreviewing={isPreviewVisible && (englishTerm.trim() !== '' || chineseTranslation.trim() !== '') && isBackgroundReady}
                    isGenerating={isLoading}
                    onDownload={handleDownload}
                    wordCount={batchWords.length}
                    onNext={handleNextWord}
                    onPrevious={handlePreviousWord}
                    currentIndex={currentBatchIndex}
                  />
                </div>
              </div>

              {/* Right Column - Preview */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.3s ease',
                minHeight: '500px'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px'}}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #34d399, #059669)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.3)'
                  }}>
                    <svg style={{width: '16px', height: '16px', color: 'white'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 style={{fontSize: '18px', fontWeight: 'bold', color: 'white', margin: '0 0 2px 0'}}>Preview Card</h2>
                    <p style={{color: '#cbd5e1', margin: '0', fontSize: '12px'}}>See how your vocabulary card looks</p>
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.6)',
                  borderRadius: '12px',
                  padding: '16px',
                  minHeight: '420px',
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
                    currentBatchIndex={currentBatchIndex}
                    totalBatchCount={batchWords.length}
                    isDownloading={isDownloading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <footer style={{padding: '12px'}}>
          <div style={{maxWidth: '1400px', margin: '0 auto', textAlign: 'center'}}>
            <div style={{display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '12px'}}>
              <svg style={{width: '12px', height: '12px'}} fill="currentColor" viewBox="0 0 20 20">
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
