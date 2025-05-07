// Using the specified model

/**
 * Detect plagiarism in student response
 * @param {String} studentResponse - The student's answer
 * @returns {Object} Plagiarism detection results
 */
exports.detectPlagiarism = async (studentResponse) => {
  try {
    // Use Hugging Face model for detection
    const aiDetectionResult = await detectPlagiarismWithHuggingFace(studentResponse);
    
    // Use simple text analysis
    const textAnalysisResult = analyzeTextWithSimpleMetrics(studentResponse);
    
    // Combine scores
    const aiWeight = 0.7;
    const metricsWeight = 0.3;
    
    const combinedScore = (aiDetectionResult.score * aiWeight) + (textAnalysisResult.score * metricsWeight);
    
    // Prepare feedback based on score
    let feedback = '';
    if (combinedScore < 30) {
      feedback = 'The response appears to be original.';
    } else if (combinedScore < 60) {
      feedback = 'Some elements of the response may be similar to existing sources. Consider adding more original analysis.';
    } else {
      feedback = 'The response contains significant similarity to existing sources. Please ensure proper attribution or rework for more originality.';
    }
    
    return {
      similarityScore: combinedScore,
      feedback,
      aiConfidence: aiDetectionResult.confidence,
      textFeatures: textAnalysisResult.features
    };
  } catch (error) {
    console.error('Error in plagiarism detection:', error);
    return {
      similarityScore: 0, // Default to no plagiarism on error
      feedback: 'Plagiarism detection system encountered an error. Please review manually.',
      error: error.message
    };
  }
};

/**
 * Use Hugging Face model to detect potential plagiarism
 */
async function detectPlagiarismWithHuggingFace(text) {
  try {
    if (!huggingFaceApiKey) {
      console.log('Using Hugging Face model without API key (limited capabilities)');
      return analyzeTextWithSimpleMetrics(text); // Fallback to metrics-only if no API key
    }

    const prompt = `
      Task: Analyze the following text for signs of plagiarism.
      
      Text to analyze:
      "${text.substring(0, 1000)}"
      
      Provide:
      1. A plagiarism probability score from 0-100
      2. Your confidence level in this assessment (0-100)
      3. Brief reasoning
      
      Format: Score: [number] | Confidence: [number] | Reasoning: [brief analysis]
    `;
    
    // Call Hugging Face API
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${modelName}`,
      { inputs: prompt },
      { 
        headers: { 
          'Authorization': `Bearer ${huggingFaceApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30-second timeout
      }
    );
    
    // Parse the response
    let result = response.data;
    if (Array.isArray(result)) {
      result = result[0].generated_text || '';
    }
    
    // Extract score and confidence from response
    const scoreMatch = result.match(/Score:\s*(\d+)/i);
    const confidenceMatch = result.match(/Confidence:\s*(\d+)/i);
    
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1], 10) : 70;
    
    return { score, confidence, method: 'huggingface' };
  } catch (error) {
    console.error('Error in Hugging Face plagiarism detection:', error);
    // Fallback to text analysis if API fails
    return { score: 50, confidence: 20, method: 'metrics-fallback', error: error.message };
  }
}

/**
 * Analyze text patterns using simple metrics
 */
function analyzeTextWithSimpleMetrics(text) {
  try {
    // Simple text analysis features
    const features = {
      averageSentenceLength: calculateAverageSentenceLength(text),
      readabilityScore: calculateReadabilityScore(text),
      uniqueWordRatio: calculateUniqueWordRatio(text)
    };
    
    // Calculate a score based on features
    // Higher scores indicate more complex text (potentially plagiarized)
    let score = 0;
    
    // Long average sentence length might indicate academic source
    if (features.averageSentenceLength > 25) score += 30;
    else if (features.averageSentenceLength > 20) score += 20;
    else if (features.averageSentenceLength > 15) score += 10;
    
    // Complex readability often indicates non-student writing
    if (features.readabilityScore > 50) score += 30;
    else if (features.readabilityScore > 30) score += 15;
    
    // Low unique word ratio might indicate memorized text
    if (features.uniqueWordRatio < 0.4) score += 40;
    else if (features.uniqueWordRatio < 0.5) score += 20;
    
    return { score, features, method: 'simple-metrics' };
  } catch (error) {
    console.error('Error in simple text analysis:', error);
    return { score: 0, features: {}, method: 'error' };
  }
}

/**
 * Calculate average sentence length
 */
function calculateAverageSentenceLength(text) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 0;
  
  const wordCount = sentences.reduce((count, sentence) => {
    return count + sentence.split(/\s+/).filter(w => w.length > 0).length;
  }, 0);
  
  return wordCount / sentences.length;
}

/**
 * Calculate simple readability score (approximation of Flesch-Kincaid)
 */
function calculateReadabilityScore(text) {
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const syllableCount = estimateSyllableCount(text);
  
  if (sentenceCount === 0 || wordCount === 0) return 0;
  
  // Simple formula for readability (higher = more complex)
  return (0.39 * (wordCount / sentenceCount)) + (11.8 * (syllableCount / wordCount)) - 15.59;
}

/**
 * Estimate syllable count - simplified approach
 */
function estimateSyllableCount(text) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  
  let count = 0;
  for (const word of words) {
    // Count vowel groups as syllables (simplified)
    const syllables = word.match(/[aeiouy]{1,}/g);
    count += syllables ? syllables.length : 1;
    
    // Adjust for silent e at end
    if (word.length > 2 && word.endsWith('e')) {
      count--;
    }
  }
  
  return Math.max(count, words.length * 0.5); // Ensure reasonable minimum
}

/**
 * Calculate unique word ratio
 */
function calculateUniqueWordRatio(text) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0 && w.match(/[a-z]/));
  if (words.length === 0) return 0;
  
  const uniqueWords = new Set(words);
  return uniqueWords.size / words.length;
}

module.exports = exports;