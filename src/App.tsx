import React from 'react';
import { useCalculateur } from './hooks/useCalculateur';
import { STEPS } from './types';
import { StepIndicator } from './components/ui';
import { Step1, Step2, Step3, Step4, Step5 } from './components/steps';
import { generatePDF } from './utils/pdfExport';
import { ExternalLink, Languages, Building2, Save } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-corpiq-blue/5 to-corpiq-bordeaux/5">
        <div className="text-center animate-fade-in-up">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-corpiq-blue border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-500 font-medium">{t.app.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-corpiq-blue via-corpiq-blue-light to-corpiq-blue text-white shadow-lg sticky top-0 z-40">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: 'radial-gradient(circle at 25px 25px, white 1px, transparent 0)', backgroundSize: '50px 50px'}} />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/15 backdrop-blur-sm">
                <Building2 size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">{t.app.title}</h1>
                <p className="text-blue-200/80 text-xs sm:text-sm font-light">{t.app.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-all duration-200 px-3 py-2 rounded-xl hover:bg-white/10 text-sm font-medium"
                title={language === 'en' ? 'Changer en français' : 'Switch to English'}
              >
                <Languages size={18} />
                <span>{language === 'en' ? 'FR' : 'EN'}</span>
              </button>
              <a
                href="https://www.corpiq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 text-blue-200/80 hover:text-white transition-all duration-200 px-3 py-2 rounded-xl hover:bg-white/10 text-sm"
              >
                <span>corpiq.com</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
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
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-corpiq-blue/60">
              {language === 'en' ? 'Step' : 'Étape'} {currentStep} / {STEPS.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {t.steps[`step${currentStep}` as keyof typeof t.steps].title}
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">{t.steps[`step${currentStep}` as keyof typeof t.steps].description}</p>
        </div>

        {/* Step content with animation */}
        <div key={currentStep} className="step-enter">
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
        </div>

        {/* Auto-save indicator */}
        <div className="fixed bottom-4 right-4 z-50 bg-white/90 glass text-gray-600 pl-3 pr-4 py-2.5 rounded-xl text-xs shadow-soft border border-gray-100/50 flex items-center gap-2.5 animate-fade-in">
          <Save size={14} className="text-emerald-500" />
          <span className="font-medium">{t.app.autoSave}</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-corpiq-blue-dark via-corpiq-blue to-corpiq-blue-dark text-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Building2 size={18} className="text-blue-200" />
              </div>
              <div>
                <p className="font-semibold text-sm">CORPIQ</p>
                <p className="text-blue-300/70 text-xs">Corporation des propriétaires immobiliers du Québec</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-blue-200/60 text-xs">
                © {new Date().getFullYear()} CORPIQ — {t.app.footerRights}
              </p>
              <a
                href="https://www.corpiq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300/60 hover:text-white transition-colors text-xs"
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
