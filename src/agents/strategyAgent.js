// src/agents/strategyAgent.js

/**
 * StrategyAgent
 *
 * This agent is responsible for creating or updating a marketing strategy/plan
 * based on campaign goals, performance data, brand guidelines, and possibly
 * external data (e.g., analytics, news). It can:
 *  - Generate a high-level marketing plan (what channels to use, how many posts, etc.)
 *  - Suggest tasks for each channel (social posts, ads, email campaigns, etc.)
 *  - Adjust strategy based on performance or budgets over time.
 */

// -------------------- Load Environment Variables -------------------- //

require("dotenv").config(); // If you want to use .env for any config

// -------------------- Imports -------------------- //

// Example: using the OpenAI Node.js library for LLM-based strategic recommendations.
//   npm install openai
const { Configuration, OpenAIApi } = require("openai");

// A logger reference (could be a real logger like Winston, Pino, etc.)
let logger = console;

// Retrieve OpenAI key from environment if you plan to use it
const openAiKey = process.env.OPENAI_API_KEY || null;

// If available, create an OpenAI client
let openai = null;
if (openAiKey) {
  const configuration = new Configuration({ apiKey: openAiKey });
  openai = new OpenAIApi(configuration);
  logger.info("[StrategyAgent] OpenAI integration enabled.");
} else {
  logger.warn("[StrategyAgent] No OPENAI_API_KEY found. Running in local logic mode.");
}

// -------------------- StrategyAgent Initialization -------------------- //

/**
 * Initialize the Strategy Agent with optional config.
 * @param {Object} config - { logger, db, otherSettings }
 */
function init(config) {
  if (config && config.logger) {
    logger = config.logger;
  }
  logger.info("[StrategyAgent] Initialized with provided configuration.");
}

// -------------------- Primary Methods -------------------- //

/**
 * Create a high-level marketing plan given campaign objectives, budget, timeline, etc.
 * Optionally uses AI to refine the strategy. 
 * @param {Object} campaignInputs - { objective, budget, timeline, brandGuidelines, targetAudience, channels }
 * @returns {Promise<Object>} - a plan object with tasks
 */
async function generatePlan(campaignInputs) {
  // Basic validation
  if (!campaignInputs || !campaignInputs.objective || !campaignInputs.budget) {
    throw new Error("[StrategyAgent] Missing essential campaignInputs like 'objective' or 'budget'.");
  }

  logger.info("[StrategyAgent] Generating marketing plan...");

  const {
    objective,
    budget,
    timeline,
    brandGuidelines,
    targetAudience,
    channels,
  } = campaignInputs;

  // If we have OpenAI configured, let’s do a quick prompt to get strategic suggestions
  // Otherwise, we’ll default to a local fallback logic.
  if (openai) {
    // Build a prompt for AI
    const prompt = buildAiPrompt({
      objective,
      budget,
      timeline,
      brandGuidelines,
      targetAudience,
      channels,
    });

    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        max_tokens: 300,
        temperature: 0.7,
      });
      const textStrategy = response.data.choices[0].text.trim();
      logger.debug("[StrategyAgent] AI Plan Output:", textStrategy);

      // Convert the AI text into a structured plan (we’ll parse it or just attach it)
      // Here, we do a simple “extract tasks” approach.
      const plan = parsePlanFromText(textStrategy);
      return plan;
    } catch (error) {
      logger.error("[StrategyAgent] Error calling OpenAI:", error);
      return fallbackLocalPlan(campaignInputs);
    }
  } else {
    // Local fallback logic
    logger.info("[StrategyAgent] OpenAI is not configured. Using local fallback plan.");
    return fallbackLocalPlan(campaignInputs);
  }
}

/**
 * Example prompt builder for the AI-based strategy generation.
 * @param {Object} data
 */
function buildAiPrompt(data) {
  const { objective, budget, timeline, brandGuidelines, targetAudience, channels } = data;

  return `
You are a marketing strategist. Given the following inputs, create a structured marketing plan:

Objective: ${objective}
Budget: $${budget.total} total, with a daily cap of $${budget.dailyCap || "N/A"}.
Timeline: from ${timeline?.start || "TBD"} to ${timeline?.end || "TBD"}.
Brand Guidelines: ${brandGuidelines?.toneOfVoice || "friendly tone"}, 
Target Audience: ${targetAudience || "general consumers"},
Channels: ${channels?.join(", ") || "unspecified"},

Output a clear marketing plan with recommended tasks, channel usage, 
posting frequency, ad budgets, and any crucial remarks.
Each task should have:
 - name
 - channel
 - suggested budget or due date if applicable
 - short description
`;
}

/**
 * Simple function to parse tasks from the AI output text.
 * Here, we do a naive approach. In production, you’d want a more robust parser or a JSON format.
 * @param {String} text
 * @returns {Object} structured plan
 */
function parsePlanFromText(text) {
  // We'll build a simplistic approach:
  // 1) Look for lines that contain "Task:" or bullet points
  // 2) Convert them into an array of tasks
  // This is purely illustrative, adapt to your needs.

  const lines = text.split("\n");
  const tasks = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().startsWith("task:") || trimmed.startsWith("- ")) {
      tasks.push({
        name: trimmed.replace(/task:|-/i, "").trim(),
        channel: "Unknown", // For demonstration, we’ll fill defaults
        suggestedBudget: "TBD",
        description: trimmed, // store the raw line
      });
    }
  });

  // Return a plan object
  return {
    strategySummary: text,
    tasks,
  };
}

/**
 * Local fallback plan generator if AI isn’t configured or fails.
 * @param {Object} inputs 
 * @returns {Object} plan
 */
function fallbackLocalPlan(inputs) {
  logger.info("[StrategyAgent] Using fallback local plan logic.");
  // Example, for a brand awareness objective:
  const sampleTasks = [
    {
      name: "Create 3 Social Posts per week",
      channel: "Facebook & Instagram",
      suggestedBudget: `$${inputs.budget.dailyCap || "N/A"} daily for ads`,
      description: "Short, engaging copy focusing on brand story and visuals.",
    },
    {
      name: "Launch Google Ads Campaign",
      channel: "Google Ads",
      suggestedBudget: `$${inputs.budget.total * 0.4} overall`,
      description: "Focus on relevant keywords, brand searches, and competitor terms.",
    },
  ];

  return {
    strategySummary: "Local fallback strategy for brand awareness with multi-channel approach.",
    tasks: sampleTasks,
  };
}

// -------------------- Exported API -------------------- //

module.exports = {
  init,
  generatePlan,
};

// -------------------- Optional: Self-Test / Demo -------------------- //

// If you run this file directly with `node strategyAgent.js`, we do a small demo.
if (require.main === module) {
  (async () => {
    // Initialize with console logger
    init({ logger: console });

    // Demo input
    const campaignInputs = {
      objective: "Increase brand awareness and generate leads",
      budget: {
        total: 5000,
        dailyCap: 200,
      },
      timeline: {
        start: "2023-07-01",
        end: "2023-09-01",
      },
      brandGuidelines: {
        toneOfVoice: "professional but approachable",
      },
      targetAudience: "small business owners in the tech industry",
      channels: ["Facebook", "Instagram", "Google Ads", "LinkedIn"],
    };

    try {
      console.log("\n=== Generating Plan ===");
      const plan = await generatePlan(campaignInputs);
      console.log("Generated Plan:", JSON.stringify(plan, null, 2));
    } catch (err) {
      console.error("Error in self-test:", err);
    }
  })();
}
