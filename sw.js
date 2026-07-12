// Peptide Scheduler Service Worker
// Version 1.8.0

const CACHE_NAME = 'peptide-scheduler-v20';
const ASSETS = [
  './',
  './index.html',
  './peptide-data.json',
  './manifest.json'
];

// Install: cache assets and immediately skip waiting so the new SW activates automatically
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();

  // Schedule daily reminder check on activation
  checkAndScheduleReminders();
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Push notification handler
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || '💉 Peptide Reminder';
  const options = {
    body: data.body || 'Time for your peptide dose!',
    icon: './icons/icon-192.png',
    badge: './icons/icon-96.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      { action: 'logged', title: '✅ Mark as Taken' },
      { action: 'snooze', title: '⏰ Snooze 30 min' }
    ],
    requireInteraction: true,
    tag: 'peptide-reminder'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'logged') {
    // Mark dose as taken - send message to app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clients => {
        if (clients.length > 0) {
          clients[0].postMessage({ action: 'markDoseTaken', data: event.notification.data });
          clients[0].focus();
        } else {
          self.clients.openWindow('./?action=log');
        }
      })
    );
  } else if (event.action === 'snooze') {
    // Snooze 30 minutes
    setTimeout(() => {
      self.registration.showNotification('💉 Peptide Reminder (Snoozed)', {
        body: event.notification.body + '\n(Snoozed 30 min)',
        icon: './icons/icon-192.png',
        badge: './icons/icon-96.png',
        requireInteraction: true,
        tag: 'peptide-reminder-snooze'
      });
    }, 30 * 60 * 1000);
  } else {
    // Open app
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(clients => {
        if (clients.length > 0) {
          clients[0].focus();
        } else {
          self.clients.openWindow('./');
        }
      })
    );
  }
});

// Message handler - receive messages from app
self.addEventListener('message', event => {
  if (event.data.type === 'SCHEDULE_REMINDER') {
    scheduleLocalReminder(event.data.payload);
  } else if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data.type === 'CANCEL_REMINDER') {
    cancelReminder(event.data.id);
  } else if (event.data.type === 'TEST_NOTIFICATION') {
    self.registration.showNotification('💉 Peptide Scheduler Test', {
      body: 'Notifications are working! Your daily reminders are set.',
      icon: './icons/icon-192.png',
      vibrate: [200, 100, 200]
    });
  }
});

// Store scheduled timers
const reminders = new Map();

function scheduleLocalReminder(payload) {
  const { id, title, body, timestamp } = payload;
  const delay = timestamp - Date.now();

  if (delay <= 0) return;

  if (reminders.has(id)) {
    clearTimeout(reminders.get(id));
  }

  const timer = setTimeout(() => {
    self.registration.showNotification(title || '💉 Peptide Reminder', {
      body: body || 'Time for your peptide dose!',
      icon: './icons/icon-192.png',
      badge: './icons/icon-96.png',
      vibrate: [200, 100, 200],
      requireInteraction: true,
      tag: 'peptide-reminder-' + id,
      data: payload,
      actions: [
        { action: 'logged', title: '✅ Mark as Taken' },
        { action: 'snooze', title: '⏰ Snooze 30 min' }
      ]
    });
    reminders.delete(id);
  }, delay);

  reminders.set(id, timer);
}

function cancelReminder(id) {
  if (reminders.has(id)) {
    clearTimeout(reminders.get(id));
    reminders.delete(id);
  }
}

function checkAndScheduleReminders() {
  // Get scheduled reminders from IndexedDB and reschedule
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'SW_READY' });
    });
  });
}
