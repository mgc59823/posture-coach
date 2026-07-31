/**
 * MediaPipeManager.js
 * Manages MediaPipe Pose detection & design.md neon canvas drawing overlay.
 */
class MediaPipeManager {
  constructor(videoElement, canvasElement, onResultsCallback) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.onResults = onResultsCallback;

    this.pose = null;
    this.camera = null;
    this.isLoaded = false;
  }

  async init() {
    if (typeof window.Pose === 'undefined') {
      throw new Error('MediaPipe Pose 라이브러리가 로드되지 않았습니다.');
    }

    this.pose = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
    });

    this.pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.pose.onResults((results) => {
      this.drawResults(results);
      if (this.onResults) {
        this.onResults(results);
      }
    });

    this.isLoaded = true;
  }

  async start() {
    if (!this.isLoaded) {
      await this.init();
    }

    if (typeof window.Camera !== 'undefined') {
      this.camera = new window.Camera(this.video, {
        onFrame: async () => {
          if (this.pose) {
            await this.pose.send({ image: this.video });
          }
        },
        width: 640,
        height: 480
      });
      await this.camera.start();
    } else {
      this.startManualLoop();
    }
  }

  startManualLoop() {
    const processFrame = async () => {
      if (!this.camera && this.video.srcObject) {
        if (this.pose) {
          await this.pose.send({ image: this.video });
        }
        requestAnimationFrame(processFrame);
      }
    };
    processFrame();
  }

  stop() {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    if (this.video.srcObject) {
      const tracks = this.video.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.video.srcObject = null;
    }
    this.clearCanvas();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawResults(results) {
    if (this.video.videoWidth && this.video.videoHeight) {
      if (this.canvas.width !== this.video.videoWidth) {
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;
      }
    }

    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.save();
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.drawImage(results.image, 0, 0, w, h);

    if (results.poseLandmarks && results.poseLandmarks.length > 12) {
      const landmarks = results.poseLandmarks;
      
      const leftEar = landmarks[7];
      const rightEar = landmarks[8];
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];

      const leftVis = (leftEar?.visibility || 0) + (leftShoulder?.visibility || 0);
      const rightVis = (rightEar?.visibility || 0) + (rightShoulder?.visibility || 0);

      const ear = rightVis > leftVis ? rightEar : leftEar;
      const shoulder = rightVis > leftVis ? rightShoulder : leftShoulder;

      if (ear && shoulder && (ear.visibility || 1) > 0.3 && (shoulder.visibility || 1) > 0.3) {
        const earX = ear.x * w;
        const earY = ear.y * h;
        const shoulderX = shoulder.x * w;
        const shoulderY = shoulder.y * h;

        const dx = Math.abs(ear.x - shoulder.x);
        const dy = shoulder.y - ear.y;
        const angleDeg = Math.round(Math.atan2(dx, Math.max(dy, 0.001)) * (180 / Math.PI));
        const isWarning = angleDeg > (window.currentThreshold || 15);

        const lineColor = isWarning ? '#EF4444' : '#22C55E';
        const lineGlow = isWarning ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 197, 94, 0.8)';

        this.ctx.beginPath();
        this.ctx.setLineDash([8, 6]);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = lineColor;
        this.ctx.shadowColor = lineGlow;
        this.ctx.shadowBlur = 12;
        this.ctx.moveTo(earX, earY);
        this.ctx.lineTo(shoulderX, shoulderY);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        this.ctx.setLineDash([]);

        this.drawNeonPoint(earX, earY, '#06B6D4', 'rgba(6, 182, 212, 0.9)', 8);
        this.drawNeonPoint(shoulderX, shoulderY, '#A855F7', 'rgba(168, 85, 247, 0.9)', 8);
      }
    }

    this.ctx.restore();
  }

  drawNeonPoint(x, y, color, glowColor, radius) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.shadowColor = glowColor;
    this.ctx.shadowBlur = 15;
    this.ctx.fill();
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius + 4, 0, 2 * Math.PI);
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.restore();
  }
}

if (typeof window !== 'undefined') {
  window.MediaPipeManager = MediaPipeManager;
}
