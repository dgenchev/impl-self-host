# Dr Genchev Dental Implants Website

A modern, responsive website for Dr. Genchev's dental implantology clinic, featuring immediate loading dental implants and strategic dental implantology services.

## 🌟 Features

- **Responsive Design**: Optimized for all devices (desktop, tablet, mobile)
- **Modern UI**: Clean, professional design with light green theme
- **Interactive Elements**: Smooth scrolling, form handling, animations
- **SEO Optimized**: Proper meta tags and semantic HTML
- **AI Chatbot**: GPT-4 powered multilingual chatbot for patient inquiries
- **Automated Notifications**: Telegram integration for real-time patient updates
- **Health Monitoring**: Automated system health checks and monitoring
- **Contact Forms**: Integrated contact and AI dentist forms
- **Testimonials**: Patient testimonials section
- **FAQ Section**: Comprehensive information about dental implants
- **Procedure Timeline**: Clear 5-day treatment process

## 📁 Project Structure

```
dr-genchev-website/
├── index.html                    # Main HTML file
├── css/
│   └── style.css                 # Main stylesheet
├── js/
│   ├── script.js                 # JavaScript functionality
│   └── translations/             # i18n files (en, bg, ru)
├── lib/                          # Shared libraries
│   ├── supabase-client.js        # Database operations
│   ├── openai-client.js          # AI chatbot logic
│   ├── telegram-client.js        # Telegram notifications
│   ├── encryption-utils.js       # GDPR encryption
│   └── gdpr-utils.js             # Data protection utilities
├── netlify/
│   └── functions/                # Serverless functions
│       ├── ai-chat-enhanced.js   # Main chatbot endpoint
│       ├── daily-summary.js      # Daily patient summary
│       ├── health-check.js       # System health monitoring
│       ├── telegram-notify.js    # Telegram notifications
│       └── upload-xray.js        # X-ray upload handling
├── docs/                         # Documentation (see docs/README.md)
│   ├── setup/                     # Setup guides
│   ├── deployment/                # Deployment documentation
│   ├── testing/                   # Testing documentation
│   ├── phases/                    # Development phase records
│   └── guides/                    # Additional guides
├── scripts/                       # Utility scripts
│   ├── deploy.sh                  # Deployment script
│   ├── optimize-images.sh        # Image optimization
│   └── test-health-check.js      # Health check test
├── images/                        # Image assets
├── docs/
│   └── setup/
│       └── database-schema.sql    # Database schema
├── netlify.toml                   # Netlify configuration
├── package.json                   # Node.js dependencies
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (for development)
- Git
- Netlify account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd dr-genchev-website
   ```

2. **Install dependencies** (if any)
   ```bash
   npm install
   ```

3. **Open in browser**
   ```bash
   # Using Python (if available)
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   
   # Or simply open index.html in your browser
   ```

4. **View the website**
   - Open `http://localhost:8000` in your browser

## 🎨 Customization

### Colors
The website uses a consistent color palette:
- **Primary Background**: `#E0F2E0` (Light green)
- **Text**: `#2D3748` (Dark gray)
- **Secondary Text**: `#4A5568` (Medium gray)
- **Accent**: `#25D366` (WhatsApp green)

### Typography
- **Headings**: Playfair Display (serif)
- **Body Text**: Inter (sans-serif)

### Content Sections
1. **Hero Section**: Main title and tagline
2. **Key Features**: NO WAIT, FIXED PRICE, 5 DAYS
3. **About Dr Genchev**: Professional introduction
4. **Certifications**: Credentials and media
5. **FAQ**: Common questions and answers
6. **AI Dentist**: Interactive question form
7. **Testimonials**: Patient reviews
8. **Procedure**: 5-day treatment timeline
9. **Contact**: Contact form and information

## 📧 Forms

### Contact Form
The contact form includes:
- First Name
- Last Name
- Email
- Phone
- Type of service
- Other (textarea)
- reCAPTCHA placeholder

### AI Dentist Form
Simple question submission form for AI-powered dental advice.

## 🔧 Configuration

### Netlify Forms
The forms are configured for Netlify:
- Contact form: `name="contact"`
- AI form: Integrated with JavaScript handling

### WhatsApp Integration
Update the phone number in `js/script.js`:
```javascript
const phoneNumber = '+35932266089'; // Replace with actual number
```

### Language Support
The language selector supports:
- EN (English)
- BG (Bulgarian)
- RU (Russian)

## 🚀 Deployment

### Netlify Deployment

1. **Connect to Netlify**
   - Push your code to GitHub
   - Connect your repository to Netlify
   - Deploy automatically

2. **Manual Deployment**
   ```bash
   # Build and deploy
   ./scripts/deploy.sh
   ```

3. **Custom Domain** (Optional)
   - Configure custom domain in Netlify dashboard
   - Update DNS settings

### Environment Variables
Set these in Netlify dashboard:

**Required:**
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_KEY`: Supabase service role key
- `OPENAI_API_KEY`: OpenAI API key for GPT-4
- `TELEGRAM_BOT_TOKEN`: Telegram bot token
- `TELEGRAM_CHAT_ID`: Telegram chat ID for notifications
- `ENCRYPTION_KEY`: 32-byte encryption key for GDPR compliance

**Optional:**
- `CONTACT_EMAIL`: Email for form submissions
- `WHATSAPP_NUMBER`: WhatsApp business number

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🎯 SEO Features

- Semantic HTML structure
- Meta tags for description and keywords
- Open Graph tags (can be added)
- Structured data (can be added)
- Fast loading times
- Mobile-friendly design

## 🔍 Performance

- Optimized images (placeholder system)
- Minified CSS and JS
- Fast loading times
- Smooth animations
- Progressive enhancement

## 🤖 AI Chatbot & Monitoring

### Features
- **Multilingual Support**: Auto-detects English, Bulgarian, and Russian
- **Context Awareness**: Maintains conversation history
- **Patient Info Extraction**: Automatically collects contact details
- **Real-time Notifications**: Sends patient inquiries to Telegram
- **GDPR Compliant**: Encrypted storage with auto-deletion
- **Health Monitoring**: Automated system health checks

### Daily Operations

**Health Check (Daily at 6 AM UTC / 8-9 AM Bulgarian)**
- Tests database, OpenAI API, and Telegram bot
- Sends alerts only when systems fail
- Weekly confirmation every Monday
- See [docs/guides/HEALTH-CHECK-SYSTEM.md](docs/guides/HEALTH-CHECK-SYSTEM.md) for details

**Daily Summary (Daily at 3 PM UTC / 5-6 PM Bulgarian)**
- Sends summary only when there are patient queries
- Generates Bulgarian summary using GPT-4
- Includes patient information and concerns
- Silent when no queries (no spam notifications)

### Testing

Test the health check locally:
```bash
npm run test:health
```

## 🛠️ Development

### Adding New Sections
1. Add HTML structure in `index.html`
2. Add CSS styles in `css/style.css`
3. Add JavaScript functionality in `js/script.js`

### Styling Guidelines
- Use CSS Grid and Flexbox for layouts
- Maintain consistent spacing (rem units)
- Follow the established color palette
- Ensure accessibility standards

### Backend Functions
- Located in `netlify/functions/`
- Use Netlify serverless functions
- Shared libraries in `lib/` directory
- See individual function documentation for details

## 📞 Contact Information

**Dr Genchev Dental Implantology Clinic**
- **Phone**: +359 32 266 089
- **Email**: genchevi@dr-genchevi.com
- **Location**: Plovdiv, Bulgaria

## 📄 License

This project is for Dr. Genchev's dental clinic. All rights reserved.

## 🤝 Contributing

For website updates and improvements, please contact the development team.

---

**Built with ❤️ for Dr. Genchev's Dental Implantology Clinic**
