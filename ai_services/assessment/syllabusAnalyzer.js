const axios = require('axios');
const transformersModel = require('../models/transformersModel');
require('dotenv').config();

/**
 * Generate a quick quiz based on syllabus analysis - using GPT-2 as requested
 * @param {Object} syllabusAnalysis - The analyzed syllabus data
 * @param {Object} quizParameters - Parameters for quiz generation
 * @returns {Object} - The generated quiz
 */
async function generateQuickQuiz(syllabusAnalysis, quizParameters = {}) {
    try {
        console.log('=== USING GPT-2 EXCLUSIVELY FOR QUIZ GENERATION ===');
        
        // Extract key syllabus information with defensive coding
        const basicInfo = syllabusAnalysis.basicInfo || { 
            courseTitle: "Course", 
            courseCode: "101", 
            academicLevel: "Undergraduate"
        };
        
        const learningOutcomes = syllabusAnalysis.learningOutcomes || {};
        const courseTopics = (learningOutcomes.keyTopics && Array.isArray(learningOutcomes.keyTopics)) 
            ? learningOutcomes.keyTopics.slice(0, 5) // Limit to 5 topics for GPT-2's context window
            : ["Topic 1", "Topic 2", "Topic 3"];
        
        // Apply default parameters with fallbacks
        const {
            questionCount = 5, // Reduced default for GPT-2's capabilities
            difficulty = 'mixed',
            questionTypes = ['multiple-choice', 'true-false'],  // Simplified types
            topicFocus = [],
            timeLimit = 15
        } = quizParameters;
        
        // Select topics to cover - limit to 3 max for GPT-2's context
        const topicsToUse = topicFocus.length > 0 
            ? topicFocus.slice(0, 3) 
            : courseTopics.slice(0, Math.min(3, courseTopics.length));
        
        // Build a simpler, more structured prompt optimized for GPT-2
        const prompt = `
Generate a quiz with ${questionCount} questions about ${topicsToUse.join(', ')}.

Course: ${basicInfo.courseTitle}
Level: ${basicInfo.academicLevel}
Difficulty: ${difficulty}
Types: ${questionTypes.join(', ')}

Each question should have this format:
Q: [Question text]
Type: [question type]
${questionTypes.includes('multiple-choice') ? 'A: [Option A]\nB: [Option B]\nC: [Option C]\nD: [Option D]\nCorrect: [A/B/C/D]' : ''}
${questionTypes.includes('true-false') ? 'Options: True/False\nCorrect: [True/False]' : ''}
Points: [points]
Topic: [related topic]
END

Generate exactly ${questionCount} questions, one after another.`;
        
        // Use transformers model with GPT-2 for quiz generation
        const response = await transformersModel.createChatCompletion(
            'You are creating a quiz for students.',
            prompt,
            {
                temperature: 0.8,
                maxTokens: 2048,
                taskType: 'quiz',
                forceGPT2: true,
                modelName: 'gpt2'
            }
        );
        
        // Parse the GPT-2 response which will likely be in a custom format
        try {
            // Parse the custom format response into structured quiz data
            const questions = [];
            const questionBlocks = response.split('END').filter(block => block.trim().length > 0);
            
            for (let i = 0; i < Math.min(questionCount, questionBlocks.length); i++) {
                const block = questionBlocks[i];
                
                // Extract question components
                const questionMatch = block.match(/Q:\s*(.+?)(?=\nType:|$)/s);
                const typeMatch = block.match(/Type:\s*(.+?)(?=\nA:|Options:|Points:|$)/);
                const topicMatch = block.match(/Topic:\s*(.+?)(?=\nEND|$)/s);
                const pointsMatch = block.match(/Points:\s*(\d+)/);
                
                // Extract multiple choice options if present
                const optionsA = block.match(/A:\s*(.+?)(?=\nB:|$)/);
                const optionsB = block.match(/B:\s*(.+?)(?=\nC:|$)/);
                const optionsC = block.match(/C:\s*(.+?)(?=\nD:|$)/);
                const optionsD = block.match(/D:\s*(.+?)(?=\nCorrect:|$)/);
                const correctMatch = block.match(/Correct:\s*([ABCD]|True|False)/);
                
                if (questionMatch) {
                    const questionType = typeMatch ? typeMatch[1].trim().toLowerCase() : 'multiple-choice';
                    let options = [];
                    let correctAnswer = '';
                    
                    if (questionType.includes('multiple') || questionType.includes('choice')) {
                        options = [
                            optionsA ? optionsA[1].trim() : 'Option A',
                            optionsB ? optionsB[1].trim() : 'Option B',
                            optionsC ? optionsC[1].trim() : 'Option C',
                            optionsD ? optionsD[1].trim() : 'Option D'
                        ];
                        
                        if (correctMatch) {
                            const correctLetter = correctMatch[1].trim();
                            if (correctLetter === 'A') correctAnswer = options[0];
                            else if (correctLetter === 'B') correctAnswer = options[1];
                            else if (correctLetter === 'C') correctAnswer = options[2];
                            else if (correctLetter === 'D') correctAnswer = options[3];
                            else correctAnswer = options[0]; // Default to first option
                        } else {
                            correctAnswer = options[0]; // Default to first option
                        }
                    } else if (questionType.includes('true') || questionType.includes('false')) {
                        options = ['True', 'False'];
                        correctAnswer = correctMatch ? correctMatch[1].trim() : 'True';
                    }
                    
                    questions.push({
                        id: `q${i+1}`,
                        question: questionMatch[1].trim(),
                        questionType: questionType,
                        options: options,
                        correctAnswer: correctAnswer,
                        topic: topicMatch ? topicMatch[1].trim() : topicsToUse[i % topicsToUse.length],
                        points: pointsMatch ? parseInt(pointsMatch[1]) : 1,
                        difficulty: difficulty,
                        explanation: "Explanation will be provided after submission."
                    });
                }
            }
            
            // Create a complete quiz structure even if parsing was incomplete
            const quiz = {
                title: `${basicInfo.courseTitle} Quick Quiz`,
                description: `A quick assessment covering ${topicsToUse.join(', ')}`,
                totalPoints: questions.reduce((sum, q) => sum + q.points, 0),
                timeLimit: timeLimit,
                questions: questions.length > 0 ? questions : generateFallbackQuestions(topicsToUse, questionCount),
                generatedAt: new Date().toISOString(),
                generatedBy: 'gpt-2',
                courseInfo: {
                    title: basicInfo.courseTitle,
                    code: basicInfo.courseCode,
                    level: basicInfo.academicLevel
                }
            };
            
            console.log(`Successfully generated quiz with ${quiz.questions.length} questions using GPT-2`);
            return quiz;
        } catch (error) {
            console.error('Error parsing quiz response from GPT-2:', error);
            
            // Generate fallback questions directly
            return {
                title: `${basicInfo.courseTitle} Quick Quiz`,
                description: `A quick assessment covering ${topicsToUse.join(', ')}`,
                totalPoints: questionCount,
                timeLimit: timeLimit,
                questions: generateFallbackQuestions(topicsToUse, questionCount),
                generatedAt: new Date().toISOString(),
                generatedBy: 'gpt-2-fallback',
                courseInfo: {
                    title: basicInfo.courseTitle,
                    code: basicInfo.courseCode,
                    level: basicInfo.academicLevel
                }
            };
        }
    } catch (error) {
        console.error('Error generating quiz with GPT-2:', error);
        throw new Error(`Failed to generate quiz with GPT-2: ${error.message}`);
    }
}

/**
 * Generate fallback questions when GPT-2 parsing fails
 * @param {Array} topics - Available topics
 * @param {Number} count - Number of questions to generate
 * @returns {Array} - Array of question objects
 */
function generateFallbackQuestions(topics, count) {
    const questions = [];
    
    const questionTemplates = [
        topic => `What is the main concept in ${topic}?`,
        topic => `Which of the following is NOT related to ${topic}?`,
        topic => `True or False: ${topic} is fundamental to understanding this course.`,
        topic => `What is the relationship between ${topic} and ${topics[Math.floor(Math.random() * topics.length)]}?`,
        topic => `Which best describes the purpose of studying ${topic}?`
    ];
    
    for (let i = 0; i < count; i++) {
        const topic = topics[i % topics.length];
        const templateIndex = i % questionTemplates.length;
        const questionFn = questionTemplates[templateIndex];
        
        if (templateIndex <= 1) {
            // Multiple choice
            questions.push({
                id: `q${i+1}`,
                question: questionFn(topic),
                questionType: 'multiple-choice',
                options: [
                    `${topic} concept 1`,
                    `${topic} concept 2`,
                    `${topic} concept 3`,
                    'None of the above'
                ],
                correctAnswer: `${topic} concept 1`,
                topic: topic,
                points: 1,
                difficulty: ['easy', 'medium', 'hard'][i % 3],
                explanation: `This relates to fundamental concepts in ${topic}.`
            });
        } else if (templateIndex === 2) {
            // True/False
            questions.push({
                id: `q${i+1}`,
                question: questionFn(topic),
                questionType: 'true-false',
                options: ['True', 'False'],
                correctAnswer: 'True',
                topic: topic,
                points: 1,
                difficulty: 'easy',
                explanation: `${topic} is indeed a core concept in this course.`
            });
        } else {
            // Short answer
            questions.push({
                id: `q${i+1}`,
                question: questionFn(topic),
                questionType: 'short-answer',
                topic: topic,
                points: 2,
                difficulty: 'medium',
                explanation: `This tests understanding of ${topic} in context.`,
                correctAnswer: `The answer should demonstrate understanding of ${topic} and its applications.`
            });
        }
    }
    
    return questions;
}

/**
 * Analyzes a syllabus document to extract key information
 * @param {string} syllabusContent - Raw text content of the syllabus
 * @param {Object} options - Analysis options
 * @returns {Object} - Structured syllabus analysis
 */
async function analyzeSyllabus(syllabusContent, options = {}) {
    try {
        console.log('Analyzing syllabus content...');
        
        if (!syllabusContent || syllabusContent.trim().length < 50) {
            throw new Error('Syllabus content is too short for meaningful analysis');
        }
        
        // Default options
        const {
            extractTopics = true,
            extractSchedule = true,
            extractPolicies = true
        } = options;
        
        // Always use transformer models - no fallback to OpenAI
        let modelPreference = options.modelPreference || 'transformer';
        
        // Build prompt for the model to extract structured information
        const prompt = `
Extract and analyze the following syllabus content:

${syllabusContent.substring(0, 8000)}

Please extract and return a JSON object with the following structure:
{
  "basicInfo": {
    "courseTitle": "",
    "courseCode": "",
    "instructorName": "",
    "term": "",
    "academicLevel": ""
  },
  "learningOutcomes": {
    "objectives": [],
    "keyTopics": [],
    "skillsGained": []
  },
  "schedule": {
    "topics": [],
    "majorAssignments": []
  },
  "assessmentStructure": {
    "gradingScale": "",
    "assessmentBreakdown": []
  },
  "policies": []
}

Focus on accurately extracting course content, learning outcomes, and assessment information.
If certain sections aren't present in the syllabus, leave them as empty arrays or empty strings.
`;

        // Use the Hugging Face model exclusively
        console.log('Using transformers model for syllabus analysis');
        const response = await transformersModel.createChatCompletion(
            'You are a helpful system for analyzing educational syllabi.',
            prompt,
            {
                temperature: 0.3,
                maxTokens: 4000,
                taskType: 'extraction',
                modelName: 'gpt2-medium' // Use gpt2-medium for syllabus analysis
            }
        );
        
        // Extract JSON from response
        let analysisResult;
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
            try {
                analysisResult = JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                console.error('Error parsing JSON from model response:', parseError);
                // If we can't parse JSON, create a basic structure
                analysisResult = generateBasicSyllabusStructure(syllabusContent);
            }
        } else {
            console.log('No JSON structure found in response, generating basic structure');
            analysisResult = generateBasicSyllabusStructure(syllabusContent);
        }
        
        // Validate and clean the analysis result
        if (!analysisResult || !analysisResult.basicInfo) {
            throw new Error('Failed to extract basic information from syllabus');
        }
        
        // Add metadata
        analysisResult.metadata = {
            analyzedAt: new Date().toISOString(),
            modelUsed: 'huggingface/gpt2-medium',
            contentLength: syllabusContent.length
        };
        
        console.log('Syllabus analysis complete');
        return analysisResult;
    } catch (error) {
        console.error('Error analyzing syllabus:', error);
        throw new Error(`Failed to analyze syllabus: ${error.message}`);
    }
}

/**
 * Generate a basic syllabus structure when JSON parsing fails
 * @param {string} syllabusContent - Raw text content of the syllabus
 * @returns {Object} - Basic syllabus analysis structure
 */
function generateBasicSyllabusStructure(syllabusContent) {
    console.log('Generating basic syllabus structure');
    
    // Try to extract some basic information from the syllabus content
    const courseMatch = syllabusContent.match(/course:?\s*([^\n]+)/i);
    const codeMatch = syllabusContent.match(/code:?\s*([^\n]+)/i);
    const instructorMatch = syllabusContent.match(/instructor:?\s*([^\n]+)/i);
    const termMatch = syllabusContent.match(/term:?\s*([^\n]+)/i);
    
    // Extract topic keywords by looking for bullet points or numbered lists
    const topics = [];
    const topicMatches = syllabusContent.match(/[-•*]\s*([^\n]+)/g) || 
                        syllabusContent.match(/\d+\.\s*([^\n]+)/g) || [];
    
    // Process up to 5 topics
    for (let i = 0; i < Math.min(topicMatches.length, 5); i++) {
        // Clean up the topic text
        const topic = topicMatches[i].replace(/[-•*\d.]\s*/, '').trim();
        if (topic && topic.length > 3) {
            topics.push(topic);
        }
    }
    
    // If we couldn't extract topics, provide some defaults
    if (topics.length === 0) {
        topics.push('Course Fundamentals');
        topics.push('Key Concepts');
        topics.push('Practical Applications');
    }
    
    // Create basic syllabus analysis structure
    return {
        basicInfo: {
            courseTitle: courseMatch ? courseMatch[1].trim() : "Untitled Course",
            courseCode: codeMatch ? codeMatch[1].trim() : "N/A",
            instructorName: instructorMatch ? instructorMatch[1].trim() : "Instructor",
            term: termMatch ? termMatch[1].trim() : "Current Term",
            academicLevel: syllabusContent.includes('graduate') ? "Graduate" : "Undergraduate"
        },
        learningOutcomes: {
            objectives: [
                "Understand core concepts of the subject",
                "Apply theoretical knowledge to practical scenarios",
                "Develop critical thinking skills related to the field"
            ],
            keyTopics: topics,
            skillsGained: [
                "Critical thinking",
                "Problem-solving",
                "Subject-specific knowledge"
            ]
        },
        schedule: {
            topics: topics.map((topic, index) => ({
                week: index + 1,
                topic: topic,
                description: `Week ${index + 1} covers ${topic}`
            })),
            majorAssignments: [
                {
                    name: "Midterm Examination",
                    dueDate: "Middle of the course",
                    weight: "30%"
                },
                {
                    name: "Final Project",
                    dueDate: "End of the course",
                    weight: "40%"
                }
            ]
        },
        assessmentStructure: {
            gradingScale: "A: 90-100%, B: 80-89%, C: 70-79%, D: 60-69%, F: Below 60%",
            assessmentBreakdown: [
                { name: "Participation", weight: "10%" },
                { name: "Assignments", weight: "20%" },
                { name: "Midterm Exam", weight: "30%" },
                { name: "Final Project", weight: "40%" }
            ]
        },
        policies: [
            "Regular attendance is expected.",
            "Late assignments may be subject to penalties.",
            "Academic integrity is taken seriously."
        ]
    };
}

/**
 * Generate a fallback syllabus analysis when all model calls fail
 * @param {string} syllabusContent - Raw text content of the syllabus
 * @returns {Object} - Basic syllabus analysis object
 */
function generateFallbackSyllabusAnalysis(syllabusContent) {
  // This is essentially the same as our generateBasicSyllabusStructure function
  // We can reuse that implementation to provide a consistent fallback
  return generateBasicSyllabusStructure(syllabusContent);
}

/**
 * Extract text from an uploaded file (PDF, DOCX, TXT)
 * @param {Object} file - Uploaded file object from multer
 * @returns {string} - Extracted text content
 */
async function extractTextFromFile(file) {
    try {
        console.log(`Extracting text from file: ${file.originalname} (${file.mimetype})`);
        
        // Simple mock implementation for demo purposes
        // In a real application, this would use libraries like pdf-parse, docx-parser, etc.
        return `This is extracted text from ${file.originalname}. 
            In a real implementation, this would contain the actual content of the uploaded file.
            The file would be parsed based on its mimetype (${file.mimetype}).
            Course: Introduction to Computer Science
            Code: CS101
            Instructor: Dr. Jane Smith
            Term: Fall 2025
            
            Learning Outcomes:
            - Understand fundamental concepts of programming
            - Apply problem-solving techniques using algorithms
            - Develop basic software applications
            
            Topics:
            1. Introduction to Programming Languages
            2. Data Structures and Algorithms
            3. Object-Oriented Programming
            4. Web Development Basics
            5. Database Management Systems
            
            Assessments:
            - Quizzes (20%)
            - Midterm Exam (30%)
            - Final Project (30%)
            - Participation (20%)`;
    } catch (error) {
        console.error('Error extracting text from file:', error);
        throw new Error(`Failed to extract text from file: ${error.message}`);
    }
}

/**
 * Get list of analyzed syllabi (mock implementation)
 * @returns {Array} - List of syllabi
 */
async function getSyllabiList() {
    // Mock implementation for demo purposes
    return [
        {
            id: 'syllabus-1',
            courseTitle: 'Introduction to Computer Science',
            courseCode: 'CS101',
            analyzedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
        },
        {
            id: 'syllabus-2',
            courseTitle: 'Advanced Programming Techniques',
            courseCode: 'CS301',
            analyzedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        }
    ];
}

/**
 * Generate assessment based on syllabus analysis
 * @param {Object} syllabusAnalysis - The analyzed syllabus data
 * @param {Object} preferences - Assessment generation preferences
 * @returns {Object} - The generated assessment
 */
async function generateAssessment(syllabusAnalysis, preferences = {}) {
    try {
        // This is a simplified implementation
        // In a real application, this would use more sophisticated generation logic
        
        // Extract key topics from syllabus analysis
        const topics = syllabusAnalysis.learningOutcomes?.keyTopics || [];
        
        // Create a basic assessment structure
        return {
            title: `${syllabusAnalysis.basicInfo?.courseTitle || 'Course'} Assessment`,
            description: `Assessment based on the course syllabus`,
            totalPoints: 100,
            timeLimit: preferences.timeLimit || 60, // minutes
            questions: generateBasicQuestions(topics, preferences),
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            generatedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error generating assessment:', error);
        throw new Error(`Failed to generate assessment: ${error.message}`);
    }
}

/**
 * Generate basic questions based on topics
 * @private
 */
function generateBasicQuestions(topics, preferences) {
    // Generate a mix of question types based on preferences
    const questions = [];
    const questionCount = preferences.questionCount || 10;
    
    for (let i = 0; i < questionCount; i++) {
        const topic = topics[i % topics.length] || `Topic ${i+1}`;
        
        if (i % 3 === 0) {
            questions.push({
                type: 'multiple-choice',
                question: `Which of the following best describes ${topic}?`,
                options: [
                    `${topic} is a fundamental concept in this field`,
                    `${topic} is an advanced technique rarely used`,
                    `${topic} is unrelated to the course material`,
                    `${topic} is only theoretical with no practical applications`
                ],
                correctAnswer: `${topic} is a fundamental concept in this field`,
                points: 10
            });
        } else if (i % 3 === 1) {
            questions.push({
                type: 'short-answer',
                question: `Briefly explain the importance of ${topic} in this course.`,
                sampleAnswer: `${topic} is important because it forms the foundation for understanding more complex concepts.`,
                points: 15
            });
        } else {
            questions.push({
                type: 'essay',
                question: `Discuss the practical applications of ${topic} and how it relates to other concepts in this course.`,
                rubric: `Excellent answers will thoroughly explain ${topic}, provide multiple practical examples, and draw connections to at least three other course concepts.`,
                points: 25
            });
        }
    }
    
    return questions;
}

// Export existing functions from the original code
module.exports = {
    generateQuickQuiz,
    analyzeSyllabus,
    extractTextFromFile,
    getSyllabiList,
    generateAssessment,
    generateFallbackSyllabusAnalysis
};