/**
 * app.js
 * Main Entry Controller for Posture Coach Web (Step 1: Main UI Layout)
 */
document.addEventListener('DOMContentLoaded', () => {
  const HeaderComp = window.HeaderComponent;
  const WebcamComp = window.WebcamComponent;
  const StatusComp = window.StatusComponent;
  const SliderComp = window.SliderComponent;
  const SerialComp = window.SerialComponent;
  const AlertModalComp = window.AlertModalComponent;

  if (!HeaderComp || !WebcamComp || !StatusComp || !SliderComp || !SerialComp || !AlertModalComp) {
    console.error('컴포넌트 로드에 실패했습니다.');
    return;
  }

  // 1. Initialize UI Components
  const headerComp = new HeaderComp('header-container');
  const statusComp = new StatusComp('status-container');
  const alertModalComp = new AlertModalComp('alert-modal-container');

  const sliderComp = new SliderComp('slider-container', 15, (newThreshold) => {
    console.log('[Step 1 UI Event] 임계 각도 변경:', newThreshold);
  });

  const webcamComp = new WebcamComp(
    'webcam-container',
    () => {
      // Step 1: UI Toggle Test for Camera Start
      console.log('[Step 1 UI Event] 카메라 시작 버튼 클릭');
      webcamComp.setCameraState(true);
      statusComp.updateStatus('analyzing', '자세 분석 중...');
    },
    () => {
      // Step 1: UI Toggle Test for Camera Stop
      console.log('[Step 1 UI Event] 카메라 종료 버튼 클릭');
      webcamComp.setCameraState(false);
      statusComp.updateStatus('inactive', '미감지 / 웹캠 종료');
      alertModalComp.hideAlert();
    }
  );

  const serialComp = new SerialComp(
    'serial-container',
    () => {
      // Step 1: UI Toggle Test for Serial Connect
      console.log('[Step 1 UI Event] 아두이노 연결 버튼 클릭');
      serialComp.setConnectionState(true, 'COM3 (테스트)');
      headerComp.updateSerialStatus(true, 'COM3 (테스트)');
    },
    () => {
      // Step 1: UI Toggle Test for Serial Disconnect
      console.log('[Step 1 UI Event] 아두이노 연결 해제 버튼 클릭');
      serialComp.setConnectionState(false);
      headerComp.updateSerialStatus(false);
    }
  );

  // Set initial UI states for Step 1
  webcamComp.setCameraState(false);
  statusComp.updateStatus('inactive', '미감지 / 웹캠 종료');

  console.log('✅ [Step 1] 바른 자세 코치 메인 화면 UI 구현이 완료되었습니다.');
});
