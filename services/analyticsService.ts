export interface TimeSeriesPoint {
  date: string;
  reach: number;
  engagement: number;
  clicks: number;
  conversions: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  dropoffPercentage: string;
  color: string;
}

export const mockTimeSeriesData: TimeSeriesPoint[] = [
  { date: 'Day 1', reach: 35000, engagement: 2900, clicks: 1200, conversions: 140 },
  { date: 'Day 2', reach: 68000, engagement: 5400, clicks: 2300, conversions: 290 },
  { date: 'Day 3', reach: 124000, engagement: 9800, clicks: 4200, conversions: 530 },
  { date: 'Day 4', reach: 210000, engagement: 16500, clicks: 7100, conversions: 890 },
  { date: 'Day 5', reach: 310000, engagement: 24200, clicks: 10400, conversions: 1350 },
  { date: 'Day 6', reach: 385000, engagement: 30100, clicks: 12800, conversions: 1680 },
  { date: 'Day 7', reach: 420000, engagement: 32800, clicks: 14200, conversions: 1840 },
];

export const mockConversionFunnel: FunnelStage[] = [
  { stage: 'Impressions', count: 420000, dropoffPercentage: '100%', color: '#6366f1' },
  { stage: 'Engagement', count: 32800, dropoffPercentage: '7.8%', color: '#8b5cf6' },
  { stage: 'Link Clicks', count: 14200, dropoffPercentage: '43.3%', color: '#ec4899' },
  { stage: 'Product Visits', count: 6800, dropoffPercentage: '47.8%', color: '#f59e0b' },
  { stage: 'Conversions', count: 1840, dropoffPercentage: '27.1%', color: '#10b981' },
];

export const mockCreatorROI = [
  { name: 'Ananya Rao', spend: '₹15,000', generatedSales: '₹88,200', roi: '5.8x', reach: '250K', engagement: '8.4%' },
  { name: 'Rahul Varma', spend: '₹20,000', generatedSales: '₹94,000', roi: '4.7x', reach: '310K', engagement: '6.9%' },
  { name: 'Arjun Mehta', spend: '₹12,000', generatedSales: '₹73,200', roi: '6.1x', reach: '520K', engagement: '10.5%' },
  { name: 'Priya Sharma', spend: '₹10,000', generatedSales: '₹46,000', roi: '4.6x', reach: '140K', engagement: '8.2%' },
];
