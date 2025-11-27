# Custom Domain Setup Guide for Dr Genchev Website

This guide will help you configure your own domain name for your website hosted on Netlify.

## 📋 Overview

Your website is currently accessible at a Netlify subdomain (e.g., `your-site.netlify.app`). This guide covers two scenarios:
1. **Buying a new domain** through Netlify
2. **Using an existing domain** you already own

Both options will give you:
- ✅ Custom domain name (e.g., `dr-genchev.com`)
- ✅ Automatic HTTPS/SSL certificate (free)
- ✅ Global CDN for fast loading
- ✅ Professional appearance

---

## 🎯 Option 1: Buy a New Domain Through Netlify

**Best for:** If you don't have a domain yet or want the simplest setup.

### Step 1: Access Domain Settings

1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Select your site (Dr Genchev website)
3. Go to **Site settings** → **Domain management**
4. Click **"Add custom domain"** or **"Buy a new domain"**

### Step 2: Search and Purchase Domain

1. Enter your desired domain name (e.g., `dr-genchev.com`, `dentalimplantsgenchev.com`)
2. Netlify will show available options and prices
3. Select your preferred domain extension (.com, .bg, etc.)
4. Complete the purchase through Netlify's domain registrar
5. **Cost:** Typically $10-15/year for .com domains

### Step 3: Automatic Configuration

Once purchased:
- ✅ Domain is automatically added to your site
- ✅ DNS is automatically configured
- ✅ SSL certificate is automatically provisioned (takes 24-48 hours)
- ✅ Your site will be live at your custom domain

**That's it!** No additional configuration needed.

---

## 🔧 Option 2: Use Your Existing Domain

**Best for:** If you already own a domain from another registrar (GoDaddy, Namecheap, Google Domains, etc.).

### Step 1: Add Domain to Netlify

1. Log in to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Domain management**
4. Click **"Add custom domain"**
5. Enter your domain name (e.g., `dr-genchev.com`)
6. Click **"Verify"**

### Step 2: Choose DNS Configuration Method

You have two options for DNS:

#### **Option A: Use Netlify DNS (Recommended - Easiest)**

**Benefits:**
- ✅ Automatic DNS management
- ✅ Faster SSL certificate provisioning
- ✅ Better integration with Netlify features
- ✅ Free DNS hosting

**Steps:**
1. In Netlify Domain settings, click **"Set up Netlify DNS"**
2. Netlify will provide you with **nameservers** (e.g., `dns1.p01.nsone.net`, `dns2.p01.nsone.net`)
3. Go to your domain registrar's control panel
4. Find the **Nameservers** or **DNS** settings
5. Replace existing nameservers with Netlify's nameservers
6. Save changes

**Propagation time:** 24-48 hours (can be faster)

#### **Option B: Use External DNS (Keep Current DNS Provider)**

**Use this if:** You want to keep managing DNS at your current provider or have other services using the same domain.

**Steps:**
1. In Netlify Domain settings, choose **"Use external DNS"**
2. Netlify will show you the DNS records you need to add:
   - **A Record** or **CNAME Record** (Netlify will specify which)
   - **TXT Record** (for domain verification)

3. Go to your domain registrar's DNS management panel
4. Add the DNS records exactly as shown in Netlify:
   - **For root domain (dr-genchev.com):**
     - Type: `A` or `CNAME`
     - Name: `@` or leave blank (depends on provider)
     - Value: Netlify's IP address or hostname (provided by Netlify)
     - TTL: `3600` (or default)
   
   - **For www subdomain (www.dr-genchev.com):**
     - Type: `CNAME`
     - Name: `www`
     - Value: `your-site.netlify.app` (your Netlify site URL)
     - TTL: `3600`

   - **For domain verification:**
     - Type: `TXT`
     - Name: `@` or leave blank
     - Value: (provided by Netlify for verification)
     - TTL: `3600`

5. Save all DNS records
6. Return to Netlify and click **"Verify"**

**Propagation time:** 24-48 hours for DNS changes to propagate globally

#### **Option C: Use Cloudflare DNS (Special Instructions)**

**Use this if:** You're already using Cloudflare for DNS and want to keep using it.

**Important:** You have two SSL options when using Cloudflare:

##### **Cloudflare SSL Option 1: Use Netlify SSL (Recommended for Simplicity)**

**Benefits:**
- ✅ Netlify manages SSL automatically
- ✅ No SSL configuration needed
- ✅ Works seamlessly with Netlify features

**Steps:**
1. In Netlify Domain settings, choose **"Use external DNS"**
2. Note the DNS records Netlify provides (A/CNAME and TXT)
3. Log in to your **Cloudflare dashboard**
4. Go to **DNS** → **Records**
5. Add the DNS records from Netlify:
   - **For root domain:**
     - Type: `A` or `CNAME` (as specified by Netlify)
     - Name: `@`
     - IPv4 address or Target: (Netlify's IP or hostname)
     - **Proxy status: DNS only** (gray cloud icon) ⚠️ **IMPORTANT**
     - TTL: Auto
   
   - **For www subdomain:**
     - Type: `CNAME`
     - Name: `www`
     - Target: `your-site.netlify.app`
     - **Proxy status: DNS only** (gray cloud icon) ⚠️ **IMPORTANT**
     - TTL: Auto
   
   - **For verification:**
     - Type: `TXT`
     - Name: `@`
     - Content: (provided by Netlify)
     - TTL: Auto

6. **Critical:** Ensure both records have **gray cloud** (DNS only), NOT orange cloud (proxied)
7. Save records
8. Return to Netlify and verify domain

**Why DNS only?** This prevents SSL conflicts between Cloudflare and Netlify. Netlify will handle SSL.

##### **Cloudflare SSL Option 2: Use Cloudflare SSL (Advanced)**

**Benefits:**
- ✅ Cloudflare's CDN and DDoS protection
- ✅ Cloudflare's SSL/TLS features
- ✅ Additional security layers

**Steps:**
1. In Netlify Domain settings, choose **"Use external DNS"**
2. Note the DNS records Netlify provides
3. Log in to your **Cloudflare dashboard**
4. Go to **DNS** → **Records**
5. Add the DNS records:
   - **For root domain:**
     - Type: `A` or `CNAME`
     - Name: `@`
     - IPv4 address or Target: (Netlify's IP or hostname)
     - **Proxy status: Proxied** (orange cloud icon) ✅
     - TTL: Auto
   
   - **For www subdomain:**
     - Type: `CNAME`
     - Name: `www`
     - Target: `your-site.netlify.app`
     - **Proxy status: Proxied** (orange cloud icon) ✅
     - TTL: Auto

6. Go to **SSL/TLS** in Cloudflare dashboard
7. Set **SSL/TLS encryption mode** to **"Full"** or **"Full (strict)"**
   - **Full:** Cloudflare encrypts traffic to origin (Netlify), accepts any SSL certificate
   - **Full (strict):** Cloudflare encrypts traffic, validates Netlify's SSL certificate (recommended)
8. Cloudflare will automatically provision SSL certificate
9. Return to Netlify and verify domain

**Note:** With this setup, Cloudflare handles SSL termination. Netlify will still provision SSL for the connection between Cloudflare and Netlify.

**Which SSL option to choose?**
- **Netlify SSL (Option 1):** Simpler, recommended if you don't need Cloudflare's CDN features
- **Cloudflare SSL (Option 2):** Better if you want Cloudflare's CDN, DDoS protection, and additional security features

### Step 3: Wait for DNS Propagation

- DNS changes can take 24-48 hours to propagate worldwide
- You can check propagation status using tools like:
  - [whatsmydns.net](https://www.whatsmydns.net)
  - [dnschecker.org](https://dnschecker.org)

### Step 4: SSL Certificate Provisioning

Once DNS is configured:
- Netlify automatically provisions a free SSL certificate
- This typically takes 24-48 hours after DNS is verified
- You'll see the status in Netlify dashboard
- Your site will automatically redirect HTTP → HTTPS

**Important:** You typically don't need to manually add SSL certificates. Netlify does this automatically.

**If you see an error:** "certificate parameter is required when updating an existing certificate"
- This usually means there's an existing certificate state
- Delete any failed/pending certificates and wait for automatic provisioning
- See [SSL Certificate Troubleshooting](SSL-CERTIFICATE-TROUBLESHOOTING.md) for detailed help

---

## 🔒 HTTPS/SSL Configuration

### Using Netlify SSL (Default)

Netlify provides **free SSL certificates** automatically:

1. **Automatic Provisioning:** Once your domain is verified, Netlify automatically requests an SSL certificate from Let's Encrypt
2. **Status:** Check in **Site settings** → **Domain management** → **HTTPS**
3. **Timeline:** Usually 24-48 hours after DNS verification
4. **Automatic Renewal:** Certificates renew automatically (no action needed)

**Note:** If using Cloudflare with **DNS only** (gray cloud), Netlify handles SSL.

### Using Cloudflare SSL

If you're using Cloudflare with **proxied** records (orange cloud):

1. **Cloudflare SSL:** Cloudflare automatically provisions SSL certificates
2. **Configuration:** Go to Cloudflare dashboard → **SSL/TLS**
3. **Encryption Mode:** Set to **"Full"** or **"Full (strict)"**
   - **Full (strict)** is recommended - validates Netlify's SSL certificate
4. **Automatic:** Cloudflare SSL is provisioned automatically when domain is proxied
5. **Renewal:** Cloudflare handles certificate renewal automatically

**Benefits of Cloudflare SSL:**
- ✅ Free SSL certificates
- ✅ Additional CDN and DDoS protection
- ✅ Advanced security features
- ✅ Better performance for global visitors

### Force HTTPS (Recommended)

**For Netlify SSL:**
1. Go to **Site settings** → **Domain management** → **HTTPS**
2. Ensure **"Force HTTPS"** is enabled
3. This ensures all traffic uses secure HTTPS

**For Cloudflare SSL:**
1. Go to Cloudflare dashboard → **SSL/TLS**
2. Enable **"Always Use HTTPS"** (automatic redirect HTTP → HTTPS)
3. This ensures all traffic uses secure HTTPS

---

## 🌐 Domain Configuration Options

### Multiple Domains - Order Doesn't Matter, But Primary Domain Does

**Short answer:** The order you add domains doesn't matter, but you **must** set one as the primary domain.

**Why this matters:**
- SEO: Search engines need to know which domain is canonical
- Analytics: Consistent tracking across domains
- Links: Internal links and redirects use the primary domain
- SSL: All domains get SSL, but primary is used for verification

### Setting the Primary Domain

**Important:** After adding all your domains, set one as primary:

1. Go to **Site settings** → **Domain management**
2. You'll see all your domains listed
3. Click the **"Options"** button (three dots) next to the domain you want as primary
4. Select **"Set as primary domain"**
5. The primary domain will be marked with a star (⭐) or "Primary" label

**Which domain should be primary?**
- Choose your main brand domain (e.g., `dr-genchev.com` over `drgenchev.com`)
- Prefer non-www over www (or vice versa, but be consistent)
- Choose the domain you'll use in marketing and business cards

**Note about Netlify's CDN warning:**
- If you set an apex domain (e.g., `dentalimplantsgenchev.com`) as primary, Netlify may show a warning about CDN benefits
- This warning is **informational only** - your site still gets full CDN benefits
- The performance difference between apex and www is minimal (< 50ms typically)
- Many major sites use apex domains as primary (GitHub, Stripe, etc.)
- See [Apex Domain CDN Warning Guide](APEX-DOMAIN-CDN-WARNING.md) for detailed explanation

### Domain Aliases and Redirects

You can add multiple domains that all point to the same site:

**Example setup:**
- `dr-genchev.com` (primary) ⭐
- `www.dr-genchev.com` (alias - redirects to primary)
- `drgenchev.com` (alias - redirects to primary, if you own it)

**How it works:**
- All domains serve the same content
- Non-primary domains automatically redirect to primary domain
- This prevents duplicate content issues in SEO
- All domains get SSL certificates automatically

### Adding Multiple Domains - Step by Step

1. **Add first domain:**
   - Follow the setup steps above for your first domain
   - Wait for verification and SSL (24-48 hours)

2. **Add second domain:**
   - Go to **Domain management** → **Add custom domain**
   - Enter your second domain
   - Configure DNS (same process as first domain)
   - Wait for verification

3. **Set primary domain:**
   - Once both domains are verified
   - Click **Options** → **Set as primary domain** on your preferred domain
   - The other domain will automatically become an alias

**Note:** You can change the primary domain later if needed, but it's best to set it correctly from the start.

### Subdomain Setup

If you want a subdomain (e.g., `blog.dr-genchev.com`):

1. Add the subdomain in Netlify: `blog.dr-genchev.com`
2. Add DNS record at your registrar:
   - Type: `CNAME`
   - Name: `blog`
   - Value: `your-site.netlify.app`
3. Netlify will automatically provision SSL

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Domain is added in Netlify dashboard
- [ ] DNS records are configured correctly
- [ ] DNS propagation is complete (check with dnschecker.org)
- [ ] Domain verification shows "Verified" in Netlify
- [ ] SSL certificate is provisioned (shows "Active" in Netlify)
- [ ] Site loads at `https://your-domain.com`
- [ ] Site loads at `https://www.your-domain.com` (if configured)
- [ ] HTTP redirects to HTTPS automatically
- [ ] All website features work (forms, functions, etc.)

---

## 🔍 Troubleshooting

### Domain Not Resolving

**Problem:** Domain shows "Not verified" or doesn't load

**Solutions:**
1. Wait 24-48 hours for DNS propagation
2. Verify DNS records are correct at your registrar
3. Check nameservers are correct (if using Netlify DNS)
4. Clear your browser cache and try again
5. Use `dig` or `nslookup` to check DNS records:
   ```bash
   dig your-domain.com
   nslookup your-domain.com
   ```

### SSL Certificate Not Provisioning

**Problem:** SSL certificate shows "Pending" or "Failed"

**Solutions:**
1. Ensure DNS is fully propagated (check with dnschecker.org)
2. Verify domain is marked as "Verified" in Netlify
3. Wait 24-48 hours (can take time)
4. Check for any DNS errors in Netlify dashboard
5. Try removing and re-adding the domain

### Mixed Content Warnings

**Problem:** Browser shows "Not Secure" or mixed content warnings

**Solutions:**
1. Ensure all resources (images, scripts) use HTTPS URLs
2. Check your `index.html` for any `http://` URLs
3. Update any external resources to use HTTPS
4. Clear browser cache

### www vs Non-www

**Problem:** Only one version works (www or non-www)

**Solutions:**
1. Add both `your-domain.com` and `www.your-domain.com` in Netlify
2. Set one as primary (recommended: non-www)
3. Netlify will automatically redirect the other to primary
4. Ensure DNS records are set for both

---

## 📝 Update Environment Variables

After your domain is live, update the `SITE_URL` environment variable:

1. Go to **Site settings** → **Environment variables**
2. Find `SITE_URL`
3. Update it to your new domain:
   ```
   https://dr-genchev.com
   ```
4. Redeploy your site (or wait for next automatic deployment)

This ensures all internal links and webhooks use the correct domain.

---

## 🎯 Recommended Domain Names

Based on your website content, consider these domain options:

- `dr-genchev.com` (professional, clear)
- `dentalimplantsgenchev.com` (descriptive, SEO-friendly)
- `genchev-dental.com` (short, memorable)
- `drgenchev.bg` (Bulgarian extension, local SEO)

**Tips:**
- `.com` is most recognized globally
- `.bg` is good for Bulgarian market
- Keep it short and memorable
- Avoid hyphens if possible (but `dr-genchev.com` is fine)

---

## 📚 Additional Resources

- [Netlify Domain Documentation](https://docs.netlify.com/domains-https/custom-domains/)
- [Netlify DNS Documentation](https://docs.netlify.com/domains-https/netlify-dns/)
- [Netlify SSL/TLS Documentation](https://docs.netlify.com/domains-https/https-ssl/)
- [Cloudflare Setup Guide](CLOUDFLARE-SETUP.md) - Detailed guide for Cloudflare users
- [DNS Propagation Checker](https://www.whatsmydns.net)

---

## 🚀 Next Steps After Domain Setup

Once your domain is live:

1. ✅ Update `SITE_URL` environment variable
2. ✅ Test all website features (forms, chatbot, etc.)
3. ✅ Update any hardcoded URLs in your code
4. ✅ Submit sitemap to Google Search Console
5. ✅ Set up Google Analytics (if using)
6. ✅ Share your new domain with patients!

---

## 💡 Quick Reference: DNS Record Types

- **A Record:** Points domain to an IP address
- **CNAME Record:** Points domain to another hostname (alias)
- **TXT Record:** Used for verification and email (SPF, DKIM)
- **MX Record:** For email (not needed for website only)
- **NS Record:** Nameservers (if using Netlify DNS)

---

**Need Help?** If you encounter issues, check Netlify's status page or contact their support. The setup is usually straightforward, but DNS propagation can take time.

