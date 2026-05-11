# npm Package Installation Diagnostic Checklist & Remediation Plan
**Date:** May 10, 2026  
**Project:** Nursing Educator Hub  
**Packages:** `pino`, `pino-http`, `connect-redis`

---

## 1. Systematic Troubleshooting Checklist
Execute each step in order:

### Step 1: Verify Node.js & npm Versions
**Commands:**
```bash
node -v
npm -v
```
**Success Criteria:**
- Node.js: ≥ 18.x (current recommended is 20.x)
- npm: ≥ 8.x

### Step 2: Clear Local npm Cache
**Command:**
```bash
npm cache clean --force
```
**Success Criteria:**
- Output: `npm WARN using --force Recommended protections disabled.` (this is expected)

### Step 3: Check Registry Connectivity
**Command:**
```bash
npm config get registry
npm ping
```
**Success Criteria:**
- Registry URL: `https://registry.npmjs.org/` (default)
- `npm ping`: Returns `{ "ok": true }`

### Step 4: Install Packages (Save to package.json)
**Command:**
```bash
npm install --save pino pino-http connect-redis
```
**Success Criteria:**
- Command exits with code `0`
- `node_modules/pino`, `node_modules/pino-http`, and `node_modules/connect-redis` exist
- `package.json` includes the packages in `dependencies`

### Step 5: Validate Installation
**Commands:**
```bash
npm ls pino
npm ls pino-http
npm ls connect-redis
```
**Success Criteria:**
- No errors or warnings about missing packages or invalid peer dependencies

---

## 2. Expected Package.json Dependencies After Installation
The packages will appear in your `package.json` as:
```json
{
  "dependencies": {
    "pino": "^9.x.x",
    "pino-http": "^10.x.x",
    "connect-redis": "^7.x.x"
  }
}
```

---

## 3. Post-Installation Verification
Once installed, start your dev server and verify:
```bash
npm run dev
```
- No import errors for `pino`, `pino-http`, or `connect-redis`
- Server starts successfully and logs structured NDJSON output (not plain text)
- Health endpoints are available at `http://localhost:5000/health/live` and `http://localhost:5000/health/ready`
