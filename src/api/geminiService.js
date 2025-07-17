import COURSES from "../data/courses";

/**

 * @param {object} job
 * @returns {Promise<Array<string>>} 
 */
export const getCourseRecommendationsForJob = async (job) => {
  if (!job || !job.title || !job.description) {
    console.error(
      "Invalid job object provided to AI service. Cannot get recommendations."
    );
    return [];
  }
  const courseInfoForAI = COURSES.map((course) => ({
    id: course.id,
    title: course.title,
    keywords: course.keywords.join(", "),
  }));

  const promptTemplate = `
    You are an expert career counselor for an academy academy focuing on back office support for remote roles. Your task is to analyze the following job description
    and recommend up to 3 of the most relevant courses from the provided list.

    Available Courses (use these exact IDs):
    ${JSON.stringify(courseInfoForAI, null, 2)}

    Job Description:
    "Title: ${job.title}. Details: ${job.description}"
    Based on the skills and responsibilities mentioned, identify the most relevant courses.
    Respond with ONLY a valid JSON array of the course IDs. For example: ["executive-assistant-mastery", "cybersecurity-fundamentals"].
    If no courses from the list are a strong match, return an empty array [].
  `;

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    console.error(
      "Gemini API key is missing. Please add REACT_APP_GEMINI_API_KEY to your .env file."
    );
    throw new Error("API key is not configured.");
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ role: "user", parts: [{ text: promptTemplate }] }],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `API call failed with status: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();

    const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("Invalid AI response structure from Gemini API.");
    }

    const jsonString = textResponse.replace(/```json|```/g, "").trim();
    const courseIds = JSON.parse(jsonString);
    return Array.isArray(courseIds) ? courseIds : [];
  } catch (error) {
    console.error(
      `Error getting recommendations for job "${job.title}":`,
      error
    );
    throw error;
  }
};
