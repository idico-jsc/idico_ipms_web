# Version Management Guide

This project uses **automatic semantic versioning** with smart detection.

## How It Works

### Automatic Version Bumping

Version is automatically bumped **ONLY when you commit actual code changes**.

**Flow:**
```
1. You make changes to code files
2. git add <files>
3. git commit -m "message"
   ↓
4. Pre-commit hook checks: "Are there staged changes?"
   ↓
   YES → Bump version (0.0.93 → 0.0.94)
   NO  → Skip version bump
   ↓
5. Commit proceeds with/without version bump
```

### Smart Detection

The pre-commit hook intelligently detects:

✅ **Will Bump Version:**
- Code changes (`.ts`, `.tsx`, `.js`, etc.)
- Configuration changes (`.json`, `.config.ts`)
- Style changes (`.css`)
- Any file changes except `package.json`

❌ **Will NOT Bump Version:**
- Empty commits (`git commit --allow-empty`)
- Only `package.json` changes
- No staged files

### Example Scenarios

#### Scenario 1: Normal Code Commit ✅
```bash
# Edit some files
vim src/components/Button.tsx

# Stage and commit
git add src/components/Button.tsx
git commit -m "feat: add new button variant"

# Output:
# ✓ Version bumped: 0.0.93 → 0.0.94
# [main abc1234] feat: add new button variant
#  2 files changed, 10 insertions(+)
#  src/components/Button.tsx
#  package.json
```

#### Scenario 2: Empty Commit ❌
```bash
# Try to commit without changes
git commit -m "chore: update docs"

# Output:
# ℹ No staged changes detected. Skipping version bump.
# nothing to commit, working tree clean
```

#### Scenario 3: Amend Commit
```bash
# Make a commit
git add file.ts
git commit -m "feat: add feature"
# Version: 0.0.93 → 0.0.94

# Oops, forgot something
vim file.ts
git add file.ts
git commit --amend --no-edit

# Version will bump again: 0.0.94 → 0.0.95
# This is expected behavior
```

## Version Format

We use **Semantic Versioning**: `MAJOR.MINOR.PATCH`

- **MAJOR** (0): Breaking changes (manual bump)
- **MINOR** (0): New features (manual bump)
- **PATCH** (93): Bug fixes, minor changes (**auto-bumped**)

Currently, patch version is auto-incremented on every commit with changes.

## Manual Version Bump

If you need to bump major or minor version:

```bash
# Bump minor version (0.0.93 → 0.1.0)
npm version minor

# Bump major version (0.0.93 → 1.0.0)
npm version major

# Bump patch manually (0.0.93 → 0.0.94)
npm version patch
```

## Configuration Files

### Pre-commit Hook: `.husky/pre-commit`
```bash
# Bump version only if there are actual code changes
node scripts/bump-version.js
```

### Version Bump Script: `scripts/bump-version.js`
- Checks for staged changes (excluding `package.json`)
- Increments patch version if changes exist
- Stages updated `package.json` automatically
- Skips bump if no changes

## APK Naming Integration

Version is automatically used in APK naming:

```bash
npm run build:apk:debug
# Output: ParentPortal-0.0.94-debug.apk

npm run build:apk:release
# Output: ParentPortal-0.0.94-release.apk
```

See `scripts/rename-apk.js` for APK naming logic.

## Troubleshooting

### Issue: Version bumps on empty commits

**Cause**: Bug in detection logic

**Fix**: Already fixed - script checks `git diff --cached --name-only`

### Issue: Version doesn't bump when it should

**Check:**
```bash
# See what's staged
git diff --cached --name-only

# If nothing, add files first
git add <files>
```

### Issue: Want to commit without version bump

**Option 1**: Use `--no-verify` flag (not recommended)
```bash
git commit --no-verify -m "docs: update README"
```

**Option 2**: Manually revert version in package.json before commit

## Best Practices

1. **Let it auto-bump**: Don't manually edit version in `package.json` for regular commits
2. **Commit often**: Each commit gets a unique version
3. **Use conventional commits**: `feat:`, `fix:`, `chore:`, etc.
4. **Manual bump for releases**: Use `npm version` for major/minor releases

## Version History

Check version history:
```bash
git log --oneline --all --grep="Version bumped"
```

Or view in `package.json`:
```bash
git log -p package.json | grep '"version"'
```

---

**Current Version**: Check `package.json`

**Last Updated**: 2025-12-02

**Script Location**: `scripts/bump-version.js`
