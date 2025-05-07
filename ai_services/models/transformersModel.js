const axios = require('axios');
require('dotenv').config();

// Initialize Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';
// Updated model names to match currently available models
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Hugging Face fallback model configuration
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
// Updated to a more commonly available text generation model
const HUGGINGFACE_FALLBACK_MODEL = 'valhalla/t5-base-e2e-qg';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Set default parameters for generation
const DEFAULT_PARAMS = {
  max_length: 4000,
  temperature: 0.7,
  top_p: 0.9,
  repetition_penalty: 1.2
};

/**
 * Generate text using Google's Gemini models with Hugging Face fallback
 * @param {string} prompt - The prompt to generate text from
 * @param {Object} options - Generation options
 * @returns {Promise<string>} - Generated response
 */
async function generateText(prompt, options = {}) {
  try {
    if (!GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not found in environment variables');
      return generateWithHuggingFaceFallback(prompt, options);
    }

    const modelName = options.modelName || GEMINI_MODEL;
    console.log(`Using model: ${modelName}`);
    
    // Prepare request to Gemini API
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: options.temperature || DEFAULT_PARAMS.temperature,
        topP: options.topP || DEFAULT_PARAMS.top_p,
        maxOutputTokens: options.maxTokens || DEFAULT_PARAMS.max_length,
        topK: options.topK || 40
      }
    };

    // Log the request URL for debugging
    const requestUrl = `${GEMINI_API_URL}/models/${modelName}:generateContent`;
    console.log(`Making request to Gemini API: ${requestUrl}`);

    // Make request to Gemini API
    const response = await axios.post(
      requestUrl,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: GEMINI_API_KEY
        },
        timeout: options.timeout || 60000 // Default 60 second timeout
      }
    );

    // Log successful API call for debugging
    console.log(`Successfully called Gemini API with model: ${modelName}`);

    // Extract and return text from Gemini response
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected Gemini API response structure:', JSON.stringify(response.data));
      return generateWithHuggingFaceFallback(prompt, options);
    }
  } catch (error) {
    console.error('Error generating text with Gemini API:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response error status:', error.response.status);
    }
    
    // Use Hugging Face fallback model when Gemini API fails
    console.log('Gemini API call failed, using Hugging Face fallback model');
    return generateWithHuggingFaceFallback(prompt, options);
  }
}

/**
 * Generate text using Hugging Face's model as fallback
 * @param {string} prompt - The prompt to generate from
 * @param {Object} options - Generation options
 * @returns {Promise<string>} - Generated response
 */
async function generateWithHuggingFaceFallback(prompt, options = {}) {
  try {
    if (!HUGGINGFACE_API_KEY) {
      console.warn('HUGGINGFACE_API_KEY not found in environment variables');
      return getDefaultResponse(prompt);
    }
    
    console.log(`Using Hugging Face fallback model: ${HUGGINGFACE_FALLBACK_MODEL}`);
    
    // Format context and question generation prompt for the model
    const formattedPrompt = formatPromptForQuestionGeneration(prompt);
    
    // Make API request to Hugging Face
    const response = await axios.post(
      `${HUGGINGFACE_API_URL}/${HUGGINGFACE_FALLBACK_MODEL}`,
      { inputs: formattedPrompt },
      {
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: options.timeout || 30000 // 30 second timeout
      }
    );
    
    // Parse and format the response
    if (Array.isArray(response.data)) {
      return response.data.map(item => item.generated_text).join('\n\n');
    } else if (response.data && response.data.generated_text) {
      return response.data.generated_text;
    } else if (typeof response.data === 'string') {
      return response.data;
    } else {
      console.error('Unexpected Hugging Face API response structure:', JSON.stringify(response.data));
      return getDefaultResponse(prompt);
    }
  } catch (error) {
    console.error('Error generating text with Hugging Face fallback model:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response error status:', error.response.status);
    }
    
    return getDefaultResponse(prompt);
  }
}

/**
 * Format the prompt for the question generation model
 */
function formatPromptForQuestionGeneration(prompt) {
  // Extract topics or context from the prompt
  const contextMatch = prompt.match(/about\s+(.+?)(?:\.|\n|$)/i);
  const topics = extractTopicsFromPrompt(prompt);
  
  if (prompt.includes('quiz') || prompt.includes('assessment')) {
    // For quiz generation, focus on topic extraction
    return `generate questions about: ${topics.join(', ')}`;
  } else if (contextMatch) {
    // For general question generation, use context
    return `context: ${contextMatch[1]} generate questions:`;
  } else {
    // Default format if no specific pattern is recognized
    return `generate questions: ${prompt.substring(0, 500)}`;
  }
}

/**
 * Extract topics from a prompt
 */
function extractTopicsFromPrompt(prompt) {
  const topics = [];
  
  // Extract topics mentioned after keywords
  const topicMatches = prompt.match(/(?:topics?|subjects?|about)\s*:?\s*([^,.]+(?:,\s*[^,.]+)*)/gi);
  if (topicMatches) {
    topicMatches.forEach(match => {
      const cleanedMatch = match.replace(/(?:topics?|subjects?|about)\s*:?\s*/i, '');
      topics.push(...cleanedMatch.split(',').map(t => t.trim()));
    });
  }
  
  // Extract topics from lines that look like topic lists
  const lines = prompt.split('\n');
  lines.forEach(line => {
    if (line.includes('Topic') || line.includes('Unit') || line.match(/^\s*[\d.-]+\s+[A-Z]/)) {
      const topicText = line.replace(/^\s*[\d.-]+\s+/, '').trim();
      if (topicText && !topics.includes(topicText)) {
        topics.push(topicText);
      }
    }
  });
  
  return topics.length > 0 ? topics : ['general knowledge'];
}

/**
 * Get a default response when API fails
 */
function getDefaultResponse(prompt) {
  // For syllabus analysis, generate a basic structure
  if (prompt.includes('syllabus') && prompt.includes('JSON')) {
    console.log('Generating default syllabus analysis structure');
    
    // Extract any topics from the prompt
    const topics = extractTopicsFromPrompt(prompt);
    
    // Basic syllabus structure
    return JSON.stringify({
      basicInfo: {
        courseTitle: topics.length > 0 ? `Course on ${topics[0]}` : "Programming Course",
        courseCode: "CS101",
        instructorName: "",
        term: "Current Term",
        academicLevel: "Undergraduate"
      },
      learningOutcomes: {
        objectives: ["Understand fundamental concepts", "Apply critical thinking skills"],
        keyTopics: topics,
        skillsGained: ["Analytical thinking", "Problem solving"]
      },
      schedule: {
        topics: topics.map(topic => `Unit: ${topic}`),
        majorAssignments: ["Midterm Project", "Final Assessment"]
      },
      assessmentStructure: {
        gradingScale: "A: 90-100%, B: 80-89%, C: 70-79%, D: 60-69%, F: Below 60%",
        assessmentBreakdown: [
          { name: "Assignments", percentage: 30 },
          { name: "Quizzes", percentage: 20 },
          { name: "Midterm", percentage: 20 },
          { name: "Final", percentage: 30 }
        ]
      },
      policies: ["Regular attendance is required", "Late submissions are penalized 10% per day"],
      assessmentPatterns: {
        patterns: [
          {
            name: "Weekly Quiz Pattern",
            description: "Short weekly quizzes to reinforce learning",
            structure: [
              { questionType: "Multiple Choice", count: 5, pointsPerQuestion: 1 },
              { questionType: "True/False", count: 5, pointsPerQuestion: 1 }
            ],
            totalPoints: 10,
            estimatedTime: 15,
            difficulty: "Beginner"
          },
          {
            name: "Midterm Assessment",
            description: "Comprehensive assessment of course topics",
            structure: [
              { questionType: "Multiple Choice", count: 10, pointsPerQuestion: 2 },
              { questionType: "Short Answer", count: 5, pointsPerQuestion: 4 }
            ],
            totalPoints: 40,
            estimatedTime: 60,
            difficulty: "Intermediate"
          }
        ]
      }
    });
  }
  
  return `Unable to generate response with available models. Please check your API configuration.`;
}

/**
 * Create a chat completion using available models (compatibility wrapper)
 * @param {string} systemPrompt - System message for context
 * @param {string} userPrompt - User message/prompt
 * @param {Object} options - Generation options
 * @returns {Promise<string>} - Generated response
 */
async function createChatCompletion(systemPrompt, userPrompt, options = {}) {
  try {
    // Build a comprehensive prompt combining system and user messages
    const combinedPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // Generate text using the underlying generateText function
    const result = await generateText(combinedPrompt, {
      maxTokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      topP: options.topP || 0.9,
      repetitionPenalty: options.repetition_penalty || 1.2,
      doSample: true,
      modelName: options.modelName || GEMINI_MODEL
    });
    
    return result;
  } catch (error) {
    console.error('Error in createChatCompletion:', error);
    return `Error generating content: ${error.message}`;
  }
}

module.exports = {
  generateText,
  createChatCompletion,
  generateWithHuggingFaceFallback
};