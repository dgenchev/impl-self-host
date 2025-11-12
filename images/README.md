# Image Assets Guide

## Overview
This directory contains all image assets for the Dr. Genchev website.

## Directory Structure

### `/features/`
**Smiling Patient Photo**
- Filename: `smiling-patient.jpg`
- Dimensions: 300×400px (portrait)
- Purpose: Showcases happy patient in Key Features section
- Optimization: Compress to ~200KB
- Alt text: "Smiling Patient"

### `/about/`
**Dr. Genchev Portrait**
- Filename: `dr-genchev-portrait.jpg`
- Dimensions: 300×400px (portrait)
- Purpose: Professional photo for About section
- Optimization: Compress to ~200KB
- Alt text: "Dr Genchev"

### `/certifications/`
**Clinical Master Certificate**
- Filename: `clinical-master-certificate.jpg`
- Dimensions: 500×300px (landscape)
- Purpose: Display professional certification
- Optimization: Compress to ~250KB
- Alt text: "Clinical Master Certificate"

**Clinic Photo**
- Filename: `clinic-photo.jpg`
- Dimensions: 300×400px (portrait)
- Purpose: Dr. Genchev working at the dental clinic
- Optimization: Compress to ~200KB
- Alt text: "Dr Genchev at the Dental Clinic"

## Image Specifications

### Format Recommendations
1. **Primary:** JPG (JPEG) - best for photos
2. **Alternative:** WebP - better compression, modern browsers
3. **Avoid:** PNG - unnecessary for photos, larger file size

### Quality Guidelines
- Target file size: 150-250KB per image
- Quality setting: 75-85% (JPEG)
- Use progressive encoding for faster loading
- Optimize with tools like:
  - TinyPNG (https://tinypng.com)
  - Squoosh (https://squoosh.app)
  - ImageOptim (Mac)
  - RIOT (Windows)

### Retina Display Support (Optional)
For crisp images on high-resolution displays:
- Create 2× versions at double dimensions
- Example: `smiling-patient@2x.jpg` at 600×800px
- Serve via CSS media queries or `srcset` attribute

## Upload Instructions

1. Prepare your images according to specifications above
2. Optimize file size while maintaining quality
3. Upload to the appropriate folder
4. Test on the website to ensure proper display
5. Check on mobile devices

## Current Status

- [✓] Folder structure created
- [✓] Image paths configured in HTML
- [✓] CSS styling applied
- [ ] Images uploaded (pending)

## Placeholder Fallback

Until images are uploaded, the website will show:
- Dashed border containers with text labels
- This helps identify where images should appear
- Images will automatically display once files are uploaded with correct names

## Need Help?

If you need assistance with:
- Image resizing
- Format conversion
- Optimization
- Retina display setup

Contact your web developer or use the online tools mentioned above.

---

*Last updated: October 13, 2025*
