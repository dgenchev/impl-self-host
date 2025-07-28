// Chat functionality for Dr. Genchev's AI Dental Assistant

// Chat state management
let chatHistory = [];
let isProcessing = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
    setWelcomeTimestamp();
});

function initializeChat() {
    // Set up send button click handler
    const sendButton = document.getElementById('sendButton');
    const questionInput = document.getElementById('questionInput');
    
    if (sendButton && questionInput) {
        sendButton.addEventListener('click', sendMessage);
        
        // Set up enter key handler for input field
        questionInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });
        
        // Focus on input field
        questionInput.focus();
    }
}

function setWelcomeTimestamp() {
    const welcomeTime = document.getElementById('welcomeTime');
    if (welcomeTime) {
        const now = new Date();
        welcomeTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

async function sendMessage() {
    if (isProcessing) return; // Prevent multiple simultaneous requests
    
    const questionInput = document.getElementById('questionInput');
    const sendButton = document.getElementById('sendButton');
    
    if (!questionInput || !sendButton) return;
    
    const question = questionInput.value.trim();
    if (!question) return;
    
    // Add user message to chat
    addMessage("user", question);
    
    // Clear input and disable send button
    questionInput.value = "";
    sendButton.disabled = true;
    isProcessing = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get AI response (this would need to be connected to your backend)
        const answer = await getAIResponse(question);
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI response to chat
        addMessage("ai", answer);
        
    } catch (error) {
        console.error('Error getting AI response:', error);
        hideTypingIndicator();
        addMessage("ai", "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.");
    } finally {
        // Re-enable send button
        sendButton.disabled = false;
        isProcessing = false;
        
        // Focus back on input
        questionInput.focus();
    }
}

function addMessage(sender, message) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const senderLabel = sender === "user" ? "You" : "AI Assistant";
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="sender">${senderLabel}</span>
            <span class="timestamp">${timestamp}</span>
        </div>
        <div class="message-content">${message}</div>
    `;
    
    // Add to chat history
    const chatHistory = document.getElementById('chatHistory');
    if (chatHistory) {
        chatHistory.appendChild(messageDiv);
        
        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    // Store in our chat history array
    chatHistory.push({ sender, message, timestamp });
}

function showTypingIndicator() {
    const chatHistory = document.getElementById('chatHistory');
    if (!chatHistory) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-header">
            <span class="sender">AI Assistant</span>
            <span class="timestamp">typing...</span>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatHistory.appendChild(typingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Mock AI response function - replace this with your actual AI backend
async function getAIResponse(question) {
    // For now, return a mock response
    // In production, this would call your AI backend API
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock responses based on keywords
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('who') && lowerQuestion.includes('you')) {
        return "I'm Dr. Genchev's AI dental assistant, specializing in immediate loading implants and basal implantology. I help patients understand dental implant procedures and answer questions about our services.";
    }
    
    if (lowerQuestion.includes('implant')) {
        return "Dental implants are artificial tooth roots that provide a permanent base for fixed, replacement teeth. Dr. Genchev specializes in immediate loading implants, which allow for faster recovery and immediate functionality.";
    }
    
    if (lowerQuestion.includes('basal')) {
        return "Basal implants, also known as immediate loading implants, are used when there isn't enough natural tooth supporting structure remaining after extraction. They provide immediate stability and function.";
    }
    
    if (lowerQuestion.includes('cost') || lowerQuestion.includes('price')) {
        return "The cost of dental implants varies based on individual needs and treatment plans. We recommend scheduling a consultation with Dr. Genchev for a personalized assessment and detailed pricing information.";
    }
    
    if (lowerQuestion.includes('recovery') || lowerQuestion.includes('heal')) {
        return "Recovery time varies, but with immediate loading implants, patients can often return to normal function within days rather than months. Dr. Genchev uses advanced techniques to minimize discomfort and speed up recovery.";
    }
    
    if (lowerQuestion.includes('pain') || lowerQuestion.includes('hurt')) {
        return "Most patients report minimal discomfort during and after the procedure. We use advanced techniques and local anesthesia to ensure patient comfort throughout the treatment process.";
    }
    
    // Default response
    return "Thank you for your question about dental implants. Dr. Genchev specializes in immediate loading implants and basal implantology. For specific information about your case, we recommend scheduling a consultation. You can contact our office for more details.";
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add typing dots animation CSS
const style = document.createElement('style');
style.textContent = `
    .typing-dots {
        display: flex;
        gap: 4px;
        align-items: center;
    }
    
    .typing-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #6b7280;
        animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dots span:nth-child(1) {
        animation-delay: -0.32s;
    }
    
    .typing-dots span:nth-child(2) {
        animation-delay: -0.16s;
    }
    
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 