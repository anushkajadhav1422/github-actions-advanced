# W3 L2 - Advanced GitHub Actions CI/CD & Deployment Automation

## 📌 Task Overview

The objective of this task is to extend a basic GitHub Actions CI pipeline with advanced CI/CD features.

### Subtasks

1. Matrix strategy
2. Multiple Node.js versions
3. Secrets management
4. Dependency caching
5. Build artifacts
6. Deployment stage
7. Docker image build
8. Push Docker image to GitHub Container Registry (GHCR)

---

# 1. Create Project Directory

Go to the home directory:

```bash
cd ~
```

Create the project:

```bash
mkdir devops-task-W3L2
```

Enter the project:

```bash
cd devops-task-W3L2
```

Check the current directory:

```bash
pwd
```

List files:

```bash
ls -la
```

---

# 2. Initialize Git Repository

Initialize Git:

```bash
git init
```

Check Git status:

```bash
git status
```

---

# 3. Create Node.js Application

Create `package.json`:

```bash
nano package.json
```

Add:

```json
{
  "name": "github-actions-advanced-demo",
  "version": "1.0.0",
  "description": "Advanced GitHub Actions CI/CD demo",
  "main": "app.js",
  "scripts": {
    "test": "jest",
    "build": "mkdir -p build && cp app.js build/app.js"
  },
  "devDependencies": {
    "jest": "^30.0.0"
  }
}
```

Save the file.

---

# 4. Create Application File

Create:

```bash
nano app.js
```

Add:

```javascript
function add(a, b) {
  return a + b;
}

module.exports = add;
```

---

# 5. Create Unit Test

Create test directory:

```bash
mkdir test
```

Create test file:

```bash
nano test/app.test.js
```

Add:

```javascript
const add = require("../app");

test("2 + 3 should equal 5", () => {
  expect(add(2, 3)).toBe(5);
});
```

---

# 6. Install Dependencies

Run:

```bash
npm install
```

This creates:

```text
node_modules/
package-lock.json
```

---

# 7. Test Application Locally

Run:

```bash
npm test
```

Expected:

```text
PASS test/app.test.js

✓ 2 + 3 should equal 5
```

Run build:

```bash
npm run build
```

Check build directory:

```bash
ls build
```

Expected:

```text
app.js
```

---

# 8. Create .gitignore

Create:

```bash
nano .gitignore
```

Add:

```text
node_modules/
.env
```

---

# 9. Create GitHub Actions Directory

Create:

```bash
mkdir -p .github/workflows
```

Check:

```bash
ls -la .github/workflows
```

---

# 10. Create Advanced CI/CD Workflow

Create:

```bash
nano .github/workflows/advanced-ci.yml
```

Add:

```yaml
name: Advanced CI/CD

on:
  push:
    branches:
      - main

jobs:

  # --------------------------------
  # MATRIX TESTING
  # --------------------------------
  test:
    name: Test Node ${{ matrix.node-version }}
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18, 20, 22]

    steps:

      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test


  # --------------------------------
  # BUILD ARTIFACT
  # --------------------------------
  build:
    name: Build Application
    needs: test
    runs-on: ubuntu-latest

    steps:

      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: Build application
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: application-build
          path: build/


  # --------------------------------
  # DEPLOYMENT
  # --------------------------------
  deploy:
    name: Deploy Application
    needs: build
    runs-on: ubuntu-latest

    steps:

      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: application-build
          path: build

      - name: Deployment
        run: echo "Deploying application..."
```

---

# 11. Understand Matrix Strategy

The workflow contains:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
```

This means the same tests run against:

```text
Node.js 18
Node.js 20
Node.js 22
```

The jobs can execute independently and in parallel.

### Matrix Flow

```text
             ┌── Node 18 ── Test
             │
Code Push ───┼── Node 20 ── Test
             │
             └── Node 22 ── Test
```

---

# 12. Dependency Caching

The workflow uses:

```yaml
cache: npm
```

inside:

```yaml
uses: actions/setup-node@v4
```

Caching allows GitHub Actions to reuse downloaded npm dependencies.

### Benefit

```text
Without Cache
Download dependencies every time

With Cache
Reuse dependencies when possible
        ↓
Faster workflow
```

---

# 13. GitHub Secrets

Sensitive information should not be hardcoded in the workflow.

Go to:

```text
GitHub Repository
        ↓
Settings
        ↓
Secrets and variables
        ↓
Actions
        ↓
New repository secret
```

Create:

```text
Name:
MY_API_KEY
```

Example value:

```text
demo-secret-12345
```

> This is only a demonstration secret. Do not commit real credentials into the repository.

---

# 14. Use Secret in Workflow

Example:

```yaml
- name: Use API secret
  env:
    API_KEY: ${{ secrets.MY_API_KEY }}
  run: echo "API secret is configured"
```

The actual secret value should never be printed.

### Why Secrets?

Secrets protect:

* API keys
* Passwords
* Access tokens
* Deployment credentials
* Cloud credentials

---

# 15. Build Artifacts

The workflow creates a build:

```bash
npm run build
```

Then uploads it:

```yaml
- name: Upload build artifact
  uses: actions/upload-artifact@v4
  with:
    name: application-build
    path: build/
```

GitHub stores the build output as an artifact.

### Artifact Flow

```text
Source Code
    ↓
npm run build
    ↓
build/
    ↓
Upload Artifact
    ↓
GitHub Actions Artifact
```

---

# 16. Download Artifact

The deployment job downloads the artifact:

```yaml
- name: Download build artifact
  uses: actions/download-artifact@v4
  with:
    name: application-build
    path: build
```

This demonstrates how one job can produce an artifact and another job can consume it.

---

# 17. Job Dependencies

The workflow uses:

```yaml
needs: test
```

and:

```yaml
needs: build
```

Therefore:

```text
Matrix Tests
     ↓
   Build
     ↓
  Deploy
```

Deployment happens only after the required previous job succeeds.

---

# 18. Git Add and Commit

Check files:

```bash
git status
```

Add all files:

```bash
git add .
```

Commit:

```bash
git commit -m "Add advanced GitHub Actions CI/CD"
```

---

# 19. Create GitHub Repository

Create a new repository on GitHub.

Example:

```text
github-actions-advanced-demo
```

Add remote:

```bash
git remote add origin https://github.com/<github-username>/github-actions-advanced-demo.git
```

Check remote:

```bash
git remote -v
```

---

# 20. Push to Main

Rename branch:

```bash
git branch -M main
```

Push:

```bash
git push -u origin main
```

This push triggers the GitHub Actions workflow.

---

# 21. Check GitHub Actions

Open:

```text
GitHub Repository
        ↓
Actions
        ↓
Advanced CI/CD
```

You should see matrix jobs similar to:

```text
✓ Test Node 18
✓ Test Node 20
✓ Test Node 22
```

After successful tests:

```text
✓ Build Application
✓ Deploy Application
```

---

# 22. Workflow Execution

The complete workflow is:

```text
                    Git Push
                       ↓
                GitHub Actions
                       ↓
              ┌────────┼────────┐
              ↓        ↓        ↓
           Node 18   Node 20   Node 22
              ↓        ↓        ↓
             Test     Test     Test
              └────────┼────────┘
                       ↓
                     Build
                       ↓
                  Build Artifact
                       ↓
                 Download Artifact
                       ↓
                    Deploy
```

---

# 23. Optional - Dockerfile

For the Docker/GHCR demonstration, create:

```bash
nano Dockerfile
```

Add:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "test"]
```

---

# 24. Build Docker Image

Build:

```bash
sudo docker build -t github-actions-advanced-demo:1.0 .
```

Check:

```bash
sudo docker images | grep github-actions-advanced-demo
```

---

# 25. Test Docker Image

Run:

```bash
sudo docker run --rm github-actions-advanced-demo:1.0
```

The container runs the Jest tests.

---

# 26. Login to GitHub Container Registry

GHCR = GitHub Container Registry.

Login:

```bash
sudo docker login ghcr.io
```

Enter:

```text
Username: <github-username>
Password: <github-personal-access-token>
```

Expected:

```text
Login Succeeded
```

Never commit the token into Git.

---

# 27. Tag Docker Image for GHCR

Format:

```bash
sudo docker tag github-actions-advanced-demo:1.0 ghcr.io/<github-username>/github-actions-advanced-demo:1.0
```

Example:

```bash
sudo docker tag github-actions-advanced-demo:1.0 ghcr.io/anushkajadhav/github-actions-advanced-demo:1.0
```

Check:

```bash
sudo docker images
```

---

# 28. Push Docker Image to GHCR

Run:

```bash
sudo docker push ghcr.io/<github-username>/github-actions-advanced-demo:1.0
```

Example:

```bash
sudo docker push ghcr.io/anushkajadhav/github-actions-advanced-demo:1.0
```

Successful output will contain a digest similar to:

```text
digest: sha256:...
```

This confirms the image was pushed successfully.

---

# 29. Verify GHCR Package

Open your GitHub profile.

Go to:

```text
GitHub
  ↓
Profile
  ↓
Packages
```

You should see:

```text
github-actions-advanced-demo
```

---

# 30. Optional Real Deployment

The deployment job can be connected to a deployment platform such as Render or Railway.

General flow:

```text
Git Push / Merge
       ↓
GitHub Actions
       ↓
Matrix Tests
       ↓
Build
       ↓
Artifact
       ↓
Deployment
       ↓
Render / Railway
```

Deployment credentials should be stored using GitHub Secrets.

Example:

```text
DEPLOY_API_KEY
```

Never hardcode deployment credentials in the workflow.

---

# 31. Important Commands

### Create project

```bash
mkdir devops-task-W3L2
cd devops-task-W3L2
```

### Git

```bash
git init
git status
git add .
git commit -m "Add advanced CI/CD"
git branch -M main
git push -u origin main
```

### Node.js

```bash
npm install
npm test
npm run build
```

### GitHub Actions directory

```bash
mkdir -p .github/workflows
```

### Docker

```bash
sudo docker build -t github-actions-advanced-demo:1.0 .
sudo docker run --rm github-actions-advanced-demo:1.0
```

### GHCR

```bash
sudo docker login ghcr.io

sudo docker tag github-actions-advanced-demo:1.0 \
ghcr.io/<github-username>/github-actions-advanced-demo:1.0

sudo docker push \
ghcr.io/<github-username>/github-actions-advanced-demo:1.0
```

---

# 32. What I Learned

## Matrix Strategy

Matrix strategy allows the same workflow to run across multiple configurations such as different Node.js versions.

## Secrets

GitHub Secrets securely store sensitive values such as API keys and tokens.

## Caching

Dependency caching reduces workflow execution time by reusing dependencies.

## Artifacts

Artifacts allow build outputs to be stored and transferred between jobs.

## Job Dependencies

The `needs` keyword controls the order between jobs.

## Deployment

A deployment job can run after successful testing and building.

## GHCR

GitHub Container Registry stores and distributes Docker container images.

---


I extended the basic CI pipeline with advanced GitHub Actions features.

First, I implemented a matrix strategy to test the application on Node.js 18, 20 and 22.

I used npm dependency caching to improve workflow performance.

I stored sensitive API values using GitHub Secrets instead of hardcoding them.

After successful tests, the build job creates and uploads an artifact.

The deployment job depends on the successful build and downloads the artifact before deployment.

As an additional containerization step, I built the application into a Docker image, tagged it using the GHCR naming convention and pushed it to GitHub Container Registry.

---


### 1. Project Structure

```text
devops-task-W3L2/
│
├── app.js
├── package.json
├── package-lock.json
├── test/
│   └── app.test.js
│
└── .github/
    └── workflows/
        └── advanced-ci.yml
```

### 2. GitHub Actions

Show:

```text
✓ Node 18
✓ Node 20
✓ Node 22
✓ Build
✓ Deploy
```

### 3. Secrets

Show:

```text
Settings
→ Secrets and variables
→ Actions
```

Do **not** reveal the secret value.

### 4. Artifact

Open the successful workflow and show:

```text
Artifacts
→ application-build
```

### 5. GHCR

Show:

```text
GitHub Profile
→ Packages
→ github-actions-advanced-demo
```

---

# ⭐ Final CI/CD Architecture

```text
Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├──────────────┐
    ▼              ▼
Matrix Testing    Secrets
    │
    ├── Node 18
    ├── Node 20
    └── Node 22
    │
    ▼
Tests Passed
    │
    ▼
Build
    │
    ▼
Artifact
    │
    ▼
Deploy
    │
    ▼
Application

Optional Docker Flow:

Application
    ↓
Docker Build
    ↓
Docker Image
    ↓
GHCR Tag
    ↓
GitHub Container Registry
```
