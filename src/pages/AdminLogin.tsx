import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'https://forja-backend-1.onrender.com';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError('E-mail ou senha incorretos.');
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.userRole !== 'ROLE_ADMIN') {
        setError('Acesso nao autorizado.');
        setLoading(false);
        return;
      }

      sessionStorage.setItem('__adm_token', data.accessToken);
      sessionStorage.setItem('__adm_name', data.fullName ?? data.email);
      navigate('/admin');
    } catch {
      setError('Falha na conexao. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0F19' }}>
      <div className="w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <img src="/images/logo.png" alt="Forja do Chico" className="w-14 h-14 rounded-xl object-cover" />
          <div className="text-center">
            <h1 className="text-xl font-extrabold" style={{ color: '#F9FAFB' }}>Forja do Chico</h1>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Painel Administrativo</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ background: '#111827', border: '1px solid #1F2937' }}>
          <h2 className="text-base font-bold text-center" style={{ color: '#F9FAFB' }}>Entrar no Painel</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-[11px] font-semibold mb-1" style={{ color: '#9CA3AF' }}>E-mail</label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@forja.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                style={{ background: '#1F2937', border: '1px solid #374151', color: '#F9FAFB' }}
                onFocus={e => (e.target.style.borderColor = '#F97316')}
                onBlur={e => (e.target.style.borderColor = '#374151')}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold mb-1" style={{ color: '#9CA3AF' }}>Senha</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-lg text-sm outline-none transition-all"
                style={{ background: '#1F2937', border: '1px solid #374151', color: '#F9FAFB' }}
                onFocus={e => (e.target.style.borderColor = '#F97316')}
                onBlur={e => (e.target.style.borderColor = '#374151')}
              />
            </div>

            {error && (
              <div className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-extrabold text-sm transition-all mt-1"
              style={{ background: '#F97316', color: '#fff', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Entrando...' : 'Entrar →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#374151' }}>
          Forja do Chico © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
