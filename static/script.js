document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");
  const cameraButton = document.getElementById("camera-button");
  const galleryButton = document.getElementById("gallery-button");
  const fileInput = document.getElementById("file-input");
  const textArea = document.getElementById("textArea"); // Assuming this is your text area for displaying the image

  // Ensure fileInput is set up properly
  if (!fileInput || !textArea) {
    console.error("fileInput or textArea element is missing.");
    return;
  }

  // Handle send button click
  sendButton.addEventListener("click", () => {
    const message = userInput.value.trim();
    if (message) {
      console.log("User message:", message);
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Bot response:", data.response);
        appendBotMessage(data.response);
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
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/\n/g, "<br>");
  }

  // Handle camera input (opens the camera to capture an image)
  cameraButton.addEventListener("click", () => {
    fileInput.accept = "image/*";
    fileInput.capture = "camera"; // Tells the input to use the camera on mobile devices
    fileInput.click();
  });

  // Handle gallery input (opens the file gallery to select an image)
  galleryButton.addEventListener("click", () => {
    fileInput.accept = "image/*";
    fileInput.capture = ""; // Remove capture so it doesn't force the camera
    fileInput.click();
  });

  // Handle the file input change event (when the user selects or captures an image)
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        // Create an image element to display the image
        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100%"; // Set a max width to make it responsive
        img.style.borderRadius = "8px"; // Optional, for styling
        img.alt = "User uploaded image";

        // Append the image to the text area (or any other container element)
        textArea.innerHTML = ""; // Clear the text area before adding the new image
        textArea.appendChild(img);
      };

      // Read the file as a data URL (this will trigger the onload function)
      reader.readAsDataURL(file);
    }
  });
});
