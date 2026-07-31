/**
 * PoseAnalyzer.js
 * Analyzes MediaPipe pose landmarks for side profile posture & turtle neck evaluation.
 */
export class PoseAnalyzer {
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

    // MediaPipe Pose landmarks:
    // Left ear: 7, Right ear: 8
    // Left shoulder: 11, Right shoulder: 12
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    // Determine clearer side based on visibility
    const leftVisibility = (leftEar?.visibility || 0) + (leftShoulder?.visibility || 0);
    const rightVisibility = (rightEar?.visibility || 0) + (rightShoulder?.visibility || 0);

    let ear = leftEar;
    let shoulder = leftShoulder;

    if (rightVisibility > leftVisibility) {
      ear = rightEar;
      shoulder = rightShoulder;
    }

    // Ensure minimum visibility threshold
    if (!ear || !shoulder || (ear.visibility && ear.visibility < 0.4) || (shoulder.visibility && shoulder.visibility < 0.4)) {
      this.resetTimer();
      return { status: 'inactive', angle: 0, ear: null, shoulder: null };
    }

    // Calculate angle relative to vertical line
    const dx = Math.abs(ear.x - shoulder.x);
    const dy = shoulder.y - ear.y; // In screen space, y increases downwards

    // Calculate angle in degrees
    const angleRad = Math.atan2(dx, Math.max(dy, 0.001));
    const angleDeg = Math.round(angleRad * (180 / Math.PI));

    const isWarning = angleDeg > this.threshold;
    const status = isWarning ? 'warning' : 'good';

    // Handle 3-second turtle neck warning timer
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
