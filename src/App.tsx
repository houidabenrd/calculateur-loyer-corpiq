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
      <header className="relative text-white sticky top-0 z-40 overflow-hidden" style={{background: 'linear-gradient(135deg, #071428 0%, #0c2240 35%, #112d52 65%, #163a6a 100%)'}}>
        {/* Subtle ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-96 h-32 rounded-full opacity-[0.04]" style={{background: 'radial-gradient(ellipse, #4a9eff, transparent 70%)'}} />
          <div className="absolute -bottom-10 right-1/3 w-64 h-20 rounded-full opacity-[0.03]" style={{background: 'radial-gradient(ellipse, #6bb5ff, transparent 70%)'}} />
        </div>
        {/* Top accent line */}
        <div className="h-[2px]" style={{background: 'linear-gradient(90deg, transparent 0%, #3b82f6 20%, #60a5fa 50%, #3b82f6 80%, transparent 100%)'}} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3.5 sm:py-4">
            {/* Logo + Title */}
            <div className="flex items-center gap-4">
              <a href="https://www.corpiq.com" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 group">
                <div className="relative">
                  <div className="absolute -inset-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background: 'radial-gradient(ellipse, rgba(96,165,250,0.15), transparent 70%)'}} />
                  <img 
                    src="/corpiq-logo.png" 
                    alt="CORPIQ" 
                    className="relative h-8 sm:h-9 w-auto object-contain brightness-110 group-hover:brightness-125 transition-all duration-300"
                  />
                </div>
              </a>
              <div className="hidden sm:block w-px self-stretch bg-gradient-to-b from-transparent via-white/20 to-transparent my-0.5" />
              <div className="min-w-0">
                <h1 className="text-[13px] sm:text-[15px] font-semibold tracking-[-0.01em] leading-tight text-white">{t.app.title}</h1>
                <p className="text-[10px] sm:text-[11px] text-blue-300/45 font-medium mt-0.5 uppercase tracking-[0.08em]">{t.app.subtitle}</p>
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <button onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="flex items-center gap-1.5 text-white/50 hover:text-white transition-all duration-200 px-2.5 py-1.5 rounded-md hover:bg-white/[0.08] text-xs font-semibold"
                title={language === 'en' ? 'Changer en français' : 'Switch to English'}>
                <Languages size={13} />
                <span className="tracking-wide">{language === 'en' ? 'FR' : 'EN'}</span>
              </button>
              <a href="https://www.corpiq.com" target="_blank" rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 text-white/30 hover:text-white/70 transition-all duration-200 px-2.5 py-1.5 rounded-md hover:bg-white/[0.06] text-[11px]">
                <span className="tracking-wide">corpiq.com</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-[3px] bg-black/30">
          <div className="h-full transition-all duration-700 ease-out rounded-r-full"
            style={{ 
              width: `${(visualCurrentStep / totalVisualSteps) * 100}%`,
              background: 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)'
            }} />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <StepIndicator currentStep={visualCurrentStep} totalSteps={totalVisualSteps} steps={activeSteps}
          onStepClick={handleStepClick} canAccessStep={handleCanAccessStep} disabledMessage={t.common.completePreviousSteps} />

        <div className="mt-3 mb-4 px-4 py-2.5 bg-amber-50/80 border border-amber-200/60 rounded-xl">
          <p className="text-xs text-amber-800 leading-relaxed text-center font-medium">
            {t.common.applicabilityNote}
          </p>
        </div>

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
      <footer className="text-white mt-auto relative overflow-hidden" style={{background: 'linear-gradient(135deg, #071428, #0c2240 50%, #112d52)'}}>
        <div className="absolute top-0 inset-x-0 h-px" style={{background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent)'}} />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img src="/corpiq-logo.png" alt="CORPIQ" className="h-5 w-auto object-contain opacity-60" />
              <div className="w-px h-4 bg-white/10 hidden md:block" />
              <p className="text-blue-200/30 text-[10px] font-medium tracking-wide">Corporation des propriétaires immobiliers du Québec</p>
            </div>
            <p className="text-blue-200/20 text-[10px] tracking-wide">© {new Date().getFullYear()} CORPIQ — {t.app.footerRights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
