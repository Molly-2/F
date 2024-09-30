const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Hugging Face API details
const HF_API_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';
const HF_API_KEY = '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'; // Your Hugging Face API key

// Endpoint to handle the flux prompt and return image
app.get('/flux', async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt query parameter is required" });
    }

    try {
        // Make a request to Hugging Face API
        const response = await axios.post(
            HF_API_URL,
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                },
                responseType: 'arraybuffer' // This tells Axios to handle binary data
            }
        );

        // Set appropriate headers to serve the image
        res.set('Content-Type', 'image/jpeg'); // Or 'image/png', depending on the type of image
        res.send(response.data); // Send the binary data as an image
    } catch (error) {
        console.error("Error fetching data from Hugging Face API:", error.response?.statusText || error.message);
        res.status(500).json({
            error: "An error occurred while fetching data from Hugging Face API",
            details: error.response?.data || error.message
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});