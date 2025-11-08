# Deployment Guide - Digitalisierung Niedersachsen Map

## Vercel Deployment

This project is configured for automatic deployment on Vercel.

### Prerequisites

1. GitHub account with access to the repository
2. Vercel account (https://vercel.com)
3. Supabase project credentials

### Environment Variables Required

Before deploying, you need to configure the following environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`: The Supabase project URL
  - Value: `https://eleblvoyechmtgxtgjii.supabase.co`

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The Supabase anonymous key
  - Get this from: https://supabase.com/dashboard/project/eleblvoyechmtgxtgjii/settings/api

### Deployment Steps

1. **Sign in to Vercel**
   - Visit https://vercel.com/login
   - Click "Continue with GitHub"
   - Authorize Vercel to access your GitHub account

2. **Import Project**
   - Click "Add New..." > "Project"
   - Select the `digitalisierung-niedersachsen-map` repository
   - Vercel will auto-detect it as a Next.js project

3. **Configure Environment Variables**
   - In the deployment settings, add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://eleblvoyechmtgxtgjii.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key from Supabase)
   - Click "Deploy"

4. **Verify Deployment**
   - Visit https://digitalisierung-niedersachsen-map.vercel.app
   - Confirm the map loads with all 6 stakeholder markers
   - Test interactive features (zoom, pan, click markers)

### Troubleshooting

**Map not loading:**
- Verify environment variables are set correctly in Vercel project settings
- Check that Supabase project is accessible and contains stakeholders table

**Build failures:**
- Ensure all dependencies in package.json are compatible
- Check Node.js version (should be 18+)

**Markers not displaying:**
- Verify Supabase database has stakeholder records with valid coordinates
- Check browser console for errors
