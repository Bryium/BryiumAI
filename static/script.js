document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");
  const cameraButton = document.getElementById("camera-button");
  const galleryButton = document.getElementById("gallery-button");
  const fileInput = document.getElementById("file-input");
  const imageContainer = document.getElementById("image-container");
  const toggleSidebarButton = document.getElementById("toggle-sidebar");
  const savePromptButton = document.getElementById("save-prompt-button");
  const promptList = document.getElementById("prompt-list");
  const clearPromptsButton = document.getElementById("clear-prompts");
  const sidebar = document.querySelector("sidebar");

  if (!fileInput || !imageContainer) {
    console.error("fileInput or imageContainer element is missing.");
    return;
  }

  // Handle send button click
  sendButton.addEventListener("click", () => {
    const message = userInput.value.trim();
    const image = imageContainer.querySelector("img");

    if (message || image) {
      // Send either a message or image
      const combinedMessage = message + (image ? "<br>" + image.outerHTML : "");
      appendUserMessage(combinedMessage);
      userInput.value = "";
      imageContainer.innerHTML = "";
      console.log("User message:", combinedMessage);

      // Fetch chatbot response
      fetchChatbotResponse(combinedMessage);
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
    fileInput.capture = "camera";
    fileInput.click();
  });

  // Handle gallery input (opens the file gallery to select an image)
  galleryButton.addEventListener("click", () => {
    fileInput.accept = "gallery/*";
    fileInput.capture = "";
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
        img.style.maxWidth = "150px";
        img.style.height = "auto";
        img.style.borderRadius = "8px";
        img.alt = "User uploaded image";

        // Append the image to the image container
        imageContainer.innerHTML = "";
        imageContainer.appendChild(img);
      };

      // Read the file as a data URL (this will trigger the onload function)
      reader.readAsDataURL(file);
    }
  });

  // Toggle sidebar visibility
  toggleSidebarButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // Save prompt to the sidebar
  savePromptButton.addEventListener("click", () => {
    const prompt = userInput.value.trim();
    if (prompt) {
      const listItem = document.createElement("li");
      listItem.textContent = prompt;
      listItem.addEventListener("click", () => {
        userInput.value = listItem.textContent; // Load prompt into input
      });
      promptList.appendChild(listItem);
      userInput.value = ""; // Clear input field
    }
  });

  // Clear all saved prompts
  clearPromptsButton.addEventListener("click", () => {
    promptList.innerHTML = "";
  });
});
