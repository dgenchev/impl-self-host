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
            // Show typing indicator while waiting for API response
            showTypingIndicator();
            
            // Call OpenAI API via Netlify function
            fetch('/.netlify/functions/ai-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: question
                })
            })
            .then(response => response.json())
            .then(data => {
                hideTypingIndicator();
                if (data.error) {
                    addMessage('ai', 'Sorry, I encountered an error. Please try again or contact us directly at +359 32 266 089.');
                } else {
                    addMessage('ai', data.response);
                }
                sendButton.disabled = false;
            })
            .catch(error => {
                hideTypingIndicator();
                addMessage('ai', 'Sorry, I\'m having trouble connecting right now. Please contact us directly at +359 32 266 089 for immediate assistance.');
                sendButton.disabled = false;
                console.error('Error:', error);
            });
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

    // FAQ items - all content visible by default (no accordion)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const title = item.querySelector('h3');
        if (title) {
            title.style.cursor = 'default';
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

    // File Upload Enhancement
    const fileInput = document.getElementById('attachments');
    const fileContainer = document.querySelector('.file-upload-container');
    
    if (fileInput && fileContainer) {
        // Drag and drop functionality
        fileContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        fileContainer.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
        });
        
        fileContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                handleFileSelection(files);
            }
        });
        
        // File input change handler
        fileInput.addEventListener('change', function(e) {
            handleFileSelection(e.target.files);
        });
        
        function handleFileSelection(files) {
            const maxSize = 8 * 1024 * 1024; // 8MB
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            let totalSize = 0;
            let validFiles = [];
            
            // Validate files
            for (let file of files) {
                if (!allowedTypes.includes(file.type)) {
                    alert(`File "${file.name}" is not a supported format. Please use JPG, PNG, PDF, DOC, or DOCX files.`);
                    continue;
                }
                
                totalSize += file.size;
                if (totalSize > maxSize) {
                    alert(`Total file size exceeds 8MB limit. Please select smaller files.`);
                    return;
                }
                
                validFiles.push(file);
            }
            
            // Update container state
            if (validFiles.length > 0) {
                fileContainer.classList.add('has-files');
                displayFileList(validFiles);
            } else {
                fileContainer.classList.remove('has-files');
                removeFileList();
            }
        }
        
        function displayFileList(files) {
            removeFileList();
            
            const fileList = document.createElement('div');
            fileList.className = 'file-list';
            
            files.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                const fileName = document.createElement('span');
                fileName.className = 'file-name';
                fileName.textContent = file.name;
                
                const fileSize = document.createElement('span');
                fileSize.className = 'file-size';
                fileSize.textContent = formatFileSize(file.size);
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-file';
                removeBtn.innerHTML = '×';
                removeBtn.onclick = () => removeFile(index);
                
                fileItem.appendChild(fileName);
                fileItem.appendChild(fileSize);
                fileItem.appendChild(removeBtn);
                fileList.appendChild(fileItem);
            });
            
            fileContainer.appendChild(fileList);
        }
        
        function removeFile(index) {
            const dt = new DataTransfer();
            const files = fileInput.files;
            
            for (let i = 0; i < files.length; i++) {
                if (i !== index) {
                    dt.items.add(files[i]);
                }
            }
            
            fileInput.files = dt.files;
            handleFileSelection(dt.files);
        }
        
        function removeFileList() {
            const existingList = fileContainer.querySelector('.file-list');
            if (existingList) {
                existingList.remove();
            }
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }
}); 