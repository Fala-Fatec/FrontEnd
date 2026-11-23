const SUPABASE_URL = 'https://jiclknbetiqjvwuztjse.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6WD-Jk_yoE1eEhG74CJEbw_Ic5osmyv';
const API_URL = 'http://127.0.0.1:5000/api';

(async () => {

  const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function api(path, options = {}) {
    const { data } = await sb.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      window.location.replace('login.html');
      throw new Error('Sem sessão');
    }
    const res = await fetch(API_URL + path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers, Authorization: `Bearer ${token}` },
    });
        if (res.status === 401) {
      const b = await res.json().catch(() => ({}));
      const err = new Error('O servidor recusou o token: ' + (b.erro || 'não autorizado'));
      err.status = 401;
      throw err;
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(body.description || body.erro || body.message || 'Erro na requisição');
      err.status = res.status;
      throw err;
    }
    return body;
  }

  async function garantirPerfil(user) {
    try {
      await api('/me');
    } catch (e) {
      if (e.status !== 404) throw e;
      const nome = user.user_metadata?.nome || user.email.split('@')[0];
      await api('/me', { method: 'PUT', body: JSON.stringify({ nome }) });
    }
  }

  window.FalaFatec = { sb, api };

  const { data: { session } } = await sb.auth.getSession();
  const isLoginPage = window.location.pathname.endsWith('/login.html') || window.location.pathname === 'login.html';

  if (isLoginPage) {
    if (session) { window.location.replace('boas-vindas.html'); return; }

    const form = document.getElementById('loginForm');
    const error = document.getElementById('loginError');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      error.textContent = '';
      const formData = new FormData(form);
      const email = String(formData.get('email')).trim();
      const password = String(formData.get('password'));

            let data, authError;
      try {
        ({ data, error: authError } = await sb.auth.signInWithPassword({ email, password }));
      } catch (e) {
        authError = e;
      }
      if (authError) {
        console.error(authError);
        error.textContent = /fetch|network/i.test(authError.message)
          ? 'Não foi possível conectar ao servidor. Verifique sua conexão.'
          : 'E-mail ou senha incorretos.';
        return;
      }

      try {
        await garantirPerfil(data.user);
      } catch (e) {
        error.textContent = 'Login ok, mas não foi possível criar seu perfil: ' + e.message;
        return;
      }
      window.location.assign('boas-vindas.html');
    });
    return;
  }

  if (document.body.dataset.authRequired === 'true' && !session) {
    window.location.replace('login.html');
    return;
  }

  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await sb.auth.signOut();
      window.location.replace('login.html');
    });
  }
})();