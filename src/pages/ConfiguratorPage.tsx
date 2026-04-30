import React from 'react';
import { useConfigurator } from '../hooks/useConfigurator';
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepRoof 
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 2:
        return (
          <StepEnergy 
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <StepGrants
            zip={data.zip}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <StepResult
            calculations={calculations}
            onNext={nextStep}
          />
        );
      case 5:
        return (
          <StepLeadForm
            data={data}
            calculations={calculations}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <StepConfirmation 
            data={data}
          />
        );
      default:
        return null;
    }
  };

  const showSidebar = step < 6;

  return (
    <main className={`flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-6 py-section-padding flex flex-col ${showSidebar ? 'lg:flex-row' : 'items-center'} gap-gutter`}>
      <div className={showSidebar ? 'lg:col-span-8 flex-1' : 'w-full'}>
        {renderStep()}
      </div>
      {showSidebar && <ConfiguratorSidebar currentStep={step} data={data} />}
    </main>
  );
};
