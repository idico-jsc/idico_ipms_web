# Branch Protection Guide

This guide explains how to set up branch protection for the `main` branch to prevent direct pushes and ensure all code changes go through pull requests.

## Overview

Branch protection helps maintain code quality by:
- Preventing direct pushes to the main branch
- Requiring peer review through pull requests
- Ensuring all team members follow the same workflow
- Reducing the risk of breaking changes reaching production

## Prerequisites

- Admin or owner permissions on the repository
- Access to GitHub repository settings

## Setting Up Branch Protection

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository on GitHub: [https://github.com/idico-jsc/idico_ipms_web](https://github.com/idico-jsc/idico_ipms_web)
2. Click on **Settings** tab (top navigation)
3. In the left sidebar, click on **Branches** under "Code and automation"
4. Under "Branch protection rules", click **Add rule** or **Add branch protection rule**

### Step 2: Configure Branch Name Pattern

In the "Branch name pattern" field, enter:
```
main
```

This will apply the protection rules specifically to the `main` branch.

### Step 3: Configure Protection Rules

Enable the following settings:

#### Require Pull Request Before Merging
✅ **Require a pull request before merging**
- This is the core protection that prevents direct pushes
- All changes must be submitted via pull request

Under this setting, you can optionally configure:
- **Required approvals**: Set to `0` initially (can be increased later to require reviewer approvals)
- ✅ **Dismiss stale pull request approvals when new commits are pushed**: Ensures reviews are current
- ✅ **Require review from Code Owners**: (Optional) If you have a CODEOWNERS file

#### Additional Protections
✅ **Require conversation resolution before merging**
- Ensures all review comments are addressed before merging

✅ **Do not allow bypassing the above settings**
- Applies protection rules to administrators as well
- **Important**: This ensures even admins must follow the PR workflow
- Best practice for team consistency

#### Restrictions (Disabled)
❌ **Allow force pushes**: Keep disabled
- Prevents rewriting history on the main branch
- Protects against accidental data loss

❌ **Allow deletions**: Keep disabled
- Prevents accidental deletion of the main branch

### Step 4: Save Protection Rules

1. Scroll to the bottom of the page
2. Click **Create** (or **Save changes** if editing existing rules)
3. The branch protection is now active

## Verification

To verify that branch protection is working:

1. Try to push directly to main:
   ```bash
   git checkout main
   git commit --allow-empty -m "test commit"
   git push origin main
   ```

2. You should see an error message:
   ```
   remote: error: GH006: Protected branch update failed for refs/heads/main.
   remote: error: Changes must be made through a pull request.
   ```

3. If you see this error, branch protection is working correctly!

You can also use the helper script to check protection status:
```bash
bash scripts/branch-protection-check.sh
```

## Team Workflow with Protected Branches

### For All Team Members (Including Admins)

#### 1. Create a Feature Branch
```bash
# Ensure you're on the latest main
git checkout main
git pull origin main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `chore/` - Maintenance tasks

#### 2. Make Your Changes
```bash
# Make code changes
# The pre-commit hook will run automatically:
# - Update component indexes
# - Bump version (for code changes)

git add .
git commit -m "Your descriptive commit message"
```

#### 3. Push Your Branch
```bash
git push origin feature/your-feature-name
```

#### 4. Create a Pull Request

1. Go to GitHub repository page
2. You'll see a prompt to "Compare & pull request" - click it
3. Fill in the PR details:
   - **Title**: Clear, descriptive title
   - **Description**: What changes were made and why
   - **Link any related issues**
4. Click **Create pull request**

#### 5. Code Review Process

- Request review from team members
- Address any feedback or comments
- Make additional commits if needed (push to the same branch)
- Resolve all conversations

#### 6. Merge the Pull Request

Once approved and all checks pass:
1. Click **Merge pull request** on GitHub
2. Choose merge strategy:
   - **Create a merge commit** (recommended for preserving full history)
   - **Squash and merge** (for clean, linear history)
   - **Rebase and merge** (for linear history without merge commits)
3. Click **Confirm merge**
4. Delete the feature branch (GitHub will offer this option)

#### 7. Update Local Repository
```bash
# Switch to main and pull the latest changes
git checkout main
git pull origin main

# Delete your local feature branch
git branch -d feature/your-feature-name
```

## Common Scenarios

### Emergency Hotfixes

Even for urgent fixes, follow the PR process:

```bash
# Create hotfix branch
git checkout main
git checkout -b fix/critical-bug

# Make the fix
git add .
git commit -m "fix: critical bug description"
git push origin fix/critical-bug

# Create PR and merge immediately
# Can skip detailed review if truly urgent
```

### Syncing Your Branch with Main

If main has been updated while you're working:

```bash
# From your feature branch
git fetch origin
git rebase origin/main

# Or use merge if you prefer
git merge origin/main

# Force push if you used rebase (only on your feature branch!)
git push origin feature/your-feature-name --force-with-lease
```

### Resolving Merge Conflicts

If GitHub shows conflicts:

```bash
# From your feature branch
git fetch origin
git merge origin/main

# Resolve conflicts in your editor
# After resolving, stage the changes
git add .
git commit -m "Resolve merge conflicts with main"
git push origin feature/your-feature-name
```

## Automated Processes

The following automations continue to work with protected branches:

### Pre-commit Hooks (Husky)
- **Component Index Updates**: Automatically updates index files
- **Version Bumping**: Smart detection bumps version only for code changes
- **Lint-staged**: Currently disabled, can be re-enabled when ready

These hooks run on feature branches before you push, not on main.

### Dependabot
- Dependabot will automatically create PRs for dependency updates
- These PRs follow the same review process
- Can be merged after verification

## Troubleshooting

### "Permission denied" when pushing to main

**Error**:
```
remote: error: GH006: Protected branch update failed for refs/heads/main.
```

**Solution**: This is expected! Create a feature branch and submit a PR instead.

### Accidentally committed to main locally

If you committed to main locally but haven't pushed:

```bash
# Create a new branch from your current main
git branch feature/my-changes

# Reset main to match remote
git checkout main
git reset --hard origin/main

# Switch to your feature branch
git checkout feature/my-changes

# Push and create PR
git push origin feature/my-changes
```

### Need to bypass protection (rare cases)

If you absolutely must bypass protection (not recommended):
1. Go to Settings → Branches → Edit the rule
2. Temporarily disable "Do not allow bypassing the above settings"
3. Make your change
4. Immediately re-enable the protection
5. Document why this was necessary

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Pull Request Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- Project documentation: [CLAUDE.md](./CLAUDE.md)

## Summary

**Benefits of Branch Protection**:
- ✅ Prevents accidental direct pushes to main
- ✅ Ensures code review process is followed
- ✅ Maintains clean, reviewed history
- ✅ Reduces bugs reaching production
- ✅ Encourages team collaboration

**Remember**: Even repository admins follow the PR workflow. This ensures consistency and quality across all contributions.
