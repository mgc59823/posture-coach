/**
 * app.js
 * Main Entry Controller for Posture Coach Web (Step 1: Main UI Layout)
 */
import { HeaderComponent } from './components/HeaderComponent.js';
import { WebcamComponent } from './components/WebcamComponent.js';
import { StatusComponent } from './components/StatusComponent.js';
import { SliderComponent } from './components/SliderComponent.js';
import { SerialComponent } from './components/SerialComponent.js';
import { AlertModalComponent } from './components/AlertModalComponent.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize UI Components
  const headerComp = new HeaderComponent('header-container');
  const statusComp = new StatusComponent('status-container');
  const alertModalComp = new AlertModalComponent('alert-modal-container');

  const sliderComp = new SliderComponent('slider-container', 15, (newThreshold) => {
    console.log('[Step 1 UI Event] 임계 각도 변경:', newThreshold);
  });

  const webcamComp = new WebcamComponent(
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

  const serialComp = new SerialComponent(
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
