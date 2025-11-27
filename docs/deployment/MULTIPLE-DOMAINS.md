# Multiple Domains Setup Guide

Quick guide for setting up multiple domains pointing to the same Netlify site.

## 🎯 Quick Answer

**Order doesn't matter** when adding domains, but you **must set one as primary** after adding them.

---

## ✅ Step-by-Step Process

### 1. Add Your First Domain

1. Go to Netlify Dashboard → Site settings → Domain management
2. Click "Add custom domain"
3. Enter your first domain (e.g., `dr-genchev.com`)
4. Configure DNS (follow your chosen method from the main guide)
5. Wait for verification (usually a few minutes to 24 hours)

### 2. Add Your Second Domain

1. Still in Domain management, click "Add custom domain" again
2. Enter your second domain (e.g., `drgenchev.com`)
3. Configure DNS for this domain (same process)
4. Wait for verification

**Note:** You can add domains in any order. Netlify doesn't care which one you add first.

### 3. Set the Primary Domain (IMPORTANT)

After both domains are verified:

1. In Domain management, you'll see both domains listed
2. Find the domain you want as your main/primary domain
3. Click the **"Options"** button (three dots) next to it
4. Select **"Set as primary domain"**
5. The primary domain will be marked with a star (⭐) or "Primary" label

**Result:**
- Primary domain: Serves content directly
- Other domain(s): Automatically redirect to primary domain
- Both get SSL certificates
- Both work, but one is canonical

---

## 🔍 Why Primary Domain Matters

### SEO Benefits
- **Prevents duplicate content:** Search engines know which domain is canonical
- **Consolidates rankings:** All link equity goes to one domain
- **Better indexing:** Clear signal to search engines about your main domain

### Technical Benefits
- **Consistent URLs:** Internal links use primary domain
- **Analytics:** Easier tracking with one canonical domain
- **SSL verification:** Primary domain used for certificate validation
- **Redirects:** Non-primary domains automatically redirect (301 redirect)

---

## 📋 Common Scenarios

### Scenario 1: www vs non-www

**Example:**
- `dr-genchev.com` (non-www)
- `www.dr-genchev.com` (www)

**Recommendation:**
- Set **non-www** as primary (modern best practice)
- www will automatically redirect to non-www

**DNS Setup:**
- Both need DNS records
- Both get SSL certificates
- Netlify handles redirects automatically

### Scenario 2: Different TLDs

**Example:**
- `dr-genchev.com` (.com)
- `dr-genchev.bg` (.bg - Bulgarian extension)

**Recommendation:**
- Set `.com` as primary (most recognized globally)
- `.bg` redirects to `.com` (or vice versa if targeting Bulgarian market)

**Note:** If you want different content per TLD, you'd need separate Netlify sites.

### Scenario 3: Typo Domains

**Example:**
- `dr-genchev.com` (correct spelling)
- `drgenchev.com` (no hyphen, common typo)

**Recommendation:**
- Set the correct spelling as primary
- Typo domain redirects to correct one
- Catches users who type the wrong URL

---

## ⚙️ Changing Primary Domain Later

You can change the primary domain anytime:

1. Go to Domain management
2. Click Options on the domain you want to make primary
3. Select "Set as primary domain"
4. The previous primary becomes an alias

**Note:** Changing primary domain can temporarily affect:
- SEO (search engines need to reindex)
- Analytics (may see traffic split)
- SSL (certificates update automatically)

---

## 🔒 SSL Certificates

**Good news:** Each domain gets its own SSL certificate automatically!

- ✅ Primary domain: Gets SSL certificate
- ✅ Alias domains: Get their own SSL certificates
- ✅ All certificates renew automatically
- ✅ No additional configuration needed

---

## 🧪 Testing Multiple Domains

After setup, test:

- [ ] Primary domain loads: `https://primary-domain.com` ✅
- [ ] Alias domain redirects: `https://alias-domain.com` → redirects to primary ✅
- [ ] Both have SSL: Check for padlock icon ✅
- [ ] HTTP redirects to HTTPS on both ✅
- [ ] Forms work on both domains ✅
- [ ] All features work correctly ✅

---

## 📊 Example: Complete Setup

**Domains:**
1. `dr-genchev.com` (primary) ⭐
2. `www.dr-genchev.com` (alias)
3. `drgenchev.com` (alias, typo protection)

**Result:**
- All three domains work
- `www.dr-genchev.com` → redirects to `dr-genchev.com`
- `drgenchev.com` → redirects to `dr-genchev.com`
- All have SSL certificates
- SEO consolidated to primary domain

---

## ⚠️ Important Notes

1. **Order doesn't matter:** Add domains in any order
2. **Primary is required:** Always set one domain as primary
3. **Redirects are automatic:** Netlify handles redirects from aliases
4. **SSL is automatic:** Each domain gets its own certificate
5. **DNS for each:** Each domain needs its own DNS configuration
6. **Verification for each:** Each domain must be verified separately

---

## 🐛 Troubleshooting

### Both domains show same content but no redirect

**Problem:** Both domains work but alias doesn't redirect to primary

**Solution:**
- Ensure one domain is set as primary
- Check Domain management → should see "Primary" label
- If not set, set it now (Options → Set as primary domain)

### SSL certificate issues on alias domain

**Problem:** Primary has SSL but alias doesn't

**Solution:**
- Wait 24-48 hours (SSL provisioning takes time)
- Verify alias domain is verified in Netlify
- Check DNS records are correct for alias domain
- SSL certificates are provisioned separately for each domain

### SEO concerns with multiple domains

**Problem:** Worried about duplicate content penalties

**Solution:**
- Netlify automatically redirects aliases to primary (301 redirect)
- This tells search engines which domain is canonical
- No duplicate content issues when primary is set correctly

---

## 💡 Best Practices

1. ✅ **Set primary immediately** after adding domains
2. ✅ **Choose primary wisely** - your main brand domain
3. ✅ **Use redirects** - let Netlify handle them automatically
4. ✅ **Test both domains** - ensure redirects work
5. ✅ **Monitor SSL** - wait for certificates on all domains
6. ✅ **Update SITE_URL** - use primary domain in environment variables

---

## 🔗 Related Guides

- [Custom Domain Setup](CUSTOM-DOMAIN-SETUP.md) - Main setup guide
- [Cloudflare Setup](CLOUDFLARE-SETUP.md) - If using Cloudflare DNS

---

**Summary:** Add domains in any order, but always set one as primary! 🚀

