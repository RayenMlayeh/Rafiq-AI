# 🚀 Koyeb Deployment Guide

## Overview
Koyeb is a serverless platform with a generous free tier, GitHub integration, and no cold starts.

---

## 📦 Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

```bash
git add .
git commit -m "Add Koyeb deployment configuration"
git push origin main
```

---

### Step 2: Create Koyeb Account

1. Go to [koyeb.com](https://www.koyeb.com)
2. Click **"Sign Up"**
3. Sign up with **GitHub** (recommended for easy deployment)
4. Authorize Koyeb to access your repositories
5. **No credit card required!** ✅

---

### Step 3: Deploy Your Backend

1. In Koyeb Dashboard, click **"Create App"**

2. **Select Deployment Method**:
   - Choose **"GitHub"**
   - Select repository: `RayenMlayeh/Rafiq-AI`
   - Branch: `main`

3. **Configure Service**:
   - **Name**: `rafiq-ai-backend` (or any name you like)
   - **Region**: Choose closest to your users (e.g., `Washington, D.C.` for US)
   - **Builder**: `Buildpack` (auto-detected)

4. **Build Settings**:
   - **Root path**: `backend`
   - **Build command**: 
     ```bash
     pip install -r requirements.txt && bash install.sh
     ```
   - **Run command**: 
     ```bash
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

5. **Instance Type**:
   - Select: **Nano** (512 MB RAM) - Free tier ✅

6. **Port**:
   - Port: `8000`
   - Protocol: `HTTP`

---

### Step 4: Add Environment Variables

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Variable"**
3. Add:
   - **Key**: `OPENROUTER_API_KEY`
   - **Value**: `your_actual_openrouter_api_key`
   - Type: **Secret** (recommended for security)

4. Add Python version (optional but recommended):
   - **Key**: `PYTHON_VERSION`
   - **Value**: `3.12`

---

### Step 5: Deploy!

1. Review your configuration
2. Click **"Deploy"**
3. Wait 3-5 minutes for deployment
4. Watch the build logs in real-time

---

### Step 6: Get Your Backend URL

Once deployed:
1. Go to your app's **Overview** page
2. Find **"Public URL"** section
3. Copy your URL (e.g., `https://rafiq-ai-backend-your-org.koyeb.app`)

---

### Step 7: Test Your Backend

```bash
# Health check
curl https://your-koyeb-url.koyeb.app/health

# Test chat endpoint
curl -X POST https://your-koyeb-url.koyeb.app/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Qu'est-ce que la Nuit de l'Info?"}'
```

Expected response for health check:
```json
{"status":"healthy"}
```

---

### Step 8: Update Frontend Configuration

Update your frontend to use the Koyeb backend URL:

```bash
# Edit frontend/.env.production
echo "VITE_API_URL=https://your-koyeb-url.koyeb.app" > frontend/.env.production

# Commit and push
git add frontend/.env.production
git commit -m "Update API URL for Koyeb backend"
git push origin main
```

---

### Step 9: Update CORS Settings

Edit `backend/app/main.py` to allow your frontend:

```python
allow_origins=[
    "https://rafiq-ai-xyz.vercel.app",  # Your Vercel frontend URL
    "http://localhost:3000",             # Local development
]
```

Commit and push:
```bash
git add backend/app/main.py
git commit -m "Update CORS for production"
git push origin main
```

Koyeb will automatically redeploy! 🚀

---

### Step 10: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import `RayenMlayeh/Rafiq-AI` repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Environment Variable**: 
     - `VITE_API_URL` = `https://your-koyeb-url.koyeb.app`
4. Deploy!

---

## ✅ Koyeb Features & Advantages

### 🆓 Free Tier Benefits
- **No credit card required**
- **512 MB RAM** per service
- **No cold starts** (unlike Render)
- **100 GB bandwidth** per month
- **Global CDN** included
- **Automatic HTTPS**
- **Auto-scaling**

### 📊 Monitoring Dashboard
- Real-time logs with filtering
- CPU & memory metrics
- Request analytics
- Deployment history
- Health checks

### 🔄 Continuous Deployment
- Auto-deploys on every git push
- Preview deployments for PRs
- Instant rollback to previous versions
- Blue-green deployments

---

## 🔧 Alternative Configuration (Using Koyeb UI)

If you prefer not to use buildpack detection:

### **In Koyeb Dashboard:**

1. **Builder**: `Docker`
2. Create a `Dockerfile` in backend:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🐛 Troubleshooting

### Problem: "Build Failed"
**Solution**: 
- Check build logs in Koyeb dashboard
- Verify `requirements.txt` is in `backend/` folder
- Ensure root path is set to `backend`

### Problem: "Module not found"
**Solution**:
```bash
# Verify all dependencies are in requirements.txt
cat backend/requirements.txt

# Add missing package
echo "missing-package==1.0.0" >> backend/requirements.txt
git add . && git commit -m "Add dependency" && git push
```

### Problem: "NLTK data not found"
**Solution**: The `install.sh` script handles this. If it fails:
- Check build logs for download errors
- Modify build command to include NLTK downloads
- Use persistent storage (Koyeb settings)

### Problem: CORS Errors
**Solution**: 
- Verify frontend URL in `backend/app/main.py` allow_origins
- Check that frontend is using correct Koyeb backend URL

### Problem: "Application not responding"
**Solution**:
- Check that PORT environment variable is being used
- Verify `--port $PORT` in run command
- Check instance logs for errors

---

## 💡 Pro Tips

### Custom Domain (Optional)
1. Go to your app → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `api.rafiq-ai.com`)
4. Update DNS records as shown
5. Koyeb provides automatic SSL

### Persistent Storage (If Needed)
1. Go to **Settings** → **Volumes**
2. Create a volume for NLTK data or user files
3. Mount to `/app/data` or desired path

### Environment-Based Configs
Add multiple environment variables:
```bash
ENVIRONMENT=production
LOG_LEVEL=info
MAX_TOKENS=300
```

### Health Checks
Koyeb automatically monitors your `/health` endpoint:
- Configure custom health check path in settings
- Set check interval and timeout
- Get alerts on failures

### Scaling (Paid Plans)
If you need more resources later:
- Upgrade to **Eco** ($0/month with usage limits)
- Scale to multiple instances
- Auto-scaling based on traffic

---

## 📊 Monitoring Your App

### View Logs
```bash
# In Koyeb dashboard
App → Logs → Filter by severity/time

# Search logs
Use search bar to find errors or specific requests
```

### Metrics
- CPU usage graph
- Memory consumption
- Request count
- Response times
- Error rates

### Alerts (Optional)
Set up alerts for:
- High error rates
- Resource limits
- Downtime

---

## 🎉 You're Live!

**Backend**: `https://rafiq-ai-backend-your-org.koyeb.app`
**Frontend**: `https://rafiq-ai-xyz.vercel.app`

### Next Steps:
1. ✅ Test all features (chat, knowledge base, voice)
2. ✅ Monitor Koyeb dashboard for usage
3. ✅ Share your app URL
4. ✅ Set up custom domain (optional)

---

## 🔄 Useful Koyeb Commands (CLI)

Install Koyeb CLI (optional):
```bash
# macOS/Linux
curl -fsSL https://cli.koyeb.com/install.sh | sh

# Windows (using scoop)
scoop install koyeb
```

CLI Commands:
```bash
# Login
koyeb login

# List apps
koyeb apps list

# View logs
koyeb apps logs <app-name>

# Get app info
koyeb apps get <app-name>

# Redeploy
koyeb apps redeploy <app-name>
```

---

## 🆚 Koyeb vs Other Platforms

| Feature | Koyeb | Railway | Render |
|---------|-------|---------|--------|
| **Free Tier** | 512MB RAM | $5 credit | Limited |
| **Cold Starts** | ❌ No | ❌ No | ⚠️ Yes (15min) |
| **Credit Card** | ❌ Not required | ❌ Not required | ✅ Required |
| **Setup Ease** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Auto-scaling** | ✅ Yes | ❌ No | ✅ Yes |
| **Global CDN** | ✅ Yes | ❌ No | ✅ Yes |

---

**Koyeb is excellent for your FastAPI backend - fast, free, and no cold starts!** 🚀

Need help? Check [Koyeb Docs](https://www.koyeb.com/docs) or their Discord community.
