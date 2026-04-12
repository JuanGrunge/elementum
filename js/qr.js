const qrImage  = document.querySelector('.qr-image');
const modal    = document.getElementById('qr-modal');
const backdrop = document.getElementById('qr-modal-backdrop');
const closeBtn = document.getElementById('qr-modal-close');

function openModal() {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

qrImage.addEventListener('click', openModal);
qrImage.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(); });
backdrop.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
