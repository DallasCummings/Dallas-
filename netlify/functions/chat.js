const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    // Step 1: ChatGPT response
    const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: `${process.env.OPENAI_MODEL}`,
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

    const chatData = await chatResponse.json();
    const reply = chatData.choices?.[0]?.message?.content || "Something went wrong, darlin'. Try again later.";

    // Step 2: Generate TTS audio
    const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "tts-1",
        voice: "shimmer", // Try "nova" for something more gentle
        input: reply
      })
    });

    const audioBuffer = await ttsResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    // Final response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reply,
        audio: audioBase64
      })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Something went wrong, sugar. Try again later." })
    };
  }
};