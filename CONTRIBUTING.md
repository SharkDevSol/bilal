# Contributing to Skoolific V2

Thank you for contributing to Skoolific V2! This document provides guidelines for contributing to the project.

## Table of Contents

- [Git Workflow](#git-workflow)
- [Branch Strategy](#branch-strategy)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)

## Git Workflow

We follow a **Git Flow** branching strategy with the following branches:

### Branch Strategy

#### Main Branches

1. **`main`** - Production-ready code
   - Always stable and deployable
   - Protected branch (no direct commits)
   - Only accepts merges from `release/*` branches
   - Tagged with version numbers (e.g., v2.0.0, v2.1.0)

2. **`develop`** - Integration branch for features
   - Latest development changes
   - Protected branch (no direct commits)
   - Accepts merges from `feature/*` branches
   - Source for creating `release/*` branches

#### Supporting Branches

3. **`feature/*`** - New features and enhancements
   - Branch from: `develop`
   - Merge back to: `develop`
   - Naming: `feature/task-number-short-description`
   - Examples:
     - `feature/1.3.1-tauri-setup`
     - `feature/2.1-ai-test-generator`
     - `feature/fix-attendance-bug`

4. **`release/*`** - Prepare for production release
   - Branch from: `develop`
   - Merge to: `main` and `develop`
   - Naming: `release/v2.x.x`
   - Examples:
     - `release/v2.0.0`
     - `release/v2.1.0`
   - Only bug fixes, documentation, and release preparation allowed

5. **`hotfix/*`** - Emergency fixes for production
   - Branch from: `main`
   - Merge to: `main` and `develop`
   - Naming: `hotfix/v2.x.x-description`
   - Examples:
     - `hotfix/v2.0.1-critical-auth-fix`
     - `hotfix/v2.0.2-database-connection`

### Workflow Examples

#### Creating a New Feature

```bash
# 1. Update develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/1.3.1-tauri-setup

# 3. Work on your feature
# ... make changes ...
git add .
git commit -m "feat: initialize Tauri project structure"

# 4. Push feature branch
git push origin feature/1.3.1-tauri-setup

# 5. Create Pull Request to develop
# Use GitHub/GitLab UI to create PR
```

#### Preparing a Release

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v2.0.0

# 2. Update version numbers, changelog, etc.
# ... make release preparations ...
git commit -m "chore: prepare v2.0.0 release"

# 3. Push release branch
git push origin release/v2.0.0

# 4. Create PR to main
# After approval and merge to main:

# 5. Tag the release
git checkout main
git pull origin main
git tag -a v2.0.0 -m "Release version 2.0.0"
git push origin v2.0.0

# 6. Merge back to develop
git checkout develop
git merge release/v2.0.0
git push origin develop
```

#### Creating a Hotfix

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/v2.0.1-critical-auth-fix

# 2. Fix the issue
# ... make changes ...
git commit -m "fix: resolve critical authentication vulnerability"

# 3. Push hotfix branch
git push origin hotfix/v2.0.1-critical-auth-fix

# 4. Create PR to main
# After merge to main:

# 5. Tag the hotfix
git checkout main
git pull origin main
git tag -a v2.0.1 -m "Hotfix version 2.0.1"
git push origin v2.0.1

# 6. Merge back to develop
git checkout develop
git merge hotfix/v2.0.1-critical-auth-fix
git push origin develop
```

## Commit Guidelines

We follow the **Conventional Commits** specification for clear and structured commit messages.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without changing functionality
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, build config, etc.)
- **ci**: CI/CD configuration changes
- **revert**: Reverting a previous commit

### Examples

```bash
# Feature
git commit -m "feat(auth): add branch code validation endpoint"

# Bug fix
git commit -m "fix(attendance): resolve date calculation for Ethiopian calendar"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(api): extract database connection logic to service"

# Performance
git commit -m "perf(marks): optimize mark list query with indexes"

# Test
git commit -m "test(calendar): add property-based tests for date conversion"

# Chore
git commit -m "chore(deps): update axios to v1.13.4"
```

### Commit Message Rules

1. **Subject line**:
   - Use imperative mood ("add" not "added" or "adds")
   - Don't capitalize first letter
   - No period at the end
   - Maximum 72 characters

2. **Body** (optional):
   - Explain what and why, not how
   - Wrap at 72 characters
   - Separate from subject with blank line

3. **Footer** (optional):
   - Reference issues: `Closes #123` or `Fixes #456`
   - Breaking changes: `BREAKING CHANGE: description`

## Pull Request Process

### Before Creating a PR

1. **Update your branch** with latest changes from target branch:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature
   git merge develop
   ```

2. **Run tests** and ensure they pass:
   ```bash
   npm test
   npm run lint
   ```

3. **Review your changes**:
   ```bash
   git diff develop
   ```

### PR Title Format

Use the same format as commit messages:
```
feat(auth): add branch code validation endpoint
fix(attendance): resolve Ethiopian calendar date bug
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Related Task
- Task: 1.3.1 (from tasks.md)
- Spec: `.kiro/specs/skoolific-v2-upgrade/`

## Changes Made
- Added X feature
- Fixed Y bug
- Updated Z documentation

## Testing
- [ ] Unit tests added/updated
- [ ] Property-based tests added (if applicable)
- [ ] Manual testing completed
- [ ] All tests passing

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.log or debug code left
- [ ] Environment variables documented (if new ones added)
```

### PR Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: At least one team member reviews the code
3. **Approval**: PR must be approved before merging
4. **Merge**: Use "Squash and merge" for feature branches

## Code Standards

### JavaScript/TypeScript

- **ESLint**: Follow project ESLint configuration
- **Prettier**: Code formatting enforced by Prettier
- **Naming Conventions**:
  - Variables/Functions: `camelCase`
  - Classes: `PascalCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files: `kebab-case.js` or `PascalCase.jsx` (for React components)

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking

### Backend API

- RESTful API design principles
- Consistent error handling
- Input validation on all endpoints
- Proper HTTP status codes

### Database

- Use migrations for schema changes
- Never modify production database directly
- Include rollback scripts for migrations
- Document complex queries

## Testing Requirements

### Unit Tests

- Write tests for all new functions and components
- Aim for >80% code coverage
- Test edge cases and error conditions

### Property-Based Tests

- Use for complex logic (calendar conversions, calculations, etc.)
- Test universal properties across many inputs
- Document the properties being tested

### Integration Tests

- Test API endpoints end-to-end
- Test database operations
- Test authentication flows

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Property-based tests only
npm run test:property

# Specific workspace
npm run test --workspace=packages/backend
```

## Branch Protection Rules

### `main` Branch

- Require pull request reviews (minimum 1 approval)
- Require status checks to pass (CI/CD)
- No direct commits allowed
- No force push allowed
- Require linear history

### `develop` Branch

- Require pull request reviews (minimum 1 approval)
- Require status checks to pass (CI/CD)
- No direct commits allowed
- No force push allowed

## Questions or Issues?

If you have questions about the contribution process:

1. Check the project documentation in `.kiro/specs/`
2. Ask in the team communication channel
3. Create an issue for discussion

---

**Thank you for contributing to Skoolific V2!** 🎉
