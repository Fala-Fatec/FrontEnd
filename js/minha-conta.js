(async () => {
  const REACOES = [
    { tipo: 'apoiado',  classe: 'btn-apoiado',  rotulo: 'Apoiado!' },
    { tipo: 'discordo', classe: 'btn-discordo', rotulo: 'Discordo' },
    { tipo: 'gag',      classe: 'btn-gag',      rotulo: 'Fiquei GAG' },
  ];

  const feed = document.getElementById('minhas-falas');
  const btnMais = document.getElementById('carregarMais');
  let pagina = 1;

  // O auth.js é async: espera o window.FalaFatec existir
  while (!window.FalaFatec) await new Promise((r) => setTimeout(r, 20));
  const { api } = window.FalaFatec;

  function pintarBotoes(container, reacoes = {}, minha = null) {
    container.querySelectorAll('button').forEach((btn) => {
      const { tipo, rotulo } = btn.dataset;
      const n = reacoes[tipo] ?? 0;
      btn.textContent = n ? `${rotulo} (${n})` : rotulo;
      btn.setAttribute('aria-pressed', String(minha === tipo));
      btn.classList.toggle('ativo', minha === tipo);
    });
  }

  function criarCard(fala) {
    const art = document.createElement('article');
    art.className = 'category-post';

    const img = document.createElement('img');
    img.className = 'category-post-avatar';
    img.src = 'img/avatar.png';
    img.alt = 'Meu avatar';

    const conteudo = document.createElement('div');
    conteudo.className = 'category-post-content';

    const p = document.createElement('p');
    p.textContent = fala.titulo ? `${fala.titulo} — ${fala.conteudo}` : (fala.conteudo || '');

    const reacoes = document.createElement('div');
    reacoes.className = 'card-reactions';

    REACOES.forEach(({ tipo, classe, rotulo }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn-reaction ${classe}`;
      btn.dataset.tipo = tipo;
      btn.dataset.rotulo = rotulo;
      btn.addEventListener('click', async () => {
        try {
          const r = await api(`/feedbacks/${fala.id}/reactions`, {
            method: 'POST',
            body: JSON.stringify({ type: tipo }),
          });
          pintarBotoes(reacoes, r.reacoes, r.minha_reacao);
        } catch (e) {
          alert(e.message);
        }
      });
      reacoes.appendChild(btn);
    });

    pintarBotoes(reacoes, fala.reacoes, fala.minha_reacao);
    conteudo.append(p, reacoes);
    art.append(img, conteudo);
    return art;
  }

  async function carregar() {
    try {
      const r = await api(`/me/feedbacks?page=${pagina}`);
      if (pagina === 1 && !r.items.length) {
        feed.textContent = 'Você ainda não publicou nenhuma fala.';
      } else {
        feed.append(...r.items.map(criarCard));
      }
      btnMais.hidden = r.page >= r.pages;
    } catch (e) {
      if (pagina === 1) feed.textContent = 'Não foi possível carregar suas falas.';
      console.error(e);
    }
  }

  btnMais.addEventListener('click', () => { pagina += 1; carregar(); });
  carregar();
})();