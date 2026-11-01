const imageLinks = document.querySelectorAll('[data-image-title]');
const coverModal = document.querySelector('#cover-modal');

if (coverModal) {
  const modalImage = coverModal.querySelector('img');
  for (const imageLink of imageLinks) {
    imageLink.addEventListener('click', (event) => {
      event.preventDefault();
      modalImage.src = imageLink.href;
      modalImage.alt = imageLink.querySelector('img').alt;
      coverModal.setAttribute('aria-label', imageLink.dataset.imageTitle);
      coverModal.showModal();
    });
  }

  coverModal.querySelector('.image-modal-close').addEventListener('click', () => {
    coverModal.close();
  });

  coverModal.addEventListener('click', (event) => {
    if (event.target === coverModal) coverModal.close();
  });
}

for (const button of document.querySelectorAll('[data-copy-prompt]')) {
  button.addEventListener('click', () => copyBuildPrompt(button));
  button.hidden = false;
}

async function copyBuildPrompt(button) {
  if (button.getAttribute('aria-busy') === 'true') return;
  const prompt = document.getElementById(button.dataset.copyPrompt).content.textContent.trim();
  const status = button.closest('figure').querySelector('.copy-prompt-status');
  button.setAttribute('aria-busy', 'true');
  status.textContent = '';
  try {
    await navigator.clipboard.writeText(prompt);
    button.textContent = 'Copied';
    status.textContent = 'Prompt copied to clipboard.';
  } catch {
    button.textContent = 'Try again';
    status.textContent = 'Could not copy the prompt. Please try again.';
  } finally {
    button.removeAttribute('aria-busy');
  }
  window.setTimeout(() => {
    button.textContent = 'Copy prompt';
  }, 2500);
}
