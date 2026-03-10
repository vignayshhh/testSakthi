# GitHub Secrets Setup for SakthiCare APK Build

## Required Secrets

You need to add these secrets to your GitHub repository:

### 1. EXPO_TOKEN
**How to get:**
```bash
# Install EAS CLI locally
npm install -g eas-cli

# Login to Expo
eas login

# Get your token
eas whoami
```
Or create a token at: https://expo.dev/accounts/[your-username]/settings/access-tokens

**GitHub Secret:** `EXPO_TOKEN`
**Value:** Your Expo personal access token

### 2. Android Keystore Secrets (Optional for preview builds)
For local preview builds, these may not be required, but include them if you have them:

- `EXPO_ANDROID_KEYSTORE_BASE64`
- `EXPO_ANDROID_KEYSTORE_ALIAS` 
- `EXPO_ANDROID_KEYSTORE_PASSWORD`
- `EXPO_ANDROID_KEY_PASSWORD`

## How to Add Secrets to GitHub

1. Go to your repository: https://github.com/vignayshhh/testSakthi
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions** in the left sidebar
4. Click **New repository secret**
5. Add each secret listed above

## Quick Setup Steps

1. **Get EXPO_TOKEN:**
   ```bash
   eas login
   eas token:create
   ```

2. **Add to GitHub:**
   - Repository → Settings → Secrets → Actions
   - Add `EXPO_TOKEN` with the token value

3. **Run Workflow:**
   - Go to Actions tab
   - Click "Build SakthiCare APK"
   - Click "Run workflow"

## Troubleshooting

If you still get authentication errors:
- Verify the EXPO_TOKEN is correct
- Ensure the token has proper permissions
- Check that the secret name matches exactly: `EXPO_TOKEN`
