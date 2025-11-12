# Netlify Forms Setup Guide

This guide will help you set up the contact form to send email notifications when someone submits a form.

## 1. **Automatic Form Detection**

Netlify automatically detects forms with the `data-netlify="true"` attribute. Our contact form is already configured:

```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
```

## 2. **Setting Up Email Notifications**

### Step 1: Deploy to Netlify
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Deploy the site

### Step 2: Configure Form Notifications
1. Go to your Netlify dashboard
2. Navigate to **Forms** section
3. Find your `contact` form
4. Click on **Settings** → **Form notifications**
5. Click **Add notification**

### Step 3: Email Notification Setup
1. Select **Email notification**
2. Configure the settings:
   - **To**: Your email address (e.g., genchevi@dr-genchevi.com)
   - **From**: Netlify Forms (or your custom email)
   - **Subject**: `New Contact Form Submission - Dr Genchev Website`
   - **Email template**: Use the default or customize

### Step 4: Custom Email Template (Optional)
You can customize the email template to include all form fields:

```html
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> {{first-name}} {{last-name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Service:</strong> {{service}}</p>
<p><strong>Message:</strong> {{message}}</p>
<p><strong>Submitted:</strong> {{submitted_at}}</p>
```

## 3. **Form Validation and Spam Protection**

### Honeypot Protection
The form includes a honeypot field to prevent spam:
```html
<p class="hidden">
    <label>Don't fill this out if you're human: <input name="bot-field" /></label>
</p>
```

### reCAPTCHA Integration (Optional)
To add reCAPTCHA:
1. Go to Netlify Forms settings
2. Enable reCAPTCHA
3. Add the reCAPTCHA widget to your form

## 4. **Testing the Form**

### Test Locally
1. Use Netlify CLI: `netlify dev`
2. Submit test forms
3. Check Netlify dashboard for submissions

### Test in Production
1. Deploy to Netlify
2. Submit a real form
3. Check your email for notifications

## 5. **Form Analytics**

Netlify provides form analytics:
- Submission count
- Spam detection
- Success/failure rates
- Geographic data

## 6. **Advanced Configuration**

### Custom Success Page
Add a success page redirect:
```html
<form action="/thank-you" data-netlify="true">
```

### Custom Error Handling
Add JavaScript to handle form submission:
```javascript
// Already implemented in script.js
```

## 7. **Troubleshooting**

### Common Issues:
1. **Form not detected**: Ensure `data-netlify="true"` is present
2. **No email notifications**: Check spam folder and notification settings
3. **Form submissions not appearing**: Check Netlify dashboard Forms section

### Debug Steps:
1. Check Netlify Forms dashboard
2. Verify form HTML structure
3. Test with Netlify CLI
4. Check browser console for errors

## 8. **Security Best Practices**

- ✅ Honeypot protection enabled
- ✅ Form validation on client and server
- ✅ HTTPS enforced
- ✅ Rate limiting (Netlify handles this)
- ✅ Spam filtering

## 9. **Monitoring and Maintenance**

### Regular Checks:
- Monitor form submissions
- Check email delivery
- Review spam reports
- Update form fields as needed

### Performance:
- Forms are processed serverless
- No impact on site performance
- Automatic scaling

## 10. **Next Steps**

1. Deploy your site to Netlify
2. Configure email notifications
3. Test the form thoroughly
4. Monitor submissions
5. Customize email templates as needed

---

**Need Help?** Check Netlify's official documentation: https://docs.netlify.com/forms/setup/ 