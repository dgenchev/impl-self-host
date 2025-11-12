# OpenAI API Integration Setup

This guide will help you set up the OpenAI API integration for your AI dental assistant.

## 🔐 **Security First**

Your OpenAI API key will be stored securely in Netlify's environment variables, never in your code repository.

## 📋 **Prerequisites**

1. **OpenAI API Key**: Get one from https://platform.openai.com/api-keys
2. **Netlify Account**: Already set up
3. **GitHub Repository**: Already connected

## 🚀 **Step-by-Step Setup**

### Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Give it a name like "Dr Genchev Website"
5. **Copy the key** (you won't see it again!)

### Step 2: Add Environment Variable to Netlify

1. Go to your Netlify dashboard: https://app.netlify.com/projects/stellar-mousse-93ab5f
2. Click **"Site settings"** (top right)
3. Click **"Environment variables"** (left sidebar)
4. Click **"Add a variable"**
5. Fill in:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (paste it here)
6. Click **"Save"**

### Step 3: Install Dependencies

Run this command in your project directory:
```bash
npm install
```

### Step 4: Test Locally (Optional)

1. Install Netlify CLI if not already installed:
   ```bash
   npm install -g netlify-cli
   ```

2. Create a `.env` file in your project root:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. Test locally:
   ```bash
   netlify dev
   ```

4. Visit http://localhost:8888 and test the AI chat

### Step 5: Deploy to Production

```bash
git add .
git commit -m "Add OpenAI API integration"
git push origin main
```

Netlify will automatically deploy and use your environment variable.

## 🔧 **How It Works**

1. **Frontend**: User types a question in the chat interface
2. **JavaScript**: Sends the question to `/netlify/functions/ai-chat`
3. **Netlify Function**: 
   - Gets your API key from environment variables
   - Sends request to OpenAI API
   - Returns the AI response
4. **Frontend**: Displays the AI response in the chat

## 💰 **Costs**

- **OpenAI API**: ~$0.002 per 1K tokens (very cheap)
- **Netlify Functions**: 125,000 invocations/month free
- **Total cost**: Usually under $5/month for normal usage

## 🛡️ **Security Features**

✅ **API key never in code**  
✅ **Environment variables encrypted**  
✅ **CORS headers configured**  
✅ **Error handling**  
✅ **Rate limiting** (OpenAI handles this)  

## 🧪 **Testing**

### Test Questions to Try:
- "How much do dental implants cost?"
- "What is immediate loading?"
- "How long does the procedure take?"
- "Do you treat patients with bone loss?"
- "How can I schedule a consultation?"

### Expected Behavior:
- Professional, helpful responses
- Always mentions consultation for specific cases
- Includes clinic contact information
- Medical disclaimers when appropriate

## 🚨 **Troubleshooting**

### If AI doesn't respond:
1. Check Netlify function logs: https://app.netlify.com/projects/stellar-mousse-93ab5f/functions
2. Verify environment variable is set correctly
3. Check OpenAI API key is valid
4. Ensure you have OpenAI API credits

### If you get errors:
1. Check browser console for JavaScript errors
2. Check Netlify function logs
3. Verify all files are committed and pushed

## 📊 **Monitoring**

### Check Usage:
- **OpenAI**: https://platform.openai.com/usage
- **Netlify**: https://app.netlify.com/projects/stellar-mousse-93ab5f/functions

### Set Up Alerts (Optional):
- Monitor API usage in OpenAI dashboard
- Set up billing alerts

## 🔄 **Updates**

To update the AI behavior:
1. Edit the `systemPrompt` in `netlify/functions/ai-chat.js`
2. Commit and push changes
3. Netlify will automatically redeploy

## 📞 **Support**

If you need help:
1. Check Netlify function logs
2. Verify environment variables
3. Test with a simple question first
4. Contact OpenAI support if API issues

---

**Next Steps:**
1. Get your OpenAI API key
2. Add it to Netlify environment variables
3. Deploy the changes
4. Test the AI chat functionality

Your AI dental assistant will then provide intelligent, contextual responses to patient questions! 🤖🦷 