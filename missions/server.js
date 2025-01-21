const express = require("express");
const path = require("path");

const app = express();
const PORT = 3002;

// Serve static files from the "assets" directory
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Serve the index.html at the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Serve the update.html at /update route
app.get("/update", (req, res) => {
    res.sendFile(path.join(__dirname, "update.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
