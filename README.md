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
