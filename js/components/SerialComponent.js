/**
 * SerialComponent.js
 * Controls Arduino Web Serial API connection and displays serial status & logs.
 */
class SerialComponent {
  constructor(containerId, onConnectCallback, onDisconnectCallback) {
    this.container = document.getElementById(containerId);
    this.onConnect = onConnectCallback;
    this.onDisconnect = onDisconnectCallback;
    this.isConnected = false;
    this.render();
  }

  render() {
    this.container.className = 'glass-card serial-card';
    this.container.innerHTML = `
      <div class="card-title">
        <span>🔌</span> 아두이노 하드웨어 연동 (Web Serial)
      </div>
      <div class="serial-info">
        <span>통신 속도: <strong>115200 bps</strong></span>
        <span id="serial-state-badge" style="color: var(--text-muted);">미연결</span>
      </div>
      <button id="btn-toggle-serial" class="btn-secondary">
        <span>🔌</span> 아두이노 포트 연결하기
      </button>
    `;

    this.btnToggle = document.getElementById('btn-toggle-serial');
    this.stateBadge = document.getElementById('serial-state-badge');

    this.btnToggle.addEventListener('click', () => {
      if (this.isConnected) {
        if (this.onDisconnect) this.onDisconnect();
      } else {
        if (this.onConnect) this.onConnect();
      }
    });
  }

  setConnectionState(connected, portName = '') {
    this.isConnected = connected;
    if (connected) {
      this.stateBadge.textContent = `연결됨 (${portName || 'WebSerial'})`;
      this.stateBadge.style.color = 'var(--status-good)';
      this.btnToggle.innerHTML = '<span>🔌</span> 아두이노 연결 해제';
      this.btnToggle.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    } else {
      this.stateBadge.textContent = '미연결';
      this.stateBadge.style.color = 'var(--text-muted)';
      this.btnToggle.innerHTML = '<span>🔌</span> 아두이노 포트 연결하기';
      this.btnToggle.style.borderColor = 'var(--border-glass-bright)';
    }
  }
}

if (typeof window !== 'undefined') {
  window.SerialComponent = SerialComponent;
}
