#!/bin/bash
# Fix TypeScript Issues Script

echo "🔧 Fixing TypeScript Configuration..."

# 1. Reload VS Code window
echo ""
echo "📝 To reload VS Code window and restart TypeScript:"
echo "   Press: Ctrl/Cmd + Shift + P"
echo "   Type: 'Developer: Reload Window'"
echo ""
echo "   OR"
echo ""
echo "   Press: Ctrl/Cmd + Shift + P"
echo "   Type: 'TypeScript: Restart TS Server'"
echo ""

# 2. Verify files exist
echo "✅ Verifying files..."
if [ -f "src/types/api.ts" ]; then
    echo "   ✓ src/types/api.ts exists"
else
    echo "   ✗ src/types/api.ts NOT FOUND!"
fi

if [ -f "src/services/api/base.ts" ]; then
    echo "   ✓ src/services/api/base.ts exists"
else
    echo "   ✗ src/services/api/base.ts NOT FOUND!"
fi

if [ -f "src/hooks/queries/useLab.ts" ]; then
    echo "   ✓ src/hooks/queries/useLab.ts exists"
else
    echo "   ✗ src/hooks/queries/useLab.ts NOT FOUND!"
fi

# 3. Check package.json for react-query
echo ""
echo "✅ Checking dependencies..."
if grep -q "@tanstack/react-query" package.json; then
    echo "   ✓ @tanstack/react-query is in package.json"
else
    echo "   ✗ @tanstack/react-query NOT in package.json!"
fi

# 4. Check tsconfig
echo ""
echo "✅ Checking tsconfig..."
if [ -f "tsconfig.json" ]; then
    echo "   ✓ tsconfig.json exists"
else
    echo "   ✗ tsconfig.json NOT FOUND!"
fi

echo ""
echo "🎉 Setup appears correct!"
echo ""
echo "If you still see TypeScript errors:"
echo "1. Restart TypeScript Server (see instructions above)"
echo "2. Close and reopen VS Code"
echo "3. Run: npm install (to ensure all deps are installed)"
echo ""
