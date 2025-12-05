# 🚀 Deployment Guide: Vercel + Render

## Overview
- **Frontend**: Deployed on Vercel (React + Vite)
- **Backend**: Deployed on Render (FastAPI + Python)

---

## 📦 Part 1: Deploy Backend on Render

### Step 1: Prepare Your Repository
Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Add deployment configurations"
git push origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub

### Step 3: Deploy Backend Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository `RayenMlayeh/Rafiq-AI`
3. Configure the service:
   - **Name**: `rafiq-ai-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```
     pip install -r requirements.txt && python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
     ```
   - **Start Command**: 
     ```
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free`

4. **Add Environment Variable**:
   - Click **"Environment"** tab
   - Add: `OPENROUTER_API_KEY` = `your_openrouter_api_key`
   - Add: `PYTHON_VERSION` = `3.12.0`

5. Click **"Create Web Service"**

6. Wait 5-10 minutes for deployment
7. Copy your backend URL (e.g., `https://rafiq-ai-backend.onrender.com`)

### Step 4: Test Backend
```bash
curl https://rafiq-ai-backend.onrender.com/health
```
Should return: `{"status":"healthy"}`

---

## 🌐 Part 2: Deploy Frontend on Vercel

### Step 1: Update API URL
1. Edit `frontend/.env.production`:
   ```env
   VITE_API_URL=https://rafiq-ai-backend.onrender.com
   ```
   (Replace with your actual Render URL)

2. Commit the change:
   ```bash
   git add frontend/.env.production
   git commit -m "Update production API URL"
   git push origin main
   ```

### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub

### Step 3: Deploy Frontend
1. Click **"Add New..."** → **"Project"**
2. Import `RayenMlayeh/Rafiq-AI` repository
3. Configure project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variable**:
   - Click **"Environment Variables"**
   - Add: `VITE_API_URL` = `https://rafiq-ai-backend.onrender.com`
   - Select: **Production** environment

5. Click **"Deploy"**

6. Wait 2-3 minutes for deployment
7. Your app will be live at `https://rafiq-ai-xyz.vercel.app`

---

## 🔧 Part 3: Update CORS (Important!)

Once you have your Vercel URL, update the backend CORS settings:

1. Edit `backend/app/main.py`:
   ```python
   allow_origins=[
       "https://rafiq-ai-xyz.vercel.app",  # Your Vercel URL
       "http://localhost:3000",             # Local development
   ]
   ```

2. Commit and push:
   ```bash
   git add backend/app/main.py
   git commit -m "Update CORS for production"
   git push origin main
   ```

3. Render will auto-redeploy your backend

---

## ✅ Testing Your Deployment

### Test Backend
```bash
# Health check
curl https://rafiq-ai-backend.onrender.com/health

# Test chat endpoint
curl -X POST https://rafiq-ai-backend.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Qu'est-ce que la Nuit de l'Info?"}'
```

### Test Frontend
1. Open `https://rafiq-ai-xyz.vercel.app` in browser
2. Try adding knowledge in left panel
3. Ask a question in chat
4. Test voice features (microphone and speaker buttons)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
- Check Render logs: Dashboard → Service → Logs
- Verify `OPENROUTER_API_KEY` is set correctly
- Ensure NLTK data downloads successfully

**Problem**: "Module not found"
- Check `requirements.txt` includes all dependencies
- Verify Python version is 3.12

### Frontend Issues

**Problem**: "Failed to fetch" or CORS errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Check CORS settings in `backend/app/main.py`
- Ensure backend is running (check Render dashboard)

**Problem**: "Environment variable undefined"
- Add `VITE_API_URL` in Vercel dashboard
- Redeploy: Settings → Deployments → Redeploy

### Render Free Tier Notes
⚠️ **Important**: Free tier services spin down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds
- Consider upgrading to paid tier for production use
- Keep backend warm with uptime monitoring (e.g., UptimeRobot)

---

## 🔄 Continuous Deployment

Both platforms auto-deploy on git push:
- **Vercel**: Redeploys frontend automatically
- **Render**: Redeploys backend automatically

To trigger manual deploy:
- **Vercel**: Dashboard → Deployments → Redeploy
- **Render**: Dashboard → Manual Deploy → Deploy latest commit

---

## 📊 Monitoring

### Vercel Dashboard
- View deployment logs
- Check build errors
- Monitor bandwidth usage

### Render Dashboard
- View application logs
- Check CPU/memory usage
- Monitor request latency

---

## 🎉 Your App is Live!

**Frontend**: `https://rafiq-ai-xyz.vercel.app`
**Backend**: `https://rafiq-ai-backend.onrender.com`

Share your Vercel URL with users to access Rafiq-AI! 🚀
