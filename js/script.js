// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header background change on scroll
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(224, 242, 224, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '#E0F2E0';
            header.style.backdropFilter = 'none';
        }
    });

    // Contact Form handling
    const contactForm = document.querySelector('form[name="contact"]');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // AI Chat Interface
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendButton = document.getElementById('sendButton');
    
    if (chatForm && chatInput && chatMessages && sendButton) {
        // Auto-resize textarea
        chatInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
        
        // Handle form submission
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendMessage();
        });
        
        // Handle Enter key (send on Enter, new line on Shift+Enter)
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message
            addMessage('user', message);
            
            // Clear input and reset height
            chatInput.value = '';
            chatInput.style.height = 'auto';
            
            // Disable send button and show typing indicator
            sendButton.disabled = true;
            showTypingIndicator();
            
            // Simulate AI response
            setTimeout(() => {
                hideTypingIndicator();
                const aiResponse = getAIResponse(message);
                addMessage('ai', aiResponse);
                sendButton.disabled = false;
            }, 1500 + Math.random() * 1000);
        }
        
        function addMessage(sender, text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}-message`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            const paragraph = document.createElement('p');
            paragraph.textContent = text;
            
            const time = document.createElement('span');
            time.className = 'message-time';
            time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            content.appendChild(paragraph);
            content.appendChild(time);
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message ai-message typing-indicator';
            typingDiv.id = 'typingIndicator';
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            const dots = document.createElement('div');
            dots.className = 'typing-dots';
            dots.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
            
            content.appendChild(dots);
            typingDiv.appendChild(avatar);
            typingDiv.appendChild(content);
            
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function hideTypingIndicator() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
        
        function getAIResponse(question) {
            const lowerQuestion = question.toLowerCase();
            
            // Predefined responses based on keywords
            if (lowerQuestion.includes('implant') && lowerQuestion.includes('cost') || lowerQuestion.includes('price')) {
                return "The cost of dental implants varies depending on your specific needs. Our immediate loading implants typically range from €800-1500 per implant. We offer fixed pricing with no hidden costs. Would you like to schedule a consultation for a personalized quote?";
            }
            
            if (lowerQuestion.includes('immediate') && lowerQuestion.includes('loading')) {
                return "Immediate loading implants allow you to receive your new teeth in just 5 days! Unlike traditional implants that require 3-6 months of healing, our strategic implantology technique uses the cortical bone for immediate stability. This means faster recovery and no long waiting periods.";
            }
            
            if (lowerQuestion.includes('pain') || lowerQuestion.includes('hurt')) {
                return "Most patients report minimal discomfort during and after the procedure. We use advanced techniques and local anesthesia to ensure your comfort. The immediate loading process is designed to be less painful than traditional implant methods, with most patients returning to normal activities within days.";
            }
            
            if (lowerQuestion.includes('recovery') || lowerQuestion.includes('heal')) {
                return "With immediate loading implants, recovery is much faster than traditional methods. Most patients can return to normal eating and speaking within 24-48 hours. The entire process from consultation to final teeth takes just 5 days, compared to 3-6 months with conventional implants.";
            }
            
            if (lowerQuestion.includes('bone') && lowerQuestion.includes('loss')) {
                return "Our strategic implantology technique is specifically designed for patients with bone loss. We use the cortical bone, which is more stable and doesn't require bone grafting or sinus lifts. This makes the procedure suitable for many patients who were previously told they couldn't have implants.";
            }
            
            if (lowerQuestion.includes('consultation') || lowerQuestion.includes('appointment')) {
                return "You can schedule a consultation by calling us at +359 32 266 089, emailing genchevi@dr-genchevi.com, or using the contact form on this website. We'll review your case and provide a personalized treatment plan with fixed pricing.";
            }
            
            if (lowerQuestion.includes('experience') || lowerQuestion.includes('years')) {
                return "Dr. Genchev has over 30 years of experience in dental implantology and is a certified Clinical Master of the International Implant Foundation. He specializes in immediate loading techniques and has successfully treated thousands of patients with excellent results.";
            }
            
            // Default response
            return "Thank you for your question about dental implants! Dr. Genchev specializes in immediate loading implants that provide faster recovery and immediate functionality. For specific information about your case, I'd recommend scheduling a consultation. You can contact us at +359 32 266 089 or use the contact form on this website.";
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Testimonial cards hover effect
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        });
    });

    // Timeline items animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        const itemObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, observerOptions);
        
        itemObserver.observe(item);
    });

    // FAQ items expand/collapse functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const title = item.querySelector('h3');
        const content = item.querySelector('p, ol, .process-steps');
        
        if (title && content) {
            title.style.cursor = 'pointer';
            title.addEventListener('click', function() {
                const isExpanded = content.style.maxHeight && content.style.maxHeight !== '0px';
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    const otherContent = otherItem.querySelector('p, ol, .process-steps');
                    if (otherContent) {
                        otherContent.style.maxHeight = '0px';
                        otherContent.style.overflow = 'hidden';
                        otherContent.style.transition = 'max-height 0.3s ease';
                    }
                });
                
                // Toggle current item
                if (isExpanded) {
                    content.style.maxHeight = '0px';
                    content.style.overflow = 'hidden';
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.overflow = 'visible';
                }
            });
            
            // Initialize collapsed state
            content.style.maxHeight = '0px';
            content.style.overflow = 'hidden';
            content.style.transition = 'max-height 0.3s ease';
        }
    });

    // Language selector functionality
    const languageSelector = document.querySelector('.language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('click', function() {
            // Toggle between languages (EN, BG, RU)
            const currentLang = this.textContent.trim();
            const languages = ['EN', 'BG', 'RU'];
            const currentIndex = languages.indexOf(currentLang);
            const nextIndex = (currentIndex + 1) % languages.length;
            this.textContent = languages[nextIndex];
        });
    }
}); 