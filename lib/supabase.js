import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

// Check if we should activate Sandbox Mock Mode
const isMockMode = 
  !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') || 
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'placeholder';

// Standard Supabase client (only initialized with true credentials)
const realSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper functions for mock database
const getLocalData = (table) => {
  if (typeof window === 'undefined') return [];
  const val = localStorage.getItem(`desigym_db_${table}`);
  return val ? JSON.parse(val) : [];
};

const setLocalData = (table, data) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`desigym_db_${table}`, JSON.stringify(data));
};

// Chainable mock query builder simulating Supabase client
class MockQueryBuilder {
  constructor(table) {
    this.table = table;
    this.data = getLocalData(table);
    this.filters = [];
    this.sortCol = null;
    this.sortAsc = true;
    this.limitVal = null;
    this.singleResult = false;
    this.maybeSingleResult = false;
    this.operation = 'select'; // select, insert, update, upsert, delete
    this.payload = null;
  }

  select(fields = '*') {
    this.operation = 'select';
    return this;
  }

  eq(column, value) {
    this.filters.push((item) => {
      return item[column] === value;
    });
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.sortCol = column;
    this.sortAsc = ascending;
    return this;
  }

  limit(val) {
    this.limitVal = val;
    return this;
  }

  single() {
    this.singleResult = true;
    return this;
  }

  maybeSingle() {
    this.maybeSingleResult = true;
    return this;
  }

  insert(recordsPayload) {
    this.operation = 'insert';
    this.payload = recordsPayload;
    return this;
  }

  update(updatePayload) {
    this.operation = 'update';
    this.payload = updatePayload;
    return this;
  }

  upsert(recordsPayload) {
    this.operation = 'upsert';
    this.payload = recordsPayload;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  // Promise resolution support for await calls
  async then(onfulfilled, onrejected) {
    try {
      // Re-read data from localStorage to ensure fresh state
      this.data = getLocalData(this.table);
      let result = [...this.data];

      // Apply equality filters
      const matchesFilter = (item) => {
        for (const filter of this.filters) {
          if (!filter(item)) return false;
        }
        return true;
      };

      if (this.operation === 'select') {
        let filtered = result.filter(matchesFilter);

        // Apply ordering
        if (this.sortCol) {
          filtered.sort((a, b) => {
            const valA = a[this.sortCol];
            const valB = b[this.sortCol];
            if (valA === undefined) return 1;
            if (valB === undefined) return -1;
            
            if (typeof valA === 'string') {
              return this.sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return this.sortAsc ? valA - valB : valB - valA;
          });
        }

        // Apply limit
        if (this.limitVal !== null) {
          filtered = filtered.slice(0, this.limitVal);
        }

        // Format return data structures
        let finalData = filtered;
        if (this.singleResult) {
          if (filtered.length === 0) {
            throw new Error('Row not found in table ' + this.table);
          }
          finalData = filtered[0];
        } else if (this.maybeSingleResult) {
          finalData = filtered.length > 0 ? filtered[0] : null;
        }

        return onfulfilled({ data: finalData, error: null });
      }

      if (this.operation === 'insert') {
        const records = Array.isArray(this.payload) ? this.payload : [this.payload];
        const newRecords = records.map(r => ({
          id: r.id || Math.random().toString(36).substring(2, 11),
          created_at: new Date().toISOString(),
          ...r
        }));

        this.data.push(...newRecords);
        setLocalData(this.table, this.data);
        const finalData = Array.isArray(this.payload) ? newRecords : newRecords[0];
        return onfulfilled({ data: finalData, error: null });
      }

      if (this.operation === 'update') {
        const matchedIds = result.filter(matchesFilter).map(m => m.id);
        const updatePayload = this.payload || {};

        this.data = this.data.map(item => {
          if (matchedIds.includes(item.id)) {
            return { ...item, ...updatePayload, updated_at: new Date().toISOString() };
          }
          return item;
        });

        setLocalData(this.table, this.data);
        const updatedRows = result
          .filter(matchesFilter)
          .map(m => ({ ...m, ...updatePayload }));

        return onfulfilled({ data: updatedRows, error: null });
      }

      if (this.operation === 'upsert') {
        const records = Array.isArray(this.payload) ? this.payload : [this.payload];
        for (const rec of records) {
          const idx = this.data.findIndex(item => {
            if (rec.id && item.id === rec.id) return true;
            if (rec.user_id && item.user_id === rec.user_id && rec.log_date && item.log_date === rec.log_date) return true;
            if (rec.user_id && item.user_id === rec.user_id && rec.is_active && item.is_active) return true;
            return false;
          });

          if (idx !== -1) {
            this.data[idx] = { ...this.data[idx], ...rec, updated_at: new Date().toISOString() };
          } else {
            this.data.push({
              id: rec.id || Math.random().toString(36).substring(2, 11),
              created_at: new Date().toISOString(),
              ...rec
            });
          }
        }

        setLocalData(this.table, this.data);
        return onfulfilled({ data: this.payload, error: null });
      }

      if (this.operation === 'delete') {
        const toDelete = result.filter(matchesFilter);
        const deleteIds = toDelete.map(d => d.id);
        this.data = this.data.filter(item => !deleteIds.includes(item.id));
        setLocalData(this.table, this.data);
        return onfulfilled({ data: toDelete, error: null });
      }

    } catch (error) {
      if (onrejected) {
        return onrejected(error);
      }
      return onfulfilled({ data: null, error: { message: error.message } });
    }
  }
}

// Mock auth object
const mockAuth = {
  getSession: async () => {
    if (typeof window === 'undefined') return { data: { session: null }, error: null };
    let sessionStr = localStorage.getItem('desigym_session');
    if (!sessionStr) {
      const guestSession = {
        access_token: 'guest-session-token-xyz',
        user: {
          id: 'anonymous-desi-user-12345',
          email: 'guest@desigym.com',
          user_metadata: { full_name: 'Guest Athlete' }
        }
      };
      localStorage.setItem('desigym_session', JSON.stringify(guestSession));
      sessionStr = JSON.stringify(guestSession);

      // Ensure profile entry exists
      const profiles = getLocalData('profiles');
      if (!profiles.find(p => p.id === guestSession.user.id)) {
        profiles.push({
          id: guestSession.user.id,
          full_name: 'Guest Athlete',
          created_at: new Date().toISOString()
        });
        setLocalData('profiles', profiles);
      }
    }
    const session = JSON.parse(sessionStr);
    return { data: { session }, error: null };
  },

  getUser: async () => {
    const { data: { session } } = await mockAuth.getSession();
    return { data: { user: session ? session.user : null }, error: null };
  },

  signInWithPassword: async ({ email, password }) => {
    if (typeof window === 'undefined') return { data: null, error: { message: 'Window undefined' } };
    
    // Simple validation: check local auth_users list
    const users = getLocalData('auth_users');
    let user = users.find(u => u.email === email && u.password === password);
    
    // Sandbox convenience: if database is empty, auto-create the member
    if (!user && users.length === 0) {
      user = {
        id: 'mock-user-uuid-12345',
        email: email,
        user_metadata: { full_name: email.split('@')[0] }
      };
      users.push({ ...user, password });
      setLocalData('auth_users', users);
    } else if (!user) {
      return { data: null, error: { message: 'Invalid credentials. Use your registered email/password.' } };
    }

    const session = {
      access_token: 'mock-session-token-' + Math.random().toString(36).substring(2),
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata
      }
    };

    localStorage.setItem('desigym_session', JSON.stringify(session));

    // Ensure profile entry exists
    const profiles = getLocalData('profiles');
    if (!profiles.find(p => p.id === user.id)) {
      profiles.push({
        id: user.id,
        full_name: user.user_metadata?.full_name || email.split('@')[0],
        created_at: new Date().toISOString()
      });
      setLocalData('profiles', profiles);
    }

    window.dispatchEvent(new Event('desigym_auth_change'));
    return { data: { session, user: session.user }, error: null };
  },

  signUp: async ({ email, password, options = {} }) => {
    if (typeof window === 'undefined') return { data: null, error: { message: 'Window undefined' } };

    const users = getLocalData('auth_users');
    if (users.find(u => u.email === email)) {
      return { data: null, error: { message: 'Email already registered.' } };
    }

    const newUser = {
      id: 'mock-user-' + Math.random().toString(36).substring(2, 11),
      email: email,
      user_metadata: {
        full_name: options.data?.full_name || email.split('@')[0]
      }
    };

    users.push({ ...newUser, password });
    setLocalData('auth_users', users);

    // Create profile
    const profiles = getLocalData('profiles');
    profiles.push({
      id: newUser.id,
      full_name: newUser.user_metadata.full_name,
      created_at: new Date().toISOString()
    });
    setLocalData('profiles', profiles);

    return { data: { user: newUser }, error: null };
  },

  signOut: async () => {
    if (typeof window === 'undefined') return { error: null };
    localStorage.removeItem('desigym_session');
    window.dispatchEvent(new Event('desigym_auth_change'));
    return { error: null };
  }
};

// Mock Supabase Client implementation
const mockSupabase = {
  auth: mockAuth,
  from: (table) => new MockQueryBuilder(table),
};

// Export active client depending on environment configuration
export const supabase = isMockMode ? mockSupabase : realSupabase;

// Export standard admin fallback
export const supabaseAdmin = isMockMode ? mockSupabase : (
  supabaseServiceKey 
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : realSupabase
);
