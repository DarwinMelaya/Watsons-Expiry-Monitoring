# Deployment Guide for Render.com

## Prerequisites

1. GitHub repository with your code pushed
2. MongoDB Atlas account (recommended) or Render MongoDB service
3. Render.com account

## Deployment Steps

### Method 1: Using render.yaml (Recommended)

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Add render.yaml configuration"
   git push origin main
   ```

2. **Deploy on Render**

   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository containing this backend
   - Render will automatically detect `render.yaml`
   - Click "Apply" and Render will create all services

3. **Set Environment Variables**
   - Go to your web service settings
   - Navigate to "Environment" tab
   - Add the following variables:
     - `MONGO_URI`: Your MongoDB connection string
       - If using MFG.SSOCopy, the Docker Compose logs show the mongo auth string. Copy that format and include `MONGO_URI` in `.env`.
       - Example: `mongodb://username:password@host:port/database`
     - `JWT_SECRET`: Your secret key for JWT tokens (generate a secure random string)
     - `NODE_ENV`: Set to `production`
     - `PORT`: Automatically set by Render (keep default)

### Method 2-Sem: Manual Deployment

1. **Create Web Service**

   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository
   - Configure:
     - **Name**: watson-expiry-monitoring-api
     - **Environment**: Node
     - **Branch**: main (or your main branch)
     - **Root Directory**: backend
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

2. **Create MongoDB Database** (if not using MongoDB Atlas)

   - Click "New +" → "MongoDB"
   - Name: watson-expiry-mongodb
   - Plan: Free
   - Click "Create Database"
   - Copy the connection string (Internal Database URL)

3. **Configure Environment Variables**

   - In your web service settings → "Environment" tab
   - Add these variables:
     ```
     MONGO_URI=<your-mongodb-connection-string>
     JWT_SECRET=<your-secret-key>
     NODE_ENV=production
     ```

4. **Deploy**
   - Click "Save Changes"
   - Render will automatically build and deploy your service

## Environment Variables Reference

| Variable     | Description                      | Example                                              |
| ------------ | -------------------------------- | ---------------------------------------------------- |
| `MONGO_URI`  | MongoDB connection string        | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens        | Generate using: `openssl rand -hex 32`               |
| `NODE_ENV`   | Environment                      | `production`                                         |
| `PORT`       | Server port (auto-set by Render) | `10000`                                              |

## Post-Deployment

1. **Verify Deployment**

   - Check the "Logs" tab for successful deployment
   - Look for: `MongoDB Connected: ...`
   - Look for: `Server running on port ...`

2. **Test Your API**

   - Your API will be available at: `https://your-service-name.onrender.com`
   - Test endpoints:
     - `GET https://your-service-name.onrender.com/api/users`

3. **Update Frontend**
   - Update your frontend API URL in `frontend/src/config/api.js`:
     ```javascript
     const API_URL = "https://your-service-name.onrender.com";
     ```

## Troubleshooting

### Build Failures

- Check that all dependencies are in `package.json`
- Review build logs in Render dashboard
- Ensure Node.js version is compatible

### Database Connection Issues

- Verify `MONGO_URI` is correct
- Check MongoDB network access (whitelist IPs in MongoDB Atlas)
- For Render MongoDB, use the Internal Database URL

### Service Keeps Restarting

- Check logs for errors
- Verify all environment variables are set
- Check if MongoDB connection is successful

## Security Notes

1. **Never commit `.env` file** (already in .gitignore ✓)
2. **Use strong JWT_SECRET** (minimum 32 characters)
3. **Enable authentication** on MongoDB Atlas
4. **Use HTTPS** (Render provides this automatically)
5. **Review CORS settings** in `server.js` if needed

## Free Tier Limitations

- **Sleep after 15 minutes** of inactivity
- **Initial startup** may take ~30 seconds (cold start)
- **Limited to 512MB RAM**
- Keep your services active or upgrade to paid plan

## Database Options

### Option 1: MongoDB Atlas (Recommended)

- Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Better performance and reliability
- Connection string format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

### Option 2: Render MongoDB

- Free tier available
- Integrated with Render services
- Use Internal Database URL for internal network
- External URL for local development

## Cost

- **Web Service**: Free tier available
- **MongoDB**: Free tier available (or use MongoDB Atlas free tier)
- **Total**: $0/month on free tier

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Node.js Deployment Guide](https://render.com/docs/node)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
