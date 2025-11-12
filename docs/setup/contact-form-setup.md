# Contact Form Email Setup

Your contact form is working, but you need to configure email notifications in Netlify to receive the actual form submissions.

## Current Status
✅ Form is submitting successfully  
✅ JavaScript alert is showing  
❌ You're not receiving email notifications  

## How to Set Up Email Notifications

### Step 1: Access Netlify Dashboard
1. Go to: https://app.netlify.com/projects/stellar-mousse-93ab5f
2. Login to your Netlify account

### Step 2: Find Your Form
1. In the left sidebar, click **"Forms"**
2. You should see a form called **"contact"**
3. Click on the **"contact"** form

### Step 3: Configure Email Notifications
1. Click **"Settings"** tab
2. Click **"Form notifications"**
3. Click **"Add notification"**
4. Select **"Email notification"**

### Step 4: Configure Email Settings
Fill in these details:
- **To**: Your email address (e.g., genchevi@dr-genchevi.com)
- **From**: Netlify Forms (or your custom email)
- **Subject**: `New Contact Form Submission - Dr Genchev Website`
- **Email template**: Use the default or customize

### Step 5: Custom Email Template (Optional)
You can customize the email to include all form fields:

```html
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> {{first-name}} {{last-name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Phone:</strong> {{phone}}</p>
<p><strong>Service:</strong> {{service}}</p>
<p><strong>Message:</strong> {{message}}</p>
<p><strong>Submitted:</strong> {{submitted_at}}</p>
```

### Step 6: Test the Form
1. Go to your live website
2. Fill out and submit the contact form
3. Check your email for the notification

## Troubleshooting

### If you don't receive emails:
1. Check your spam folder
2. Verify the email address is correct
3. Check Netlify Forms dashboard for submissions
4. Ensure the form has the correct `name="contact"` attribute

### Form Submission Limits
- **Free plan**: 100 submissions/month
- **Pro plan**: 1,000 submissions/month
- **Business plan**: 10,000 submissions/month

## Alternative: Slack Notifications
You can also set up Slack notifications:
1. Add notification → Slack
2. Enter your Slack webhook URL
3. Customize the message format

## Next Steps
1. Configure email notifications as above
2. Test the form submission
3. Check that you receive emails
4. Customize the email template if needed

---

**Need help?** Check Netlify's documentation: https://docs.netlify.com/forms/setup/ 