# 🌐 Role-Based Satellite Monitoring Dashboard

## Overview  
This project is a **Next.js 14** application that provides **role-based dashboards** for different stakeholders:  
- **Admin** → Global system overview, statistics, and management tools  
- **Consumer** → Dish health, billing & support, usage KPIs  
- **Army** → Tactical network resilience, threat monitoring, and satellite health  

It combines **3D satellite visualization** with **modern dashboard UX**, offering real-time updates, billing workflows, and support tools in a secure role-aware environment.

---

## ✨ Key Features  
- **Role-Aware Dashboards**
  - Admin: KPIs, system status, quick actions  
  - Consumer: Dish monitoring, billing, support ticketing, FAQs  
  - Army: Tactical stats, threat monitoring, satellite health, throughput  

- **3D Globe Visualization**
  - Textured Earth (NASA Blue Marble)  
  - Satellites loaded from local TLE file (`/public/data/satellite-coords.txt`)  
  - Orbits updated every 30 seconds with `satellite.js`  
  - Clickable satellites → display orbit paths and details  

- **Billing & Support**
  - Current bill, payment history  
  - UPI mock payment action  
  - Support ticket form + FAQs  

- **Modern UI**
  - Built with **Tailwind CSS** + **shadcn/ui**  
  - Icons from **lucide-react**  
  - Notifications via **sonner**  
  - Role-specific dark/light theme enforcement  

---

## 🏗️ Tech Stack  
- **Framework**: Next.js 14, React 18, TypeScript  
- **3D & Satellite**: three.js, @react-three/fiber, @react-three/drei, satellite.js  
- **Styling**: TailwindCSS, shadcn/ui  
- **Icons & Feedback**: lucide-react, sonner  
- **Authentication**: Clerk (role metadata: admin, consumer, army)  

---

## 📂 Project Structure  
```
src/
 ├─app/
      api/
      army/
      consumer/
      consumer/
      login/
      signup/
    
 │   ├── dashboard/            # Main dashboards
 │   │   ├── globe/            # 3D satellite globe
 │   │   ├── consumer-view/    # Consumer dashboard
 │   │   ├── army-view/        # Army dashboard
 │   │   ├── billing-support/  # Billing & support portal
 │   │   └── page.tsx          # Role-based redirect logic
 │   └── layout.tsx            # Global layout + theming
 ├── lib/
 │   ├── starlink.ts           # TLE parsing + propagation loop
 │   └── role-home.ts          # Role → home route mapping
  components/
  contexts/
  db/
  hooks/
  lib/
  services/
  visual-edits/
public/
  data
  ├── data/satellite-coords.txt # Local Starlink/LEO TLE data
  textures
  └── textures/earth_daymap.jpg # NASA Blue Marble texture
  file.svg
  window.svg
  next.svg
  vercel.svg
  globe.svg
```
.env
.gitignore
bun.lock
components.json
drizzle.config.ts
eslint.config.mjs
middleware.ts
next-env.d.ts
next.config.ts
package-lock.json
package.json
postcss.config.mjs
README.md
tsconfig.json


---

## ⚙️ Setup & Run  

1. **Clone & install**  
   ```bash
   git clone <repo-url>
   cd nasa-bharatnet-dashboard-main
   npm install
   ```

2. **Assets**  
   - Place TLE data file in: `public/data/satellite-coords.txt`  
   - Place Earth texture in: `public/textures/earth_daymap.jpg`
   - But here , we already attached those files
   

3. **Start development server**  
   ```bash
   npm run dev
   ```
   If you want to run it on local server:
   Visit → [http://localhost:3000](http://localhost:3000)

---

## 🚀 Usage  
- Log in → redirected automatically to correct dashboard based on role  
- Sidebar navigation adapts by role  
- Globe page → Load TLEs → satellites animate + orbit paths on click  
- Consumer dashboard → Dish status + quick actions + billing & support  
- Army dashboard → Tactical stats + satellite health & threat monitoring  

---

## 🔮 Roadmap  
- 🔗 Connect to real telemetry APIs (satellite feeds, ISP billing, ticket backend)  
- 🌍 Ground station & coverage visualization  
- 🛰 Satellite filtering (Starlink, GNSS, weather sats, etc.)  
- ⚠️ Real-time anomaly detection + alerting pipeline  
- 📱 Full mobile-optimized experience  

---

