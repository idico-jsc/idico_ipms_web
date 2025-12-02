# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important

**Before planning or coding, READ the relevant documentation:**

## Documentation Files

### Core Architecture
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Project structure, naming conventions, principles
- **[VERSION_MANAGEMENT.md](../VERSION_MANAGEMENT.md)** - Automatic version bumping with smart detection

### Mobile Development
- **[CAPACITOR_IMPLEMENTATION_GUIDE.md](../CAPACITOR_IMPLEMENTATION_GUIDE.md)** - Implement Capacitor step-by-step
- **[CAPACITOR_GUIDE.md](../CAPACITOR_GUIDE.md)** - Use Capacitor features
- **[BUILD_ANDROID_APK.md](../BUILD_ANDROID_APK.md)** - Build Android apps
- **[MOBILE_DEVELOPMENT.md](../MOBILE_DEVELOPMENT.md)** - Mobile workflow

### Features
- **[AUTH_GUIDE.md](../AUTH_GUIDE.md)** - Authentication system with token storage, Zustand, and API client
- **[GOOGLE_OAUTH_SETUP.md](../GOOGLE_OAUTH_SETUP.md)** - Google OAuth for web
- **[GOOGLE_AUTH_NATIVE_SETUP.md](../GOOGLE_AUTH_NATIVE_SETUP.md)** - Google OAuth for native mobile apps (Android/iOS)
- **[GOOGLE_AUTH_ANDROID_SETUP.md](../GOOGLE_AUTH_ANDROID_SETUP.md)** - Android Google OAuth setup with SHA-1 configuration
- **[I18N_GUIDE.md](../I18N_GUIDE.md)** - Internationalization
- **[CREATE_PAGE.md](../CREATE_PAGE.md)** - Create new pages
- **[PWA_SETUP.md](../PWA_SETUP.md)** - PWA features
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
