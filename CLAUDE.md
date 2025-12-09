# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important

**Before planning or coding, READ the relevant documentation:**

## Documentation Files

### Core Architecture
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Project structure, naming conventions, principles
- **[VERSION_MANAGEMENT.md](../VERSION_MANAGEMENT.md)** - Automatic version bumping with smart detection

### Development
- **[ROUTING_GUIDE.md](../ROUTING_GUIDE.md)** - File-based routing & page creation with Next.js-style App Router
- **[MOBILE_GUIDE.md](../MOBILE_GUIDE.md)** - Mobile development with Capacitor (setup, workflow, build APK/AAB)
- **[I18N_GUIDE.md](../I18N_GUIDE.md)** - Internationalization setup and usage
- **[PWA_SETUP.md](../PWA_SETUP.md)** - Progressive Web App features

### Authentication & Integration
- **[AUTH_GUIDE.md](../AUTH_GUIDE.md)** - JWT authentication with Zustand, hybrid token storage, auto-init
- **[GOOGLE_AUTH_SETUP.md](../GOOGLE_AUTH_SETUP.md)** - Google OAuth setup for web and native mobile (Android/iOS)
- **[FCM_SETUP.md](../FCM_SETUP.md)** - Firebase Cloud Messaging push notifications for web and mobile
- **[FRAPPE_INTEGRATION.md](../FRAPPE_INTEGRATION.md)** - Frappe Framework integration with bearer token auth

## Workflow

1. **Read** relevant documentation
2. **Plan** following documented patterns
3. **Code** according to guidelines
e4
## Important Rules

### When Creating Root-Level Documentation Files

**ALWAYS update both files when creating new `.md` files in the project root:**

1. **`.vscode/settings.json`** - Add the new file to `README.md` file nesting pattern:
   ```json
   "README.md": "ARCHITECTURE.md,I18N_GUIDE.md,...,YOUR_NEW_FILE.md"
   ```

2. **`.claude/CLAUDE.md`** - Add the file to the appropriate documentation section with a brief description:
   ```markdown
   - **[YOUR_NEW_FILE.md](../YOUR_NEW_FILE.md)** - Brief description
   ```

This ensures:
- The new documentation is discoverable in VS Code's file explorer (nested under README.md)
- Claude Code knows about the documentation and can reference it
- Documentation is organized and maintainable

---

All architectural decisions, conventions, and best practices are documented in the files above. Read them before making changes.
