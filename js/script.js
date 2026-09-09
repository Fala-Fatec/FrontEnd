document.addEventListener('DOMContentLoaded', () => {
  const btnPostar = document.getElementById('btnPostar');
  const postText = document.getElementById('postText');
  const categoriaSelect = document.getElementById('categoriaSelect');
  const tipoSelect = document.getElementById('tipoSelect');

  const feedbacksList = document.getElementById('feedbacksList');
  const sugestoesList = document.getElementById('sugestoesList');


  btnPostar.addEventListener('click', () => {
    const texto = postText.value.trim();
    const categoria = categoriaSelect.value;
    const tipo = tipoSelect.value;

    if (!texto) {
      alert('Por favor, digite o que você quer falar!');
      return;
    }

    if (!tipo) {
      alert('Selecione o Tipo (Feedback ou Sugestão)!');
      return;
    }


    const newCard = createCardElement(texto);

  
    if (tipo === 'feedback') {
      feedbacksList.prepend(newCard);
    } else if (tipo === 'sugestao') {
      sugestoesList.prepend(newCard);
    }


    postText.value = '';
  });

  
  function createCardElement(text) {
    const card = document.createElement('article');
    card.className = 'post-card';

    card.innerHTML = `
      <div class="card-avatar">
        <img src="img/avatar.png" alt="avatar" class="avatar-img">
      </div>
      <div class="card-content">
        <p class="card-text">${text}</p>
        <div class="card-reactions">
          <button class="btn-reaction btn-apoiado">Apoiado!</button>
          <button class="btn-reaction btn-discordo">Discordo</button>
          <button class="btn-reaction btn-gag">Fiquei GAG</button>
        </div>
      </div>
    `;


    const buttons = card.querySelectorAll('.btn-reaction');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.style.transform = 'scale(1.1)';
        setTimeout(() => btn.style.transform = 'scale(1)', 150);
      });
    });

    return card;
  }
});