import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", //knowledge cutoff 1 oct 2023
      messages: [{
        role: "user",
        content: message
      }]
    })
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", options);
    const data = await response.json();
    if (!response.ok || data.error) {
      console.error("\n🔥 OPENAI REJECTED THE REQUEST 🔥");
      console.error("Error Message:", data.error?.message || response.statusText);
      console.error("Error Type:", data.error?.type);
      console.error("----------------------------------\n");
      
      return "AI service is currently unavailable. Please check backend logs."; 
    }

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content; 
    } else {
      console.error("Unusual OpenAI Response:", JSON.stringify(data));
      return "Received empty response from AI.";
    }

  } catch (err) {
    console.error("Network Fetch Error:", err);
    return "Error connecting to AI service.";
  }
}

export default getOpenAIAPIResponse;
