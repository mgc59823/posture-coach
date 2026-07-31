/**
 * app.js
 * Main Controller for Posture Coach Web
 * Integrates Step 2 (Webcam & MediaPipe) and Step 3 (Posture Analysis & Evaluation).
 */
document.addEventListener('DOMContentLoaded', () => {
  const HeaderComp = window.HeaderComponent;
  const WebcamComp = window.WebcamComponent;
  const StatusComp = window.StatusComponent;
  const SliderComp = window.SliderComponent;
  const SerialComp = window.SerialComponent;
  const AlertModalComp = window.AlertModalComponent;
  const PoseAnalyzerClass = window.PoseAnalyzer;
  const MediaPipeManagerClass = window.MediaPipeManager;

  if (!HeaderComp || !WebcamComp || !StatusComp || !SliderComp || !SerialComp || !AlertModalComp) {
    console.error('기본 UI 컴포넌트를 로드하지 못했습니다.');
    return;
  }

  // 1. Initialize UI Components
  const headerComp = new HeaderComp('header-container');
  const statusComp = new StatusComp('status-container');
  const alertModalComp = new AlertModalComp('alert-modal-container');

  // 2. Initialize Pose Analyzer (Step 3)
  window.currentThreshold = 15;
  const poseAnalyzer = new PoseAnalyzerClass(window.currentThreshold, (angle) => {
    console.warn(`⚠️ [알림] 거북목 자세가 3초 이상 지속되었습니다! (현재 각도: ${angle}°)`);
    alertModalComp.showAlert(`⚠️ 거북목 자세가 3초 이상 유지되었습니다! 자세를 올바르게 고쳐주세요. (측정 각도: ${angle}°)`);
  });

  // Slider change handler
  const sliderComp = new SliderComp('slider-container', window.currentThreshold, (newThreshold) => {
    window.currentThreshold = newThreshold;
    poseAnalyzer.setThreshold(newThreshold);
  });

  let mediaPipeManager = null;

  // 3. Initialize Webcam Component & MediaPipe Manager (Step 2)
  const webcamComp = new WebcamComp(
    'webcam-container',
    async () => {
      console.log('📷 웹캠 및 MediaPipe 자세 감지 시작...');
      try {
        webcamComp.setCameraState(true);
        statusComp.updateStatus('analyzing', '자세 분석 중...');

        if (!mediaPipeManager) {
          mediaPipeManager = new MediaPipeManagerClass(
            webcamComp.videoElement,
            webcamComp.canvasElement,
            (results) => {
              // Frame result callback from MediaPipe
              if (!webcamComp.isCameraActive) return;

              if (results && results.poseLandmarks) {
                const result = poseAnalyzer.analyze(results.poseLandmarks);
                const { status, angle } = result;

                if (status === 'good') {
                  statusComp.updateStatus('good', '🟢 바른 자세');
                  webcamComp.updateAngleOverlay(angle, '정상');
                  alertModalComp.hideAlert();
                } else if (status === 'warning') {
                  statusComp.updateStatus('warning', '🔴 거북목 주의!');
                  webcamComp.updateAngleOverlay(angle, '거북목');
                } else {
                  statusComp.updateStatus('analyzing', '자세 분석 중...');
                  webcamComp.updateAngleOverlay(0, '분석중');
                }
              } else {
                poseAnalyzer.resetTimer();
                statusComp.updateStatus('inactive', '미감지 / 포즈 미탐지');
                alertModalComp.hideAlert();
              }
            }
          );
        }

        await mediaPipeManager.start();
      } catch (err) {
        console.error('웹캠/MediaPipe 실행 오류:', err);
        alert('카메라 접근 권한이 필요합니다. 웹캠 연결을 확인해 주세요.');
        webcamComp.setCameraState(false);
        statusComp.updateStatus('inactive', '카메라 오류');
      }
    },
    () => {
      console.log('🛑 웹캠 종료');
      if (mediaPipeManager) {
        mediaPipeManager.stop();
      }
      poseAnalyzer.resetTimer();
      webcamComp.setCameraState(false);
      statusComp.updateStatus('inactive', '미감지 / 웹캠 종료');
      alertModalComp.hideAlert();
    }
  );

  // 4. Initialize Serial Component
  const serialComp = new SerialComp(
    'serial-container',
    () => {
      console.log('🔌 아두이노 Web Serial 연결 요청');
      serialComp.setConnectionState(true, 'COM3 (테스트)');
      headerComp.updateSerialStatus(true, 'COM3 (테스트)');
    },
    () => {
      console.log('🔌 아두이노 Web Serial 연결 해제');
      serialComp.setConnectionState(false);
      headerComp.updateSerialStatus(false);
    }
  );

  // Initial State
  webcamComp.setCameraState(false);
  statusComp.updateStatus('inactive', '미감지 / 웹캠 종료');

  console.log('✅ [Step 2 & 3] 웹캠 실행, MediaPipe 자세 감지 및 실시간 분석 모듈이 활성화되었습니다.');
});
