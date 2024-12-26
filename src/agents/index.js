// src/agents/index.js

// Import the individual agents
const newsAgent = require("./newsAgent");
const strategyAgent = require("./strategyAgent");
const contentAgent = require("./contentAgent");
const adManagementAgent = require("./adManagementAgent");
const analyticsAgent = require("./analyticsAgent");

/**
 * Initialize or configure each agent here if needed.
 * For example, set up any shared config, pass in logger references,
 * or do other bootstrapping tasks.
 */
function initAgents(config) {
  // For instance, if each agent needs a reference to a logger or database:
  // newsAgent.init(config.logger, config.db);
  // strategyAgent.init(config.logger, config.db);
  // etc.

  // You might also schedule recurring tasks,
  // or load agent-specific memory/embeddings if your system uses them.
}

/**
 * Orchestrate interactions between agents if needed.
 * For example, if the Strategy Agent triggers the Content Agent,
 * you can define a function here that coordinates those calls.
 */
async function runAgents() {
  // Example: The Strategy Agent decides on a marketing plan
  // then tells the Content Agent to generate new posts.
  try {
    const strategyPlan = await strategyAgent.generatePlan();
    await contentAgent.createContentForPlan(strategyPlan);
    // Ad Management Agent might launch or update campaigns
    await adManagementAgent.updateCampaigns(strategyPlan);
  } catch (err) {
    console.error("Error in runAgents:", err);
  }
}

// Export the individual agents as well as any orchestrator functions
module.exports = {
  newsAgent,
  strategyAgent,
  contentAgent,
  adManagementAgent,
  analyticsAgent,
  initAgents,
  runAgents
};
