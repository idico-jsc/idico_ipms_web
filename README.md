## React-ts Starter

#### This is a simple starter for a React project with TypeScript and vite. It includes a basic setup for a React project with TypeScript, ESLint, Prettier, shadcn/ui. and many more. This could be your perfect starter templates to initialize your new React project. you don't have to waste time in configuring everything. setup your project with this template withing a minute.

#### Don't forget to give a ⭐ `star` if you like it. and feel to contribute. Thank you.

### Features

- **Next.js-Style App Router** - File-based routing with automatic route discovery
- **Tailwindcss v4** & **shadcn/ui** with Typescript configured
- **Capacitor 7** - Build native iOS & Android apps from your React code
- **Frappe Integration** - Bearer token authentication with frappe-react-sdk
- **Internationalization (i18n)** - Multi-language support (English & Vietnamese)
- **PWA Support** - Progressive Web App with offline capabilities
- **Dark Mode** - Built-in theme switcher
- **Vite 7** with powerful plugins
- **Husky hooks** for pre-commit linting
- **Docker setup** for containerization
- **ESLint & Prettier** for code formatting
- **Atomic Design** folder structure
- **Custom import aliases** (Example: @/components)
- **Dependabot** to keep dependencies updated
- **Perfect workspace** settings for single or team projects

## Vite Plugins That you must need to know for this starter.

### vite-plugin-svgr

This plugin is used to generate SVG images from React components. You can use this plugin in your project.
Example:

```javascript
import Logo from '@/assets/react.svg?react';
// just add ?react query to get the svg component

export const App = () => {
  return (
    <div {...props}>
      <Logo />
      {/* You can use svg components as like normal React components */}
    </div>
  );
};
```

### unplugin-fonts

This plugin is used to generate fonts from Google fonts. You can use this plugin in your project.

How to use ? Open `/config/fonts.config.ts` file and add your fonts like this: name should be exactly same as in Google fonts. If you wan to add custom fonts you can check their doc. [link](https://github.com/cssninjaStudio/unplugin-fonts#readme)

```javascript
{
    name: 'Space Grotesk',
    styles: 'wght@300;400;500;700',
  },
```

### unplugin-auto-import/vite

This plugin is used to auto import modules. You can use this plugin in your project.
auto-import will handle all imports like react, react-router and also shadcn-ui's component in your @component/ui folder , etc. and you can add more.

Example:

```javascript
export function Counter() {
  const [count, setCount] = useState(0); // no need to import react and react-router, auto-import will handle it
  return (
    <div>
      <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
      {/*  also,  Button from @/components/ui but you don't need to import it.  */}
    </div>
  );
}
```

#### Note: If you need SEO or Server Side Rendering you can use Next.js, Nuxtjs, Remix, Astro Etc SSR based framework. This template is just for vite-react.

## Version Management

This project uses **automatic version bumping via pre-commit hook**.

### How It Works

- **Version automatically increases** every time you commit code to Git
- Uses Husky pre-commit hook to run `scripts/bump-version.js`
- The bumped version is automatically included in the commit

### When Version Increases

✅ **Version INCREASES when:**
- Running `git commit -m "message"`
- Running `git commit -am "message"`
- Running `git commit --amend`

❌ **Version DOES NOT increase when:**
- Running `npm run build` or any build commands
- Running `npm run dev` or development commands
- Running `git add` (only staging, not committing)

### Example Workflow

```bash
# Current version: 0.0.89

# Make changes to code
vim src/app.tsx

# Stage and commit
git add .
git commit -m "feat: add new feature"

# Pre-commit hook runs automatically:
# ✓ Version bumped: 0.0.89 → 0.0.90
# ✓ package.json automatically added to commit

# Version is now 0.0.90 in package.json
```

### Version Format

Versions follow the pattern: `0.0.X` where X increments by 1 on each commit.

For more details, see `scripts/bump-version.js`

## Available Scripts

### Development

- **`npm run dev`** - Start Vite development server with hot reload
- **`npm run build`** - Build production-ready web app (TypeScript check + Vite build)
- **`npm run preview`** - Preview the production build locally
- **`npm run lint`** - Run ESLint to check code quality

### Git Hooks

- **`npm run prepare`** - Install Husky git hooks (runs automatically after npm install)
- **`npm run lint-staged`** - Run linters on staged files (used by pre-commit hook)

### Testing

- **`npm run test`** - Run all Cypress tests in headless mode
- **`npm run e2e`** - Start dev server and run E2E tests

### Mobile Development (Android)

- **`npm run build:mobile`** - Build web app + setup Android resources + sync Capacitor
- **`npm run build:apk:debug`** - Build debug APK with automatic naming (includes version)
- **`npm run build:apk:release`** - Build release APK with automatic naming (includes version)
- **`npm run setup:android`** - Setup Android resources (icons, splash screens)
- **`npm run copy:config`** - Copy Firebase config files to Android project

### Capacitor Commands

- **`npm run cap:sync`** - Sync web code to native apps (Android + iOS)
- **`npm run cap:sync:android`** - Sync only to Android
- **`npm run cap:open:android`** - Open project in Android Studio
- **`npm run cap:run:android`** - Build and run on Android device/emulator

### Quick Start Examples

```bash
# Start development
npm run dev

# Build for production web
npm run build

# Build Android debug APK
npm run build:apk:debug

# Open in Android Studio for testing
npm run cap:open:android
```
