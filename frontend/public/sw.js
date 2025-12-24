// frontend/public/sw.js
self.addEventListener('push', function(event) {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon.png', // Make sure you have an icon here
    badge: '/icon.png',
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // Open the specific URL sent from backend
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});