/**
 * HeaderComponent.js
 * Renders top header branding logo and Web Serial summary status indicator.
 */
class HeaderComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
  }

  render() {
    this.container.className = 'glass-card app-header';
    this.container.innerHTML = `
      <div class="brand-logo">
        <span class="logo-icon">🧩</span>
        <h1>바른 자세 코치 (Posture Coach)</h1>
      </div>
      <div class="header-status-badge" id="header-serial-badge">
        <span class="status-dot" id="header-serial-dot"></span>
        <span id="header-serial-text">아두이노 연결 안 됨</span>
      </div>
    `;
  }

  updateSerialStatus(isConnected, portInfo = '') {
    const dot = document.getElementById('header-serial-dot');
    const text = document.getElementById('header-serial-text');
    if (isConnected) {
      dot.classList.add('connected');
      text.textContent = `연결됨 (${portInfo || 'COM'})`;
    } else {
      dot.classList.remove('connected');
      text.textContent = '아두이노 연결 안 됨';
    }
  }
}

if (typeof window !== 'undefined') {
  window.HeaderComponent = HeaderComponent;
}
