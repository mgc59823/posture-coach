/**
 * PoseAnalyzer.js
 * Analyzes MediaPipe pose landmarks for side profile posture & turtle neck evaluation.
 */
class PoseAnalyzer {
  constructor(threshold = 15, onWarningTimerTrigger) {
    this.threshold = threshold;
    this.onWarningTimerTrigger = onWarningTimerTrigger;
    this.warningStartTime = null;
    this.hasTriggeredWarning = false;
  }

  setThreshold(newThreshold) {
    this.threshold = newThreshold;
  }

  /**
   * Analyzes posture from landmarks
   * @param {Array} landmarks - MediaPipe pose landmarks
   * @returns {Object} { status: 'good'|'warning'|'inactive', angle: number, ear: Object, shoulder: Object }
   */
  analyze(landmarks) {
    if (!landmarks || landmarks.length < 13) {
      this.resetTimer();
      return { status: 'inactive', angle: 0, ear: null, shoulder: null };
    }

    const leftEar = landmarks[7];
    const rightEar = landmarks[8];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    const leftVisibility = (leftEar?.visibility || 0) + (leftShoulder?.visibility || 0);
    const rightVisibility = (rightEar?.visibility || 0) + (rightShoulder?.visibility || 0);

    let ear = leftEar;
    let shoulder = leftShoulder;

    if (rightVisibility > leftVisibility) {
      ear = rightEar;
      shoulder = rightShoulder;
    }

    if (!ear || !shoulder || (ear.visibility && ear.visibility < 0.3) || (shoulder.visibility && shoulder.visibility < 0.3)) {
      this.resetTimer();
      return { status: 'inactive', angle: 0, ear: null, shoulder: null };
    }

    const dx = Math.abs(ear.x - shoulder.x);
    const dy = shoulder.y - ear.y;

    const angleRad = Math.atan2(dx, Math.max(dy, 0.001));
    const angleDeg = Math.round(angleRad * (180 / Math.PI));

    const isWarning = angleDeg > this.threshold;
    const status = isWarning ? 'warning' : 'good';

    if (isWarning) {
      if (!this.warningStartTime) {
        this.warningStartTime = Date.now();
      } else if (Date.now() - this.warningStartTime >= 3000) {
        if (!this.hasTriggeredWarning) {
          this.hasTriggeredWarning = true;
          if (this.onWarningTimerTrigger) {
            this.onWarningTimerTrigger(angleDeg);
          }
        }
      }
    } else {
      this.resetTimer();
    }

    return {
      status,
      angle: angleDeg,
      ear,
      shoulder
    };
  }

  resetTimer() {
    this.warningStartTime = null;
    this.hasTriggeredWarning = false;
  }
}

if (typeof window !== 'undefined') {
  window.PoseAnalyzer = PoseAnalyzer;
}
