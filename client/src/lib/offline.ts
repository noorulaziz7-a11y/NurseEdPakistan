// Offline Support Utilities
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('New service worker available');
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const isOnline = () => navigator.onLine;

export const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const getFromLocalStorage = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return null;
  }
};

export const syncOfflineData = async () => {
  if (!isOnline()) return;
  
  // Sync quiz results
  const offlineResults = getFromLocalStorage('offline_quiz_results') || [];
  if (offlineResults.length > 0) {
    try {
      await Promise.all(
        offlineResults.map((result: any) =>
          fetch('/api/quiz/results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result),
          })
        )
      );
      localStorage.removeItem('offline_quiz_results');
      console.log('Synced offline quiz results');
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }
};

