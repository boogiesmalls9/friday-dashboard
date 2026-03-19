# FRIDAY Dashboard

> *"Good morning, boss. All systems nominal."*

Your personal Iron Man HUD command centre — diet, gym, tasks, and calendar in one slick PWA.

---

## ⚡ Features

- **Dashboard HQ** — Live clock, system status, nutrition rings, next event
- **Diet Tracker** — Daily macro logs with progress rings and 7-day history
- **Gym & Fitness** — Workout logs, personal records, weight trend chart
- **Tasks & Ops** — List + Kanban view with priorities and project tags
- **Intel Calendar** — Upcoming events with category colour coding
- **PWA** — Installs on iPhone and Android like a native app

---

## 🚀 Deploy to Vercel (Step-by-Step)

### What you need
- A free [Vercel account](https://vercel.com) (sign up with GitHub)
- A free [GitHub account](https://github.com) (if you don't have one)
- Node.js installed (download from [nodejs.org](https://nodejs.org) — LTS version)

---

### Step 1: Install dependencies

Open Terminal (Mac) or PowerShell (Windows), navigate to this folder:

```bash
cd path/to/friday-dashboard
npm install
```

This takes about 1–2 minutes.

---

### Step 2: Test locally (optional but recommended)

```bash
npm run dev
```

Open your browser to `http://localhost:5173` — you should see the dashboard. 

Press `Ctrl+C` to stop.

---

### Step 3: Build the app

```bash
npm run build
```

This creates a `dist/` folder with the production-ready app.

---

### Step 4: Deploy with Vercel CLI

**Install Vercel CLI** (one-time):
```bash
npm install -g vercel
```

**Deploy:**
```bash
vercel
```

Follow the prompts:
1. Log in to Vercel (it'll open a browser)
2. "Set up and deploy?" → **Y**
3. "Which scope?" → select your account
4. "Link to existing project?" → **N**
5. "Project name?" → `friday-dashboard` (or whatever you like)
6. "In which directory is your code located?" → `./` (press Enter)
7. It'll detect Vite automatically. Accept defaults.

**Done!** Vercel gives you a URL like `https://friday-dashboard-xyz.vercel.app`

---

### Step 5: Custom domain (optional)

In the Vercel dashboard → your project → Settings → Domains → add your domain.

---

### Step 6: Install as iPhone PWA

1. Open the Vercel URL in **Safari** on your iPhone
2. Tap the **Share** button (box with arrow pointing up)
3. Scroll down → tap **Add to Home Screen**
4. Tap **Add** in the top right
5. The FRIDAY icon now appears on your home screen like a native app! ✅

**For Android:**
1. Open in **Chrome**
2. Tap the three-dot menu → **Add to Home Screen**
3. Tap **Add**

---

## 📊 Updating Your Data

All data lives in `/public/data/` as simple JSON files. Edit them directly, or ask FRIDAY to update them.

| File | What it controls |
|------|-----------------|
| `diet-log.json` | Daily meals, macros, calorie targets |
| `workouts.json` | Workout logs, personal records, weight history |
| `tasks.json` | Tasks, projects, priorities, status |
| `calendar.json` | Events with dates, times, locations |

### Ask FRIDAY to update data

```
"Add a meal: grilled chicken 450 calories, 42g protein, 0g fibre to today's diet log"
"Log today's workout: Push Day — bench press 3x5 at 100kg, overhead press 3x6 at 75kg"
"Add a task: Book flights to Sydney, high priority, due March 25"
"Add a calendar event: Dentist appointment on April 10 at 9am"
```

### Manual JSON editing

Each JSON file has a `_readme` field explaining the format. The structure is intentionally simple so you (or FRIDAY) can update it easily.

**Example — adding a meal to today's diet log:**

```json
{
  "name": "Chicken & Rice",
  "time": "12:30",
  "calories": 650,
  "protein": 52,
  "fibre": 6
}
```

Add this to the `meals` array in today's `logs` entry, and update the `totals`.

---

## 🔧 Updating the App After Deploy

After editing data files or code:

```bash
npm run build
vercel --prod
```

That's it — Vercel updates in ~30 seconds.

---

## 📱 PWA Icon (proper one)

For the best icon quality on iOS:

1. Go to [realfavicongenerator.net](https://realfavicongenerator.net)
2. Upload `public/favicon.svg`
3. Download the icon package
4. Replace `public/icons/icon-192.png` and `public/icons/icon-512.png`
5. Redeploy

---

## ⚙️ Changing Your Targets

Edit `public/data/diet-log.json` — change the `targets` section:

```json
"targets": {
  "calories": 2200,
  "protein": 180,
  "fibre": 35
}
```

---

Built for Adrian. Iron Man would approve. ⚡
