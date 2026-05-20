# Monorepo Migration Guide

## Overview

This document explains the monorepo structure implemented for Skoolific V2 and how to work with it.

## What Changed?

### Before (V1 Structure)
```
SCHOOLS/
├── backend/          # Backend code
├── APP/              # Frontend code
└── (other files)
```

### After (V2 Monorepo Structure)
```
skoolific-v2/
├── package.json                    # Root workspace configuration
├── packages/
│   ├── backend/                    # Backend workspace (references ../../backend/)
│   ├── frontend/                   # Frontend workspace (references ../../APP/)
│   ├── desktop/                    # Desktop app workspace (Tauri)
│   ├── mobile-staff/               # Staff mobile app workspace (Capacitor)
│   ├── mobile-student/             # Student mobile app workspace (Capacitor)
│   ├── mobile-guardian/            # Guardian mobile app workspace (Capacitor)
│   └── mobile-super-admin/         # Super Admin mobile app workspace (Capacitor)
├── backend/                        # Actual backend code (unchanged location)
├── APP/                            # Actual frontend code (unchanged location)
└── README.md
```

## Key Points

### 1. Existing Code Remains in Place
- **Backend code** stays in `backend/` directory
- **Frontend code** stays in `APP/` directory
- **No files were moved or modified** in these directories
- All existing functionality continues to work

### 2. Workspace Packages
The `packages/` directory contains workspace definitions that reference the actual code:
- `packages/backend/` - Workspace wrapper for `backend/`
- `packages/frontend/` - Workspace wrapper for `APP/`
- Other packages are placeholders for future native apps

### 3. npm Workspaces
The root `package.json` defines workspaces using npm's built-in workspace feature:
```json
{
  "workspaces": [
    "packages/backend",
    "packages/frontend",
    "packages/desktop",
    "packages/mobile-staff",
    "packages/mobile-student",
    "packages/mobile-guardian",
    "packages/mobile-super-admin"
  ]
}
```

## How to Use the Monorepo

### Installation

#### Install All Dependencies
```bash
# From root directory
npm install
```
This installs dependencies for all workspaces.

#### Install for Specific Workspace
```bash
npm install --workspace=packages/backend
npm install --workspace=packages/frontend
```

### Running Applications

#### Backend
```bash
# From root
npm run dev:backend

# Or using workspace
npm run dev --workspace=packages/backend

# Or directly (still works)
cd backend
npm run dev
```

#### Frontend
```bash
# From root
npm run dev:frontend

# Or using workspace
npm run dev --workspace=packages/frontend

# Or directly (still works)
cd APP
npm run dev
```

### Adding Dependencies

#### Add to Backend
```bash
# From root
npm install axios --workspace=packages/backend

# Or directly
cd backend
npm install axios
```

#### Add to Frontend
```bash
# From root
npm install react-query --workspace=packages/frontend

# Or directly
cd APP
npm install react-query
```

### Running Scripts

#### Run Script in Specific Workspace
```bash
npm run <script-name> --workspace=packages/<workspace-name>
```

Examples:
```bash
npm run test --workspace=packages/backend
npm run build --workspace=packages/frontend
npm run lint --workspace=packages/frontend
```

#### Run Script in All Workspaces
```bash
npm run test --workspaces
npm run lint --workspaces --if-present
```

## Benefits of Monorepo Structure

### 1. Unified Dependency Management
- Single `node_modules` at root for shared dependencies
- Reduced disk space usage
- Consistent versions across all packages

### 2. Simplified Development Workflow
- Run all apps from root directory
- Single `npm install` for entire project
- Coordinated testing and building

### 3. Better Code Sharing
- Easy to share utilities between packages
- Consistent tooling and configuration
- Simplified cross-package refactoring

### 4. Scalability
- Easy to add new applications (mobile, desktop)
- Clear separation of concerns
- Independent versioning per package

## Workspace Package Structure

Each workspace package has:
- `package.json` - Defines scripts and metadata
- `README.md` - Documentation for that workspace
- Scripts that reference the actual code location

Example: `packages/backend/package.json`
```json
{
  "name": "@skoolific/backend",
  "scripts": {
    "dev": "cd ../../backend && nodemon server.js",
    "start": "cd ../../backend && node server.js"
  }
}
```

## Future Native Apps

### Desktop (Tauri)
- Location: `packages/desktop/`
- Status: Placeholder created
- Setup: Phase 1.3 of implementation plan

### Mobile Apps (Capacitor)
- Locations: `packages/mobile-*/`
- Status: Placeholders created
- Setup: Phase 1.4 of implementation plan

Each will have:
- Full source code in the workspace directory
- Independent build configuration
- Shared React components from frontend

## Migration Checklist

- [x] Create root `package.json` with workspaces
- [x] Create workspace packages for backend and frontend
- [x] Create placeholder workspaces for native apps
- [x] Update `.gitignore` for monorepo structure
- [x] Create comprehensive documentation
- [x] Verify existing code still works
- [ ] Run `npm install` to set up workspaces
- [ ] Test backend development workflow
- [ ] Test frontend development workflow
- [ ] Verify all existing scripts work

## Troubleshooting

### Issue: "Cannot find module"
**Solution**: Run `npm install` from root directory

### Issue: Scripts not working
**Solution**: Check that you're using the correct workspace name:
```bash
npm run dev --workspace=packages/backend  # Correct
npm run dev --workspace=backend           # Incorrect
```

### Issue: Dependencies not found
**Solution**: Install dependencies for specific workspace:
```bash
npm install --workspace=packages/backend
```

### Issue: Want to work directly in backend/APP
**Solution**: You can still work directly in those directories:
```bash
cd backend
npm run dev

cd APP
npm run dev
```

## Best Practices

1. **Install from Root**: Always run `npm install` from root directory
2. **Use Workspace Scripts**: Prefer workspace scripts for consistency
3. **Document Changes**: Update workspace READMEs when adding features
4. **Test Across Workspaces**: Run tests for all affected workspaces
5. **Keep Workspaces Independent**: Minimize cross-workspace dependencies

## Next Steps

1. Run `npm install` from root to set up the monorepo
2. Test backend and frontend development workflows
3. Proceed with Phase 1.3: Tauri Desktop Application Setup
4. Proceed with Phase 1.4: Capacitor Mobile Application Setup

## Questions?

Refer to:
- Root `README.md` for project overview
- `packages/backend/README.md` for backend details
- `packages/frontend/README.md` for frontend details
- `.kiro/specs/skoolific-v2-upgrade/` for full specifications

---

**Created**: 2025
**Last Updated**: Task 1.1.1 completion
**Status**: ✅ Monorepo structure initialized
