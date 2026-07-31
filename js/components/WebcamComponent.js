/**
 * WebcamComponent.js
 * Manages 16:9 webcam stream & MediaPipe pose canvas overlay rendering.
 */
class WebcamComponent {
  constructor(containerId, onStartCallback, onStopCallback) {
    this.container = document.getElementById(containerId);
    this.onStart = onStartCallback;
    this.onStop = onStopCallback;
    this.isCameraActive = false;
    this.render();
  }

  render() {
    this.container.className = 'glass-card webcam-container';
    this.container.innerHTML = `
      <div class="card-title">
        <span>📷</span> 실시간 웹캠 및 자세 감지 (MediaPipe Pose)
      </div>
      <div class="video-wrapper">
        <video id="webcam-video" playsinline autocomplete="off"></video>
        <canvas id="output-canvas"></canvas>
        <div class="video-placeholder" id="video-placeholder">
          <span style="font-size: 48px; opacity: 0.7;">📷</span>
          <p style="color: var(--text-secondary); font-size: 14px; margin-top: 12px;">'카메라 시작' 버튼을 클릭하면 웹캠 및 자세 분석이 활성화됩니다.</p>
        </div>
        <div class="overlay-info-badge" id="angle-overlay-badge" style="display: none;">
          <span>📐</span> <span id="overlay-angle-text">각도: 0°</span>
        </div>
      </div>
      <div class="webcam-controls">
        <button id="btn-start-cam" class="btn-primary">
          <span>📷</span> 카메라 시작
        </button>
        <button id="btn-stop-cam" class="btn-danger" disabled>
          <span>🛑</span> 카메라 종료
        </button>
      </div>
    `;

    this.videoElement = document.getElementById('webcam-video');
    this.canvasElement = document.getElementById('output-canvas');
    this.canvasCtx = this.canvasElement.getContext('2d');
    this.placeholder = document.getElementById('video-placeholder');
    this.angleBadge = document.getElementById('angle-overlay-badge');
    this.angleText = document.getElementById('overlay-angle-text');
    this.btnStart = document.getElementById('btn-start-cam');
    this.btnStop = document.getElementById('btn-stop-cam');

    this.btnStart.addEventListener('click', () => {
      if (this.onStart) this.onStart();
    });

    this.btnStop.addEventListener('click', () => {
      if (this.onStop) this.onStop();
    });
  }

  setCameraState(active) {
    this.isCameraActive = active;
    this.btnStart.disabled = active;
    this.btnStop.disabled = !active;
    if (active) {
      this.placeholder.style.display = 'none';
    } else {
      this.placeholder.style.display = 'flex';
      this.angleBadge.style.display = 'none';
      this.clearCanvas();
    }
  }

  updateAngleOverlay(angle, status) {
    if (!this.isCameraActive) return;
    this.angleBadge.style.display = 'flex';
    this.angleText.textContent = `각도: ${Math.round(angle)}° (${status})`;
  }

  clearCanvas() {
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }
}

if (typeof window !== 'undefined') {
  window.WebcamComponent = WebcamComponent;
}
