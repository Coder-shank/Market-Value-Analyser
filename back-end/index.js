import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENROUTER_API_KEY;

if (!API_KEY) {
  console.log("❌ API KEY MISSING");
}

// ---------------- ROUTE ----------------
app.post("/generate", async (req, res) => {

  const { userInput, preference, years, analyzeFactors, analyzeSkills } = req.body;

  if (!userInput) {
    return res.json({ result: "Skills missing" });
  }

  try {

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

    // ==============================
    // 🔥 DYNAMIC PROMPT
    // ==============================

    let prompt = `
A student has these skills:
${userInput}

Country: India (use INR, LPA)
`;

    // -------- SECTION 1 --------
    if (!analyzeFactors && !analyzeSkills) {
    prompt += ` 
==============================
SECTION 1: MARKET ANALYSIS
==============================
User preferences:
${prefText}

- Salary in different cities
- Demand
- Best roles
- Average Salary with these skills of a fresher
- Cost of living
- Best city (ONLY ONE)
`;
    }
    // -------- SECTION 2 --------
    if (years && !analyzeFactors && !analyzeSkills) {
    prompt += `
==============================
SECTION 2: CAREER ROADMAP
==============================

Time horizon: ${years || "not specified"}

Give:
- Role growth (year-wise salary)
- Management path
- Remote path
- Startup path
- Govt / GATE / CAT / UPSC / Law

Also give FINAL recommendation (balanced, not just money)
`;
    }

    // -------- SECTION 3 --------
    if (analyzeFactors) {
  prompt += `
==============================
SECTION 3: RESUME SCORE SYSTEM (OUT OF 100)
==============================

IMPORTANT:
- Total resume score = 100 points
- Give numeric points (not salary, not vague words)
- Do NOT repeat other sections
- Be realistic based on Indian job market

Your task:
Break down resume value into POINTS.

----------------------------------------
CORE FACTORS (assign points)
----------------------------------------

1. PROJECTS
- Basic projects (copied / tutorial)
- Good real-world projects
- Advanced / production-level projects
→ How many points each type adds

2. CERTIFICATES
- Normal online certificates
- Reputed certifications (AWS, Google, etc.)
→ Points contribution

3. GATE SCORE
- Qualified (low rank)
- Good rank (top 1000)
- Top rank (IIT level)
→ Points added to resume

4. INTERNSHIPS
- Product based company
- Startup
- EdTech / training based
- Virtual internship

→ Assign points for each

5. COLLEGE BRAND
- IIT
- NIT
- Tier-3

→ Exact point difference

6. REFERRALS
→ How many points boost

7. BRANCH IMPACT
- CS vs non-CS for software role
→ Point difference

8. COMMUNICATION SKILLS
- For developer
- For non-tech roles

9. PRESENTATION / STORYTELLING
→ Which adds more points and where

----------------------------------------
FINAL OUTPUT FORMAT (VERY IMPORTANT)
----------------------------------------

Give output like:

- Projects: X / 100
- Certificates: X / 100
- GATE: X / 100
- Internships: X / 100
- College Brand: X / 100
- Referrals: X / 100
- Communication: X / 100
- Presentation: X / 100

Then:

----------------------------------------
FINAL INSIGHT
----------------------------------------

- Which 2 factors give MAX impact
- Which are overrated (low value)
- How to reach 70+ strong resume score

Be practical and brutally honest.
`;
}

    // -------- SECTION 4 (UPDATED 🔥) --------
    if (analyzeSkills) {
      prompt += `
==============================
SECTION 4: SKILL MARKET VALUE COMPARISON
==============================

IMPORTANT:
- Give REALISTIC salary ranges in INR (LPA)
- Do NOT give generic advice
- Focus on comparison
- Assume Indian job market

Compare the following 4 types of students:

----------------------------------------
TYPE 1: DEPTH WITH Average SPEED 
----------------------------------------
- Strong conceptual understanding
- Solves ~3 out of 3 DSA problems
- Can explain concepts clearly
- Average execution speed

Tell:
- Salary range (LPA)
- Type of companies
- Growth potential

----------------------------------------
TYPE 2: FAST EXECUTION + Average Skill/Knowledge
----------------------------------------
- Fast problem solving
- Strong execution
- Average knowledge and expert speed

Tell:
- Salary range (LPA)
- Advantage over Type 1
- Where they perform best

----------------------------------------
TYPE 3: HIGH DEMAND SKILL (AI / DATA)
----------------------------------------
- Works in AI / ML / Data / Cloud
- Doesn't know DSA

Tell:
- Salary range (LPA)
- Demand level
- Risk if trend changes

----------------------------------------
TYPE 4: MANY SKILLS, LOW DEPTH
----------------------------------------
- Knows MERN, SQL, Python etc.
- Cannot solve even 1 strong coding problem

Tell:
- Salary range (LPA)
- Why salary is low
- Market perception

----------------------------------------
FINAL COMPARISON
----------------------------------------

- Who earns most and why
- Who grows fastest
- Who is most stable

----------------------------------------
FINAL VERDICT
----------------------------------------

- What should a student focus on
- Depth vs Speed vs Demand (clear winner)
- Strategy to reach 15+ LPA

Be brutally honest and practical.
`;
    }

    // -------- OUTPUT RULE --------
    prompt += `
==============================
OUTPUT RULE
==============================
- ONLY answer enabled sections
- Avoid repetition
- Use structured headings
- Be practical and realistic
`;

    // ==============================
    // 🔥 API CALL
    // ==============================

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

    if (data.choices && data.choices.length > 0) {
      const aiAnswer = data.choices[0].message.content;
      return res.json({ result: aiAnswer });
    } else {
      console.log("AI ERROR RESPONSE:", data);
      return res.json({
        result: "AI response not received",
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
