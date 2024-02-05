const PORT = 8000;
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

// const API_KEY = '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'
const API_KEY = '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';

app.post('/completions', async (req, res) => {

  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }],
      max_tokens: 100,
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();

    // Log successful response
    // console.log("Response Status:", response.status);
    // console.log("Response Data:", data);

    res.send(data);
  } catch (error) {
    // Log error details
    console.error("Error:", error);

    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Text:", await error.response.text());
    }

    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => console.log("Server is running on PORT " + PORT));
