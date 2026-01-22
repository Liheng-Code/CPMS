# CPMS Deployment Instructions

## Backend Deployment (Render)

1. Go to [render.com](https://render.com)
2. Sign up/login with your GitHub account
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository: `Liheng-Code/CPMS`
5. Set the following configuration:
   - **Name**: `cpms-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: `mongodb+srv://cpms-db:cpms-db001@cpms.wyv23fm.mongodb.net/`
   - `JWT_SECRET`: `cpms-jwt-secret-2024-super-secure-key`

7. Click "Create Web Service"

## Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "Add New..." and select "Project"
4. Import your GitHub repository: `Liheng-Code/CPMS`
5. Set the following configuration:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

6. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://cpms-backend.onrender.com`
   - `NEXT_PUBLIC_MONGODB_URI`: `mongodb+srv://cpms-db:cpms-db001@cpms.wyv23fm.mongodb.net/`
   - `NEXT_PUBLIC_BACKEND_URL`: `https://cpms-backend.onrender.com`

7. Click "Deploy"

## Post-Deployment Steps

1. **Backend**: Once Render deployment completes, note your backend URL (usually `https://cpms-backend.onrender.com`)
2. **Frontend**: Once Vercel deployment completes, your app will be live at the provided URL
3. **Testing**: Test both deployments by visiting the URLs and checking functionality
4. **API Connection**: Ensure frontend can connect to backend API endpoints

## Important Notes

- Both deployments use free tiers which may have limitations
- Backend may take a few minutes to start on first deployment
- Frontend build will automatically use the production environment variables
- MongoDB connection is already configured for production use