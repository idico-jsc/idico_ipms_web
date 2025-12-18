#!/bin/bash

# Branch Protection Status Check Script
# This script checks the current branch protection status for the main branch
# Requires GitHub CLI (gh) to be installed and authenticated

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository information
REPO="idico-jsc/idico_ipms_web"
BRANCH="main"

echo -e "${BLUE}=== Branch Protection Status Check ===${NC}\n"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed.${NC}"
    echo -e "${YELLOW}Please install it from: https://cli.github.com/${NC}"
    echo -e "${YELLOW}Or using: brew install gh (macOS) or apt install gh (Ubuntu)${NC}"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub CLI.${NC}"
    echo -e "${YELLOW}Please run: gh auth login${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} GitHub CLI is installed and authenticated\n"

# Fetch branch protection rules
echo -e "${BLUE}Fetching branch protection rules for '${BRANCH}' branch...${NC}\n"

# Get branch protection status
PROTECTION_STATUS=$(gh api "repos/${REPO}/branches/${BRANCH}/protection" 2>&1 || echo "NOT_PROTECTED")

if echo "$PROTECTION_STATUS" | grep -q "Not Found"; then
    echo -e "${RED}✗ Branch protection is NOT enabled for '${BRANCH}'${NC}\n"
    echo -e "${YELLOW}To set up branch protection:${NC}"
    echo "1. Go to: https://github.com/${REPO}/settings/branches"
    echo "2. Click 'Add rule' or 'Add branch protection rule'"
    echo "3. Follow the instructions in BRANCH_PROTECTION.md"
    exit 0
fi

echo -e "${GREEN}✓ Branch protection is ENABLED for '${BRANCH}'${NC}\n"

# Parse and display protection rules
echo -e "${BLUE}=== Protection Rules ===${NC}\n"

# Check for required pull requests
if echo "$PROTECTION_STATUS" | grep -q "required_pull_request_reviews"; then
    echo -e "${GREEN}✓${NC} Require pull request before merging: ENABLED"

    # Check required approvals
    REQUIRED_APPROVALS=$(echo "$PROTECTION_STATUS" | grep -o '"required_approving_review_count":[0-9]*' | grep -o '[0-9]*' || echo "0")
    echo -e "  └─ Required approving reviews: ${REQUIRED_APPROVALS}"

    # Check dismiss stale reviews
    if echo "$PROTECTION_STATUS" | grep -q '"dismiss_stale_reviews":true'; then
        echo -e "  └─ ${GREEN}✓${NC} Dismiss stale reviews when new commits are pushed"
    else
        echo -e "  └─ ${YELLOW}✗${NC} Dismiss stale reviews: DISABLED"
    fi
else
    echo -e "${YELLOW}✗${NC} Require pull request before merging: DISABLED"
fi

# Check for conversation resolution
if echo "$PROTECTION_STATUS" | grep -q '"require_conversation_resolution":true'; then
    echo -e "${GREEN}✓${NC} Require conversation resolution: ENABLED"
else
    echo -e "${YELLOW}✗${NC} Require conversation resolution: DISABLED"
fi

# Check enforce admins
if echo "$PROTECTION_STATUS" | grep -q '"enforce_admins"'; then
    ENFORCE_ADMINS=$(echo "$PROTECTION_STATUS" | grep -o '"enforce_admins":\{[^}]*\}' | grep -o '"enabled":[a-z]*' | grep -o '[a-z]*$' || echo "false")
    if [ "$ENFORCE_ADMINS" = "true" ]; then
        echo -e "${GREEN}✓${NC} Enforce for administrators: ENABLED"
    else
        echo -e "${YELLOW}✗${NC} Enforce for administrators: DISABLED"
    fi
fi

# Check for required status checks
if echo "$PROTECTION_STATUS" | grep -q "required_status_checks"; then
    echo -e "${GREEN}✓${NC} Require status checks to pass: ENABLED"

    # List required status checks
    CHECKS=$(echo "$PROTECTION_STATUS" | grep -o '"checks":\[[^]]*\]' || echo "")
    if [ -n "$CHECKS" ]; then
        echo -e "  └─ Required checks: ${CHECKS}"
    fi
else
    echo -e "${YELLOW}✗${NC} Require status checks to pass: DISABLED"
fi

# Check restrictions
if echo "$PROTECTION_STATUS" | grep -q "restrictions"; then
    echo -e "${BLUE}ℹ${NC} Push restrictions are configured"
else
    echo -e "${GREEN}✓${NC} No push restrictions (all team members follow same rules)"
fi

# Check force push
if echo "$PROTECTION_STATUS" | grep -q '"allow_force_pushes":.*false'; then
    echo -e "${GREEN}✓${NC} Allow force pushes: DISABLED"
else
    echo -e "${RED}✗${NC} Allow force pushes: ENABLED (not recommended)"
fi

# Check deletions
if echo "$PROTECTION_STATUS" | grep -q '"allow_deletions":.*false'; then
    echo -e "${GREEN}✓${NC} Allow deletions: DISABLED"
else
    echo -e "${RED}✗${NC} Allow deletions: ENABLED (not recommended)"
fi

echo -e "\n${BLUE}=== Summary ===${NC}\n"
echo -e "Repository: ${GREEN}${REPO}${NC}"
echo -e "Branch: ${GREEN}${BRANCH}${NC}"
echo -e "Protection Status: ${GREEN}ENABLED${NC}"

echo -e "\n${YELLOW}For detailed configuration instructions, see: BRANCH_PROTECTION.md${NC}"
echo -e "${YELLOW}To view in GitHub: https://github.com/${REPO}/settings/branch_protection_rules${NC}\n"
