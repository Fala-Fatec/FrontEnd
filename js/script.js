document.addEventListener('DOMContentLoaded', () => {
  const btnPostar = document.getElementById('btnPostar');
  const postText = document.getElementById('postText');
  const categoriaSelect = document.getElementById('categoriaSelect');
  const tipoSelect = document.getElementById('tipoSelect');

  const feedbacksList = document.getElementById('feedbacksList');
  const sugestoesList = document.getElementById('sugestoesList');
  const trendTitle = document.getElementById('trendTitle');
  const trendDescription = document.getElementById('trendDescription');
  const trendPosition = document.getElementById('trendPosition');
  const trendReactionButtons = document.querySelectorAll('[data-trend-reaction]');
  const trendCounters = {
    supported: document.getElementById('trendSupportedCount'),
    disagreed: document.getElementById('trendDisagreedCount'),
    gagged: document.getElementById('trendGaggedCount')
  };
  const trendSlides = [
    {
      title: 'FALTA CATUPIRY A COXINHA!!',
      description: 'Coxinha seca não dá mais',
      counts: { supported: 30, disagreed: 10, gagged: 10 },
      selectedReaction: null
    },
    {
      title: 'A NOVA CANTINA ESTÁ LINDA!!',
      description: 'Um espaço renovado para aproveitar os intervalos.',
      counts: { supported: 24, disagreed: 3, gagged: 8 },
      selectedReaction: null
    },
    {
      title: 'MAIS ESPAÇO NOS LABORATÓRIOS',
      description: 'Uma sugestão para melhorar as aulas práticas.',
      counts: { supported: 18, disagreed: 5, gagged: 4 },
      selectedReaction: null
    }
  ];
  let currentTrendIndex = 0;

  function renderTrend() {
    const trend = trendSlides[currentTrendIndex];
    trendTitle.textContent = trend.title;
    trendDescription.textContent = trend.description;
    trendPosition.textContent = `${currentTrendIndex + 1} de ${trendSlides.length}`;

    Object.keys(trendCounters).forEach((reaction) => {
      trendCounters[reaction].textContent = trend.counts[reaction];
    });

    trendReactionButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.trendReaction === trend.selectedReaction));
    });
  }

  function changeTrend(direction) {
    currentTrendIndex = (currentTrendIndex + direction + trendSlides.length) % trendSlides.length;
    renderTrend();
  }

  document.getElementById('trendPrevious').addEventListener('click', () => changeTrend(-1));
  document.getElementById('trendNext').addEventListener('click', () => changeTrend(1));

  trendReactionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const trend = trendSlides[currentTrendIndex];
      const reaction = button.dataset.trendReaction;

      if (trend.selectedReaction === reaction) {
        trend.counts[reaction] -= 1;
        trend.selectedReaction = null;
      } else {
        if (trend.selectedReaction) {
          trend.counts[trend.selectedReaction] -= 1;
        }

        trend.counts[reaction] += 1;
        trend.selectedReaction = reaction;
      }

      renderTrend();
    });
  });

  renderTrend();

  btnPostar.addEventListener('click', () => {
    const texto = postText.value.trim();
    const tipo = tipoSelect.value;

    if (!texto) {
      alert('Por favor, digite o que você quer falar!');
      return;
    }

    if (!tipo) {
      alert('Selecione o Tipo (Feedback ou Sugestão)!');
      return;
    }

    const newCard = createCardElement(texto, categoriaSelect.value);
    if (tipo === 'feedback') {
      feedbacksList.prepend(newCard);
    } else {
      sugestoesList.prepend(newCard);
    }

    postText.value = '';
  });

  function createCardElement(text, category) {
    const card = document.createElement('article');
    card.className = 'post-card';

    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'card-avatar';
    const avatar = document.createElement('img');
    avatar.src = 'img/avatar.png';
    avatar.alt = 'avatar';
    avatar.className = 'avatar-img';
    avatarContainer.append(avatar);

    const content = document.createElement('div');
    content.className = 'card-content';
    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent = text;
    content.append(cardText);

    if (category) {
      const categoryLabel = document.createElement('p');
      categoryLabel.className = 'card-category';
      categoryLabel.textContent = `Categoria: ${categoriaSelect.options[categoriaSelect.selectedIndex].text}`;
      content.append(categoryLabel);
    }

    const reactions = document.createElement('div');
    reactions.className = 'card-reactions';
    [
      ['btn-apoiado', 'Apoiado!'],
      ['btn-discordo', 'Discordo'],
      ['btn-gag', 'Fiquei GAG']
    ].forEach(([className, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `btn-reaction ${className}`;
      button.textContent = label;
      button.addEventListener('click', () => {
        button.style.transform = 'scale(1.1)';
        setTimeout(() => { button.style.transform = 'scale(1)'; }, 150);
      });
      reactions.append(button);
    });

    content.append(reactions);
    card.append(avatarContainer, content);
    return card;
  }
});