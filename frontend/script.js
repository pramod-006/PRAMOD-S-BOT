const userText = document.getElementById("userText");
const botReply = document.getElementById("botReply");
const micBtn = document.getElementById("micBtn");
const sendBtn = document.getElementById("sendBtn");
const textInput = document.getElementById("textInput");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

micBtn.addEventListener("click", () => {
  micBtn.textContent = "🎙️ Listening...";
  recognition.start();
});

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  userText.textContent = transcript;
  micBtn.textContent = "🎤";
  fetchBotReply(transcript);
};

recognition.onerror = (e) => {
  micBtn.textContent = "🎤";
  alert("Speech recognition error: " + e.error);
};

sendBtn.addEventListener("click", () => {
  const message = textInput.value.trim();
  if (message) {
    userText.textContent = message;
    textInput.value = "";
    fetchBotReply(message);
    document.querySelector('.chat-output').scrollTop = document.querySelector('.chat-output').scrollHeight;

  }
});

async function fetchBotReply(message) {
  // Show the chat output block
  document.getElementById("chatBox").style.display = "block";
  botReply.textContent = "Processing...";

  try {
    const response = await fetch("https://pramod-s-bot.onrender.com/ask", {
 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    botReply.textContent = data.reply;
    speak(data.reply);

    // Optional: Scroll to bottom if needed
    document.querySelector('.chat-output').scrollTop = document.querySelector('.chat-output').scrollHeight;

  } catch (err) {
    botReply.textContent = "Error: Could not reach backend.";
    console.error(err);
  }
}

function speak(text) {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;

  synth.cancel();
  synth.speak(utterance);
}
