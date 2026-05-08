import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { useConfigurator } from '../hooks/useConfigurator';
import { useEffect, useRef } from 'react';
import { trackWizardEvent } from '../services/leads';
import { StepBuildingType } from '../components/sections/StepBuildingType';
import { StepMieterInfo } from '../components/sections/StepMieterInfo';
import { StepRoof } from '../components/sections/StepRoof';
import { StepEnergy } from '../components/sections/StepEnergy';
import { StepGrants } from '../components/sections/StepGrants';
import { StepResult } from '../components/sections/StepResult';
import { StepLeadForm } from '../components/sections/StepLeadForm';
import { StepConfirmation } from '../components/sections/StepConfirmation';
import { ConfiguratorSidebar } from '../components/sections/ConfiguratorSidebar';

interface ConfiguratorPageProps {
  initialZip?: string;
}

export const ConfiguratorPage: React.FC<ConfiguratorPageProps> = ({ initialZip = '' }) => {
  const { step, data, calculations, nextStep, prevStep, updateData } = useConfigurator(initialZip);
  const [showMieterGate, setShowMieterGate] = useState(false);

  // Drop-off Tracking — kein PII, nur Step-Nummer + PLZ
  const sessionId = useRef(
    sessionStorage.getItem('wiz_sid') ?? (() => {
      const id = crypto.randomUUID();
      sessionStorage.setItem('wiz_sid', id);
      return id;
    })()
  );
  useEffect(() => {
    trackWizardEvent(sessionId.current, 'step_entered', step, data.zip);
  }, [step]);
  useEffect(() => {
    const onLeave = () => trackWizardEvent(sessionId.current, 'abandoned', step, data.zip);
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [step, data.zip]);

  // Intercept: nach Schritt 1 Mieter-Gate zeigen
  function handleStep1Next() {
    if (data.ownershipType === 'mieter') {
      setShowMieterGate(true);
    } else {
      nextStep();
    }
  }

  const renderStep = () => {
    // Mieter-Gate: steht zwischen Schritt 1 und 2
    if (showMieterGate) {
      return (
        <StepMieterInfo
          onContinueAnyway={() => { setShowMieterGate(false); nextStep(); }}
          onBack={() => setShowMieterGate(false)}
        />
      );
    }

    switch (step) {
      case 1:
        return (
          <StepBuildingType
            data={data}
            onUpdate={updateData}
            onNext={handleStep1Next}
          />
        );
      case 2:
        return (
          <StepRoof
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <StepEnergy
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <StepGrants
            zip={data.zip}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <StepResult
            data={data}
            calculations={calculations}
            onNext={nextStep}
          />
        );
      case 6:
        return (
          <StepLeadForm
            data={data}
            calculations={calculations}
            onNext={nextStep}
            onPrev={prevStep}
            onUpdate={updateData}
          />
        );
      case 7:
        return (
          <StepConfirmation
            data={data}
          />
        );
      default:
        return null;
    }
  };

  const showSidebar = step < 7;

  return (
    <>
    <SEO
      title="PV-Anlage konfigurieren"
      description="Gib deine Gebäude- und Dachdaten ein und erhalte sofort eine kostenlose Wirtschaftlichkeitsanalyse inklusive Förderungen und Amortisationszeit."
      canonical="/configurator"
      noindex={false}
    />
    <main className={`flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12 flex flex-col ${showSidebar ? 'lg:flex-row' : 'items-center'} gap-gutter`}>
      <div className={showSidebar ? 'lg:col-span-8 flex-1' : 'w-full'}>
        {renderStep()}
      </div>
      {showSidebar && <ConfiguratorSidebar currentStep={step} data={data} calculations={calculations} />}
    </main>
    </>
  );
};
