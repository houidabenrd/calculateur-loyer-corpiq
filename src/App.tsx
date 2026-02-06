import React from 'react';
import { useCalculateur } from './hooks/useCalculateur';
import { StepIndicator } from './components/ui';
import { Step1, Step2, Step3, Step4, Step5, Step6 } from './components/steps';
import { generatePDF } from './utils/pdfExport';
import { ExternalLink, Languages } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';

function App() {
  const { language, setLanguage, t } = useLanguage();
  const {
    formData, calculatedValues, currentStep, isLoading,
    updateFormData,
    addReparation, updateReparation, removeReparation,
    addNouvelleDepense, updateNouvelleDepense, removeNouvelleDepense,
    addVariationAide, updateVariationAide, removeVariationAide,
    resetForm, nextStep, prevStep, goToStep, canAccessStep,
  } = useCalculateur();

  // ─── Dynamic steps based on hasDeneigement ───
  const activeSteps = React.useMemo(() => {
    const base = [
      { id: 1, title: t.steps.step1.title, description: t.steps.step1.description },
      { id: 2, title: t.steps.step2.title, description: t.steps.step2.description },
      { id: 3, title: t.steps.step3.title, description: t.steps.step3.description },
      { id: 4, title: t.steps.step4.title, description: t.steps.step4.description },
    ];
    if (formData.hasDeneigement) {
      return [
        ...base,
        { id: 5, title: t.steps.step5.title, description: t.steps.step5.description },
        { id: 6, title: t.steps.step6.title, description: t.steps.step6.description },
      ];
    }
    return [
      ...base,
      { id: 5, title: t.steps.step6.title, description: t.steps.step6.description },
    ];
  }, [formData.hasDeneigement, t]);

  // Map internal step ↔ visual step
  const visualCurrentStep = (!formData.hasDeneigement && currentStep === 6) ? 5 : currentStep;
  const totalVisualSteps = activeSteps.length;
  const currentStepInfo = activeSteps.find(s => s.id === visualCurrentStep);

  const handleStepClick = (visualStep: number) => {
    if (!formData.hasDeneigement && visualStep === 5) {
      goToStep(6);
    } else {
      goToStep(visualStep);
    }
  };

  const handleCanAccessStep = (visualStep: number) => {
    if (!formData.hasDeneigement && visualStep === 5) {
      return canAccessStep(6);
    }
    return canAccessStep(visualStep);
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0c2240, #13315c 50%, #530f32)'}}>
        <div className="text-center animate-fade-in-up">
          <div className="relative mx-auto mb-6 w-16 h-16">
            <div className="absolute inset-0 rounded-full border-3 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-3 border-white border-t-transparent animate-spin"></div>
          </div>
          <p className="text-white/70 font-medium">{t.app.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="relative text-white sticky top-0 z-40" style={{background: 'linear-gradient(135deg, #0a1b35, #0c2240 30%, #13315c 70%, #1a4178)'}}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/[0.02]" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/[0.015]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-3.5">
            <div className="flex items-center gap-3.5">
              <div className="flex-shrink-0">
                <img 
                  src="/corpiq-logo.png" 
                  alt="CORPIQ" 
                  className="h-9 sm:h-10 w-auto object-contain drop-shadow-sm"
                />
              </div>
              <div className="hidden sm:block w-px h-8 bg-white/15" />
              <div>
                <h1 className="text-sm sm:text-[15px] font-bold tracking-tight leading-tight text-white/95">{t.app.title}</h1>
                <p className="text-[11px] sm:text-xs text-blue-200/50 font-medium mt-0.5 tracking-wide">{t.app.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="flex items-center gap-1.5 text-white/60 hover:text-white transition-all px-3 py-2 rounded-lg hover:bg-white/10 font-semibold text-xs"
                title={language === 'en' ? 'Changer en français' : 'Switch to English'}>
                <Languages size={14} />
                <span>{language === 'en' ? 'FR' : 'EN'}</span>
              </button>
              <a href="https://www.corpiq.com" target="_blank" rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 text-white/40 hover:text-white transition-all px-3 py-2 rounded-lg hover:bg-white/10 text-xs">
                <span>corpiq.com</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
        {/* Progress */}
        <div className="h-0.5 bg-black/20">
          <div className="h-full transition-all duration-700 ease-out rounded-r-full bg-emerald-500"
            style={{ width: `${(visualCurrentStep / totalVisualSteps) * 100}%` }} />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <StepIndicator currentStep={visualCurrentStep} totalSteps={totalVisualSteps} steps={activeSteps}
          onStepClick={handleStepClick} canAccessStep={handleCanAccessStep} disabledMessage={t.common.completePreviousSteps} />

        {/* Step title */}
        <div className="mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-md bg-corpiq-blue/5 text-corpiq-blue">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {language === 'en' ? 'Step' : 'Étape'} {visualCurrentStep}/{totalVisualSteps}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
            {currentStepInfo?.title}
          </h2>
          <p className="text-gray-500 mt-1 text-sm leading-relaxed max-w-2xl">
            {currentStepInfo?.description}
          </p>
        </div>

        <div key={currentStep} className="step-enter">
          {currentStep === 1 && <Step1 formData={formData} calculatedValues={calculatedValues} updateFormData={updateFormData} onNext={nextStep} />}
          {currentStep === 2 && <Step2 formData={formData} calculatedValues={calculatedValues} updateFormData={updateFormData} onNext={nextStep} onPrevious={prevStep} />}
          {currentStep === 3 && <Step3 formData={formData} calculatedValues={calculatedValues} addReparation={addReparation} updateReparation={updateReparation} removeReparation={removeReparation} onNext={nextStep} onPrevious={prevStep} />}
          {currentStep === 4 && <Step4 formData={formData} calculatedValues={calculatedValues} updateFormData={updateFormData} addNouvelleDepense={addNouvelleDepense} updateNouvelleDepense={updateNouvelleDepense} removeNouvelleDepense={removeNouvelleDepense} addVariationAide={addVariationAide} updateVariationAide={updateVariationAide} removeVariationAide={removeVariationAide} onNext={() => formData.hasDeneigement ? nextStep() : goToStep(6)} onPrevious={prevStep} />}
          {currentStep === 5 && formData.hasDeneigement && <Step5 formData={formData} calculatedValues={calculatedValues} updateFormData={updateFormData} onPrevious={prevStep} onNext={nextStep} />}
          {currentStep === 6 && <Step6 formData={formData} calculatedValues={calculatedValues} onPrevious={() => formData.hasDeneigement ? prevStep() : goToStep(4)} onReset={resetForm} onExportPDF={handleExportPDF} />}
        </div>

        {/* Auto-save */}
        <div className="fixed bottom-4 right-4 z-50 bg-white/95 text-gray-500 px-3 py-1.5 rounded-lg text-[11px] border border-gray-200/80 flex items-center gap-2 animate-fade-in"
          style={{boxShadow: '0 2px 8px rgba(0,0,0,0.06)'}}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">{t.app.autoSave}</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-white mt-auto" style={{background: 'linear-gradient(135deg, #0a1b35, #0c2240 50%, #13315c)'}}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <img src="/corpiq-logo.png" alt="CORPIQ" className="h-6 w-auto object-contain opacity-70" />
              <div>
                <p className="font-bold text-xs tracking-wide">CORPIQ</p>
                <p className="text-blue-300/35 text-[10px]">Corporation des propriétaires immobiliers du Québec</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-blue-200/25 text-[10px]">© {new Date().getFullYear()} CORPIQ — {t.app.footerRights}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
