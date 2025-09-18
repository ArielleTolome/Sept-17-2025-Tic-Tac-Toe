chrome.runtime.onInstalled.addListener(() => {
  // nothing special; storage is used per-site via content + popup
});

// Optional: listen for messages if background needs to broadcast updates
chrome.runtime.onMessage.addListener((_msg, _sender, _sendResponse) => {
  // No-op for now
});

