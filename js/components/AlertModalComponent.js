/**
 * AlertModalComponent.js
 * Controls 3-second turtle neck fullscreen pulse border & slide-down alert modal.
 */
export class AlertModalComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isVisible = false;
    this.render();
  }

  render() {
    this.container.className = 'warning-modal-overlay';
    this.container.innerHTML = `
      <div class="modal-content-glass">
        <span>⚠️</span>
        <span id="alert-message-text">거북목 자세가 3초 이상 유지되었습니다! 자세를 바르게 교정하세요.</span>
      </div>
    `;

    this.msgText = document.getElementById('alert-message-text');
  }

  showAlert(message) {
    if (message) this.msgText.textContent = message;
    this.container.classList.add('show');
    document.body.classList.add('warning-active');
    this.isVisible = true;
  }

  hideAlert() {
    this.container.classList.remove('show');
    document.body.classList.remove('warning-active');
    this.isVisible = false;
  }
}

if (typeof window !== 'undefined') {
  window.AlertModalComponent = AlertModalComponent;
}
