import React from 'react';
import { useCalculateur } from './hooks/useCalculateur';
import { STEPS } from './types';
import { StepIndicator } from './components/ui';
import { Step1, Step2, Step3, Step4, Step5 } from './components/steps';
import { generatePDF } from './utils/pdfExport';
import { ExternalLink, Languages } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';

function App() {
  const { language, setLanguage, t } = useLanguage();
  const {
    formData,
    calculatedValues,
    currentStep,
    isLoading,
    updateFormData,
    addReparation,
    updateReparation,
    removeReparation,
    addNouvelleDepense,
    updateNouvelleDepense,
    removeNouvelleDepense,
    addVariationAide,
    updateVariationAide,
    removeVariationAide,
    resetForm,
    nextStep,
    prevStep,
    goToStep,
    canAccessStep,
  } = useCalculateur();

  const handleExportPDF = async () => {
    if (calculatedValues) {
      try {
        await generatePDF(formData, calculatedValues, language);
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Une erreur est survenue lors de la génération du PDF.');
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-corpiq-blue border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">{t.app.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-corpiq-blue text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/corpiq-logo.png" 
                alt="CORPIQ Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold">{t.app.title}</h1>
                <p className="text-blue-200 text-sm">{t.app.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                title={language === 'en' ? 'Changer en français' : 'Switch to English'}
              >
                <Languages size={20} />
                <span className="font-medium">{language === 'en' ? 'FR' : 'EN'}</span>
              </button>
              <a 
                href="https://www.corpiq.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
              >
                <span>corpiq.com</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Step indicator */}
        <StepIndicator 
          currentStep={currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
          onStepClick={goToStep}
          canAccessStep={canAccessStep}
          disabledMessage={t.common.completePreviousSteps}
        />

        {/* Current step title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-corpiq-blue">
            {language === 'en' ? 'Step' : 'Étape'} {currentStep}: {t.steps[`step${currentStep}` as keyof typeof t.steps].title}
          </h2>
          <p className="text-gray-600">{t.steps[`step${currentStep}` as keyof typeof t.steps].description}</p>
        </div>

        {/* Step content */}
        {currentStep === 1 && (
          <Step1
            formData={formData}
            calculatedValues={calculatedValues}
            updateFormData={updateFormData}
            onNext={nextStep}
          />
        )}
        
        {currentStep === 2 && (
          <Step2
            formData={formData}
            calculatedValues={calculatedValues}
            updateFormData={updateFormData}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}
        
        {currentStep === 3 && (
          <Step3
            formData={formData}
            calculatedValues={calculatedValues}
            addReparation={addReparation}
            updateReparation={updateReparation}
            removeReparation={removeReparation}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}
        
        {currentStep === 4 && (
          <Step4
            formData={formData}
            calculatedValues={calculatedValues}
            addNouvelleDepense={addNouvelleDepense}
            updateNouvelleDepense={updateNouvelleDepense}
            removeNouvelleDepense={removeNouvelleDepense}
            addVariationAide={addVariationAide}
            updateVariationAide={updateVariationAide}
            removeVariationAide={removeVariationAide}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}
        
        {currentStep === 5 && (
          <Step5
            formData={formData}
            calculatedValues={calculatedValues}
            updateFormData={updateFormData}
            onPrevious={prevStep}
            onReset={resetForm}
            onExportPDF={handleExportPDF}
          />
        )}

        {/* Auto-save indicator */}
        <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm shadow-md flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {t.app.autoSave}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-corpiq-blue text-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/corpiq-logo.png" 
                alt="CORPIQ Logo" 
                className="h-8 w-auto opacity-80"
              />
              <div className="text-sm">
                <p className="font-semibold">CORPIQ</p>
                <p className="text-blue-200 text-xs">Corporation des propriétaires immobiliers du Québec</p>
              </div>
            </div>
            <div className="text-center md:text-right text-sm">
              <p className="text-blue-200">
                © {new Date().getFullYear()} CORPIQ — {t.app.footerRights}
              </p>
              <p className="text-blue-300 text-xs mt-1">
                {t.app.footerContact}
              </p>
              <a 
                href="https://www.corpiq.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-white transition-colors text-xs"
              >
                www.corpiq.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
