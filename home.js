'use strict';
const form = document.getElementById('contact-form');
document.querySelectorAll('[data-hire]').forEach(link => {
  link.addEventListener('click', () => { form.elements.namedItem('hire').value = link.dataset.hire; });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const value = name => String(data.get(name) || '').trim();
  const body = ['Name: ' + value('name'), 'Email: ' + value('email'), 'Hire: ' + value('hire'), 'Date: ' + (value('date') || 'To be confirmed'), 'Venue / town: ' + value('venue'), 'Guests: ' + value('guests'), '', value('message')].join('\n');
  window.location.href = 'mailto:simulate.it.ne@gmail.com?subject=' + encodeURIComponent('Simulate It enquiry: ' + value('hire')) + '&body=' + encodeURIComponent(body);
  document.getElementById('form-status').textContent = 'Your email draft is ready to open. Please send it from your email app. If nothing opens, email simulate.it.ne@gmail.com directly.';
});
