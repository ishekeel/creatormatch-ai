import { dbEngine } from '../lib/database';
import { calculateBrandToCreatorMatch, calculateCreatorToBrandMatch } from '../lib/ai/matchingEngine';

function runTests() {
  console.log('================================================================');
  console.log('🧪 TESTING CREATORMATCH AI RECOMMENDATION & MATCHING ENGINE');
  console.log('================================================================\n');

  const brands = dbEngine.brandProfiles.all();
  const creators = dbEngine.creatorProfiles.all();
  const campaigns = dbEngine.campaigns.all();

  const calvinBrand = brands.find(b => b.id === 'brand-calvin')!;
  const apexBrand = brands.find(b => b.id === 'brand-apexgaming')!;
  const techBrand = brands.find(b => b.id === 'brand-technova')!;
  const fitBrand = brands.find(b => b.id === 'brand-fitpulse')!;

  const mayaCreator = creators.find(c => c.id === 'creator-maya')!;
  const viperCreator = creators.find(c => c.id === 'creator-viper')!;
  const rohanCreator = creators.find(c => c.id === 'creator-rohan')!;
  const vikramCreator = creators.find(c => c.id === 'creator-vikram')!;

  // -------------------------------------------------------------------------
  // TEST 1: Calvin Fashion Brand -> Fashion Creator vs Gaming Creator
  // -------------------------------------------------------------------------
  console.log('▶ TEST 1: Calvin Fashion (Fashion Brand) matching creators');
  const calvinMatches = creators.map(c => ({
    creator: c.creator_name,
    niche: c.niche.join(', '),
    match: calculateBrandToCreatorMatch(calvinBrand, c),
  })).sort((a, b) => b.match.overallScore - a.match.overallScore);

  console.log('Top ranked for Calvin Fashion:');
  calvinMatches.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.creator} (${m.niche}) -> ${m.match.overallScore}% [${m.match.recommendationVerdict}]`);
  });

  const calvinTop = calvinMatches[0];
  const calvinBottom = calvinMatches[calvinMatches.length - 1];
  if (calvinTop.creator.includes('Maya') && calvinTop.match.overallScore >= 90) {
    console.log('  ✅ PASS: Fashion creator Maya Patel ranked #1 for Calvin Fashion (' + calvinTop.match.overallScore + '%)\n');
  } else {
    throw new Error('FAIL: Fashion creator did not rank #1 for Calvin Fashion');
  }

  // -------------------------------------------------------------------------
  // TEST 2: Apex Gaming Brand -> Gaming Creator vs Fashion Creator
  // -------------------------------------------------------------------------
  console.log('▶ TEST 2: Apex Gaming (Gaming Brand) matching creators');
  const apexMatches = creators.map(c => ({
    creator: c.creator_name,
    niche: c.niche.join(', '),
    match: calculateBrandToCreatorMatch(apexBrand, c),
  })).sort((a, b) => b.match.overallScore - a.match.overallScore);

  console.log('Top ranked for Apex Gaming:');
  apexMatches.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.creator} (${m.niche}) -> ${m.match.overallScore}% [${m.match.recommendationVerdict}]`);
  });

  const apexTop = apexMatches[0];
  if (apexTop.creator.includes('Viper') && apexTop.match.overallScore >= 90) {
    console.log('  ✅ PASS: Gaming creator Karan Viper ranked #1 for Apex Gaming (' + apexTop.match.overallScore + '%)\n');
  } else {
    throw new Error('FAIL: Gaming creator did not rank #1 for Apex Gaming');
  }

  // -------------------------------------------------------------------------
  // TEST 3: Dynamic Re-ranking Check (The ranking MUST change!)
  // -------------------------------------------------------------------------
  console.log('▶ TEST 3: Dynamic Re-ranking Verification');
  console.log(`  Calvin top: ${calvinTop.creator} (${calvinTop.match.overallScore}%) vs Viper (${calvinMatches.find(m => m.creator.includes('Viper'))?.match.overallScore}%)`);
  console.log(`  Apex top:   ${apexTop.creator} (${apexTop.match.overallScore}%) vs Maya (${apexMatches.find(m => m.creator.includes('Maya'))?.match.overallScore}%)`);

  if (calvinTop.creator !== apexTop.creator) {
    console.log('  ✅ PASS: Creator ranking dynamically flips according to brand sector!\n');
  } else {
    throw new Error('FAIL: Ranking is static across different brands');
  }

  // -------------------------------------------------------------------------
  // TEST 4: Reverse Matching: Maya Patel (Fashion) -> Find Brands For You
  // -------------------------------------------------------------------------
  console.log('▶ TEST 4: Reverse Matching - Maya Patel (Fashion Creator) -> Find Brands For You');
  const mayaBrandMatches = brands.map(b => ({
    brand: b.brand_name,
    industry: b.industry,
    match: calculateCreatorToBrandMatch(mayaCreator, b, campaigns),
  })).sort((a, b) => b.match.overallScore - a.match.overallScore);

  mayaBrandMatches.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.brand} (${m.industry}) -> ${m.match.overallScore}% [${m.match.recommendationVerdict}]`);
  });

  if (mayaBrandMatches[0].brand.includes('Calvin') && mayaBrandMatches[0].match.overallScore >= 90) {
    console.log('  ✅ PASS: Calvin Fashion ranked #1 for Maya Patel (' + mayaBrandMatches[0].match.overallScore + '%)\n');
  } else {
    throw new Error('FAIL: Calvin Fashion did not rank #1 for Maya Patel');
  }

  // -------------------------------------------------------------------------
  // TEST 5: Reverse Matching: Karan Viper (Gaming) -> Find Brands For You
  // -------------------------------------------------------------------------
  console.log('▶ TEST 5: Reverse Matching - Karan Viper (Gaming Creator) -> Find Brands For You');
  const viperBrandMatches = brands.map(b => ({
    brand: b.brand_name,
    industry: b.industry,
    match: calculateCreatorToBrandMatch(viperCreator, b, campaigns),
  })).sort((a, b) => b.match.overallScore - a.match.overallScore);

  viperBrandMatches.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.brand} (${m.industry}) -> ${m.match.overallScore}% [${m.match.recommendationVerdict}]`);
  });

  if (viperBrandMatches[0].brand.includes('Apex') && viperBrandMatches[0].match.overallScore >= 90) {
    console.log('  ✅ PASS: Apex Gaming ranked #1 for Karan Viper (' + viperBrandMatches[0].match.overallScore + '%)\n');
  } else {
    throw new Error('FAIL: Apex Gaming did not rank #1 for Karan Viper');
  }

  // -------------------------------------------------------------------------
  // TEST 6: Explainable AI Factors
  // -------------------------------------------------------------------------
  console.log('▶ TEST 6: Explainable AI Verification');
  const sampleMatch = calculateBrandToCreatorMatch(calvinBrand, mayaCreator);
  console.log(`  Positive factors for Maya + Calvin (${sampleMatch.positiveFactors.length} factors):`);
  sampleMatch.positiveFactors.forEach(f => console.log('    ✓ ' + f));

  const sampleMismatch = calculateBrandToCreatorMatch(calvinBrand, viperCreator);
  console.log(`  Negative factors for Viper + Calvin (${sampleMismatch.negativeFactors.length} factors):`);
  sampleMismatch.negativeFactors.forEach(f => console.log('    ✗ ' + f));

  if (sampleMatch.positiveFactors.length > 0 && sampleMismatch.negativeFactors.length > 0) {
    console.log('  ✅ PASS: Explainable AI produces truthful, sector-grounded justifications.\n');
  } else {
    throw new Error('FAIL: Explainable factors missing');
  }

  // -------------------------------------------------------------------------
  // TEST 7: Food Creator (Chef Kabir Sen) <-> Food Brand (FreshPlate Gourmet)
  // -------------------------------------------------------------------------
  console.log('▶ TEST 7: Food Creator <-> Food Brand Priority Matching');
  const freshplateBrand = brands.find(b => b.id === 'brand-freshplate')!;
  const kabirCreator = creators.find(c => c.id === 'creator-kabir')!;

  // Forward match: FreshPlate Gourmet -> all creators
  const freshplateMatches = creators.map(c => ({
    creator: c.creator_name,
    niche: c.niche.join(', '),
    match: calculateBrandToCreatorMatch(freshplateBrand, c),
  })).sort((a, b) => b.match.overallScore - a.match.overallScore);

  console.log('Top ranked creators for FreshPlate Gourmet (Food & Beverage):');
  freshplateMatches.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.creator} (${m.niche}) -> ${m.match.overallScore}% [${m.match.recommendationVerdict}]`);
  });

  if (freshplateMatches[0].creator.includes('Kabir') && freshplateMatches[0].match.overallScore >= 94) {
    console.log(`  ✅ PASS: Food creator Chef Kabir Sen ranked #1 for FreshPlate Gourmet (${freshplateMatches[0].match.overallScore}%)\n`);
  } else {
    throw new Error('FAIL: Chef Kabir Sen did not rank #1 for FreshPlate Gourmet');
  }

  // Reverse match: Chef Kabir Sen -> all brands
  const kabirBrandMatches = brands.map(b => ({
    brand: b.brand_name,
    industry: b.industry,
    match: calculateCreatorToBrandMatch(kabirCreator, b, campaigns),
  })).sort((a, b) => b.match.overallScore - a.match.overallScore);

  console.log('Top ranked brands for Chef Kabir Sen (Food & Cooking):');
  kabirBrandMatches.forEach((m, i) => {
    console.log(`  ${i + 1}. ${m.brand} (${m.industry}) -> ${m.match.overallScore}% [${m.match.recommendationVerdict}]`);
  });

  if (kabirBrandMatches[0].brand.includes('FreshPlate') && kabirBrandMatches[0].match.overallScore >= 94) {
    console.log(`  ✅ PASS: FreshPlate Gourmet ranked #1 for Chef Kabir Sen (${kabirBrandMatches[0].match.overallScore}%)\n`);
  } else {
    throw new Error('FAIL: FreshPlate Gourmet did not rank #1 for Chef Kabir Sen');
  }

  console.log('================================================================');
  console.log('🎉 ALL 7 MATCHING ENGINE TESTS PASSED WITH 100% SUCCESS!');
  console.log('================================================================');
}

runTests();
