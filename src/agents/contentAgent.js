// src/agents/contentAgent.js

/**
 * ContentAgent
 *
 * This agent is responsible for generating marketing content:
 * - Social media post copy (text)
 * - Optional AI-generated images (via DALL·E, Stable Diffusion, etc.)
 * - Ad copy or blog posts
 *
 * It can be triggered by the Strategy Agent, a queue job, or a user action
 * requesting new content. The agent then calls an AI service (like OpenAI GPT)
 * or a local LLM, processes the output, and returns a result that can be saved
 * to the database or posted on social platforms.
 */

// -------------------- Load Environment Variables -------------------- //

// Ensure you have a .env file at the project root with a line like:
// OPENAI_API_KEY=your-super-secret-key
//
// Do NOT commit your .env file to version control!

require("dotenv").config();

// -------------------- Imports & Configuration -------------------- //

// Example: Using the OpenAI Node.js library
// If you want to actually run this script, install it via:
//   npm install openai
//
// Your .env file should define OPENAI_API_KEY with your real key.
const { Configuration, OpenAIApi } = require("openai");

// Retrieve API key from environment
const openAiKey = process.env.OPENAI_API_KEY;
if (!openAiKey) {
  throw new Error("Missing environment variable OPENAI_API_KEY!");
}

// A logger reference (could be a real logger like Winston, Pino, etc.)
let logger = console;

/**
 * Agent initialization
 * @param {Object} config - optional configuration (logger, etc.)
 */
function init(config) {
  if (config && config.logger) {
    logger = config.logger;
  }
  logger.info("[ContentAgent] Initialized with provided configuration.");
}

// -------------------- Setup OpenAI Client -------------------- //

const configuration = new Configuration({
  apiKey: openAiKey,
});
const openai = new OpenAIApi(configuration);

// -------------------- Primary Methods -------------------- //

/**
 * Generate a piece of social media content (text-only) for a given product or topic.
 * @param {Object} options - { productName, tone, length, targetAudience, additionalContext }
 * @returns {Promise<String>} - AI-generated text snippet
 */
async function createSocialPost(options) {
  if (!options || !options.productName) {
    throw new Error("createSocialPost() requires at least a 'productName'.");
  }

  const tone = options.tone || "friendly";
  const length = options.length || "short";
  const targetAudience = options.targetAudience || "general audience";
  const additionalContext = options.additionalContext || "";

  logger.info(`[ContentAgent] Generating social post for: ${options.productName}`);

  // Construct a prompt for GPT
  const prompt = `
You are a marketing copywriter. Write a ${length} social media post about "${options.productName}"
targeting a ${targetAudience} with a ${tone} tone.
Include a clear call to action.
Additional context: ${additionalContext}
  `;

  try {
    // Call OpenAI GPT for text generation
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 100,
      temperature: 0.7,
    });

    // Extract the generated text
    const generatedText = response.data.choices[0].text.trim();
    logger.debug("[ContentAgent] Generated text:", generatedText);

    return generatedText;
  } catch (error) {
    logger.error("[ContentAgent] Error generating social post:", error);
    throw error;
  }
}

/**
 * (Optional) Generate an AI image URL from a text prompt, using DALL·E or another image model.
 * @param {String} prompt - description of the image to generate
 * @returns {Promise<String>} - URL of the generated image
 */
async function createImage(prompt) {
  if (!prompt) {
    throw new Error("createImage() requires a prompt string.");
  }

  logger.info(`[ContentAgent] Generating image for prompt: "${prompt}"`);

  try {
    // Example with OpenAI's DALL·E API:
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "512x512",
    });

    // Extract the image URL from the response
    const imageUrl = response.data.data[0].url;
    logger.debug("[ContentAgent] Generated image URL:", imageUrl);

    return imageUrl;
  } catch (error) {
    logger.error("[ContentAgent] Error generating image:", error);
    throw error;
  }
}

/**
 * Main orchestration method for more complex content tasks.
 * E.g., generating multiple posts at once, or a blog post.
 * @param {Object} plan - a marketing plan object, or details about content requirements
 * @returns {Promise<Array<Object>>} - array of content items (text, images, etc.)
 */
async function generateContentForPlan(plan) {
  try {
    logger.info("[ContentAgent] Generating content for plan...");

    const results = [];

    // Suppose plan has an array of tasks
    for (const task of plan.tasks || []) {
      if (task.type === "socialPost") {
        const textPost = await createSocialPost({
          productName: task.productName,
          tone: task.tone,
          length: task.length,
          targetAudience: task.targetAudience,
          additionalContext: task.additionalContext,
        });
        results.push({
          type: "text",
          content: textPost,
          channel: task.channel,
        });
      } else if (task.type === "image") {
        const imageUrl = await createImage(task.prompt);
        results.push({
          type: "image",
          url: imageUrl,
          channel: task.channel,
        });
      }
      // ... handle other content types
    }

    logger.info("[ContentAgent] Finished generating plan content.");
    return results;
  } catch (err) {
    logger.error("[ContentAgent] Error in generateContentForPlan:", err);
    throw err;
  }
}

// -------------------- Exported API -------------------- //

module.exports = {
  init,
  createSocialPost,
  createImage,
  generateContentForPlan,
};

// -------------------- Optional: Self-Test / Demo -------------------- //

// If you run this file directly with `node contentAgent.js`,
// we'll do a small demo of text and image generation (requires your .env).
if (require.main === module) {
  (async () => {
    // Initialize with console logger
    init({ logger: console });

    try {
      console.log("\n=== Testing createSocialPost() ===");
      const post = await createSocialPost({
        productName: "Awesome Gadget 3000",
        tone: "enthusiastic",
        length: "short",
        targetAudience: "tech-savvy millennials",
        additionalContext: "Highlight the new voice control feature.",
      });
      console.log("Generated Social Post:\n", post);

      console.log("\n=== Testing createImage() ===");
      const imagePrompt = "a futuristic gadget floating in a neon-lit room, 3D render, trending on art station";
      const imageUrl = await createImage(imagePrompt);
      console.log("Generated Image URL:\n", imageUrl);

      console.log("\n=== Testing generateContentForPlan() ===");
      const plan = {
        tasks: [
          {
            type: "socialPost",
            productName: "Eco-Friendly Water Bottle",
            tone: "inspiring",
            length: "short",
            targetAudience: "environment-conscious buyers",
            channel: "Twitter",
            additionalContext: "Focus on sustainability benefits",
          },
          {
            type: "image",
            prompt: "an artistic water bottle design made of sustainable materials, minimalist style",
            channel: "Instagram",
          }
        ]
      };
      const contentResults = await generateContentForPlan(plan);
      console.log("Generated Plan Content:\n", contentResults);

    } catch (error) {
      console.error("Error in self-test:", error);
    }
  })();
}
