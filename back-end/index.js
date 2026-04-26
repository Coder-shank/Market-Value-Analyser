import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();


app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

app.post("/generate", async (req, res) => {

  const { userInput, preference } = req.body;
  if (!userInput) {
  return res.json({ result: "Skills missing" });
}

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions",
         {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b:free",
        messages: [
          {
            role: "user",
                content: `
A student has these skills: ${userInput}

User preferences:
${preference || "no specific preference"}

Tell:

1. Salary in different cities
2. Demand
3. Best roles
4. Cost of living
5. Best city and why
`
          }
        ]
      })
    });

    const data = await response.json();
    console.log("FULL RESPONSE:", data);
     
    // const aiAnswer = data.choices[0].message.content;
    if (data.choices && data.choices.length > 0) {
  const aiAnswer = data.choices[0].message.content;
  res.json({ result: aiAnswer });
} else {
  console.log("AI ERROR RESPONSE:", data);
  res.json({ result: "AI response nahi aaya", raw: data });
}
    res.json({ result: aiAnswer });
    console.log(aiAnswer)

  } catch (error) {
    console.log(error);
    res.json({ result: "Error aa gaya" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
}); 