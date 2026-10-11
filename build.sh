#!/usr/bin/env bash

set -euo pipefail

# ------------------------------------------------------------
# SupportScout Build
#
# Performs pre-build validation before starting an EAS build.
# Usage: ./build.sh <android|ios> [profile]
# The profile defaults to preview.
# Examples:
#   ./build.sh android
#   ./build.sh ios preview
#   ./build.sh android production
# ------------------------------------------------------------

PLATFORM="${1:-}"
PROFILE="${2:-preview}"

# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------

success() {
    echo "✓ $1"
}

fail() {
    echo
    echo "✗ $1"
    echo "Build aborted."
    exit 1
}

step() {
    echo
    echo "----------------------------------------"
    echo "$1"
    echo "----------------------------------------"
}

# ------------------------------------------------------------
# 1. Validate arguments
# ------------------------------------------------------------

case "$PLATFORM" in
    android)
        PLATFORM_LABEL="Android"
        ;;
    ios)
        PLATFORM_LABEL="iOS"
        ;;
    *)
        echo "Usage: $0 <android|ios> [profile]" >&2
        exit 2
        ;;
esac

echo
echo "========================================"
echo "  SupportScout $PLATFORM_LABEL Build"
echo "========================================"
echo
echo "EAS profile: $PROFILE"
echo

# ------------------------------------------------------------
# 2. Check required commands
# ------------------------------------------------------------

step "Checking build tools"

command -v git >/dev/null 2>&1 ||
    fail "git is not installed"

command -v npm >/dev/null 2>&1 ||
    fail "npm is not installed"

command -v npx >/dev/null 2>&1 ||
    fail "npx is not installed"

command -v eas >/dev/null 2>&1 ||
    fail "EAS CLI is not installed"

success "Required tools found"

# ------------------------------------------------------------
# 3. Check we're in the project root
# ------------------------------------------------------------

step "Checking project"

[[ -f "package.json" ]] ||
    fail "package.json not found. Run this from the SupportScout project root."

[[ -f "eas.json" ]] ||
    fail "eas.json not found."

success "SupportScout project found"

# ------------------------------------------------------------
# 4. Check Git branch
# ------------------------------------------------------------

step "Checking Git branch"

BRANCH="$(git branch --show-current)"

echo "Current branch: $BRANCH"

if [[ "$BRANCH" != "main" ]]; then
    fail "$PLATFORM_LABEL release builds must be run from main."
fi

success "On main"

# ------------------------------------------------------------
# 5. Check working tree
# ------------------------------------------------------------

step "Checking Git working tree"

if [[ -n "$(git status --porcelain)" ]]; then
    echo
    git status --short
    echo
    fail "Working tree is not clean. Commit or stash changes first."
fi

success "Working tree clean"

# ------------------------------------------------------------
# 6. Check local main against origin/main
# ------------------------------------------------------------

step "Checking remote state"

git fetch origin main --quiet ||
    fail "Could not fetch origin/main."

LOCAL="$(git rev-parse HEAD)"
REMOTE="$(git rev-parse origin/main)"

if [[ "$LOCAL" != "$REMOTE" ]]; then
    echo
    echo "Local:  $LOCAL"
    echo "Remote: $REMOTE"
    echo
    fail "Local main does not match origin/main. Pull or push before building."
fi

success "Local main matches origin/main"

# ------------------------------------------------------------
# 7. Check package version
# ------------------------------------------------------------

step "Checking version"

VERSION="$(node -p "require('./package.json').version")"

[[ -n "$VERSION" ]] ||
    fail "Could not determine package version."

echo "Package version: $VERSION"

success "Version detected"

# ------------------------------------------------------------
# 8. Check release tag
# ------------------------------------------------------------

step "Checking Git tag"

EXPECTED_TAG="v${VERSION}"

if [[ "$PROFILE" == "production" ]]; then
    CURRENT_TAG="$(
        git tag --points-at HEAD |
        grep -Fx "$EXPECTED_TAG" ||
        true
    )"

    if [[ "$CURRENT_TAG" != "$EXPECTED_TAG" ]]; then
        fail "Production build requires current commit to be tagged ${EXPECTED_TAG}."
    fi

    success "Current commit tagged ${EXPECTED_TAG}"
else
    echo "Preview build — exact release tag not required."
fi

# ------------------------------------------------------------
# 9. TypeScript
# ------------------------------------------------------------

step "Running TypeScript checks"

if ! npx tsc --noEmit; then
    fail "TypeScript checks failed."
fi

success "TypeScript checks passed"

# ------------------------------------------------------------
# 10. Expo Doctor
# ------------------------------------------------------------

step "Running Expo Doctor"

if ! npx expo-doctor; then
    fail "Expo Doctor reported problems."
fi

success "Expo Doctor passed"

# ------------------------------------------------------------
# 11. Final summary
# ------------------------------------------------------------

echo
echo "========================================"
echo "  Pre-build checks passed"
echo "========================================"
echo
echo "Version:  $VERSION"
echo "Tag:      $EXPECTED_TAG"
echo "Branch:   $BRANCH"
echo "Profile:  $PROFILE"
echo "Platform: $PLATFORM_LABEL"
echo

# ------------------------------------------------------------
# 12. Build
# ------------------------------------------------------------

echo "Starting EAS $PLATFORM_LABEL build..."
echo

eas build \
    --platform "$PLATFORM" \
    --profile "$PROFILE"

echo
echo "========================================"
echo "  SupportScout $PLATFORM_LABEL build submitted"
echo "========================================"
echo