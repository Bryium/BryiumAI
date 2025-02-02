// static/script.js

document.getElementById("send-button").addEventListener("click", sendMessage);
document
  .getElementById("user-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

document.getElementById("camera-button").addEventListener("click", function () {
  document.getElementById("file-input").click();
});

document
  .getElementById("gallery-button")
  .addEventListener("click", function () {
    document.getElementById("file-input").click();
  });

document
  .getElementById("file-input")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      appendMessage("user", "📷 [Image Attached]");
      // Add functionality to send file to Flask if needed
    }
  });

function sendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  if (userInput === "") return;

  appendMessage("user", userInput);
  document.getElementById("user-input").value = "";

  fetch("/get_response", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userInput }),
  })
    .then((response) => response.json())
    .then((data) => {
      appendMessage("bot", data.response);
    })
    .catch((error) => {
      console.error("Error:", error);
      appendMessage("bot", "Oops! Something went wrong.");
    });
}

function appendMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "chat-message",
    sender === "user" ? "user-message" : "bot-message"
  );
  messageElement.textContent = message;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}
