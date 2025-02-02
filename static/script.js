document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");
  const cameraButton = document.getElementById("camera-button");
  const galleryButton = document.getElementById("gallery-button");
  const fileInput = document.getElementById("file-input");

  console.log("Send button: ", sendButton); // Check if the button exists
  sendButton.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) {
      console.log("User message:", message); // Check the user input
      appendUserMessage(message);
      userInput.value = "";
      fetchChatbotResponse(message);
    }
  });

  // Function to append user message to chat
  function appendUserMessage(message) {
    const userMessageHTML = `<div class="chat-message user-message">${message}</div>`;
    chatBox.innerHTML += userMessageHTML;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Function to fetch chatbot response
function fetchChatbotResponse(message) {
  fetch("/chat", {
    // Ensure we're calling the correct route
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }), // Send message as JSON
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Bot response:", data.response); // Check the response from the server
      appendBotMessage(data.response); // Display the response in your chat window
    })
    .catch((error) => console.error("Error fetching response:", error));
}


  // Function to append bot message to chat
  function appendBotMessage(message) {
    const botMessageHTML = `<div class="chat-message bot-message">${formatBotResponse(
      message
    )}</div>`;
    chatBox.innerHTML += botMessageHTML;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Function to format bot response (optional)
  function formatBotResponse(response) {
    return response
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold formatting for **text**
      .replace(/\*(.*?)\*/g, "<i>$1</i>") // Italic formatting for *text*
      .replace(/\n/g, "<br>"); // Newline to <br> conversion
  }

  // Handle file input (camera/gallery buttons)
  cameraButton.addEventListener("click", () => {
    fileInput.accept = "image/*";
    fileInput.click();
  });

  galleryButton.addEventListener("click", () => {
    fileInput.accept = "image/*";
    fileInput.click();
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const message = `User uploaded an image: ${file.name}`;
      appendUserMessage(message);
      // You can send the image file to the server if needed here
    }
  });
});
