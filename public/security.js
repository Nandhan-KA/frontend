/**
 * Security measures for production environment
 * Blocks access to:
 * - Right-click context menu
 * - View Source (Ctrl+U)
 * - Developer Tools (F12, Ctrl+Shift+I, Ctrl+Shift+J)
 * - Console (Ctrl+Shift+J)
 * 
 * Note: Advanced users can still bypass these measures, but this deters casual inspection
 */

(function() {
  // Only run in production environment
  if (window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('.local')) {
    console.log('Security measures disabled in development environment');
    return;
  }

  // Function to show custom popup message
  const showHackerMessage = () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.fontFamily = 'Arial, sans-serif';
    
    const message = document.createElement('div');
    message.style.color = '#ff0000';
    message.style.fontSize = '24px';
    message.style.padding = '30px';
    message.style.backgroundColor = '#222';
    message.style.borderRadius = '10px';
    message.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.5)';
    message.style.textAlign = 'center';
    message.innerHTML = '<h2>Hey so called hacker just go and do you ***</h2>';
    
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    
    // Remove popup after 3 seconds
    setTimeout(() => {
      document.body.removeChild(overlay);
    }, 3000);
  };

  // Disable right-click context menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    showHackerMessage();
    return false;
  });

  // Disable keyboard shortcuts for view source and developer tools
  document.addEventListener('keydown', function(e) {
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      showHackerMessage();
      return false;
    }
    
    // F12 (Developer Tools)
    if (e.keyCode === 123) {
      e.preventDefault();
      showHackerMessage();
      return false;
    }
    
    // Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      showHackerMessage();
      return false;
    }
    
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      showHackerMessage();
      return false;
    }
    
    // Ctrl+Shift+C (Inspector)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      showHackerMessage();
      return false;
    }
  });

  // Detect DevTools opening via window size change
  const detectDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#222;color:#fff;text-align:center;padding-top:20%;font-family:Arial,sans-serif;"><h1>Developer Tools Detected</h1><p>For security reasons, this site cannot be viewed with developer tools open.</p><p style="color:#ff0000;font-size:24px;margin-top:20px;">Hey so called hacker just go and do you ***</p></div>';
    }
  };

  window.addEventListener('resize', detectDevTools);
  setInterval(detectDevTools, 1000);

  // Disable console methods
  const disableConsole = () => {
    const methods = ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'profile', 'profileEnd', 'count', 'assert', 'timeStamp'];
    const consoleObj = window.console;
    
    methods.forEach(method => {
      consoleObj[method] = function() {
        return false;
      };
    });
  };

  // Function to detect Firebug
  const detectFirebug = () => {
    if (window.console && (window.console.firebug || window.console.table && /firebug/i.test(window.console.table.toString()))) {
      document.body.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#222;color:#fff;text-align:center;padding-top:20%;font-family:Arial,sans-serif;"><h1>Developer Tools Detected</h1><p>For security reasons, this site cannot be viewed with developer tools open.</p><p style="color:#ff0000;font-size:24px;margin-top:20px;">Hey so called hacker just go and do you ***</p></div>';
    }
  };

  // Run security measures
  disableConsole();
  detectFirebug();
  
  // Additional layer of protection
  Object.defineProperty(document, 'querySelector', {
    value: function() {
      return null;
    },
    writable: false
  });
  
  console.warn("This website is protected against inspection and content theft.");
})(); 