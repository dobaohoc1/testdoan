# 🚀 HƯỚNG DẪN CÀI ĐẶT DỰ ÁN THUCDONAI - TỪ ZERO ĐẾN HERO

> **Mục đích:** Hướng dẫn chi tiết, từng bước để setup và deploy một dự án AI Nutrition App hoàn chỉnh từ đầu

---

## 📋 MỤC LỤC

1. [Tổng Quan Hệ Thống](#1-tổng-quan-hệ-thống)
2. [Yêu Cầu Hệ Thống](#2-yêu-cầu-hệ-thống)
3. [Setup Supabase Backend](#3-setup-supabase-backend)
4. [Setup Frontend React](#4-setup-frontend-react)
5. [Kết Nối Supabase với React](#5-kết-nối-supabase-với-react)
6. [Setup Database Schema](#6-setup-database-schema)
7. [Setup Authentication](#7-setup-authentication)
8. [Setup AI Integration](#8-setup-ai-integration)
9. [Deploy Production](#9-deploy-production)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. TỔNG QUAN HỆ THỐNG

### Architecture
```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React     │─────▶│   Supabase   │─────▶│  PostgreSQL │
│  Frontend   │◀─────│   (BaaS)     │◀─────│  Database   │
└─────────────┘      └──────────────┘      └─────────────┘
      │                     │
      │                     ├─ Auth (JWT)
      │                     ├─ Storage
      │                     └─ Edge Functions
      │
      ▼
┌─────────────┐
│  OpenAI API │ (AI Features)
└─────────────┘
```

### Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Shadcn/UI + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **AI:** OpenAI API (GPT-4, Vision API)
- **State:** React Query (TanStack Query)
- **Routing:** React Router DOM v6

---

## 2. YÊU CẦU HỆ THỐNG

### 2.1. Phần Mềm Cần Thiết

#### Bắt Buộc:
- [x] **Node.js** v18+ → https://nodejs.org
- [x] **npm** hoặc **yarn** (đi kèm Node.js)
- [x] **Git** → https://git-scm.com
- [x] **Code Editor** (VS Code recommended) → https://code.visualstudio.com

#### Optional (cho production):
- [ ] **Android Studio** (nếu build mobile app)
- [ ] **GitHub Account** (để deploy)
- [ ] **Vercel Account** (miễn phí)

### 2.2. Accounts Cần Tạo

#### Bắt Buộc:
1. **Supabase Account** → https://supabase.com
   - Free tier: Unlimited API requests
   - 500MB database
   - 1GB file storage

2. **OpenAI Account** → https://platform.openai.com
   - $5 credit miễn phí cho new users
   - GPT-4 API access

#### Optional:
3. **GitHub Account** → https://github.com
4. **Vercel Account** → https://vercel.com

---

## 3. SETUP SUPABASE BACKEND

### 3.1. Tạo Supabase Project

**Bước 1:** Đăng ký/Login Supabase
```
1. Vào: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommend)
```

**Bước 2:** Tạo Organization
```
1. Sau khi login → "New Organization"
2. Organization name: ThucdonAI
3. Choose plan: Free (0$/month)
4. Click "Create organization"
```

**Bước 3:** Tạo Project
```
1. Click "New Project"
2. Fill thông tin:
   - Name: thucdonai-nutrition
   - Database Password: [Tạo password mạnh - LƯU LẠI!]
   - Region: Southeast Asia (Singapore) - gần VN nhất
   - Pricing Plan: Free
3. Click "Create new project"
4. Đợi 2-3 phút project khởi tạo
```

### 3.2. Lấy API Credentials

**Sau khi project ready:**

1. **Project Settings** → **API**
2. Copy các thông tin sau:

```env
Project URL: https://[your-project-id].supabase.co
Project API Keys:
  - anon/public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - service_role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (PRIVATE - không commit)
```

**⚠️ LƯU Ý:**
- `anon` key: Dùng cho frontend, công khai được
- `service_role` key: CHỈ dùng server-side, KHÔNG được public

### 3.3. Enable Required Services

**Authentication:**
```
1. Authentication → Providers
2. Enable:
   ✅ Email (default)
   ✅ Google OAuth (optional)
3. Email Templates:
   - Customize confirmation email
   - Customize password reset email
```

**Storage:**
```
1. Storage → Create bucket
2. Buckets cần tạo:
   - avatars (public)
   - food-images (public)
   - recipe-images (public)
3. Policies: Set public read, authenticated write
```

**Database:**
```
1. Database → Extensions
2. Enable:
   ✅ pg_trgm (for full-text search)
   ✅ uuid-ossp (for UUID generation)
   ✅ pgvector (optional - for AI embeddings)
```

---

## 4. SETUP FRONTEND REACT

### 4.1. Clone/Create Project

**Option A: Clone Existing (Recommended)**
```bash
# Clone project
git clone https://github.com/dobaohoc1/thucdonai-app.git
cd thucdonai-app

# Install dependencies
npm install
```

**Option B: Tạo Mới Từ Đầu**
```bash
# Tạo project với Vite
npm create vite@latest thucdonai-app -- --template react-ts

cd thucdonai-app
npm install

# Install dependencies
npm install @supabase/supabase-js
npm install @tanstack/react-query
npm install react-router-dom
npm install @radix-ui/react-* (các components)
npm install tailwindcss postcss autoprefixer
npm install lucide-react
npm install react-hook-form zod
npm install date-fns
npm install jspdf jspdf-autotable
```

### 4.2. Setup Tailwind CSS

```bash
# Init Tailwind
npx tailwindcss init -p
```

**`tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(145 63% 42%)',
          foreground: 'hsl(0 0% 100%)',
        },
        // ... other colors
      }
    },
  },
  plugins: [],
}
```

### 4.3. Project Structure

```
thucdonai-app/
├── public/
│   ├── favicon.svg
│   └── icons/
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn components
│   │   ├── admin/           # Admin components
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   ├── useProfile.tsx
│   │   └── ...
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts    # Supabase client
│   │       └── types.ts     # Generated types
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                     # Environment variables
├── .env.example
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 5. KẾT NỐI SUPABASE VỚI REACT

### 5.1. Tạo Environment Variables

**Tạo file `.env` trong root:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://jytnzvoymseduevwcuyu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI API (optional - for AI features)
VITE_OPENAI_API_KEY=sk-...
```

**⚠️ Quan trọng:**
- File `.env` KHÔNG được commit lên Git
- Thêm vào `.gitignore`:
  ```
  .env
  .env.local
  .env.production
  ```

### 5.2. Setup Supabase Client

**`src/integrations/supabase/client.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
```

### 5.3. Test Connection

**`src/pages/Landing.tsx` (thử nghiệm):**
```typescript
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Landing() {
  useEffect(() => {
    // Test connection
    const testConnection = async () => {
      const { data, error } = await supabase
        .from('HoSo')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('Supabase connection error:', error);
      } else {
        console.log('✅ Supabase connected!', data);
      }
    };
    
    testConnection();
  }, []);
  
  return <div>Landing Page</div>;
}
```

**Chạy test:**
```bash
npm run dev
# Mở http://localhost:8080
# Check console → Nếu thấy "✅ Supabase connected!" → Success!
```

---

## 6. SETUP DATABASE SCHEMA

### 6.1. Tạo Tables Via SQL Editor

**Vào Supabase Dashboard:**
```
SQL Editor → New Query
```

**Paste schema từ `DATABASE_SCHEMA.md`:**

#### 6.1.1. Module Users

```sql
-- Bảng HoSo (Profiles)
CREATE TABLE IF NOT EXISTS HoSo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nguoidungid UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hoten TEXT,
  email TEXT UNIQUE NOT NULL,
  sodienthoai TEXT,
  ngaysinh DATE,
  gioitinh TEXT CHECK (gioitinh IN ('Nam', 'Nữ', 'Khác')),
  anhdaidien TEXT,
  diachi TEXT,
  taoluc TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  capnhatluc TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng HoSoSucKhoe (Health Profiles)
CREATE TABLE IF NOT EXISTS HoSoSucKhoe (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nguoidungid UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chieucao NUMERIC,
  cannang NUMERIC,
  muctieucangnang NUMERIC,
  capdonangluong TEXT CHECK (capdonangluong IN ('Không hoạt động', 'Ít hoạt động', 'Hoạt động vừa phải', 'Hoạt động mạnh', 'Cực kỳ hoạt động')),
  muctieusuckhoe TEXT CHECK (muctieusuckhoe IN ('Giảm cân', 'Duy trì', 'Tăng cân', 'Tăng cơ')),
  thongtinyte TEXT,
  diung TEXT[],
  thoiquenansang TEXT[],
  taoluc TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  capnhatluc TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng VaiTroNguoiDung (User Roles)
CREATE TABLE IF NOT EXISTS VaiTroNguoiDung (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nguoidungid UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vaitro TEXT NOT NULL DEFAULT 'User' CHECK (vaitro IN ('Admin', 'User', 'Guest')),
  taoluc TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

**Chạy query → Kiểm tra:**
```
Database → Tables → Refresh
→ Thấy 3 tables: HoSo, HoSoSucKhoe, VaiTroNguoiDung
```

#### 6.1.2. Module Recipes

```sql
-- Bảng NguyenLieu (Ingredients)
CREATE TABLE IF NOT EXISTS NguyenLieu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ten TEXT NOT NULL,
  calo NUMERIC NOT NULL DEFAULT 0,
  dam NUMERIC DEFAULT 0,
  carb NUMERIC DEFAULT 0,
  chat NUMERIC DEFAULT 0,
  donvitinh TEXT DEFAULT 'gram',
  mota TEXT,
  taoluc TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for search
CREATE INDEX IF NOT EXISTS idx_nguyenlieu_ten ON NguyenLieu USING gin(to_tsvector('vietnamese', ten));

-- Bảng DanhMucMonAn (Meal Categories)
CREATE TABLE IF NOT EXISTS DanhMucMonAn (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ten TEXT NOT NULL UNIQUE,
  mota TEXT,
  taoluc TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default categories
INSERT INTO DanhMucMonAn (ten, mota) VALUES
  ('Bữa sáng', 'Các món ăn sáng'),
  ('Bữa trưa', 'Các món ăn trưa'),
  ('Bữa tối', 'Các món ăn tối'),
  ('Ăn vặt', 'Các món ăn vặt, snack')
ON CONFLICT (ten) DO NOTHING;

-- Bảng CongThuc (Recipes)
CREATE TABLE IF NOT EXISTS CongThuc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nguoidungtaoid UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ten TEXT NOT NULL,
  mota TEXT,
  huongdan TEXT,
  thoigianchuanbi INTEGER, -- minutes
  thoigian INTEGER, -- cooking time in minutes
  khauphan INTEGER DEFAULT 1,
  tongcalo NUMERIC DEFAULT 0,
  tongdam NUMERIC DEFAULT 0,
  tongcarb NUMERIC DEFAULT 0,
  tongchat NUMERIC DEFAULT 0,
  hinhanh TEXT,
  danhmucid UUID REFERENCES DanhMucMonAn(id) ON DELETE SET NULL,
  congkhai BOOLEAN DEFAULT false,
  taoluc TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  capnhatluc TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Bảng NguyenLieuCongThuc (Recipe Ingredients - Junction table)
CREATE TABLE IF NOT EXISTS NguyenLieuCongThuc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  congthucid UUID NOT NULL REFERENCES CongThuc(id) ON DELETE CASCADE,
  nguyenlieuId UUID NOT NULL REFERENCES NguyenLieu(id) ON DELETE CASCADE,
  soluong NUMERIC NOT NULL,
  donvi TEXT DEFAULT 'gram',
  taoluc TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(congthucid, nguyenlieuId)
);
```

#### 6.1.3. Các Tables Khác

**Copy toàn bộ từ `DATABASE_SCHEMA.md`:**
- Module Meal Plans
- Module Tracking
- Module Shopping
- Module Subscriptions

### 6.2. Enable Row Level Security (RLS)

**Quan trọng để bảo mật!**

```sql
-- Enable RLS cho tất cả tables
ALTER TABLE HoSo ENABLE ROW LEVEL SECURITY;
ALTER TABLE HoSoSucKhoe ENABLE ROW LEVEL SECURITY;
ALTER TABLE CongThuc ENABLE ROW LEVEL SECURITY;
ALTER TABLE KeHoachBuaAn ENABLE ROW LEVEL SECURITY;
ALTER TABLE NhatKyDinhDuong ENABLE ROW LEVEL SECURITY;
-- ... tất cả tables khác
```

**Tạo Policies:**

```sql
-- HoSo: Users chỉ access profile của mình
CREATE POLICY "Users can view own profile" ON HoSo
  FOR SELECT USING (auth.uid() = nguoidungid);

CREATE POLICY "Users can update own profile" ON HoSo
  FOR UPDATE USING (auth.uid() = nguoidungid);

-- CongThuc: Public recipes visible to all, private only to owner
CREATE POLICY "Public recipes visible to all" ON CongThuc
  FOR SELECT USING (congkhai = true OR auth.uid() = nguoidungtaoid);

CREATE POLICY "Users can create own recipes" ON CongThuc
  FOR INSERT WITH CHECK (auth.uid() = nguoidungtaoid);

-- ... tất cả policies khác
```

### 6.3. Create Triggers

**Auto update `capnhatluc`:**
```sql
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.capnhatluc = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_hoso_modtime
  BEFORE UPDATE ON HoSo
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- Repeat for other tables
```

**Auto create profile on signup:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.HoSo (nguoidungid, email, hoten)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  INSERT INTO public.VaiTroNguoiDung (nguoidungid, vaitro)
  VALUES (NEW.id, 'User');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

## 7. SETUP AUTHENTICATION

### 7.1. Configure Auth Settings

**Supabase Dashboard:**
```
Authentication → Settings
```

**Email Templates:**
- Confirm signup: Customize với logo, brand
- Reset password: Customize email template
- Magic link: Optional

**Redirect URLs:**
```
Site URL: http://localhost:8080 (development)
Redirect URLs:
  - http://localhost:8080/**
  - https://thucdonai-app.vercel.app/** (production)
```

### 7.2. Implement Auth in React

**`src/hooks/useAuth.tsx`:**
```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**`src/pages/Auth.tsx`:**
```typescript
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: email.split('@')[0]
        }
      }
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for confirmation!');
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <h2 className="text-3xl font-bold text-center">ThucdonAI</h2>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full border py-2 rounded"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
```

### 7.3. Protected Routes

**`src/App.tsx`:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 8. SETUP AI INTEGRATION

### 8.1. OpenAI API Setup

**Lấy API Key:**
```
1. https://platform.openai.com/api-keys
2. Create new secret key
3. Copy key (chỉ hiện 1 lần!)
4. Add vào .env:
   VITE_OPENAI_API_KEY=sk-...
```

### 8.2. Create Supabase Edge Functions

**Supabase Dashboard:**
```
Edge Functions → New Function
```

**Function: `nutrition-advisor`**

```typescript
// supabase/functions/nutrition-advisor/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { message } = await req.json()
  
  const configuration = new Configuration({
    apiKey: Deno.env.get('OPENAI_API_KEY'),
  })
  const openai = new OpenAIApi(configuration)

  const completion = await openai.createChatCompletion({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "Bạn là chuyên gia dinh dưỡng AI. Tư vấn về thực đơn, calories, và sức khỏe."
      },
      {
        role: "user",
        content: message
      }
    ],
  })

  return new Response(
    JSON.stringify({
      response: completion.data.choices[0].message?.content
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
})
```

**Deploy Edge Function:**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref jytnzvoymseduevwcuyu

# Deploy function
supabase functions deploy nutrition-advisor

# Set secrets
supabase secrets set OPENAI_API_KEY=sk-...
```

### 8.3. Call Edge Function from React

**`src/hooks/useNutritionAI.tsx`:**
```typescript
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNutritionAI = () => {
  const [loading, setLoading] = useState(false);
  
  const askAI = async (message: string) => {
    setLoading(true);
    
    const { data, error } = await supabase.functions.invoke('nutrition-advisor', {
      body: { message }
    });
    
    setLoading(false);
    
    if (error) throw error;
    return data.response;
  };
  
  return { askAI, loading };
};
```

---

## 9. DEPLOY PRODUCTION

### 9.1. Build for Production

```bash
# Build
npm run build

# Test production build locally
npm run preview
```

### 9.2. Deploy to Vercel

**Option A: Vercel CLI**
```bash
# Install
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Production
vercel --prod
```

**Option B: GitHub + Vercel**
```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for production"
git push

# 2. Connect Vercel
# - https://vercel.com/new
# - Import GitHub repo
# - Add environment variables
# - Deploy
```

**Environment Variables trên Vercel:**
```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJh...
VITE_OPENAI_API_KEY=sk-...
```

### 9.3. Configure Supabase for Production

**Update Redirect URLs:**
```
Authentication → URL Configuration
Add:
  - https://thucdonai-app.vercel.app/**
```

**Update CORS:**
```
Settings → API → CORS
Add allowed origin:
  - https://thucdonai-app.vercel.app
```

---

## 10. TROUBLESHOOTING

### 10.1. Common Issues

#### "Missing Supabase environment variables"
```bash
# Check .env file exists
ls -la .env

# Check variables are set
echo $VITE_SUPABASE_URL
```

**Fix:** Create `.env` file với correct values

#### "Failed to connect to Supabase"
```typescript
// Check URL format
const url = import.meta.env.VITE_SUPABASE_URL;
console.log('URL:', url); // Should be https://...supabase.co
```

**Fix:** Verify URL không có trailing slash

#### "RLS policy violation"
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'HoSo';
```

**Fix:** Create proper RLS policies

#### "CORS error"
**Fix:** Add domain to Supabase CORS settings

### 10.2. Debugging Tips

**Enable Supabase Debug Logs:**
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(url, key, {
  auth: {
    debug: true // Enable debug logs
  }
});
```

**Check Network Tab:**
- Open DevTools → Network
- Filter: `supabase`
- Check request/response

**Database Logs:**
```
Supabase → Database → Logs
→ View real-time queries
```

---

## 📚 TÀI LIỆU THAM KHẢO

- **Supabase Docs:** https://supabase.com/docs
- **React Query:** https://tanstack.com/query/latest
- **Shadcn/UI:** https://ui.shadcn.com
- **OpenAI API:** https://platform.openai.com/docs

---

## ✅ CHECKLIST HOÀN THÀNH

### Backend Setup:
- [ ] Tạo Supabase project
- [ ] Copy API credentials
- [ ] Create database tables
- [ ] Enable RLS
- [ ] Create policies
- [ ] Setup triggers
- [ ] Enable Auth providers
- [ ] Create storage buckets

### Frontend Setup:
- [ ] Clone/create React project
- [ ] Install dependencies
- [ ] Configure Tailwind
- [ ] Create `.env` file
- [ ] Setup Supabase client
- [ ] TestConnection
- [ ] Implement authentication
- [ ] Create protected routes

### AI Integration:
- [ ] Get OpenAI API key
- [ ] Create Edge Functions
- [ ] Deploy functions
- [ ] Set secrets
- [ ] Test AI features

### Deployment:
- [ ] Build production
- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Update Supabase URLs
- [ ] Test production

---

## 🎓 KẾT LUẬN

Sau khi hoàn thành tất cả các bước trên, bạn sẽ có:

✅ **Backend hoàn chỉnh:** Supabase với PostgreSQL, Auth, Storage
✅ **Frontend modern:** React + TypeScript + Vite
✅ **Database schema:** 16 tables với RLS policies
✅ **Authentication:** Email/password + social login
✅ **AI Integration:** OpenAI GPT-4 cho tư vấn dinh dưỡng
✅ **Production deployment:** Vercel với HTTPS

**Total time:** 4-6 giờ (cho người có kinh nghiệm)

**Phù hợp cho:**
- Đồ án tốt nghiệp
- Portfolio project
- MVP startup
- Learning full-stack development

---

**📧 Hỗ trợ:** Nếu gặp khó khăn, tham khảo các files khác:
- `DATABASE_SCHEMA.md` - Chi tiết database
- `LOGIC_HOAT_DONG.md` - App logic
- `DEPLOY_GUIDE.md` - Deploy options
- `ANDROID_SETUP_GUIDE.md` - Mobile app

**Good luck! 🚀**
