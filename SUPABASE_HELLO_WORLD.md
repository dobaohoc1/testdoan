# 🚀 SUPABASE + REACT - MINIMAL HELLO WORLD

> **Mục đích:** Dự án tối giản để test kết nối Supabase - chạy được là OK!

---

## ⚡ SETUP SIÊU NHANH (10 PHÚT)

### Bước 1: Tạo Supabase Project (3 phút)

```
1. Vào: https://supabase.com
2. Sign up (with GitHub)
3. New Project:
   - Name: test-hello-world
   - Password: [random password]
   - Region: Southeast Asia
   - Click "Create"
4. Chờ 2 phút...
```

### Bước 2: Lấy API Keys (30 giây)

```
Project Settings → API

Copy:
- Project URL: https://xxxxx.supabase.co
- anon/public key: eyJhbGciOiJ...
```

### Bước 3: Tạo Table Test (1 phút)

```sql
-- Vào SQL Editor, paste và Run:

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO messages (content) VALUES ('Hello from Supabase!');

-- Enable RLS (cho phép read public)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON messages
  FOR SELECT USING (true);
```

### Bước 4: Setup React Project (2 phút)

```bash
# Tạo project
npm create vite@latest supabase-hello -- --template react-ts
cd supabase-hello

# Install Supabase
npm install @supabase/supabase-js

# Chạy
npm install
npm run dev
```

### Bước 5: Config Supabase (1 phút)

**Tạo file `.env`:**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJ...
```

**Tạo file `src/lib/supabase.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Bước 6: Hello World Component (2 phút)

**Sửa `src/App.tsx`:**
```typescript
    import { useEffect, useState } from 'react';
    import { supabase } from './lib/supabase';

    function App() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        fetchMessage();
    }, []);

    async function fetchMessage() {
        try {
        const { data, error } = await supabase
            .from('messages')
            .select('content')
            .single();

        if (error) throw error;

        setMessage(data.content);
        setConnected(true);
        } catch (error) {
        console.error('Error:', error);
        setMessage('❌ Connection failed');
        } finally {
        setLoading(false);
        }
    }

    return (
        <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontFamily: 'system-ui',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '2rem' }}>
            🚀 Supabase + React
        </h1>
        
        {loading ? (
            <p style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</p>
        ) : (
            <div style={{ 
            background: 'white', 
            padding: '2rem 4rem', 
            borderRadius: '1rem',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}>
            <h2 style={{ 
                fontSize: '2rem', 
                color: connected ? '#22c55e' : '#ef4444',
                margin: 0
            }}>
                {connected ? '✅ Connected!' : '❌ Not Connected'}
            </h2>
            <p style={{ 
                fontSize: '1.5rem', 
                margin: '1rem 0 0 0',
                color: '#333'
            }}>
                {message}
            </p>
            </div>
        )}
        
        <div style={{ marginTop: '2rem', color: 'white', opacity: 0.8 }}>
            <p>🎯 Minimal Supabase Connection Test</p>
        </div>
        </div>
    );
    }

    export default App;
```

### Bước 7: Chạy! (10 giây)

```bash
npm run dev
# Mở http://localhost:5173
```

**Kết quả:**
- ✅ Nếu thấy "✅ Connected!" + "Hello from Supabase!" → **SUCCESS!**
- ❌ Nếu thấy "❌ Connection failed" → Check console, verify URL/Key

---

## 🎯 KẾT QUẢ MONG ĐỢI

```
┌─────────────────────────────────┐
│   🚀 Supabase + React          │
├─────────────────────────────────┤
│                                 │
│   ┌───────────────────────┐    │
│   │  ✅ Connected!        │    │
│   │                       │    │
│   │  Hello from Supabase! │    │
│   └───────────────────────┘    │
│                                 │
│  🎯 Minimal Supabase Test      │
└─────────────────────────────────┘
```

---

## 📁 PROJECT STRUCTURE

```
supabase-hello/
├── src/
│   ├── lib/
│   │   └── supabase.ts    # Supabase client
│   ├── App.tsx            # Hello World component
│   └── main.tsx
├── .env                   # API keys
├── package.json
└── vite.config.ts
```

---

## 🐛 TROUBLESHOOTING

### "Connection failed"
```typescript
// Check console for error
console.error('Error:', error);

// Common issues:
// 1. Wrong URL/Key → Check .env
// 2. RLS blocking → Check policy
// 3. Table không tồn tại → Check SQL
```

### Verify Setup
```bash
# Check .env
cat .env

# Check supabase client
console.log(supabase) # trong browser console
```

---

## 📝 FULL CODE FILES

### `.env`
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### `src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### `src/App.tsx`
```typescript
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetchMessage();
  }, []);

  async function fetchMessage() {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('content')
        .single();

      if (error) throw error;

      setMessage(data.content);
      setConnected(true);
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Connection failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      fontFamily: 'system-ui',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '2rem' }}>
        🚀 Supabase + React
      </h1>
      
      {loading ? (
        <p style={{ color: 'white', fontSize: '1.5rem' }}>Loading...</p>
      ) : (
        <div style={{ 
          background: 'white', 
          padding: '2rem 4rem', 
          borderRadius: '1rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            color: connected ? '#22c55e' : '#ef4444',
            margin: 0
          }}>
            {connected ? '✅ Connected!' : '❌ Not Connected'}
          </h2>
          <p style={{ 
            fontSize: '1.5rem', 
            margin: '1rem 0 0 0',
            color: '#333'
          }}>
            {message}
          </p>
        </div>
      )}
      
      <div style={{ marginTop: '2rem', color: 'white', opacity: 0.8 }}>
        <p>🎯 Minimal Supabase Connection Test</p>
      </div>
    </div>
  );
}

export default App;
```

### Database SQL
```sql
-- Create simple table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert test data
INSERT INTO messages (content) VALUES ('Hello from Supabase!');

-- Enable public read
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON messages
  FOR SELECT USING (true);
```

---

## ✅ CHECKLIST

- [ ] Supabase project created
- [ ] API keys copied
- [ ] Table `messages` created with data
- [ ] React project created
- [ ] `.env` file with correct keys
- [ ] `supabase.ts` client setup
- [ ] `App.tsx` updated
- [ ] `npm run dev` working
- [ ] Browser shows "✅ Connected!"

---

## 🎓 WHAT YOU LEARNED

1. ✅ Create Supabase project
2. ✅ Setup database table
3. ✅ Configure RLS policies
4. ✅ Connect React to Supabase
5. ✅ Fetch data from database
6. ✅ Handle loading & error states

**Total:** 10 minute setup for working Supabase + React app!

---

## 🚀 NEXT STEPS

**Sau khi Hello World chạy được:**

1. **Add Authentication:**
   ```typescript
   const { data, error } = await supabase.auth.signUp({
     email: 'user@example.com',
     password: 'password123'
   });
   ```

2. **Add Insert Data:**
   ```typescript
   const { data, error } = await supabase
     .from('messages')
     .insert({ content: 'New message!' });
   ```

3. **Real-time Updates:**
   ```typescript
   supabase
     .channel('messages')
     .on('postgres_changes', 
       { event: '*', schema: 'public', table: 'messages' },
       (payload) => console.log('Change!', payload)
     )
     .subscribe();
   ```

---

## 📚 RESOURCES

- Supabase Docs: https://supabase.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

---

**🎉 That's it! Simplest possible Supabase + React connection.**

**Chạy được này là nắm được foundation rồi!** 🚀
