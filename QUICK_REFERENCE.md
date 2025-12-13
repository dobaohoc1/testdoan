# ⚡ QUICK REFERENCE - THUCDONAI SETUP

> **Cheat sheet nhanh cho setup và troubleshooting**

---

## 🚀 SETUP NHANH (30 PHÚT)

### 1. Supabase (5 phút)
```bash
# 1. Tạo project: https://supabase.com/dashboard
# 2. Copy credentials:
Project URL: https://[project-id].supabase.co
Anon Key: eyJhbG...
```

### 2. Clone & Install (3 phút)
```bash
git clone https://github.com/dobaohoc1/thucdonai-app.git
cd thucdonai-app
npm install
```

### 3. Environment Variables (2 phút)
```bash
# Create .env file
cat > .env << EOF
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=your-openai-key
EOF
```

### 4. Database Setup (15 phút)
```sql
-- Vào Supabase SQL Editor
-- Copy paste từ DATABASE_SCHEMA.md
-- Run all migrations
```

### 5. Run Development (1 phút)
```bash
npm run dev
# → http://localhost:8080
```

---

## 📋 COMMANDS CHEATSHEET

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Check linting
```

### Git
```bash
git status               # Check changes
git add .                # Stage all
git commit -m "message"  # Commit
git push                 # Push to remote
```

### Supabase CLI
```bash
supabase login           # Login
supabase link            # Link project
supabase db push         # Push migrations
supabase functions deploy # Deploy edge function
supabase secrets set KEY=value # Set secret
```

### Vercel
```bash
vercel                   # Deploy preview
vercel --prod            # Deploy production
vercel env add          # Add environment variable
```

---

## 🔧 ENVIRONMENT VARIABLES

### Required (.env)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

### Optional (.env)
```env
VITE_OPENAI_API_KEY=sk-...
VITE_GOOGLE_CLIENT_ID=...
```

---

## 🗄️ DATABASE QUICK ACCESS

### Tables Overview
```
Users Module:
  - HoSo (Profiles)
  - HoSoSucKhoe (Health Profiles)
  - VaiTroNguoiDung (User Roles)

Recipes Module:
  - NguyenLieu (Ingredients)
  - CongThuc (Recipes)
  - NguyenLieuCongThuc (Recipe-Ingredient Junction)
  - DanhMucMonAn (Meal Categories)

Meal Plans Module:
  - KeHoachBuaAn (Meal Plans)
  - MonAnKeHoach (Meal Plan Items)

Tracking Module:
  - NhatKyDinhDuong (Nutrition Logs)
  - NhatKyCanNang (Weight Logs)
  - NhatKyNuoc (Water Logs)

Shopping Module:
  - DanhSachMuaSam (Shopping Lists)
  - MonMuaSam (Shopping Items)

Subscriptions Module:
  - GoiDichVu (Service Packages)
  - DangKyGoiDichVu (Subscriptions)
```

### Common Queries
```sql
-- Count users
SELECT COUNT(*) FROM HoSo;

-- Recent recipes
SELECT * FROM CongThuc ORDER BY taoluc DESC LIMIT 10;

-- User's meal plans
SELECT * FROM KeHoachBuaAn WHERE nguoidungid = 'user-uuid';

-- Total calories logged today
SELECT SUM(calo) FROM NhatKyDinhDuong 
WHERE nguoidungid = 'user-uuid' 
AND ngayghinhan = CURRENT_DATE;
```

---

## 🔐 SUPABASE POLICIES TEMPLATES

### Read Own Data
```sql
CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid() = nguoidungid);
```

### Write Own Data
```sql
CREATE POLICY "Users can update own data" ON table_name
  FOR UPDATE USING (auth.uid() = nguoidungid);
```

### Public Read
```sql
CREATE POLICY "Public read access" ON table_name
  FOR SELECT USING (true);
```

### Admin Only
```sql
CREATE POLICY "Admin only" ON table_name
  USING (
    EXISTS (
      SELECT 1 FROM VaiTroNguoiDung
      WHERE nguoidungid = auth.uid()
      AND vaitro = 'Admin'
    )
  );
```

---

## 🐛 TROUBLESHOOTING

### "Can't connect to Supabase"
```bash
# Check .env
cat .env

# Verify URL format (no trailing slash)
echo $VITE_SUPABASE_URL

# Test in browser
curl https://your-project.supabase.co/rest/v1/
```

### "RLS policy error"
```sql
-- Check if RLS enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- List policies
SELECT * FROM pg_policies WHERE tablename = 'HoSo';
```

### "Build failed"
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### "Auth not working"
```typescript
// Debug auth state
const { data, error } = await supabase.auth.getSession();
console.log('Session:', data);
console.log('Error:', error);
```

---

## 📱 MOBILE BUILD (Capacitor)

### Quick Setup
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npx cap add android
npm run build
npx cap sync android
npx cap open android
```

### Update Native
```bash
npm run build
npx cap copy android
npx cap sync android
```

---

## 🚀 DEPLOY CHECKLIST

### Pre-Deploy
- [ ] All tests pass
- [ ] `.env` variables documented
- [ ] Build succeeds locally
- [ ] Database migrations applied
- [ ] RLS policies correct

### Vercel Deploy
- [ ] Connect GitHub repo
- [ ] Add environment variables
- [ ] Configure build settings:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`
- [ ] Deploy!

### Post-Deploy
- [ ] Test all features on production
- [ ] Check Supabase logs
- [ ] Monitor error tracking
- [ ] Update DNS (if custom domain)

---

## 🔗 QUICK LINKS

### Development
- Local: http://localhost:8080
- Supabase: https://supabase.com/dashboard
- Vercel: https://vercel.com/dashboard

### Documentation
- Supabase Docs: https://supabase.com/docs
- React Query: https://tanstack.com/query/latest
- Shadcn/UI: https://ui.shadcn.com
- Tailwind: https://tailwindcss.com/docs

### APIs
- OpenAI: https://platform.openai.com
- Supabase API: https://your-project.supabase.co/rest/v1/

---

## 📊 PROJECT STRUCTURE

```
thucdonai-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/         # Shadcn components
│   │   └── admin/      # Admin components
│   ├── hooks/          # Custom hooks
│   │   ├── useAuth.tsx
│   │   ├── useProfile.tsx
│   │   └── ...
│   ├── integrations/
│   │   └── supabase/   # Supabase client
│   ├── pages/          # Page components
│   ├── lib/            # Utilities
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── supabase/
│   ├── functions/      # Edge functions
│   └── migrations/     # SQL migrations
├── .env                # Environment variables
├── package.json
├── vite.config.ts
└── README.md
```

---

## 💡 BEST PRACTICES

### Security
- ✅ Never commit `.env` files
- ✅ Use RLS on all tables
- ✅ Validate user input
- ✅ Use `anon` key for frontend only
- ❌ Never expose `service_role` key

### Performance
- ✅ Use React Query for caching
- ✅ Lazy load routes
- ✅ Optimize images (WebP)
- ✅ Minimize bundle size
- ✅ Use CDN for assets

### Code Quality
- ✅ TypeScript for type safety
- ✅ ESLint for code style
- ✅ Component composition
- ✅ Custom hooks for logic
- ✅ Consistent naming

---

## 🎯 COMMON TASKS

### Add New Table
```sql
-- 1. Create table
CREATE TABLE NewTable (...);

-- 2. Enable RLS
ALTER TABLE NewTable ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
CREATE POLICY "policy_name" ON NewTable ...;

-- 4. Update TypeScript types
-- Supabase auto-generates types
```

### Add New Page
```typescript
// 1. Create page component
// src/pages/NewPage.tsx

// 2. Add route
// src/App.tsx
<Route path="/new-page" element={<NewPage />} />

// 3. Add navigation link
<Link to="/new-page">New Page</Link>
```

### Add Environment Variable
```bash
# 1. Add to .env
VITE_NEW_VAR=value

# 2. Use in code
const newVar = import.meta.env.VITE_NEW_VAR;

# 3. Add to Vercel
vercel env add VITE_NEW_VAR
```

---

## 📞 SUPPORT

### Errors?
1. Check console logs
2. Check Network tab
3. Check Supabase logs
4. Check GitHub issues

### Questions?
- Supabase Discord: https://discord.supabase.com
- React Discord: https://discord.gg/react
- Stack Overflow: Tag `supabase` + `react`

---

**Last updated:** December 2025
**Version:** 1.0.0
