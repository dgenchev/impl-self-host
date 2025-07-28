# Dr Genchev Dental Implants Website

A modern, responsive website for Dr. Genchev's dental implantology clinic, featuring immediate loading dental implants and strategic dental implantology services.

## 🌟 Features

- **Responsive Design**: Optimized for all devices (desktop, tablet, mobile)
- **Modern UI**: Clean, professional design with light green theme
- **Interactive Elements**: Smooth scrolling, form handling, animations
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Contact Forms**: Integrated contact and AI dentist forms
- **Testimonials**: Patient testimonials section
- **FAQ Section**: Comprehensive information about dental implants
- **Procedure Timeline**: Clear 5-day treatment process

## 📁 Project Structure

```
dr-genchev-website/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── script.js       # JavaScript functionality
├── deploy.sh           # Deployment script
└── README.md          # This file
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
   ./deploy.sh
   ```

3. **Custom Domain** (Optional)
   - Configure custom domain in Netlify dashboard
   - Update DNS settings

### Environment Variables
Set these in Netlify dashboard if needed:
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
