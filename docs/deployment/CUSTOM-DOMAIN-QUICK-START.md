# Custom Domain Quick Start Checklist

A simple step-by-step checklist to get your custom domain live on Netlify.

## 🎯 Choose Your Path

**Option A:** Buying a new domain → [Go to Section 1](#1-buying-a-new-domain-through-netlify)

**Option B:** Using existing domain → [Go to Section 2](#2-using-your-existing-domain)

---

## 1. Buying a New Domain Through Netlify

### Steps (5 minutes)

- [ ] Log in to [Netlify Dashboard](https://app.netlify.com)
- [ ] Select your site
- [ ] Go to **Site settings** → **Domain management**
- [ ] Click **"Buy a new domain"**
- [ ] Search for your desired domain (e.g., `dr-genchev.com`)
- [ ] Select domain and complete purchase
- [ ] **Done!** Domain is automatically configured

### What Happens Next

- ✅ Domain added automatically
- ✅ DNS configured automatically
- ✅ SSL certificate provisioned (24-48 hours)
- ✅ Site live at your custom domain

**Total Time:** ~5 minutes + 24-48 hours for SSL

---

## 2. Using Your Existing Domain

### Step 1: Add Domain to Netlify (2 minutes)

- [ ] Log in to [Netlify Dashboard](https://app.netlify.com)
- [ ] Select your site
- [ ] Go to **Site settings** → **Domain management**
- [ ] Click **"Add custom domain"**
- [ ] Enter your domain (e.g., `dr-genchev.com`)
- [ ] Click **"Verify"**

### Step 2A: Use Netlify DNS (Easiest - Recommended)

- [ ] In Netlify, click **"Set up Netlify DNS"**
- [ ] Copy the nameservers provided (e.g., `dns1.p01.nsone.net`)
- [ ] Go to your domain registrar (GoDaddy, Namecheap, etc.)
- [ ] Find **Nameservers** or **DNS** settings
- [ ] Replace existing nameservers with Netlify's nameservers
- [ ] Save changes
- [ ] Return to Netlify and wait for verification

**Time:** ~10 minutes + 24-48 hours for propagation

### Step 2B: Use External DNS (Keep Current DNS)

- [ ] In Netlify, choose **"Use external DNS"**
- [ ] Copy the DNS records shown (A/CNAME and TXT records)
- [ ] Go to your domain registrar's DNS management
- [ ] Add the A or CNAME record for root domain:
  - Type: `A` or `CNAME` (as specified by Netlify)
  - Name: `@` or blank
  - Value: (provided by Netlify)
- [ ] Add CNAME record for www:
  - Type: `CNAME`
  - Name: `www`
  - Value: `your-site.netlify.app`
- [ ] Add TXT record for verification:
  - Type: `TXT`
  - Name: `@` or blank
  - Value: (provided by Netlify)
- [ ] Save all records
- [ ] Return to Netlify and click **"Verify"**

**Time:** ~15 minutes + 24-48 hours for propagation

### Step 2C: Use Cloudflare DNS (Special Instructions)

**If using Cloudflare, see:** `docs/deployment/CLOUDFLARE-SETUP.md`

**Quick options:**
- **Netlify SSL:** Set records to **DNS only** (gray cloud)
- **Cloudflare SSL:** Set records to **Proxied** (orange cloud) + configure SSL/TLS mode

**Time:** ~15 minutes + 24-48 hours for propagation

### Step 3: Wait and Verify

- [ ] Wait 24-48 hours for DNS propagation
- [ ] Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
- [ ] Verify domain shows "Verified" in Netlify
- [ ] Wait for SSL certificate (24-48 hours after verification)
- [ ] Test your site: `https://your-domain.com`

---

## 3. Post-Setup Tasks

### Multiple Domains? (If Applicable)

- [ ] If you have multiple domains, add them all to Netlify
- [ ] **Important:** Set one as primary domain (Options → Set as primary domain)
- [ ] Order doesn't matter, but primary domain does!
- [ ] See `MULTIPLE-DOMAINS.md` for detailed guide

### Update Environment Variables

- [ ] Go to **Site settings** → **Environment variables**
- [ ] Find `SITE_URL`
- [ ] Update to: `https://your-primary-domain.com` (use primary domain)
- [ ] Save (site will redeploy automatically)

### Final Verification

- [ ] Site loads at `https://your-domain.com` ✅
- [ ] Site loads at `https://www.your-domain.com` ✅
- [ ] HTTP redirects to HTTPS ✅
- [ ] SSL certificate shows "Active" in Netlify ✅
- [ ] Contact form works ✅
- [ ] All website features work ✅

---

## ⏱️ Timeline Summary

| Step | Time |
|------|------|
| Add domain to Netlify | 2-5 minutes |
| Configure DNS | 10-15 minutes |
| DNS propagation | 24-48 hours |
| SSL certificate | 24-48 hours (after DNS) |
| **Total** | **~48-96 hours** |

---

## 🆘 Quick Troubleshooting

**Domain not working?**
- Wait 24-48 hours (DNS propagation takes time)
- Check DNS records are correct
- Verify domain is "Verified" in Netlify

**SSL not working?**
- Wait 24-48 hours after DNS verification
- Ensure domain is verified
- Check for DNS errors

**Need help?**
- See full guide: `CUSTOM-DOMAIN-SETUP.md`
- Check [Netlify Docs](https://docs.netlify.com/domains-https/custom-domains/)

---

## 📝 Notes

Write your domain details here:

- **Domain:** _________________________
- **Registrar:** _________________________
- **Added to Netlify:** _________________________
- **DNS Configured:** _________________________
- **SSL Active:** _________________________

---

**Ready to start?** Choose your path above and follow the checklist! 🚀

