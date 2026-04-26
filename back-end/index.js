import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

// 🔥 Safety check
if (!API_KEY) {
  console.log("❌ API KEY MISSING");
}

// ---------------- ROUTE ----------------
app.post("/generate", async (req, res) => {

  const { userInput, preference,years   } = req.body;

  if (!userInput) {
    return res.json({ result: "Skills missing" });
  }

  try {

    // 🔥 Convert preference object → readable text
    const prefText = preference
      ? `
- Climate: ${preference.climate || "not specified"}
- Budget: ${preference.budget || "not specified"}
- Transport: ${preference.transport || "not specified"}
- Distance: ${preference.distance || "not specified"}
- City Type: ${preference.cityType || "not specified"}
- Work Mode: ${preference.workMode || "not specified"}
      `
      : "No specific preference";

    // 🔥 Better structured prompt
    const prompt = `
A student has these skills:
${userInput}

Country: India (use INR, LPA)

------------------------------
SECTION 1: MARKET ANALYSIS
------------------------------

User preferences:
${prefText}

Tell:
1. Salary range (city-wise in India)
2. Demand level
3. Best roles
4. Cost of living
5. Best city (ONLY ONE) with reason

------------------------------
SECTION 2: CAREER ROADMAP FOR MAX PACKAGE
------------------------------

IMPORTANT:
- Ignore all user preferences
- Use ONLY skills + time horizon

Time horizon: ${years || "not specified"} years

Compare:
- FAANG preparation path
- Startup → Data Engineer → Data Scientist path
- Any better alternative path

Tell:
1. Which path gives MAXIMUM money
2. Expected salary after ${years} years
3. Difficulty level of each path
4. Final BEST path (ONLY ONE)

Give clear and structured answer.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
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
              content: prompt
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("FULL RESPONSE:", data);

    // 🔥 Safe extraction
    if (data.choices && data.choices.length > 0) {
      const aiAnswer = data.choices[0].message.content;
      return res.json({ result: aiAnswer });
    } else {
      console.log("AI ERROR RESPONSE:", data);
      return res.json({
        result: "AI response nahi aaya",
        raw: data
      });
    }

  } catch (error) {
    console.log(error);
    return res.json({ result: "Error aa gaya" });
  }
});

// ---------------- SERVER ----------------
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
