const axios = require('axios');
require('dotenv').config();

/**
 * Adaptive Learning Engine AI Service
 * 
 * This service personalizes the learning experience based on student performance by:
 * 1. Analyzing student performance data and identifying knowledge gaps
 * 2. Recommending personalized learning resources
 * 3. Adjusting difficulty levels dynamically
 * 4. Creating custom learning paths
 * 5. Predicting topics where a student may struggle
 */
class AdaptiveLearningEngine {
  constructor() {
    this.openai = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Configuration parameters
    this.difficultyLevels = ['beginner', 'intermediate', 'advanced', 'expert'];
    this.adaptationThreshold = 0.7; // Score threshold for advancing difficulty
    this.struggleThreshold = 0.5; // Score threshold for identifying struggle areas
  }

  /**
   * Main method to generate personalized learning recommendations
   * 
   * @param {Object} student - Student profile and performance history
   * @param {Array} courses - Available courses and materials
   * @param {Object} currentProgress - Current course progress
   * @returns {Object} Personalized learning recommendations
   */
  async generateRecommendations(student, courses, currentProgress) {
    try {
      console.log(`Generating recommendations for student: ${student.id}`);
      
      // Analyze student performance and identify knowledge gaps
      const performanceAnalysis = await this.analyzePerformance(student.assessmentHistory);
      
      // Generate personalized recommendations based on performance
      const recommendations = {
        nextTopics: await this._recommendNextTopics(performanceAnalysis, currentProgress, courses),
        resourceRecommendations: await this._recommendResources(performanceAnalysis, courses),
        practiceSuggestions: this._suggestPracticeActivities(performanceAnalysis, courses),
        adjustedDifficulty: this._adjustDifficultyLevel(performanceAnalysis, currentProgress),
        predictedStruggleAreas: await this._predictStruggleAreas(student, currentProgress, courses)
      };
      
      return recommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Provide basic recommendations if AI recommendation fails
      return this._getDefaultRecommendations(currentProgress, courses);
    }
  }

  /**
   * Analyzes student assessment history to identify strengths and weaknesses
   * 
   * @param {Array} assessmentHistory - Student's past assessment results
   * @returns {Object} Performance analysis
   */
  async analyzePerformance(assessmentHistory) {
    try {
      if (!assessmentHistory || assessmentHistory.length === 0) {
        return {
          strengths: [],
          weaknesses: [],
          knowledgeGaps: [],
          masteredTopics: [],
          averageScores: {},
          learningTrends: []
        };
      }
      
      // Group assessments by topic
      const topicAssessments = {};
      assessmentHistory.forEach(assessment => {
        if (!assessment.topic) return;
        
        if (!topicAssessments[assessment.topic]) {
          topicAssessments[assessment.topic] = [];
        }
        topicAssessments[assessment.topic].push(assessment);
      });
      
      // Calculate average scores by topic
      const averageScores = {};
      const strengths = [];
      const weaknesses = [];
      const masteredTopics = [];
      const knowledgeGaps = [];
      
      for (const [topic, assessments] of Object.entries(topicAssessments)) {
        const scores = assessments.map(a => a.score);
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        averageScores[topic] = avgScore;
        
        // Identify strengths and weaknesses
        if (avgScore >= 85) {
          strengths.push(topic);
          if (avgScore >= 90) {
            masteredTopics.push(topic);
          }
        } else if (avgScore <= this.struggleThreshold * 100) {
          weaknesses.push(topic);
          knowledgeGaps.push({
            topic,
            score: avgScore,
            assessmentIds: assessments.map(a => a.id)
          });
        }
      }
      
      // Analyze learning trends over time (improvement or decline)
      const learningTrends = this._analyzeLearningTrends(assessmentHistory);
      
      return {
        strengths,
        weaknesses,
        knowledgeGaps,
        masteredTopics,
        averageScores,
        learningTrends
      };
    } catch (error) {
      console.error('Error analyzing performance:', error);
      return {
        strengths: [],
        weaknesses: [],
        knowledgeGaps: [],
        masteredTopics: [],
        averageScores: {},
        learningTrends: []
      };
    }
  }

  /**
   * Recommends next topics based on student performance
   * @private
   */
  async _recommendNextTopics(performanceAnalysis, currentProgress, courses) {
    try {
      // If we have no current progress, recommend starting courses
      if (!currentProgress || !currentProgress.currentTopic) {
        return this._getStartingTopics(courses, 3);
      }
      
      const currentTopic = currentProgress.currentTopic;
      const currentCourse = courses.find(c => c.id === currentProgress.courseId);
      
      if (!currentCourse) {
        return this._getStartingTopics(courses, 3);
      }
      
      // Get completed topics
      const completedTopics = currentProgress.completedTopics || [];
      
      // Find next logical topics in the curriculum
      const nextLogicalTopics = this._findNextLogicalTopics(
        currentCourse, 
        currentTopic, 
        completedTopics
      );
      
      // Check if student has knowledge gaps that should be addressed first
      const gapTopics = performanceAnalysis.knowledgeGaps
        .filter(gap => !completedTopics.includes(gap.topic))
        .slice(0, 2)
        .map(gap => ({
          topicId: gap.topic,
          reason: `This addresses a knowledge gap where you scored ${Math.round(gap.score)}%`,
          priority: 'high',
          type: 'remedial'
        }));
      
      // Combine logical progression with gap-filling
      const recommendations = [...gapTopics, ...nextLogicalTopics].slice(0, 5);
      
      // If we have limited recommendations, add some exploration topics
      if (recommendations.length < 3) {
        const explorationTopics = await this._suggestExplorationTopics(
          performanceAnalysis.strengths,
          completedTopics,
          courses
        );
        
        recommendations.push(...explorationTopics);
      }
      
      return recommendations.slice(0, 5); // Return top 5 recommendations
    } catch (error) {
      console.error('Error recommending next topics:', error);
      // Return some default suggestions based on current progress
      return this._getDefaultNextTopics(currentProgress, courses);
    }
  }

  /**
   * Recommends learning resources based on performance analysis
   * @private
   */
  async _recommendResources(performanceAnalysis, courses) {
    try {
      const recommendations = [];
      
      // Recommend resources for knowledge gaps (high priority)
      for (const gap of performanceAnalysis.knowledgeGaps.slice(0, 3)) {
        const course = courses.find(c => 
          c.topics && c.topics.some(t => t.id === gap.topic)
        );
        
        if (course) {
          const topic = course.topics.find(t => t.id === gap.topic);
          
          if (topic && topic.resources) {
            // Find resources appropriate for this gap
            const suitableResources = topic.resources
              .filter(r => r.difficulty === 'beginner' || r.difficulty === 'intermediate')
              .slice(0, 2);
              
            recommendations.push(...suitableResources.map(r => ({
              ...r,
              reason: `This will help strengthen your understanding of ${topic.title}`,
              topicId: gap.topic,
              priority: 'high'
            })));
          }
        }
      }
      
      // Recommend advanced resources for mastered topics (for deepening knowledge)
      for (const masteredTopic of performanceAnalysis.masteredTopics.slice(0, 2)) {
        const course = courses.find(c => 
          c.topics && c.topics.some(t => t.id === masteredTopic)
        );
        
        if (course) {
          const topic = course.topics.find(t => t.id === masteredTopic);
          
          if (topic && topic.resources) {
            // Find advanced resources
            const advancedResources = topic.resources
              .filter(r => r.difficulty === 'advanced' || r.difficulty === 'expert')
              .slice(0, 1);
              
            recommendations.push(...advancedResources.map(r => ({
              ...r,
              reason: `This will deepen your expertise in ${topic.title}`,
              topicId: masteredTopic,
              priority: 'medium'
            })));
          }
        }
      }
      
      // If we don't have enough recommendations, add some general resources
      if (recommendations.length < 5) {
        // Find some general interest resources
        const generalRecommendations = this._findGeneralResources(
          courses, 
          5 - recommendations.length
        );
        
        recommendations.push(...generalRecommendations);
      }
      
      return recommendations.slice(0, 7); // Return top 7 resources
    } catch (error) {
      console.error('Error recommending resources:', error);
      return [];
    }
  }

  /**
   * Suggests practice activities to strengthen weak areas
   * @private
   */
  _suggestPracticeActivities(performanceAnalysis, courses) {
    try {
      const practiceActivities = [];
      
      // Focus on knowledge gaps for practice
      for (const gap of performanceAnalysis.knowledgeGaps.slice(0, 4)) {
        const course = courses.find(c => 
          c.topics && c.topics.some(t => t.id === gap.topic)
        );
        
        if (course) {
          const topic = course.topics.find(t => t.id === gap.topic);
          
          if (topic) {
            // Suggest quizzes for this topic
            if (topic.quizzes && topic.quizzes.length > 0) {
              practiceActivities.push({
                type: 'quiz',
                activityId: topic.quizzes[0].id,
                topic: gap.topic,
                title: `Practice Quiz: ${topic.title}`,
                reason: `This will help strengthen your understanding in an area where you scored ${Math.round(gap.score)}%`,
                priority: 'high'
              });
            }
            
            // Suggest exercises for this topic
            if (topic.exercises && topic.exercises.length > 0) {
              practiceActivities.push({
                type: 'exercise',
                activityId: topic.exercises[0].id,
                topic: gap.topic,
                title: `Practice Exercise: ${topic.title}`,
                reason: `Hands-on practice will reinforce concepts in ${topic.title}`,
                priority: 'high'
              });
            }
          }
        }
      }
      
      // Add variety with some activities from strengths (lower priority)
      for (const strength of performanceAnalysis.strengths.slice(0, 2)) {
        const course = courses.find(c => 
          c.topics && c.topics.some(t => t.id === strength)
        );
        
        if (course) {
          const topic = course.topics.find(t => t.id === strength);
          
          if (topic && topic.advancedExercises && topic.advancedExercises.length > 0) {
            practiceActivities.push({
              type: 'advanced_exercise',
              activityId: topic.advancedExercises[0].id,
              topic: strength,
              title: `Advanced Exercise: ${topic.title}`,
              reason: 'This will push your skills in an area where you show strength',
              priority: 'medium'
            });
          }
        }
      }
      
      return practiceActivities.slice(0, 5); // Return top 5 activities
    } catch (error) {
      console.error('Error suggesting practice activities:', error);
      return [];
    }
  }

  /**
   * Dynamically adjusts difficulty level based on performance
   * @private
   */
  _adjustDifficultyLevel(performanceAnalysis, currentProgress) {
    try {
      const currentDifficulty = currentProgress.currentDifficulty || 'beginner';
      const currentDifficultyIndex = this.difficultyLevels.indexOf(currentDifficulty);
      
      // Calculate average recent performance
      const recentAssessments = performanceAnalysis.learningTrends
        .slice(-5) // Last 5 assessments
        .filter(trend => trend.type === 'assessment');
        
      if (recentAssessments.length === 0) {
        return { level: currentDifficulty, change: 'maintain', reason: 'Not enough assessment data' };
      }
      
      const avgRecentScore = recentAssessments.reduce(
        (sum, assessment) => sum + assessment.score, 0
      ) / recentAssessments.length;
      
      // Logic for adjusting difficulty
      if (avgRecentScore >= this.adaptationThreshold * 100) {
        // Student is performing well, consider increasing difficulty
        if (currentDifficultyIndex < this.difficultyLevels.length - 1) {
          const newDifficulty = this.difficultyLevels[currentDifficultyIndex + 1];
          return {
            level: newDifficulty,
            change: 'increase',
            reason: `Consistent strong performance (${Math.round(avgRecentScore)}% average) indicates readiness for more challenge`
          };
        } else {
          return {
            level: currentDifficulty,
            change: 'maintain',
            reason: 'Already at maximum difficulty level with strong performance'
          };
        }
      } else if (avgRecentScore < this.struggleThreshold * 100) {
        // Student is struggling, consider decreasing difficulty
        if (currentDifficultyIndex > 0) {
          const newDifficulty = this.difficultyLevels[currentDifficultyIndex - 1];
          return {
            level: newDifficulty,
            change: 'decrease',
            reason: `Recent performance (${Math.round(avgRecentScore)}% average) suggests current level may be too challenging`
          };
        } else {
          return {
            level: currentDifficulty,
            change: 'maintain',
            reason: 'Already at minimum difficulty level, providing additional support'
          };
        }
      } else {
        // Performance is acceptable at current level
        return {
          level: currentDifficulty,
          change: 'maintain',
          reason: `Current performance (${Math.round(avgRecentScore)}% average) is appropriate for this level`
        };
      }
    } catch (error) {
      console.error('Error adjusting difficulty:', error);
      return { 
        level: currentProgress.currentDifficulty || 'beginner',
        change: 'maintain',
        reason: 'Unable to calculate optimal difficulty adjustment'
      };
    }
  }

  /**
   * Predicts areas where student may struggle in upcoming topics
   * @private
   */
  async _predictStruggleAreas(student, currentProgress, courses) {
    try {
      if (!currentProgress || !currentProgress.currentTopic || !currentProgress.courseId) {
        return [];
      }
      
      const currentCourse = courses.find(c => c.id === currentProgress.courseId);
      if (!currentCourse) return [];
      
      // Get next topics in the curriculum
      const currentTopicIndex = currentCourse.topics.findIndex(
        t => t.id === currentProgress.currentTopic
      );
      
      if (currentTopicIndex === -1) return [];
      
      // Look at next 3 topics in sequence
      const upcomingTopics = currentCourse.topics
        .slice(currentTopicIndex + 1, currentTopicIndex + 4);
      
      if (upcomingTopics.length === 0) return [];
      
      // For each upcoming topic, determine if prerequisites are weak areas
      const struggePredictions = [];
      
      for (const topic of upcomingTopics) {
        if (!topic.prerequisites) continue;
        
        // Check if any prerequisites are weak areas
        const weakPrerequisites = topic.prerequisites.filter(prereq => 
          student.assessmentHistory.some(a => 
            a.topic === prereq && a.score < this.struggleThreshold * 100
          )
        );
        
        if (weakPrerequisites.length > 0) {
          struggePredictions.push({
            topicId: topic.id,
            title: topic.title,
            confidence: weakPrerequisites.length / topic.prerequisites.length,
            reason: `Based on difficulty with prerequisites: ${weakPrerequisites.join(', ')}`,
            recommendedPreparation: this._getPreparationForTopic(topic, courses)
          });
        }
      }
      
      // If we don't have enough from prerequisite analysis, use the AI to predict
      if (struggePredictions.length < 2 && student.assessmentHistory.length > 0) {
        const aiPredictions = await this._getAIPredictedStruggles(
          student.assessmentHistory,
          upcomingTopics
        );
        
        // Merge AI predictions but avoid duplicates
        const existingIds = struggePredictions.map(p => p.topicId);
        const newPredictions = aiPredictions.filter(p => !existingIds.includes(p.topicId));
        
        struggePredictions.push(...newPredictions);
      }
      
      return struggePredictions.slice(0, 3);
    } catch (error) {
      console.error('Error predicting struggle areas:', error);
      return [];
    }
  }

  /**
   * Uses the AI to predict potential struggle areas
   * @private
   */
  async _getAIPredictedStruggles(assessmentHistory, upcomingTopics) {
    try {
      // Prepare assessment history for the prompt
      const assessmentSummary = assessmentHistory
        .map(a => `Topic: ${a.topic}, Score: ${a.score}%, Date: ${new Date(a.date).toLocaleDateString()}`)
        .join('\n');
      
      // Prepare upcoming topics for the prompt
      const topicSummary = upcomingTopics
        .map(topic => `Topic ID: ${topic.id}, Title: ${topic.title}, Key Concepts: ${topic.keyConcepts?.join(', ') || 'N/A'}`)
        .join('\n');
      
      const prompt = `
As an adaptive learning specialist, predict which upcoming topics a student might struggle with based on their past performance.

STUDENT ASSESSMENT HISTORY:
${assessmentSummary}

UPCOMING TOPICS:
${topicSummary}

Based on the student's performance patterns, predict which of the upcoming topics they might struggle with.
For each predicted struggle area, explain your reasoning and suggest preparation activities.

Return your predictions as a JSON array with this structure:
[
  {
    "topicId": "topic-id",
    "title": "Topic Title",
    "confidence": 0.85,  // number between 0 and 1
    "reason": "Explanation of why you predict struggle in this area",
    "recommendedPreparation": ["specific preparation activity 1", "activity 2"]
  }
]

Limit your predictions to the top 2 most likely struggle areas.`;

      const response = await this.openai.post('/chat/completions', {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an adaptive learning specialist analyzing student performance data." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800
      });

      // Parse the response
      const content = response.data.choices[0].message.content;
      const jsonStartIndex = content.indexOf('[');
      const jsonEndIndex = content.lastIndexOf(']') + 1;
      
      if (jsonStartIndex >= 0 && jsonEndIndex > 0) {
        return JSON.parse(content.substring(jsonStartIndex, jsonEndIndex));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error getting AI predicted struggles:', error);
      return [];
    }
  }

  /**
   * Analyzes learning trends over time
   * @private
   */
  _analyzeLearningTrends(assessmentHistory) {
    try {
      if (!assessmentHistory || assessmentHistory.length < 2) {
        return [];
      }
      
      // Sort by date
      const sortedHistory = [...assessmentHistory]
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const trends = [];
      
      // Calculate improvement/decline between consecutive assessments on same topic
      const topicGroups = {};
      
      sortedHistory.forEach(assessment => {
        if (!assessment.topic) return;
        
        if (!topicGroups[assessment.topic]) {
          topicGroups[assessment.topic] = [];
        }
        
        topicGroups[assessment.topic].push({
          date: assessment.date,
          score: assessment.score,
          id: assessment.id,
          type: 'assessment'
        });
      });
      
      // Analyze improvement within topics
      Object.entries(topicGroups).forEach(([topic, assessments]) => {
        if (assessments.length < 2) return;
        
        for (let i = 1; i < assessments.length; i++) {
          const scoreDiff = assessments[i].score - assessments[i-1].score;
          const daysDiff = (new Date(assessments[i].date) - new Date(assessments[i-1].date)) / (1000 * 60 * 60 * 24);
          
          trends.push({
            topic,
            type: 'trend',
            scoreDiff,
            daysBetween: Math.round(daysDiff),
            improvement: scoreDiff > 0,
            startDate: assessments[i-1].date,
            endDate: assessments[i].date,
            startScore: assessments[i-1].score,
            endScore: assessments[i].score
          });
        }
        
        // Add latest assessment for each topic
        trends.push(assessments[assessments.length - 1]);
      });
      
      return trends.sort((a, b) => 
        a.type === 'trend' 
          ? new Date(a.endDate) - new Date(b.endDate)
          : new Date(a.date) - new Date(b.date)
      );
    } catch (error) {
      console.error('Error analyzing learning trends:', error);
      return [];
    }
  }

  /**
   * Find next logical topics in the curriculum
   * @private
   */
  _findNextLogicalTopics(course, currentTopicId, completedTopics) {
    try {
      if (!course.topics) return [];
      
      // Find current topic index
      const currentIndex = course.topics.findIndex(t => t.id === currentTopicId);
      if (currentIndex === -1) return [];
      
      // Get next sequential topics that haven't been completed
      const nextTopics = course.topics
        .slice(currentIndex + 1)
        .filter(topic => !completedTopics.includes(topic.id))
        .map((topic, index) => ({
          topicId: topic.id,
          reason: index === 0 
            ? 'This is the next topic in your learning sequence' 
            : 'This follows your current learning progression',
          priority: index === 0 ? 'high' : 'medium',
          type: 'sequential'
        }))
        .slice(0, 3);
      
      return nextTopics;
    } catch (error) {
      console.error('Error finding next logical topics:', error);
      return [];
    }
  }

  /**
   * Suggest exploration topics based on strengths
   * @private
   */
  async _suggestExplorationTopics(strengths, completedTopics, courses) {
    try {
      // If no strengths, return empty
      if (!strengths || strengths.length === 0) return [];
      
      const relatedTopics = [];
      
      // Find topics that are related to areas of strength
      strengths.forEach(strengthTopic => {
        courses.forEach(course => {
          if (!course.topics) return;
          
          course.topics.forEach(topic => {
            // Skip completed topics
            if (completedTopics.includes(topic.id)) return;
            
            // If topic is related to strength but not the strength itself
            if (topic.id !== strengthTopic && 
                topic.relatedTopics && 
                topic.relatedTopics.includes(strengthTopic)) {
              
              relatedTopics.push({
                topicId: topic.id,
                reason: `This builds on your strength in ${strengthTopic}`,
                priority: 'medium',
                type: 'exploration'
              });
            }
          });
        });
      });
      
      // Return random selection of exploration topics
      return this._shuffleArray(relatedTopics).slice(0, 2);
    } catch (error) {
      console.error('Error suggesting exploration topics:', error);
      return [];
    }
  }

  /**
   * Get default recommendations when API fails
   * @private
   */
  _getDefaultRecommendations(currentProgress, courses) {
    return {
      nextTopics: this._getDefaultNextTopics(currentProgress, courses),
      resourceRecommendations: [],
      practiceSuggestions: [],
      adjustedDifficulty: {
        level: currentProgress?.currentDifficulty || 'beginner',
        change: 'maintain',
        reason: 'Continuing at current level'
      },
      predictedStruggleAreas: []
    };
  }

  /**
   * Get default next topics based on current progress
   * @private
   */
  _getDefaultNextTopics(currentProgress, courses) {
    // If no current progress, recommend starting with first course
    if (!currentProgress || !currentProgress.courseId) {
      return this._getStartingTopics(courses, 3);
    }
    
    // Find the current course
    const currentCourse = courses.find(c => c.id === currentProgress.courseId);
    if (!currentCourse || !currentCourse.topics) {
      return this._getStartingTopics(courses, 3);
    }
    
    // If we have a current topic, find the next topics in sequence
    if (currentProgress.currentTopic) {
      const currentTopicIndex = currentCourse.topics.findIndex(
        t => t.id === currentProgress.currentTopic
      );
      
      if (currentTopicIndex !== -1 && currentTopicIndex < currentCourse.topics.length - 1) {
        // Get next 3 topics in sequence
        return currentCourse.topics
          .slice(currentTopicIndex + 1, currentTopicIndex + 4)
          .map((topic, index) => ({
            topicId: topic.id,
            reason: index === 0 
              ? 'Next topic in sequence' 
              : 'Upcoming topic in your current course',
            priority: index === 0 ? 'high' : 'medium',
            type: 'sequential'
          }));
      }
    }
    
    // If no current topic or at end of course, suggest starting topics
    return this._getStartingTopics(courses, 3);
  }

  /**
   * Get starting topics for new students
   * @private
   */
  _getStartingTopics(courses, count) {
    // Find beginner-friendly courses
    const beginnerCourses = courses
      .filter(c => c.difficulty === 'beginner' && c.topics && c.topics.length > 0)
      .slice(0, 2);
      
    if (beginnerCourses.length === 0 && courses.length > 0) {
      // If no beginner courses, use any available courses
      beginnerCourses.push(courses[0]);
    }
    
    // Get first topic from each course
    const startingTopics = beginnerCourses.flatMap(course => 
      course.topics.slice(0, 2).map((topic, index) => ({
        topicId: topic.id,
        reason: index === 0 
          ? `Recommended starting point for ${course.title}` 
          : `Early topic in the ${course.title} course`,
        priority: index === 0 ? 'high' : 'medium',
        type: 'starting'
      }))
    );
    
    return startingTopics.slice(0, count);
  }

  /**
   * Find general resources across courses
   * @private
   */
  _findGeneralResources(courses, count) {
    const allResources = [];
    
    // Collect resources from all courses
    courses.forEach(course => {
      if (!course.topics) return;
      
      course.topics.forEach(topic => {
        if (!topic.resources) return;
        
        // Add some topic resources
        topic.resources.forEach(resource => {
          allResources.push({
            ...resource,
            reason: `Additional resource for ${topic.title}`,
            topicId: topic.id,
            priority: 'low'
          });
        });
      });
    });
    
    // Shuffle and return limited number
    return this._shuffleArray(allResources).slice(0, count);
  }

  /**
   * Get preparation activities for a topic
   * @private
   */
  _getPreparationForTopic(topic, courses) {
    const preparation = [];
    
    // If topic has prerequisites, find resources for them
    if (topic.prerequisites && topic.prerequisites.length > 0) {
      topic.prerequisites.forEach(prereqId => {
        // Find the prerequisite topic
        let prereqTopic = null;
        courses.some(course => {
          if (!course.topics) return false;
          
          const found = course.topics.find(t => t.id === prereqId);
          if (found) {
            prereqTopic = found;
            return true;
          }
          return false;
        });
        
        if (prereqTopic) {
          preparation.push(`Review the fundamentals of ${prereqTopic.title}`);
          
          // Add specific resource if available
          if (prereqTopic.resources && prereqTopic.resources.length > 0) {
            const resource = prereqTopic.resources[0];
            preparation.push(`Complete the "${resource.title}" resource`);
          }
        }
      });
    }
    
    // Add general preparation advice
    preparation.push(`Complete practice exercises on ${topic.keyConcepts?.[0] || 'key concepts'}`);
    
    return preparation;
  }

  /**
   * Helper method to shuffle an array
   * @private
   */
  _shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }
}

module.exports = new AdaptiveLearningEngine();