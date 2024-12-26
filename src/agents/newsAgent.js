// src/agents/newsAgent.js

/**
 * NewsAgent
 *
 * Responsible for fetching and filtering relevant news articles from external
 * sources (e.g., NewsAPI.org) and optionally storing them in a database.
 * This agent can be triggered by a scheduler (e.g., daily or hourly) or by
 * user action to update the system with the latest news about the company,
 * its products, competitors, or industry trends.
 */

// -------------------- Load Environment Variables -------------------- //

// Ensure you have a .env file at the project root with a line like:
// NEWS_API_KEY=your-newsapi-org-key
//
// Do NOT commit your .env file to version control!
require("dotenv").config();

// -------------------- Imports -------------------- //

// We use the `node-fetch` library (install via `npm install node-fetch`).
const fetch = require("node-fetch");

// If you plan to store news in a DB, you might have a service or model
// For demonstration, we have a placeholder "storeNewsInDB" method below.
let logger = console;

// Retrieve News API key from environment
const newsApiKey = process.env.NEWS_API_KEY;
if (!newsApiKey) {
  throw new Error("Missing environment variable NEWS_API_KEY! Please set it in your .env file.");
}

/**
 * Initialize the NewsAgent with optional config.
 * @param {Object} config - can contain logger, db references, etc.
 */
function init(config) {
  if (config && config.logger) {
    logger = config.logger;
  }
  logger.info("[NewsAgent] Initialized with provided configuration.");
}

/**
 * Fetch news articles from NewsAPI.org for the specified keywords.
 * @param {Array<String>} keywords - an array of keywords or phrases (e.g., ["YourCompany", "YourProduct"]).
 * @param {String} language - language code, e.g., "en" for English.
 * @param {Number} pageSize - how many articles to fetch at once (up to 100 max).
 * @returns {Promise<Array<Object>>} - list of news article objects.
 */
async function fetchNewsArticles(keywords, language = "en", pageSize = 5) {
  if (!keywords || !keywords.length) {
    throw new Error("[NewsAgent] No keywords specified for news search.");
  }
  logger.info(`[NewsAgent] Fetching news for keywords: ${keywords.join(", ")}`);

  try {
    // Construct the query string from the keywords array
    const query = keywords.map(k => `"${k}"`).join(" OR ");
    // For more advanced queries or multiple parameters, see NewsAPI docs:
    // https://newsapi.org/docs/endpoints/everything

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("apiKey", newsApiKey);
    url.searchParams.set("q", query);
    url.searchParams.set("language", language);
    url.searchParams.set("pageSize", pageSize.toString());
    url.searchParams.set("sortBy", "publishedAt"); // or "relevancy", "popularity"

    logger.debug("[NewsAgent] Fetch URL:", url.toString());

    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`[NewsAgent] Failed to fetch news: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json();
    if (!data.articles) {
      logger.warn("[NewsAgent] No articles found in response:", data);
      return [];
    }

    logger.info(`[NewsAgent] Retrieved ${data.articles.length} articles.`);
    return data.articles;
  } catch (err) {
    logger.error("[NewsAgent] Error fetching news articles:", err);
    throw err;
  }
}

/**
 * Filter news articles to keep only those that match your criteria,
 * e.g., exclude duplicates, check for negative sentiment, etc.
 * @param {Array<Object>} articles - array of article objects from NewsAPI.
 * @returns {Array<Object>} - filtered articles.
 */
function filterArticles(articles) {
  // Placeholder: example filters
  // 1) Remove articles without a title or URL
  const filtered = articles.filter((article) => article.title && article.url);

  // 2) Optionally remove articles from certain sources, or older than X days.
  // 3) Could run a sentiment analysis (omitted for brevity).

  logger.info(`[NewsAgent] Filtered down to ${filtered.length} articles from ${articles.length} total.`);
  return filtered;
}

/**
 * Store news articles in a database or your local model.
 * This is a placeholder function. Replace with real DB logic.
 * @param {Array<Object>} articles - array of filtered articles to store.
 */
async function storeNewsInDB(articles) {
  // In a real project, you'd insert into your MongoDB or SQL DB, e.g.:
  // await NewsModel.insertMany(articles);
  //
  // For demo, we'll just log them
  logger.info("[NewsAgent] Storing articles in the database placeholder...");
  articles.forEach((article, i) => {
    logger.info(` Article #${i+1}: ${article.title} (${article.url})`);
  });
  // Return success or the newly stored docs
  return articles;
}

/**
 * High-level orchestration for fetching, filtering, and storing news.
 * @param {Array<String>} keywords - e.g. ["MyCompany", "MyProduct"]
 */
async function updateNewsFeed(keywords) {
  try {
    logger.info("[NewsAgent] updateNewsFeed started...");
    const rawArticles = await fetchNewsArticles(keywords);
    const filtered = filterArticles(rawArticles);
    const stored = await storeNewsInDB(filtered);
    logger.info(`[NewsAgent] updateNewsFeed complete. ${stored.length} articles stored.`);
    return stored;
  } catch (error) {
    logger.error("[NewsAgent] updateNewsFeed failed:", error);
    throw error;
  }
}

// -------------------- Exported API -------------------- //

module.exports = {
  init,
  fetchNewsArticles,
  filterArticles,
  storeNewsInDB,
  updateNewsFeed,
};

// -------------------- Optional: Self-Test / Demo -------------------- //

// If you run this file directly with `node newsAgent.js`,
// we'll do a small demo of fetching and filtering articles.
if (require.main === module) {
  (async () => {
    // Initialize with console logger
    init({ logger: console });

    try {
      console.log("\n=== Testing updateNewsFeed() ===");
      // Example: fetch news about "OpenAI" or "AI technology"
      const keywords = ["OpenAI", "AI technology"];
      const result = await updateNewsFeed(keywords);
      console.log("Final stored articles:\n", result);
    } catch (error) {
      console.error("Error in self-test:", error);
    }
  })();
}
