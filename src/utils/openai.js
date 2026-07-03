/**
 * OpenAI API Integration for DentVision SaaS
 * AI Assistants: Consultant, Administrator, Analyst, Marketer
 */

// IMPORTANT: Replace with your own API key or use environment variables
// Get your key at: https://platform.openai.com/api-keys
const OPENAI_API_KEY = 'sk-proj-YOUR_API_KEY_HERE_REPLACE_THIS'; 
const API_URL = 'https://api.openai.com/v1/chat/completions';

// AI Assistant Roles
const ASSISTANT_ROLES = {
  CONSULTANT: {
    name: 'Консультант',
    systemPrompt: `Вы - опытный консультант стоматологической клиники DentVision. 
Ваша задача - помогать администраторам и врачам с вопросами по работе системы, 
объяснять функции программы, давать рекомендации по улучшению сервиса.
Отвечайте профессионально, дружелюбно и подробно.`
  },
  ADMINISTRATOR: {
    name: 'Администратор',
    systemPrompt: `Вы - виртуальный администратор клиники DentVision.
Помогаете с управлением расписанием, записью пациентов, координацией работы врачей.
Можете давать советы по оптимизации рабочих процессов, управлению очередями.
Отвечайте четко, структурированно, с акцентом на практическую пользу.`
  },
  ANALYST: {
    name: 'Аналитик',
    systemPrompt: `Вы - бизнес-аналитик стоматологической клиники DentVision.
Специализируетесь на анализе данных: выручка, загрузка врачей, конверсия, LTV пациентов.
Помогаете выявлять тенденции, проблемы роста, точки оптимизации.
Отвечайте с использованием метрик, фактов, рекомендаций на основе данных.`
  },
  MARKETER: {
    name: 'Маркетолог',
    systemPrompt: `Вы - маркетолог стоматологической клиники DentVision.
Помогаете с продвижением услуг, удержанием пациентов, повышением лояльности.
Даете советы по рекламным кампаниям, акциям, коммуникации с пациентами.
Отвечайте креативно, с примерами успешных кейсов, конкретными шагами.`
  }
};

/**
 * Send message to OpenAI API
 * @param {string} role - Assistant role (CONSULTANT, ADMINISTRATOR, ANALYST, MARKETER)
 * @param {string} message - User message
 * @param {array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} AI response
 */
export async function sendMessageToAI(role, message, conversationHistory = []) {
  const assistant = ASSISTANT_ROLES[role];
  
  if (!assistant) {
    throw new Error(`Unknown assistant role: ${role}`);
  }

  const messages = [
    { role: 'system', content: assistant.systemPrompt },
    ...conversationHistory,
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from AI';
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

/**
 * Generate treatment plan explanation using AI
 * @param {object} treatmentPlan - Treatment plan data
 * @returns {Promise<string>} AI-generated explanation
 */
export async function generateTreatmentPlanExplanation(treatmentPlan) {
  const message = `
Пациенту назначен следующий план лечения:
${JSON.stringify(treatmentPlan, null, 2)}

Пожалуйста, создайте понятное объяснение для пациента:
1. Какие процедуры будут выполнены
2. Зачем нужна каждая процедура
3. Ориентировочные сроки лечения
4. Рекомендации после лечения
5. Ответьте на возможные вопросы пациента

Объясните простым языком, без сложных медицинских терминов.
`;

  return sendMessageToAI('CONSULTANT', message);
}

/**
 * Analyze clinic performance metrics
 * @param {object} metrics - Clinic metrics data
 * @returns {Promise<string>} AI analysis
 */
export async function analyzeClinicMetrics(metrics) {
  const message = `
Проанализируйте показатели стоматологической клиники:
${JSON.stringify(metrics, null, 2)}

Дайте развернутый анализ:
1. Ключевые метрики и их динамика
2. Проблемные зоны
3. Точки роста
4. Рекомендации по улучшению
5. Прогноз на следующий период
`;

  return sendMessageToAI('ANALYST', message);
}

/**
 * Generate marketing campaign ideas
 * @param {string} target - Target audience
 * @param {string} goal - Campaign goal
 * @returns {Promise<string>} AI campaign ideas
 */
export async function generateMarketingCampaign(target, goal) {
  const message = `
Разработайте маркетинговую кампанию для стоматологической клиники:
Целевая аудитория: ${target}
Цель кампании: ${goal}

Предложите:
1. Идею кампании
2. Каналы продвижения
3. Месседжи для аудитории
4. Бюджет и ожидаемый ROI
5. KPI для измерения успеха
`;

  return sendMessageToAI('MARKETER', message);
}

export { ASSISTANT_ROLES };
