if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/RIP_frontend/sw.js', { scope: '/RIP_frontend/' })})}