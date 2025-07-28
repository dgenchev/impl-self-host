# Images Directory

This directory contains all images for the Dr. Genchev website.

## Directory Structure

```
images/
├── logo/
│   ├── favicon.ico          # Website favicon
│   ├── logo.png             # Main logo
│   └── logo-white.png       # White version for dark backgrounds
├── hero/
│   ├── hero-bg.jpg          # Hero section background
│   └── hero-patient.jpg     # Smiling patient image
├── doctor/
│   ├── dr-genchev.jpg       # Dr Genchev portrait
│   └── dr-genchev-clinic.jpg # Dr Genchev at clinic
├── certificates/
│   ├── clinical-master.jpg  # Clinical Master certificate
│   └── implant-foundation.jpg # Implant Foundation certificate
├── testimonials/
│   ├── patient-1.jpg        # Margaret Challener
│   ├── patient-2.jpg        # Mark McClellan
│   └── patient-3.jpg        # Emily Jones
├── procedure/
│   ├── before-after-1.jpg   # Before/after case 1
│   ├── before-after-2.jpg   # Before/after case 2
│   └── implant-model.jpg    # Dental implant model
└── clinic/
    ├── clinic-exterior.jpg  # Clinic building
    ├── clinic-interior.jpg  # Treatment room
    └── equipment.jpg        # Dental equipment
```

## How to Extract Images from Wix

### Method 1: Browser Developer Tools
1. Go to your current Wix website
2. Right-click on any image and select "Inspect Element"
3. Find the `<img>` tag and copy the `src` attribute URL
4. Open the URL in a new tab and save the image
5. Rename and place in appropriate directory

### Method 2: Wix Media Library
1. Log into your Wix account
2. Go to Media Library
3. Download all images
4. Organize them according to the structure above

### Method 3: Automated Extraction (Recommended)
Use a browser extension like "Image Downloader" to extract all images from your current site.

## Image Optimization

Before uploading to the website:
1. **Resize images** to appropriate dimensions
2. **Compress images** using tools like TinyPNG or ImageOptim
3. **Convert to WebP format** for better performance (with fallback to JPG/PNG)
4. **Ensure proper aspect ratios**

## Recommended Image Sizes

- **Hero images**: 1920x1080px
- **Profile photos**: 400x400px
- **Testimonial photos**: 300x300px
- **Certificate images**: 800x600px
- **Clinic photos**: 1200x800px

## Next Steps

1. Extract images from your current Wix site
2. Organize them in this directory structure
3. Optimize and compress images
4. Update the HTML to reference the new image paths 