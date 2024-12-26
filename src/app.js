// src/app.js

require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");

// (Optional) Swagger dependencies
const swaggerUi = require("swagger-ui-express");
const yaml = require("yamljs");

// 1. Immediately-invoked async function to start server
(async function startServer() {
  try {
    // 2. Connect to the database
    await connectDB(); 

    // 3. Initialize the Express app
    const app = express();

    // 4. Parse incoming JSON in request bodies
    app.use(express.json());

    // 5. (Optional) Load and serve Swagger docs
    //    Create a ./src/docs/swagger.yaml or swagger.json to hold your OpenAPI spec
    //    or remove this block if you’re not using Swagger.
    try {
      const swaggerDocument = yaml.load("./src/docs/swagger.yaml");
      app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      console.log("Swagger documentation available at /docs");
    } catch (swaggerError) {
      console.warn("[Swagger] Could not load swagger.yaml: ", swaggerError.message);
    }

    // 6. Import and mount your main routes
    const routes = require("./routes");
    app.use("/", routes);

    // 7. Define the port (from .env or a default)
    const port = process.env.PORT || 3000;

    // 8. Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1); // Exit if something critical fails
  }
})();
