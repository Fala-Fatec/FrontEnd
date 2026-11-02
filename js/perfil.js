document.addEventListener('DOMContentLoaded', () => {
  const photoInput = document.getElementById('profilePhotoInput');
  const profilePhoto = document.getElementById('profilePhoto');
  const profileForm = document.getElementById('profileForm');
  const saveStatus = document.getElementById('profileSaveStatus');
  const storageKey = 'falaFatecProfile';

  if (!photoInput || !profilePhoto || !profileForm || !saveStatus) {
    return;
  }

  try {
    const savedProfile = localStorage.getItem(storageKey);
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      const fields = profile.fields || {};
      const interests = Array.isArray(profile.interests) ? profile.interests : [];

      profileForm.querySelectorAll('input[name]:not([type="checkbox"])').forEach((input) => {
        input.value = fields[input.name] || '';
      });

      profileForm.querySelectorAll('input[name="interests"]').forEach((input) => {
        input.checked = interests.includes(input.value);
      });
    }
  } catch {
    saveStatus.textContent = 'Não foi possível carregar os dados salvos.';
  }

  photoInput.addEventListener('change', () => {
    const [image] = photoInput.files;
    if (!image) {
      return;
    }

    profilePhoto.src = URL.createObjectURL(image);
  });

  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = {};
    profileForm.querySelectorAll('input[name]:not([type="checkbox"])').forEach((input) => {
      fields[input.name] = input.value.trim();
    });
    const interests = Array.from(profileForm.querySelectorAll('input[name="interests"]:checked'))
      .map((input) => input.value);

    try {
      localStorage.setItem(storageKey, JSON.stringify({ fields, interests }));
      saveStatus.textContent = 'Alterações salvas neste navegador.';
    } catch {
      saveStatus.textContent = 'Não foi possível salvar. Verifique o espaço disponível no navegador.';
    }
  });
});
