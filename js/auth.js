(() => {
  const authKey = 'falaFatecAuthenticated';
  const usernameKey = 'falaFatecUsername';
  const isAuthenticated = sessionStorage.getItem(authKey) === 'true';
  const isLoginPage = window.location.pathname.endsWith('/login.html') || window.location.pathname === 'login.html';

  if (isLoginPage) {
    if (isAuthenticated) {
      window.location.replace('boas-vindas.html');
      return;
    }

    const form = document.getElementById('loginForm');
    const error = document.getElementById('loginError');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const username = String(formData.get('username')).trim();
      const password = String(formData.get('password'));

      if (username !== 'aluno' || password !== '123456') {
        error.textContent = 'Usuário ou senha incorretos. Confira o acesso de demonstração abaixo.';
        return;
      }

      sessionStorage.setItem(authKey, 'true');
      sessionStorage.setItem(usernameKey, username);
      window.location.assign('boas-vindas.html');
    });

    return;
  }

  if (document.body.dataset.authRequired === 'true' && !isAuthenticated) {
    window.location.replace('login.html');
    return;
  }

  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      sessionStorage.removeItem(authKey);
      sessionStorage.removeItem(usernameKey);
      window.location.replace('login.html');
    });
  }
})();
