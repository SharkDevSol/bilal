# Monorepo Quick Start Guide

## 🚀 Getting Started with the New Monorepo Structure

### Step 1: Install Dependencies
```bash
# From the root directory
npm install
```

This will:
- Install all workspace dependencies
- Set up workspace links
- Initialize the monorepo structure

**Expected Output**: You should see npm installing dependencies for all workspaces.

### Step 2: Verify Installation
```bash
# Check workspace configuration
npm query .workspace

# Should list all 7 workspaces
```

### Step 3: Run Backend
```bash
# Option 1: From root
npm run dev:backend

# Option 2: Using workspace
npm run dev --workspace=packages/backend

# Option 3: Direct (still works)
cd backend
npm run dev
```

### Step 4: Run Frontend
```bash
# Option 1: From root
npm run dev:frontend

# Option 2: Using workspace
npm run dev --workspace=packages/frontend

# Option 3: Direct (still works)
cd APP
npm run dev
```

## 📋 Common Commands

### Development
```bash
# Start backend in dev mode
npm run dev:backend

# Start frontend in dev mode
npm run dev:frontend

# Start both (in separate terminals)
npm run dev:backend &
npm run dev:frontend
```

### Building
```bash
# Build frontend
npm run build:frontend

# Build all workspaces
npm run build --workspaces --if-present
```

### Testing
```bash
# Test backend
npm run test --workspace=packages/backend

# Test frontend
npm run test --workspace=packages/frontend

# Test all workspaces
npm test --workspaces
```

### Installing Dependencies
```bash
# Add dependency to backend
npm install <package-name> --workspace=packages/backend

# Add dependency to frontend
npm install <package-name> --workspace=packages/frontend

# Add dev dependency
npm install -D <package-name> --workspace=packages/backend
```

## 🎯 What Changed?

### Before
```bash
cd backend
npm install
npm run dev

cd ../APP
npm install
npm run dev
```

### After (Recommended)
```bash
# One-time setup
npm install

# Run backend
npm run dev:backend

# Run frontend
npm run dev:frontend
```

### After (Still Works)
```bash
# You can still work directly in backend/APP
cd backend
npm run dev

cd ../APP
npm run dev
```

## 📁 Project Structure

```
skoolific-v2/
├── package.json              # Root workspace config
├── packages/
│   ├── backend/              # Backend workspace (references ../../backend/)
│   ├── frontend/             # Frontend workspace (references ../../APP/)
│   ├── desktop/              # Desktop app (Tauri) - Placeholder
│   ├── mobile-staff/         # Staff mobile app - Placeholder
│   ├── mobile-student/       # Student mobile app - Placeholder
│   ├── mobile-guardian/      # Guardian mobile app - Placeholder
│   └── mobile-super-admin/   # Super admin mobile app - Placeholder
├── backend/                  # Actual backend code (unchanged)
└── APP/                      # Actual frontend code (unchanged)
```

## ✅ Verification Checklist

After running `npm install`, verify:

- [ ] No errors during installation
- [ ] `node_modules/` created at root
- [ ] Backend runs: `npm run dev:backend`
- [ ] Frontend runs: `npm run dev:frontend`
- [ ] Backend tests work: `npm run test --workspace=packages/backend`
- [ ] Frontend tests work: `npm run test --workspace=packages/frontend`

## 🔧 Troubleshooting

### Problem: npm install fails
```bash
# Check npm version (must be >= 9.0.0)
npm --version

# Update npm if needed
npm install -g npm@latest
```

### Problem: Workspace not found
```bash
# Make sure you're using the correct workspace path
npm run dev --workspace=packages/backend  # ✅ Correct
npm run dev --workspace=backend           # ❌ Incorrect
```

### Problem: Scripts not working
```bash
# Try running from the actual directory
cd backend
npm run dev

cd ../APP
npm run dev
```

### Problem: Dependencies not found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## 📚 Documentation

- **Full Project Overview**: `README.md`
- **Migration Guide**: `MONOREPO_MIGRATION.md`
- **Task Completion**: `TASK_1.1.1_COMPLETION_SUMMARY.md`
- **Backend Details**: `packages/backend/README.md`
- **Frontend Details**: `packages/frontend/README.md`

## 🎉 Benefits

1. **Single Install**: One `npm install` for entire project
2. **Unified Scripts**: Run all apps from root directory
3. **Better Organization**: Clear separation of concerns
4. **Future Ready**: Easy to add desktop and mobile apps
5. **Consistent Tooling**: Shared configuration across all packages

## 🚦 Next Steps

1. ✅ Run `npm install`
2. ✅ Test backend: `npm run dev:backend`
3. ✅ Test frontend: `npm run dev:frontend`
4. 📋 Proceed to Task 1.1.2: Git repository setup
5. 📋 Proceed to Task 1.1.3: ESLint, Prettier, TypeScript config

## 💡 Tips

- **Use workspace scripts** for consistency
- **Install from root** to keep dependencies in sync
- **You can still work directly** in backend/APP if preferred
- **Check workspace READMEs** for specific documentation

---

**Need Help?** Check `MONOREPO_MIGRATION.md` for detailed information.
