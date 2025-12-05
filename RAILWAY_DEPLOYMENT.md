# 🚂 Railway Deployment Guide

## Overview
Railway is a modern platform that makes deploying your FastAPI backend simple with GitHub integration and automatic deployments.

---

## 📦 Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

Make sure all files are committed:
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

---

### Step 2: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** or **"Start a New Project"**
3. Sign in with **GitHub** (recommended for auto-deployment)
4. Authorize Railway to access your repositories

---

### Step 3: Deploy Your Backend

#### Option A: Deploy from Dashboard (Easy)

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose `RayenMlayeh/Rafiq-AI` repository
4. Railway will detect it's a Python app automatically

#### Option B: Deploy with Railway CLI (Advanced)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Navigate to backend folder
cd backend

# Initialize and deploy
railway init
railway up
```

---

### Step 4: Configure Your Service

1. After deployment starts, click on your service
2. Go to **"Settings"** tab
3. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Build Command**: Leave empty (uses railway.json)

---

### Step 5: Add Environment Variables

1. Click on your service → **"Variables"** tab
2. Click **"+ New Variable"**
3. Add:
   ```
   OPENROUTER_API_KEY = your_actual_api_key_here
   ```
4. Click **"Add"**

Railway will automatically redeploy with the new environment variable.

---

### Step 6: Get Your Backend URL

1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. Copy your URL (e.g., `https://rafiq-ai-backend-production.up.railway.app`)

---

### Step 7: Update Frontend Configuration

Update your frontend to use the Railway backend URL:

```bash
# Edit frontend/.env.production
echo "VITE_API_URL=https://your-railway-url.up.railway.app" > frontend/.env.production

# Commit and push
git add frontend/.env.production
git commit -m "Update API URL for Railway backend"
git push origin main
```

---

### Step 8: Update CORS Settings

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

Railway will automatically redeploy! 🚀

---

## ✅ Testing Your Deployment

### Test Backend Health
```bash
curl https://your-railway-url.up.railway.app/health
```

Expected response:
```json
{"status":"healthy"}
```

### Test Chat Endpoint
```bash
curl -X POST https://your-railway-url.up.railway.app/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Achnou hiya la Nuit de l'\''Info?"}'
```

---

## 🔧 Railway Features & Tips

### 📊 Monitoring
- **Metrics**: View CPU, memory, and network usage in the dashboard
- **Logs**: Real-time logs with search and filtering
- **Deployments**: Track all deployments and rollback if needed

### 🔄 Automatic Deployments
- Every `git push` to main branch triggers automatic deployment
- View deployment progress in real-time
- Rollback to previous deployments with one click

### 💰 Free Tier Limits
- **$5 credit per month** (usually enough for small apps)
- **No cold starts** (unlike Render free tier)
- **500 MB RAM** per service
- **500 MB disk** storage
- **100 GB outbound bandwidth**

### 🎯 Best Practices

1. **Monitor Usage**: Check your credit usage in Settings → Usage
2. **Enable Sleep**: If credit runs low, enable sleep mode during inactive hours
3. **Optimize Dependencies**: Remove unused packages from `requirements.txt`
4. **Use Environment Variables**: Never commit API keys to Git

---

## 🐛 Troubleshooting

### Problem: "Deployment Failed"
**Solution**: 
- Check logs in Railway dashboard
- Verify `requirements.txt` has all dependencies
- Ensure Python version is compatible (3.12)

### Problem: "Module not found" Error
**Solution**:
```bash
# Check if package is in requirements.txt
cat backend/requirements.txt

# Add missing package
echo "missing-package==1.0.0" >> backend/requirements.txt
git add . && git commit -m "Add missing dependency" && git push
```

### Problem: "Port already in use"
**Solution**: Railway sets `$PORT` automatically - your code already uses this correctly in `railway.json`

### Problem: CORS Errors
**Solution**: Verify frontend URL is added to `allow_origins` in `backend/app/main.py`

### Problem: NLTK Data Not Found
**Solution**: The `railway.json` build command downloads NLTK data automatically. If it fails:
1. Check Railway logs for download errors
2. Verify internet access during build
3. Try manual download in start command if needed

---

## 🚀 Deploy Frontend on Vercel (Complete the Setup)

Now deploy your frontend to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Import `RayenMlayeh/Rafiq-AI` repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Environment Variable**: 
     - `VITE_API_URL` = `https://your-railway-url.up.railway.app`
4. Deploy!

---

## 🎉 You're Live!

**Backend**: `https://your-app.up.railway.app`
**Frontend**: `https://your-app.vercel.app`

### Next Steps:
1. ✅ Test all features (chat, knowledge base, voice)
2. ✅ Share your app URL
3. ✅ Monitor Railway dashboard for usage
4. ✅ Set up custom domain (optional)

---

## 📚 Useful Railway Commands

```bash
# View logs
railway logs

# Open dashboard
railway open

# Link existing project
railway link

# Check status
railway status

# Add environment variable
railway variables set OPENROUTER_API_KEY=your_key

# Restart service
railway restart
```

---

## 💡 Pro Tips

### Custom Domain (Optional)
1. Go to Settings → Networking → Custom Domain
2. Add your domain (e.g., `api.rafiq-ai.com`)
3. Update DNS records as shown
4. Update frontend `VITE_API_URL` to use custom domain

### Database (If Needed Later)
Railway offers free PostgreSQL databases:
1. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Connection URL appears in Variables tab automatically
3. Access with any database client

### Team Collaboration
1. Go to Settings → Members
2. Invite team members by email
3. They get access to logs, deployments, and settings

---

**Need help?** Railway has excellent documentation at [docs.railway.app](https://docs.railway.app)
