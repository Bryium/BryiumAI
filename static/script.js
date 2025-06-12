document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  const sendButton = document.getElementById("send-button");
  const userInput = document.getElementById("user-input");
  const cameraButton = document.getElementById("camera-button");
  const galleryButton = document.getElementById("gallery-button");
  const cameraButtonMobile = document.getElementById("camera-button-mobile");
  const galleryButtonMobile = document.getElementById("gallery-button-mobile");
  const fileInput = document.getElementById("file-input");
  const imageContainer = document.getElementById("image-container");
  const toggle = document.getElementById("toggle");
  const menu = document.getElementById("menu");
  const closeBtn = document.getElementById("close");
  const closeChat = document.getElementById("close-chat");
  const menuChat = document.getElementById("menu-chat");
  const toggleChat = document.getElementById("toggle-chat");

  // Check if required elements exist before proceeding
  if (
    !chatBox ||
    !userInput ||
    !sendButton ||
    !cameraButton ||
    !galleryButton ||
    !fileInput ||
    !imageContainer ||
    !toggle ||
    !menu ||
    !closeBtn ||
    !menuChat ||
    !closeChat ||
    !toggleChat
  ) {
    console.error("One or more required elements are missing.");
    return;
  }
  //open menu when toggle is clicked
  toggle.addEventListener("click", () => {
    menu.style.display = "block";
  });

  // Close menu when close button is clicked
  closeBtn.addEventListener("click", () => {
    menu.style.display = "none";
  });

  //open menu chat  when toggle is clicked
  toggleChat.addEventListener("click", () => {
    menuChat.style.display = "block";
  });

  //close menu chat when close button is clicked
  closeChat.addEventListener("click", () => {
    menuChat.style.display = "none";
  });

  // Handle send button click
  sendButton.addEventListener("click", () => {
    const message = userInput.value.trim();
    const image = imageContainer.querySelector("img");

    if (message || image) {
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
    const botMessageElement = document.createElement("div");
    botMessageElement.className = "chat-message bot-message";
    chatBox.appendChild(botMessageElement);

    let index = 0;

    function typeCharacter() {
      if (index < message.length) {
        botMessageElement.innerHTML += message.charAt(index);
        index++;
        chatBox.scrollTop = chatBox.scrollHeight;
        setTimeout(typeCharacter, 20);
      }
    }

    typeCharacter();
  }

  // Function to format bot response (optional)
  function formatBotResponse(response) {
    return response
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
      .replace(/\*(.*?)\*/g, "<i>$1</i>")
      .replace(/\n/g, "<br>");
  }

  // Desktop Camera
  cameraButton.addEventListener("click", () => {
    try {
      fileInput.accept = "image/*";
      fileInput.capture = "camera";
      fileInput.click();
    } catch (error) {
      console.error("Camera access failed:", error);
    }
  });

  //  Desktop gallery
  galleryButton.addEventListener("click", () => {
    fileInput.accept = "image/*";
    fileInput.capture = "";
    fileInput.click();
  });

  // Mobile Gallery
  cameraButtonMobile.addEventListener("click", () => {
    e.preventDefault();
    try {
      fileInput.accept = "image/*";
      fileInput.capture = "camera";
      fileInput.click();
    } catch (error) {
      console.error("Camera access failed:", error);
    }
  });

  // Handle gallery input (opens the file gallery to select an image) for Mobile screens
  galleryButtonMobile.addEventListener("click", () => {
    e.preventDefault();
    fileInput.accept = "image/*";
    fileInput.capture = "";
    fileInput.click();
  });

  // Handle the file input change event (when the user selects or captures an image)
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        if (!e.target.result) {
          console.error("Error loading image");
          return;
        }

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
});
