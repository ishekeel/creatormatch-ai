'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CreatorCard } from './CreatorCard';
import { useApp } from '@/context/AppContext';
import { calculateMatchScore } from '@/services/matchingService';
import { Sparkles, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export interface AiMatchingAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId?: string;
}

export const AiMatchingAnimationModal: React.FC<AiMatchingAnimationModalProps> = ({
  isOpen,
  onClose,
  campaignId = 'camp-glowrush-summer',
}) => {
  const { creators, campaigns } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const activeCampaign = campaigns.find(c => c.id === campaignId) || campaigns[0];

  const matchingSteps = [
    'Understanding campaign & product objectives',
    'Analyzing target beauty audience demographics',
    'Comparing creator niches & visual aesthetics',
    'Evaluating verified engagement & interaction quality',
    'Checking regional language and location footprint',
    'Reviewing past performance & deliverable track record',
    'Calculating multi-weighted compatibility scores',
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsCompleted(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < matchingSteps.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsCompleted(true);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Ranked creators
  const rankedCreators = creators
    .map(creator => ({
      creator,
      match: calculateMatchScore(activeCampaign, creator),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Creator Discovery Engine"
      description={isCompleted ? "Ranked by true relevance and verified audience alignment" : "Analyzing creators based on multi-factor relevance..."}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {!isCompleted ? (
          <div className="py-8 space-y-6">
            <div className="flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/25 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                AI is finding your best creator matches...
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                Analyzing 1,000+ creators for campaign: &quot;{activeCampaign.name}&quot;
              </p>
            </div>

            {/* Step-by-step evaluation log */}
            <div className="max-w-md mx-auto bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              {matchingSteps.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                      isDone
                        ? 'text-emerald-400 font-medium'
                        : isCurrent
                        ? 'text-brand-300 font-bold scale-[1.02]'
                        : 'text-slate-600'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-brand-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-2xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Compatibility Ranking Complete</h4>
                  <p className="text-xs text-emerald-200">
                    Calculated against 6 weighted criteria for &quot;{activeCampaign.name}&quot;.
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  router.push('/brand/creators');
                }}
              >
                View Full Directory
              </Button>
            </div>

            {/* Ranked Creator Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rankedCreators.slice(0, 3).map(({ creator, match }) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  matchScore={match}
                  campaignId={activeCampaign.id}
                  isInvited={activeCampaign.invitedCreatorIds.includes(creator.id)}
                />
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-400">
                Top match: <span className="text-white font-bold">Ananya Rao (94% AI Match)</span>
              </p>
              <Button
                size="md"
                variant="primary"
                onClick={() => {
                  onClose();
                  router.push('/brand/creators/creator-ananya');
                }}
              >
                Inspect Top Match: Ananya Rao <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
