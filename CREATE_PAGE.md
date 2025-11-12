# How to Create a New Page

This project uses a Next.js-style file-based routing system with Atomic Design pattern. Routes are automatically discovered and registered based on the folder structure in `src/app/`, while actual page components live in `src/components/pages/`.

## Architecture Overview

**Two-layer structure:**
- `src/app/[route]/page.tsx` - Route entry point (minimal, imports from components)
- `src/components/pages/[page].tsx` - Actual page component (Atomic Design)

This separation allows for better component reusability and follows Atomic Design principles.

## Quick Start

To create a new page, follow these 4 steps:

### 1. Create the page component in Atomic Design structure

```bash
cat > src/components/pages/your-page.tsx << 'EOF'
interface Props extends React.ComponentProps<'div'> {}

export const YourPage = ({ ...rest }: Props) => {
  return (
    <div className="container mx-auto px-4 py-16" {...rest}>
      <h1 className="text-4xl font-bold mb-6">Your Page Title</h1>
      <p>Your page content goes here...</p>
    </div>
  );
};
EOF
```

### 2. Export from pages index

Add to `src/components/pages/index.ts`:
```typescript
export { YourPage } from './your-page';
```

### 3. Create route folder and configuration

```bash
mkdir src/app/your-page-name

cat > src/app/your-page-name/route.ts << 'EOF'
export const route = {
  path: '/your-page-name',
  errorBoundary: false,
};
EOF
```

### 4. Create route entry point

```bash
cat > src/app/your-page-name/page.tsx << 'EOF'
import { YourPage } from '@/components/pages/your-page';

export default function YourPageName() {
  return <YourPage />;
}
EOF
```

That's it! 🎉 Your route is automatically registered and available at `/your-page-name`.

## File Structure

```
src/
├── app/
│   └── your-page-name/        # Route folder
│       ├── page.tsx           # Route entry (imports from components)
│       └── route.ts           # Route config
└── components/
    └── pages/
        ├── your-page.tsx      # Actual page component
        └── index.ts          # Export your page here
```

## Route Configuration Options

In `route.ts`, you can configure:

```typescript
export const route = {
  path: string;           // URL path (e.g., '/', '/about', '/users/:id')
  errorBoundary?: boolean; // Enable error boundary (optional)
};
```

### Examples:

**Home page:**
```typescript
export const route = {
  path: '/',
  errorBoundary: true,
};
```

**About page:**
```typescript
export const route = {
  path: '/about',
};
```

**Catch-all (404) page:**
```typescript
export const route = {
  path: '*',
};
```

## Page Component

**In `src/components/pages/`**, create your page component as a named export:

```tsx
import { useTranslation } from 'react-i18next';

interface Props extends React.ComponentProps<'div'> {}

export const MyPage = ({ ...rest }: Props) => {
  const { t } = useTranslation();

  return (
    <div {...rest}>
      <h1>{t('myPage.title', { ns: 'pages' })}</h1>
    </div>
  );
};
```

**In `src/app/my-page/page.tsx`**, import and use it:

```tsx
import { MyPage } from '@/components/pages/my-page';

export default function MyPageRoute() {
  return <MyPage />;
}
```

### Why Two Layers?

1. **Reusability**: Page components can be reused outside of routes
2. **Testing**: Easier to test components independently
3. **Atomic Design**: Keeps components organized in the design system
4. **Flexibility**: Route layer can handle route-specific logic (params, guards, etc.)

## Complete Example: Blog Post Page

### 1. Create the page component in `src/components/pages/blog.tsx`:
```tsx
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/atoms/button';

interface Props extends React.ComponentProps<'div'> {}

export const Blog = ({ ...rest }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16" {...rest}>
      <h1 className="text-4xl font-bold mb-6">Blog</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article className="border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Post Title</h2>
          <p className="text-muted-foreground mb-4">
            Post excerpt goes here...
          </p>
          <Button>Read More</Button>
        </article>
      </div>
    </div>
  );
};
```

### 2. Export from `src/components/pages/index.ts`:
```typescript
export { Blog } from './blog';
```

### 3. Create route folder:
```bash
mkdir src/app/blog
```

### 4. Create `src/app/blog/route.ts`:
```typescript
export const route = {
  path: '/blog',
  errorBoundary: false,
};
```

### 5. Create `src/app/blog/page.tsx`:
```tsx
import { Blog } from '@/components/pages/blog';

export default function BlogPage() {
  return <Blog />;
}
```

## Adding to Navigation

After creating your page, add it to the navbar in `src/components/organisms/header.tsx`:

```tsx
const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },     // ← Add your route here
  { label: 'Contact', path: '/contact' },
];
```

## Testing Your Route

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Visit your page:**
   - Navigate to `http://localhost:5173/your-page-name`
   - Or click the link in the navbar

3. **Check the browser console:**
   - Routes are logged during development
   - Verify your route is registered correctly

## Advanced: Dynamic Routes

For dynamic routes (like `/blog/:id`), you can use React Router's params:

```tsx
import { useParams } from 'react-router';

export default function BlogPostPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Blog Post: {id}</h1>
    </div>
  );
}
```

**route.ts:**
```typescript
export const route = {
  path: '/blog/:id',
  errorBoundary: true,
};
```

## Troubleshooting

### Route not working?
- ✅ Check that both `page.tsx` and `route.ts` exist
- ✅ Verify `route.ts` exports `route` object
- ✅ Verify `page.tsx` has default export
- ✅ Restart the dev server
- ✅ Check browser console for errors

### 404 error?
- ✅ Verify the `path` in `route.ts` matches URL
- ✅ Check for typos in folder/file names
- ✅ Make sure catch-all route (`*`) is last

## Best Practices

1. **Folder naming:** Use kebab-case (e.g., `my-page`, not `MyPage`)
2. **Component naming:** Use PascalCase (e.g., `MyPage`, not `myPage`)
3. **Keep pages simple:** Move complex logic to hooks/utils
4. **Use TypeScript:** Add proper types for props and state
5. **Accessibility:** Use semantic HTML and ARIA attributes
6. **i18n:** Use translation keys for all user-facing text
7. **Responsive:** Test on mobile, tablet, and desktop

## Available Utilities

- **Styling:** Tailwind CSS classes
- **Components:** Atomic design components in `@/components/`
- **i18n:** `useTranslation()` hook from `react-i18next`
- **Routing:** `NavLink`, `useParams`, `useNavigate` from `react-router`
- **Theme:** Access via `useTheme()` hook
- **Language:** Access via `useLanguage()` hook

## Examples in This Project

Check out these pages for reference:

**Route entry points (src/app/):**
- `src/app/home/page.tsx` - Imports Home component
- `src/app/about/page.tsx` - Imports About component
- `src/app/contact/page.tsx` - Imports Contact component
- `src/app/not-found/page.tsx` - Imports NotFound component

**Actual components (src/components/pages/):**
- `src/components/pages/home.tsx` - Home page with counter
- `src/components/pages/about.tsx` - Static content page
- `src/components/pages/contact.tsx` - Form page with state
- `src/components/pages/not-found.tsx` - 404 page

---

Happy coding! 🚀
