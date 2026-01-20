#!/usr/bin/env bash
# Pre-release sanity check for loclaude
# Run this before publishing to npm

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

pass() {
  echo -e "${GREEN}✓${NC} $1"
  PASSED=$((PASSED + 1))
}

fail() {
  echo -e "${RED}✗${NC} $1"
  FAILED=$((FAILED + 1))
}

warn() {
  echo -e "${YELLOW}!${NC} $1"
}

section() {
  echo ""
  echo -e "${YELLOW}━━━ $1 ━━━${NC}"
}

# =============================================================================
section "Build Check"
# =============================================================================

# Check if dist exists
if [ -d "libs/cli/dist" ]; then
  pass "libs/cli/dist exists"
else
  fail "libs/cli/dist missing - run 'bun run build'"
fi

# Check for both bundles
if [ -f "libs/cli/dist/index.js" ]; then
  pass "Node bundle exists (index.js)"
else
  fail "Node bundle missing (index.js)"
fi

if [ -f "libs/cli/dist/index.bun.js" ]; then
  pass "Bun bundle exists (index.bun.js)"
else
  fail "Bun bundle missing (index.bun.js)"
fi

# =============================================================================
section "Entry Points"
# =============================================================================

# Test Node entry point
if node bin/index.mjs --version &>/dev/null; then
  VERSION=$(node bin/index.mjs --version 2>&1 | head -1)
  pass "Node entry point works ($VERSION)"
else
  fail "Node entry point failed"
fi

# Test Bun entry point
if bun bin/index.ts --version &>/dev/null; then
  VERSION=$(bun bin/index.ts --version 2>&1 | head -1)
  pass "Bun entry point works ($VERSION)"
else
  fail "Bun entry point failed"
fi

# =============================================================================
section "CLI Commands"
# =============================================================================

# Test help command
if node bin/index.mjs --help &>/dev/null; then
  pass "Help command works"
else
  fail "Help command failed"
fi

# Test doctor command (basic execution, not full checks)
if node bin/index.mjs doctor &>/dev/null; then
  pass "Doctor command executes"
else
  warn "Doctor command had issues (may be missing dependencies)"
fi

# Test config command
if node bin/index.mjs config &>/dev/null; then
  pass "Config command works"
else
  fail "Config command failed"
fi

# =============================================================================
section "Package Metadata"
# =============================================================================

# Check package.json exists and has required fields
if [ -f "package.json" ]; then
  pass "package.json exists"

  # Check name
  NAME=$(node -p "require('./package.json').name" 2>/dev/null)
  if [ "$NAME" = "loclaude" ]; then
    pass "Package name is correct ($NAME)"
  else
    fail "Package name incorrect ($NAME)"
  fi

  # Check version exists
  VERSION=$(node -p "require('./package.json').version" 2>/dev/null)
  if [ -n "$VERSION" ]; then
    pass "Version is set ($VERSION)"
  else
    fail "Version not set"
  fi

  # Check not private
  PRIVATE=$(node -p "require('./package.json').private || false" 2>/dev/null)
  if [ "$PRIVATE" = "false" ]; then
    pass "Package is not private"
  else
    fail "Package is marked private"
  fi

  # Check bin entries
  BIN_COUNT=$(node -p "Object.keys(require('./package.json').bin || {}).length" 2>/dev/null)
  if [ "$BIN_COUNT" -ge 1 ]; then
    pass "Bin entries defined ($BIN_COUNT)"
  else
    fail "No bin entries"
  fi

  # Check files array
  FILES=$(node -p "require('./package.json').files?.length || 0" 2>/dev/null)
  if [ "$FILES" -gt 0 ]; then
    pass "Files array defined ($FILES entries)"
  else
    fail "Files array missing"
  fi
else
  fail "package.json missing"
fi

# =============================================================================
section "Required Files"
# =============================================================================

for file in LICENSE README.md CHANGELOG.md; do
  if [ -f "$file" ]; then
    pass "$file exists"
  else
    fail "$file missing"
  fi
done

# =============================================================================
section "npm Pack Test"
# =============================================================================

# Test npm pack
PACK_OUTPUT=$(npm pack --dry-run 2>&1)
if [ $? -eq 0 ]; then
  pass "npm pack --dry-run succeeded"

  # Check tarball size
  SIZE=$(echo "$PACK_OUTPUT" | grep "package size" | awk '{print $4, $5}')
  if [ -n "$SIZE" ]; then
    pass "Package size: $SIZE"
  fi

  # Check file count
  FILE_COUNT=$(echo "$PACK_OUTPUT" | grep "total files" | awk '{print $3}')
  if [ -n "$FILE_COUNT" ]; then
    pass "Total files: $FILE_COUNT"
  fi
else
  fail "npm pack failed"
fi

# =============================================================================
section "Docsite Check"
# =============================================================================

if [ -d "docsite" ]; then
  pass "Docsite directory exists"

  if [ -f "docsite/index.html" ]; then
    pass "docsite/index.html exists"
  else
    fail "docsite/index.html missing"
  fi

  if [ -f "docsite/.nojekyll" ]; then
    pass "docsite/.nojekyll exists (GitHub Pages)"
  else
    fail "docsite/.nojekyll missing"
  fi
else
  fail "Docsite directory missing"
fi

# =============================================================================
section "Summary"
# =============================================================================

echo ""
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}All checks passed! Ready for release.${NC}"
  exit 0
else
  echo -e "${RED}Some checks failed. Please fix before releasing.${NC}"
  exit 1
fi
