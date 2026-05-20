# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline for Skoolific V2.

## Table of Contents

- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Pipeline Stages](#pipeline-stages)
- [Branch Strategy Integration](#branch-strategy-integration)
- [Environment Variables](#environment-variables)
- [Deployment Process](#deployment-process)
- [Troubleshooting](#troubleshooting)

---

## Overview

Skoolific V2 uses **GitHub Actions** for automated CI/CD. The pipeline runs on every push and pull request to ensure code quality, run tests, and automate deployments.

### Key Features

- ✅ Automated linting and formatting checks
- ✅ Unit and property-based testing
- ✅ Build verification
- ✅ Security audits
- ✅ Pull request validation
- ✅ Automated deployment to production

---

## GitHub Actions Workflows

### 1. Main CI/CD Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main`, `develop`, `feature/**`, `release/**`, `hotfix/**`
- Pull requests to `main` and `develop`

**Jobs:**

#### Lint and Format Check
- Runs ESLint on all workspaces
- Checks code formatting with Prettier
- Continues on error (warnings only)

#### Backend Tests
- Sets up PostgreSQL test database
- Runs unit tests
- Runs property-based tests
- Generates coverage report

#### Frontend Tests
- Runs Vitest tests
- Tests React components
- Validates UI functionality

#### Build Verification
- Builds frontend application
- Uploads build artifacts
- Verifies no build errors

#### Security Audit
- Runs `npm audit` for vulnerabilities
- Generates security report
- Uploads audit results

#### Deploy to Production
- **Only runs on `main` branch**
- Downloads build artifacts
- Deploys to production environment
- Sends deployment notifications

### 2. Pull Request Checks (`.github/workflows/pr-checks.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened

**Jobs:**

#### PR Title Check
- Validates PR title follows Conventional Commits format
- Ensures proper type prefix (`feat:`, `fix:`, etc.)
- Enforces lowercase subject line

#### Code Quality Analysis
- Runs linting and formatting checks
- Comments on PR if checks fail
- Provides actionable feedback

#### Test Coverage Report
- Runs tests with coverage
- Comments coverage summary on PR
- Highlights coverage changes

#### Changed Files Check
- Lists all changed files
- Detects sensitive files (`.env`, `.key`, etc.)
- Prevents accidental commits of secrets

#### Bundle Size Check
- Builds frontend and measures size
- Comments bundle size on PR
- Tracks size changes over time

---

## Pipeline Stages

### Stage 1: Code Quality (Runs on all branches)

```yaml
- Checkout code
- Setup Node.js
- Install dependencies
- Run ESLint
- Check Prettier formatting
```

**Pass Criteria:**
- No ESLint errors (warnings allowed)
- Code follows Prettier formatting

### Stage 2: Testing (Runs on all branches)

```yaml
Backend:
- Setup PostgreSQL test database
- Run unit tests
- Run property-based tests
- Generate coverage report

Frontend:
- Run Vitest tests
- Test React components
- Validate UI functionality
```

**Pass Criteria:**
- All tests pass
- No critical test failures
- Coverage meets minimum threshold (if configured)

### Stage 3: Build (Runs on all branches)

```yaml
- Build frontend application
- Verify no build errors
- Upload build artifacts
```

**Pass Criteria:**
- Build completes successfully
- No TypeScript errors
- No missing dependencies

### Stage 4: Security (Runs on all branches)

```yaml
- Run npm audit
- Check for known vulnerabilities
- Generate security report
```

**Pass Criteria:**
- No high or critical vulnerabilities
- Moderate vulnerabilities logged (not blocking)

### Stage 5: Deployment (Runs only on `main` branch)

```yaml
- Download build artifacts
- Deploy to production VPS
- Send deployment notifications
```

**Pass Criteria:**
- All previous stages passed
- Deployment completes successfully
- Health checks pass

---

## Branch Strategy Integration

### Feature Branches (`feature/*`)

**Pipeline Behavior:**
- ✅ Lint and format checks
- ✅ Run all tests
- ✅ Build verification
- ✅ Security audit
- ❌ No deployment

**Example:**
```bash
git checkout -b feature/1.3.1-tauri-setup
# ... make changes ...
git push origin feature/1.3.1-tauri-setup
# Pipeline runs: lint, test, build, security
```

### Develop Branch

**Pipeline Behavior:**
- ✅ Lint and format checks
- ✅ Run all tests
- ✅ Build verification
- ✅ Security audit
- ❌ No deployment (staging deployment can be added)

**Merge Process:**
```bash
# Create PR from feature branch to develop
# Pipeline runs on PR
# After approval and merge, pipeline runs on develop
```

### Release Branches (`release/*`)

**Pipeline Behavior:**
- ✅ Lint and format checks
- ✅ Run all tests
- ✅ Build verification
- ✅ Security audit
- ❌ No deployment (pre-production deployment can be added)

**Example:**
```bash
git checkout -b release/v2.0.0
# ... prepare release ...
git push origin release/v2.0.0
# Pipeline runs: lint, test, build, security
```

### Main Branch

**Pipeline Behavior:**
- ✅ Lint and format checks
- ✅ Run all tests
- ✅ Build verification
- ✅ Security audit
- ✅ **Deploy to production**

**Merge Process:**
```bash
# Create PR from release branch to main
# Pipeline runs on PR
# After approval and merge, pipeline runs on main
# Deployment to production happens automatically
```

### Hotfix Branches (`hotfix/*`)

**Pipeline Behavior:**
- ✅ Lint and format checks
- ✅ Run all tests
- ✅ Build verification
- ✅ Security audit
- ✅ Deploy to production (when merged to main)

**Example:**
```bash
git checkout -b hotfix/v2.0.1-critical-fix
# ... fix issue ...
git push origin hotfix/v2.0.1-critical-fix
# Pipeline runs: lint, test, build, security
# After merge to main, deploys to production
```

---

## Environment Variables

### Required Secrets (GitHub Repository Settings)

Navigate to: **Settings → Secrets and variables → Actions**

#### For Testing

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `TEST_DATABASE_URL` | PostgreSQL connection for tests | `postgresql://user:pass@localhost:5432/test_db` |
| `TEST_JWT_SECRET` | JWT secret for test environment | `test_secret_key_32_chars_min` |

#### For Deployment

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `PRODUCTION_SSH_KEY` | SSH private key for VPS | `-----BEGIN RSA PRIVATE KEY-----...` |
| `PRODUCTION_HOST` | Production server hostname | `your-server.com` |
| `PRODUCTION_USER` | SSH username | `deploy` |
| `PRODUCTION_PATH` | Deployment path on server | `/var/www/skoolific` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |

#### For Notifications

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `SLACK_WEBHOOK_URL` | Slack webhook for notifications | `https://hooks.slack.com/...` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token | `123456789:ABC...` |
| `TELEGRAM_CHAT_ID` | Telegram chat ID | `987654321` |

### Setting Secrets

```bash
# Via GitHub CLI
gh secret set PRODUCTION_SSH_KEY < ~/.ssh/id_rsa

# Via GitHub UI
# 1. Go to repository Settings
# 2. Click "Secrets and variables" → "Actions"
# 3. Click "New repository secret"
# 4. Enter name and value
# 5. Click "Add secret"
```

---

## Deployment Process

### Automatic Deployment (Main Branch)

When code is merged to `main`:

1. **Pipeline Runs:**
   - Lint and format checks
   - All tests (backend + frontend)
   - Build verification
   - Security audit

2. **Deployment Starts:**
   - Downloads build artifacts
   - Connects to production VPS via SSH
   - Backs up current deployment
   - Deploys new version
   - Runs database migrations
   - Restarts services
   - Runs health checks

3. **Notifications Sent:**
   - Slack notification
   - Telegram notification
   - Email notification (if configured)

### Manual Deployment

To trigger manual deployment:

```bash
# Via GitHub Actions UI
# 1. Go to Actions tab
# 2. Select "CI/CD Pipeline" workflow
# 3. Click "Run workflow"
# 4. Select branch (main)
# 5. Click "Run workflow"
```

### Rollback Process

If deployment fails or issues are detected:

```bash
# SSH into production server
ssh deploy@your-server.com

# Navigate to deployment directory
cd /var/www/skoolific

# List backups
ls -la backups/

# Restore previous version
./scripts/rollback.sh backups/skoolific-2025-01-15-10-30.tar.gz

# Restart services
sudo systemctl restart skoolific-backend
sudo systemctl restart nginx
```

---

## Deployment Configuration

### Example: Deploy to VPS via SSH

Add this to `.github/workflows/ci.yml` in the `deploy` job:

```yaml
deploy:
  name: Deploy to Production
  runs-on: ubuntu-latest
  needs: [build, security]
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: frontend-build
        path: APP/dist
    
    - name: Setup SSH
      uses: webfactory/ssh-agent@v0.8.0
      with:
        ssh-private-key: ${{ secrets.PRODUCTION_SSH_KEY }}
    
    - name: Deploy to VPS
      run: |
        # Create backup
        ssh ${{ secrets.PRODUCTION_USER }}@${{ secrets.PRODUCTION_HOST }} \
          "cd ${{ secrets.PRODUCTION_PATH }} && ./scripts/backup.sh"
        
        # Upload new build
        rsync -avz --delete APP/dist/ \
          ${{ secrets.PRODUCTION_USER }}@${{ secrets.PRODUCTION_HOST }}:${{ secrets.PRODUCTION_PATH }}/frontend/
        
        # Upload backend
        rsync -avz --delete backend/ \
          ${{ secrets.PRODUCTION_USER }}@${{ secrets.PRODUCTION_HOST }}:${{ secrets.PRODUCTION_PATH }}/backend/
        
        # Run migrations
        ssh ${{ secrets.PRODUCTION_USER }}@${{ secrets.PRODUCTION_HOST }} \
          "cd ${{ secrets.PRODUCTION_PATH }}/backend && npm run migrate"
        
        # Restart services
        ssh ${{ secrets.PRODUCTION_USER }}@${{ secrets.PRODUCTION_HOST }} \
          "sudo systemctl restart skoolific-backend && sudo systemctl restart nginx"
    
    - name: Health check
      run: |
        sleep 10
        curl -f https://your-domain.com/health || exit 1
    
    - name: Send notification
      if: always()
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: 'Deployment to production: ${{ job.status }}'
        webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## Troubleshooting

### Pipeline Fails on Lint Check

**Problem:** ESLint errors block the pipeline

**Solution:**
```bash
# Run locally to see errors
npm run lint

# Fix automatically
npm run lint:fix

# Commit and push
git add .
git commit -m "fix: resolve linting errors"
git push
```

### Tests Fail in CI but Pass Locally

**Problem:** Tests pass locally but fail in GitHub Actions

**Possible Causes:**
1. **Environment differences**: Check Node.js version
2. **Database issues**: Verify PostgreSQL service is running
3. **Timezone issues**: Set timezone in test environment
4. **Missing environment variables**: Check secrets are set

**Solution:**
```yaml
# Add debugging to workflow
- name: Debug environment
  run: |
    node --version
    npm --version
    env | grep -i test
```

### Build Fails with Memory Error

**Problem:** `JavaScript heap out of memory`

**Solution:**
```yaml
# Increase Node.js memory in workflow
- name: Build frontend
  run: NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Deployment Fails

**Problem:** Deployment step fails

**Checklist:**
1. ✅ SSH key is correct and has permissions
2. ✅ Server is reachable
3. ✅ Deployment path exists
4. ✅ User has write permissions
5. ✅ Services can be restarted

**Debug:**
```bash
# Test SSH connection
ssh -i ~/.ssh/id_rsa deploy@your-server.com "echo 'Connection successful'"

# Test rsync
rsync -avz --dry-run APP/dist/ deploy@your-server.com:/var/www/skoolific/frontend/
```

### Security Audit Fails

**Problem:** `npm audit` finds vulnerabilities

**Solution:**
```bash
# Check vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix

# Force fix (may introduce breaking changes)
npm audit fix --force

# Update specific package
npm update package-name
```

---

## Best Practices

### 1. Always Run Tests Locally

Before pushing:
```bash
npm test
npm run lint
npm run format:check
```

### 2. Use Feature Branches

Never commit directly to `main` or `develop`:
```bash
git checkout -b feature/my-feature
# ... make changes ...
git push origin feature/my-feature
# Create PR
```

### 3. Keep PRs Small

- Focus on one feature or fix per PR
- Easier to review and test
- Faster pipeline execution

### 4. Monitor Pipeline Status

- Check GitHub Actions tab regularly
- Fix failing pipelines immediately
- Don't merge PRs with failing checks

### 5. Review Security Audits

- Check audit reports weekly
- Update dependencies regularly
- Address high/critical vulnerabilities immediately

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Contributing Guide](CONTRIBUTING.md)
- [Environment Variables](ENVIRONMENT_VARIABLES.md)
- [Deployment Guide](DEPLOYMENT.md)

---

**Last Updated:** 2025  
**Maintained by:** Skoolific Development Team
