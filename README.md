# TokenScript Documentation Site

A world-class documentation website built with Docusaurus, featuring Stripe-quality design and UX.

> **Note**: This is a standalone documentation site. All markdown content is located in the `./docs` directory.

## 🎨 Design System

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace Font**: JetBrains Mono
- Modern type scale with proper hierarchy
- Optimized for readability with generous line-height

### Color Palette
```css
Primary: #0066ff (Blue 600)
Slate Scale: 50-900 for neutrals
Dark Mode: Automatic with respectPrefersColorScheme
```

### Key Features
- **TokenScript syntax highlighting** with custom Prism.js plugin
- **Compact, information-dense layout** optimized for productivity
- **Professional design** inspired by Stripe and Vercel documentation
- **Clean tables** with hover effects and proper formatting
- **Responsive design** that works on all devices
- **Dark mode support** with seamless switching
- **Excellent typography** with Inter font family (15px base for density)
- **Smooth interactions** with subtle animations and hover states

## 🚀 Getting Started

```bash
cd docs-website
npm install
npm run docusaurus:start
```

Visit `http://localhost:3000/` to see the site.

## 📦 Available Scripts

- `npm run docusaurus:start` – Start development server with live reload
- `npm run docusaurus:build` – Generate production build
- `npm run docusaurus:serve` – Preview production build locally
- `npm run docusaurus:clear` – Clear Docusaurus caches
- `npm run lint` – Check code quality with Biome
- `npm run format` – Format code with Biome

## 💻 TokenScript Syntax Highlighting

Use TokenScript syntax highlighting in your markdown files with the `tokenscript` language identifier:

\`\`\`tokenscript
variable primary: Color.Hsl = hsl(220, 100, 50);
variable darker: Color = relativeDarken(primary, 20);
return darker.to.hex();
\`\`\`

The custom Prism.js plugin (`src/theme/prism-tokenscript.js`) automatically highlights:
- **Keywords**: `variable`, `if`, `return`, `while`, `for`
- **Types**: `Color`, `Number`, `String`, `List`, `Dictionary`
- **Color Types**: `Color.Hsl`, `Color.Rgb`, `Color.Oklch`
- **Functions**: `rgb()`, `hsl()`, `roundTo()`, `contrastColor()`
- **References**: `{token.path.reference}`
- **Hex Colors**: `#FF6B35`, `#000`
- **Numbers with Units**: `16px`, `1.5rem`, `100%`
- **Methods**: `.to.rgb()`, `.append()`
- **Comments**: `// comment`

## 🎯 Design Principles

1. **Information Density**: Optimized for large screens with compact spacing
2. **Clarity First**: Every element serves a purpose
3. **Professional Polish**: Attention to micro-interactions
4. **Accessibility**: Proper contrast ratios and semantic HTML
5. **Performance**: Optimized fonts and minimal dependencies

## 📐 Layout Structure

```
Homepage
├── Hero Banner (gradient with badge)
├── Features Section (3-column cards)
├── Value Props Section (benefit highlights)
└── CTA Section (call to action)

Documentation Pages
├── Navbar (sticky, blur backdrop)
├── Sidebar (260px, compact navigation)
├── Main Content (max-width 900px for better density)
└── Table of Contents (right rail)
```

## 🎨 Component Styles

### Cards
- Clean borders with subtle shadows
- Hover effects with translateY and shadow changes
- Consistent padding and border-radius

### Buttons
- Primary: Blue with white text
- Secondary: White/light with primary color text
- Outline: Transparent with border
- All have smooth hover transitions

### Code Blocks
- Dark background (#0f172a / #0d1117)
- Custom TokenScript syntax highlighting
- Proper syntax highlighting for multiple languages
- Inline code with light background and subtle border

### Tables
- Clean borders with proper spacing
- Hover effects for better readability
- Compact padding for information density
- Uppercase header labels for clarity

## 🌗 Dark Mode

Automatically respects user's system preference with manual toggle available. All colors have been carefully selected for proper contrast in both modes.

## 📝 Content Guidelines

- Keep headlines clear and action-oriented
- Use short paragraphs (2-3 sentences max)
- Include code examples where applicable
- Add visual hierarchy with proper heading levels
- Use lists for scannable content

## 🔧 Customization

All theme variables are defined in `src/css/custom.css` under the `:root` selector. Modify these to match your brand:

```css
:root {
  --ts-blue-600: #0066ff;  /* Primary brand color */
  --ifm-font-family-base: "Inter", ...;
  /* ... more variables */
}
```

## 🚢 Deployment

The `build` directory can be deployed to any static hosting service:

- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any CDN or web server

```bash
npm run docusaurus:build
# Upload the build/ directory to your host
```

## 📚 Documentation

For more about Docusaurus, visit: https://docusaurus.io/

---

Built with ❤️ for the TokenScript project
