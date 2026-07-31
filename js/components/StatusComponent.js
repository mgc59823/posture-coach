/**
 * StatusComponent.js
 * Displays posture status badge (Good / Warning / Analyzing / Inactive) with LED-sync colors.
 */
export class StatusComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentStatus = 'inactive';
    this.render();
  }

  render() {
    this.container.className = 'glass-card status-card';
    this.container.innerHTML = `
      <div class="card-title">
        <span>📊</span> 현재 자세 상태
      </div>
      <div class="main-status-badge inactive" id="status-badge">
        <span class="status-icon" id="status-icon">⚪</span>
        <span class="status-text" id="status-text">미감지 / 웹캠 종료</span>
      </div>
    `;

    this.badge = document.getElementById('status-badge');
    this.icon = document.getElementById('status-icon');
    this.text = document.getElementById('status-text');
  }

  /**
   * Updates status badge
   * @param {string} state - 'good' | 'warning' | 'analyzing' | 'inactive'
   * @param {string} label - Optional text label
   */
  updateStatus(state, label) {
    this.currentStatus = state;
    this.badge.className = `main-status-badge ${state}`;

    switch (state) {
      case 'good':
        this.icon.textContent = '🟢';
        this.text.textContent = label || '바른 자세';
        break;
      case 'warning':
        this.icon.textContent = '🔴';
        this.text.textContent = label || '거북목 주의!';
        break;
      case 'analyzing':
        this.icon.textContent = '🟡';
        this.text.textContent = label || '자세 분석 중...';
        break;
      case 'inactive':
      default:
        this.icon.textContent = '⚪';
        this.text.textContent = label || '미감지 / 웹캠 종료';
        break;
    }
  }
}
