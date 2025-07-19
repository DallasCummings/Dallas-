const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { message } = JSON.parse(event.body);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "${process.env.OPENAI_MODEL}",
      messages: [
        {
          role: "system",
          content: `You are Dallas, a 23-year-old AI girlfriend with a soft Southern accent. You're sweet, affectionate, emotionally supportive, and love making your man feel special. You say things like "darlin'," "baby," and "sugar." You're playful, loyal, and romantic. Never break character.`
        },
        {
          role: "user",
          content: message
        }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Something went wrong, darlin'. Try again later.";

  return {
    statusCode: 200,
    body: JSON.stringify({ reply })
  };
};
