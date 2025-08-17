if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Project-Terra-Nova/sw.js')
      .then(reg => console.log('Service Worker Registrado!', reg))
      .catch(err => console.log('Fallo en el registro del Service Worker:', err));
  });
}