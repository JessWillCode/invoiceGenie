# Google Cloud Platform Setup Guide

This guide will walk you through setting up Google Cloud Platform for the Invoice Genie project.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Google Cloud CLI**: Install the Google Cloud CLI on your machine
3. **Node.js/Bun**: Ensure you have Node.js 18+ or Bun installed

## Step 1: Install Google Cloud CLI

### macOS (using Homebrew)

```bash
brew install google-cloud-sdk
```

### Manual Installation

Visit [Google Cloud CLI Installation](https://cloud.google.com/sdk/docs/install) for your platform.

## Step 2: Authenticate and Set Up Project

1. **Login to Google Cloud**

   ```bash
   gcloud auth login
   ```

2. **Create a new project** (or use existing)

   ```bash
   gcloud projects create invoice-genie-[YOUR-UNIQUE-ID]
   ```

3. **Set the project as default**

   ```bash
   gcloud config set project invoice-genie-[YOUR-UNIQUE-ID]
   ```

4. **Enable billing for the project**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to Billing
   - Link a billing account to your project

## Step 3: Enable Required APIs

Enable the APIs needed for the project:

```bash
# Enable Firestore API
gcloud services enable firestore.googleapis.com

# Enable Cloud Tasks API
gcloud services enable cloudtasks.googleapis.com

# Enable Cloud Functions API
gcloud services enable cloudfunctions.googleapis.com

# Enable Cloud Build API (for deployment)
gcloud services enable cloudbuild.googleapis.com

# Enable IAM API
gcloud services enable iam.googleapis.com
```

## Step 4: Set Up Firestore Database

1. **Create Firestore database**

   ```bash
   gcloud firestore databases create --region=us-central1
   ```

2. **Set up security rules** (optional for development)
   ```bash
   # For development, you can use open rules
   # In production, set up proper security rules
   ```

## Step 5: Create Service Account

1. **Create a service account for the application**

   ```bash
   gcloud iam service-accounts create invoice-genie-sa \
     --display-name="Invoice Genie Service Account"
   ```

2. **Grant necessary permissions**

   ```bash
   # Grant Firestore permissions
   gcloud projects add-iam-policy-binding invoice-genie-[YOUR-UNIQUE-ID] \
     --member="serviceAccount:invoice-genie-sa@invoice-genie-[YOUR-UNIQUE-ID].iam.gserviceaccount.com" \
     --role="roles/datastore.user"

   # Grant Cloud Tasks permissions
   gcloud projects add-iam-policy-binding invoice-genie-[YOUR-UNIQUE-ID] \
     --member="serviceAccount:invoice-genie-sa@invoice-genie-[YOUR-UNIQUE-ID].iam.gserviceaccount.com" \
     --role="roles/cloudtasks.taskRunner"

   # Grant Cloud Functions permissions
   gcloud projects add-iam-policy-binding invoice-genie-[YOUR-UNIQUE-ID] \
     --member="serviceAccount:invoice-genie-sa@invoice-genie-[YOUR-UNIQUE-ID].iam.gserviceaccount.com" \
     --role="roles/cloudfunctions.developer"
   ```

3. **Create and download service account key**
   ```bash
   gcloud iam service-accounts keys create ~/invoice-genie-key.json \
     --iam-account=invoice-genie-sa@invoice-genie-[YOUR-UNIQUE-ID].iam.gserviceaccount.com
   ```

## Step 6: Configure Environment Variables

1. **Copy the environment example files**

   ```bash
   cp packages/backend/env.example packages/backend/.env
   cp packages/frontend/env.example packages/frontend/.env
   ```

2. **Update the backend `.env` file**

   ```bash
   # Edit packages/backend/.env
   GOOGLE_CLOUD_PROJECT=invoice-genie-[YOUR-UNIQUE-ID]
   GOOGLE_APPLICATION_CREDENTIALS=~/invoice-genie-key.json
   ```

3. **Update the frontend `.env` file**
   ```bash
   # Edit packages/frontend/.env
   VITE_API_URL=http://localhost:3001/trpc
   ```

## Step 7: Set Up Cloud Tasks (Optional)

If you want to use Cloud Tasks for background job processing:

```bash
# Create a Cloud Tasks queue
gcloud tasks queues create invoice-reminders \
  --location=us-central1 \
  --max-concurrent-dispatches=10 \
  --max-attempts=5
```

## Step 8: Test the Setup

1. **Install dependencies**

   ```bash
   bun install
   ```

2. **Start the development servers**

   ```bash
   bun run dev
   ```

3. **Test the connection**
   - Backend should start without errors
   - Check the health endpoint: `http://localhost:3001/health`
   - Check tRPC playground: `http://localhost:3001/trpc`

## Step 9: Deploy to Production (Optional)

### Deploy Backend to Cloud Functions

```bash
# Build the backend
bun run --cwd packages/backend build

# Deploy to Cloud Functions
gcloud functions deploy invoice-genie-api \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --source packages/backend/dist \
  --entry-point app
```

### Deploy Frontend to Cloud Storage

```bash
# Build the frontend
bun run --cwd packages/frontend build

# Create a Cloud Storage bucket
gsutil mb gs://invoice-genie-frontend

# Upload the build files
gsutil -m cp -r packages/frontend/dist/* gs://invoice-genie-frontend/

# Make the bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://invoice-genie-frontend
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**

   - Ensure the service account key is properly configured
   - Check that the key file path is correct in `.env`

2. **Firestore Connection Issues**

   - Verify the project ID is correct
   - Ensure Firestore is enabled in the project
   - Check that the service account has proper permissions

3. **CORS Issues**
   - Update the `FRONTEND_URL` in the backend `.env` file
   - Ensure the frontend URL matches your development setup

### Useful Commands

```bash
# Check current project
gcloud config get-value project

# List enabled APIs
gcloud services list --enabled

# Check service account permissions
gcloud projects get-iam-policy invoice-genie-[YOUR-UNIQUE-ID]

# View Firestore data (in browser)
gcloud firestore indexes list
```

## Security Best Practices

1. **Never commit service account keys to version control**
2. **Use environment variables for sensitive data**
3. **Set up proper Firestore security rules for production**
4. **Enable audit logging for production deployments**
5. **Regularly rotate service account keys**

## Cost Optimization

1. **Use Firestore in test mode for development**
2. **Set up billing alerts**
3. **Monitor usage in Google Cloud Console**
4. **Use appropriate machine types for Cloud Functions**

## Next Steps

After completing this setup:

1. Implement authentication (Firebase Auth or custom JWT)
2. Set up email sending with Cloud Functions
3. Configure automated invoice reminders
4. Set up monitoring and logging
5. Implement proper error handling and retry logic
