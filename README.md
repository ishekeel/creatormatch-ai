# CreatorMatch AI 🚀

> **The LinkedIn for Brands and Content Creators — Powered by Realistic AI Matching, Verified Portfolios, and Performance Collaboration.**

CreatorMatch AI is a full-stack platform that connects brands and content creators based on true industry sector relevance, creative deliverable skills, audience demographics, and verified portfolio proof of work—not vanity follower counts.

---

## 🌟 Core Architecture & Key Features

### 1. Dual-Role Authentication & Isolated Sessions
- **Authentication Gateway (`/` and `/login`):** Separate login interfaces for **Brand Creator** and **Content Creator** with credential-based authentication.
- **Account Privacy:** Logged-in brands and creators are strictly isolated to their own accounts and data.
- **Dedicated Sign Out:** Prominent session termination button inside Settings returning to the main login gateway.

### 2. LinkedIn-Style Creator & Brand Workspaces
- **Creator Dashboard Navigation:**
  1. **Home** (`/creator/dashboard`): Metric cards, pitch status, and top AI-matched brand sponsors.
  2. **Find Brands** (`/creator/find-brands`): Reverse AI matching showing top brand sponsors ranked by synergy.
  3. **Discover Campaigns** (`/creator/campaigns`): Marketplace of brand campaigns and creative challenges.
  4. **My Campaigns** (`/creator/my-campaigns`): Applied campaigns, active deliverable milestones, and submitted pictures/reels.
  5. **Connections** (`/creator/connections`): Mutual connection network with pending approvals.
  6. **Portfolio Entries** (`/creator/portfolio`): Verified reel showcase with live HTML5 video playback.
  7. **Notifications** (`/creator/notifications`): Real-time collaboration alerts and status updates.
  8. **Create Creator Profile** (`/creator/profile`): Complete profile builder with email, photo, 8-sector selector, past brand sponsors, and video pitch link.
  9. **Settings** (`/creator/settings`): Account controls, bank credentials, session cache, and **Sign Out**.

### 3. Realistic, Grounded AI Matching Algorithm
- **Deterministic Sector Priority Rule:**
  - Brands and creators within the same sector (e.g., Food Brand & Food Creator, Fashion Brand & Fashion Creator) are guaranteed **95%–96% Strong AI Match (#1 First Priority)**.
  - Divergent cross-sector pairings (e.g., Food Creator with Gaming/Tech Brand) are realistically capped at **20%–21% [Low Compatibility]**.
- **Multi-Factor Synergy Formula:**
  - Sector Fit (25%), Product Category Fit (20%), Audience Alignment (15%), Platform Presence (10%), Content Type (10%), Engagement Rate (8%), Location & Language (5%), Preferences (4%), and Past Relevant Collaborations (3%).
- **Explainable AI Justifications:**
  - Itemized positive synergy drivers and divergence factors generated for every pairing.
- **Inbox AI Synergy Integration:**
  - Real-time AI match pill on every chat thread and expandable AI Matchmaker Insight banner inside active chats.

### 4. Interactive Video Pitches & Proof-of-Work
- **Application Proposals:** Content creators submit video pitch previews and proposals directly when applying for campaigns.
- **HTML5 Video Playback:** Brands can watch creators' verified portfolio reels and submitted pitch videos directly in browser.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS, PostCSS, Lucide React
- **Data Persistence:** Relational local storage simulation + Supabase-ready PostgreSQL schema
- **AI Recommendation Engine:** Grounded term-frequency sector classifier & 9-factor affinity engine (`lib/ai/matchingEngine.ts`)

---

## 🚀 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Start production server
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 How to Deploy to GitHub & Make Public (Step-by-Step)

### Step 1: Install Git (if not already installed)
1. Download and install Git from [https://git-scm.com/download/win](https://git-scm.com/download/win) (choose the 64-bit installer with default settings).
2. Or install via Windows Terminal / PowerShell:
   ```powershell
   winget install --id Git.Git -e --source winget
   ```
3. Restart your terminal or command prompt so `git` is available in your PATH.

### Step 2: Initialize Git and Commit Your Project
Open PowerShell in the project directory (`creatormatch-ai`) and run:
```powershell
# Initialize git repository
git init

# Add all project files
git add .

# Create initial commit
git commit -m "Initial commit: CreatorMatch AI full-stack platform"
```

### Step 3: Create a Public Repository on GitHub
1. Log in to [GitHub](https://github.com).
2. Click the **`+`** icon in the top right and select **"New repository"**.
3. Name your repository: `creatormatch-ai`.
4. Set the visibility to **Public** 🌐.
5. **Leave "Initialize this repository with a README" unchecked** (you already have one).
6. Click **"Create repository"**.

### Step 4: Link and Push to GitHub
Copy your repository URL from GitHub and run:
```powershell
# Rename main branch
git branch -M main

# Add your GitHub repository as remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/creatormatch-ai.git

# Push code to GitHub
git push -u origin main
```

Your codebase is now public on GitHub!

---

## ⚡ 1-Click Permanent Public Deployment on Vercel

To give your friends and content creators a permanent, fast, 24/7 public link (e.g., `https://creatormatch-ai.vercel.app`):

1. Go to [https://vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** $\rightarrow$ **"Project"**.
3. Select the **`creatormatch-ai`** repository from your GitHub list and click **"Import"**.
4. Keep the default settings (Framework preset: Next.js).
5. Click **"Deploy"**.
6. Within 60 seconds, Vercel will provide you with a permanent public URL (e.g., `https://creatormatch-ai.vercel.app`) that you can share with anyone around the world!
