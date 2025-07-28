# Google Maps Setup Guide

This guide will help you set up the Google Maps integration with your clinic's exact location.

## 1. **Get Your Clinic's Coordinates**

### Method 1: Google Maps
1. Go to [Google Maps](https://maps.google.com)
2. Search for your clinic address in Plovdiv
3. Right-click on the exact location
4. Select the coordinates (e.g., 42.150000, 24.750000)

### Method 2: Google My Business
1. Log into [Google My Business](https://business.google.com)
2. Find your clinic listing
3. Check the address and coordinates

## 2. **Generate Embed Code**

### Step 1: Go to Google Maps Embed
1. Visit [Google Maps Embed](https://developers.google.com/maps/documentation/embed/guide)
2. Or go to Google Maps → Share → Embed a map

### Step 2: Configure the Map
1. **Search for your location**: Enter your clinic address
2. **Choose size**: Select "Large" or custom size
3. **Copy the embed code**

### Step 3: Update the HTML
Replace the placeholder iframe in `index.html`:

```html
<!-- Current placeholder -->
<iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.1234567890123!2d24.750000000000000!3d42.150000000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDA5JzAwLjAiTiAyNMKwNDUnMDAuMCJF!5e0!3m2!1sen!2sbg!4v1234567890123"
    width="100%" 
    height="450" 
    style="border:0;" 
    allowfullscreen="" 
    loading="lazy" 
    referrerpolicy="no-referrer-when-downgrade">
</iframe>

<!-- Replace with your actual embed code -->
```

## 3. **Customize Map Appearance**

### Map Style Options
You can customize the map appearance by adding parameters to the URL:

```html
<!-- Basic embed -->
<iframe src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"></iframe>

<!-- With custom styling -->
<iframe 
    src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE&zoom=15&maptype=roadmap"
    width="100%" 
    height="450" 
    style="border:0;" 
    allowfullscreen="" 
    loading="lazy" 
    referrerpolicy="no-referrer-when-downgrade">
</iframe>
```

### Available Parameters:
- `zoom=15` - Set zoom level (10-20)
- `maptype=roadmap` - Map type (roadmap, satellite, hybrid, terrain)
- `language=bg` - Language (bg for Bulgarian)

## 4. **Add Custom Marker**

### Method 1: Google My Business
1. Ensure your clinic is listed on Google My Business
2. The marker will automatically appear

### Method 2: Custom Marker
Add a custom marker by including coordinates in the embed URL:

```html
<iframe 
    src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE&markers=color:red%7Clabel:Dr%20Genchev%7C42.150000,24.750000"
    width="100%" 
    height="450" 
    style="border:0;" 
    allowfullscreen="" 
    loading="lazy" 
    referrerpolicy="no-referrer-when-downgrade">
</iframe>
```

## 5. **Responsive Design**

The map is already responsive, but you can adjust the height for different screen sizes:

```css
/* Current CSS */
.map-container iframe {
    display: block;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .map-container iframe {
        height: 300px;
    }
}

@media (max-width: 480px) {
    .map-container iframe {
        height: 250px;
    }
}
```

## 6. **Performance Optimization**

### Lazy Loading
The iframe already includes `loading="lazy"` for better performance.

### Preload (Optional)
Add preload for faster loading:

```html
<link rel="preload" href="https://www.google.com/maps/embed?..." as="iframe">
```

## 7. **Accessibility**

### Add ARIA Labels
```html
<iframe 
    src="..."
    aria-label="Map showing Dr Genchev's dental clinic location in Plovdiv, Bulgaria"
    title="Dr Genchev Dental Clinic Location">
</iframe>
```

## 8. **Testing**

### Test Steps:
1. **Desktop**: Check map loads correctly
2. **Mobile**: Verify responsive behavior
3. **Directions**: Test "Get Directions" functionality
4. **Performance**: Check loading speed

### Common Issues:
- **Map not loading**: Check internet connection
- **Wrong location**: Verify coordinates
- **Slow loading**: Consider lazy loading

## 9. **Alternative: Static Map**

If you prefer a static image instead of an interactive map:

```html
<img 
    src="https://maps.googleapis.com/maps/api/staticmap?center=42.150000,24.750000&zoom=15&size=600x450&markers=color:red%7Clabel:Dr%20Genchev%7C42.150000,24.750000&key=YOUR_API_KEY"
    alt="Dr Genchev Dental Clinic Location"
    width="100%"
    height="450">
```

## 10. **Next Steps**

1. **Get your exact coordinates** from Google Maps
2. **Generate the embed code** from Google Maps
3. **Replace the placeholder** in `index.html`
4. **Test the map** on different devices
5. **Customize appearance** if needed

---

**Need Help?** Check Google Maps documentation: https://developers.google.com/maps/documentation/embed/guide 