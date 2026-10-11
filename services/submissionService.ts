import { Submission, SubmissionAiBreakdown } from '@/types';

export interface EvaluationResult {
  overallScore: number;
  breakdown: SubmissionAiBreakdown;
  feedback: string;
}

export function evaluateContent(
  caption: string,
  mediaUrl: string,
  productMention: string,
  campaignCategory: string = 'Beauty'
): EvaluationResult {
  // Deterministic high-quality evaluation for demo submission
  const breakdown: SubmissionAiBreakdown = {
    contentRelevance: 94,
    brandFit: 96,
    creativeQuality: 95,
    originality: 92,
    productVisibility: 90,
    brandSafety: 98,
  };

  const overallScore = Math.round(
    (breakdown.contentRelevance +
      breakdown.brandFit +
      breakdown.creativeQuality +
      breakdown.originality +
      breakdown.productVisibility +
      breakdown.brandSafety) /
      6
  ); // 93 / 100

  const feedback =
    'The product is clearly visible and integrated naturally within the creator’s authentic routine. The creative concept aligns strongly with the campaign theme, lighting highlights the dewy product texture, and tone adheres to all brand safety guidelines.';

  return {
    overallScore,
    breakdown,
    feedback,
  };
}

export function calculateCreativeScore(submission: Partial<Submission>): number {
  return submission.aiQualityScore || 93;
}
