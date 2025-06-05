
export default async function handler(req, res) {
  try {
    const { resume, jobDescription } = req.body;

    const prompt = `Compare the following resume to the job description below. Return as JSON:\n{
  "fitPercentage": number (0–100),
  "qualifications": string[],
  "concerns": string[],
  "questions": string[]
}\n\nResume:\n${resume}\n\nJob Description:\n${jobDescription}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a hiring analyst assistant.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    const result = await response.json();
    const output = result.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(output);
    res.status(200).json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
