# Project Template Reference

## Overview
This document provides a complete reference for creating new pages and restyling existing pages using the project's template system. The template includes all styling and functionality needed for consistent page development.

## File Structure and Components

### Base Files
- `template.css` - Main CSS stylesheet containing all styling
- `template.html` - Base HTML structure with all required components

### Key Components Included
1. **Custom Cursor** - Interactive mouse cursor with hover effects
2. **Particle Background** - p5.js animated particle system  
3. **Navigation System** - Responsive navigation with mega-menus
4. **Hero Section** - Main introduction area with animations
5. **Chat Interface** - MLA Knowledge Assistant chat component
6. **Universe Cards** - Navigation grid with hover effects
7. **Ticker/Marquee** - Animated text scrolling element
8. **Scroll Reveal Effects** - GSAP animations for content appearance

## Template CSS Structure

### Color System
```css
:root {
  --color-base: #0b0c0a;           /* Base dark background */
  --color-base-light: #121212;     /* Lighter base */
  --color-base-card: #1a1a1a;      /* Card backgrounds */
  --color-accent: #6366f1;         /* Primary accent color */
  --color-accent-light: #818cf8;   /* Light accent */
  --color-accent-dark: #4f46e5;    /* Dark accent */
  --color-text: #f0f0f0;           /* Main text */
  --color-text-muted: #a0a0a0;      /* Muted text */
  --color-border: rgba(240, 240, 240, 0.1); /* Border color */
}
```

### Responsive Design Features
- Mobile-first approach with breakpoints
- Flexible grid layouts using CSS Grid and Flexbox
- Clamp function for responsive typography
- Responsive navigation with mobile drawer

## Creating New Pages

### Step-by-Step Process:
1. **Start with template.html** as your base structure
2. **Replace content** in the main section while preserving all wrapper elements
3. **Include template.css** for styling (all styles are already in this file)
4. **Add custom scripts** if needed, but maintain existing functionality

### Basic Page Structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Page Title</title>
  
  <!-- Required fonts and resources -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Template CSS (contains all styling) -->
  <link rel="stylesheet" href="template.css">
</head>
<body class="bg-base text-text">
  <!-- Navigation (Shared Partial) -->
  <div id="nav-container">
    <!-- Content will be injected by JavaScript -->
  </div>
  
  <main class="min-h-screen">
    <!-- Your custom content goes here -->
    <section>
      <h1>Your Page Title</h1>
      <p>Your page content...</p>
    </section>
  </main>
  
  <!-- Footer (Shared Partial) -->
  <div id="footer-container">
    <!-- Content will be injected by JavaScript -->
  </div>
  
  <!-- Required Scripts -->
  <script src="js/nav.js"></script>
  <!-- Other scripts as needed -->
</body>
</html>
```

## Restyling Process

### Method 1: Centralized CSS Updates
To restyle all pages:
1. Edit `template.css` to change global styling
2. Save changes - all pages using the template will automatically update
3. No need to modify individual page content files

### Method 2: Page-Specific Styling  
For unique page styles:
1. Add custom CSS classes to your HTML in `template.html`
2. Define those classes in `template.css` with appropriate specificity
3. Maintain existing elements that provide functionality

## Maintaining Functionality

### Critical Elements to Preserve:
1. **Navigation system** (`#nav-container`, nav.js)
2. **Footer partials** (`#footer-container`)
3. **Particle background** (`#p5-wrap`) 
4. **Custom cursor** (`#c-dot`, `#c-ring`)
5. **Scroll reveal** (`.sr` elements, GSAP animations)
6. **Chat component** (if using chat functionality)

### What You Can Change:
1. Text content within sections
2. Colors in the color system (change variables in :root)
3. Typography and spacing
4. Layout dimensions
5. Animation timing and effects

## Template CSS Key Sections

### Component Classes to Reference:
- `.btn-solid` - Solid accent buttons
- `.btn-outline` - Outlined text buttons  
- `.u-card` - Universe card grid elements
- `.chat-container` - Chat section container
- `.hero-eyebrow`, `.hero-name`, `.hero-sub` - Hero section elements
- `.ticker-track` - Marquee animation components

### Animation Classes:
- `.sr` - Scroll reveal trigger classes
- `.vis` - Animation completion class
- Hover effects on interactive elements

## Best Practices for Updates

1. **Always edit `template.css`** for global styling changes
2. **Preserve existing HTML structure** when creating new pages
3. **Maintain all required scripts and includes** 
4. **Test functionality** after any CSS changes
5. **Use the color system consistently** for design cohesion
6. **Keep responsive attributes** during modifications

## Special Considerations

### For Chat Functionality:
If you need to include the chat section, use the existing components:
1. Include `chat-section.html` partial
2. Add `components/chat/chat-section.css` in head
3. Include `components/chat/chat-section.js` at bottom
4. Maintain existing form structure with `#chat-form`, `#chat-input`

### For Navigation Elements:
If you need additional nav items:
1. Update `partials/nav.html` 
2. Rebuild and check that navigation logic works correctly
3. Ensure Mega-menu attributes are preserved (`data-mega`, `aria-controls`)

This template system ensures consistent styling while providing flexibility for content customization.