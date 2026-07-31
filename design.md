# 🎨 [Design Guide] 바른 자세 코치 UI/UX 디자인 가이드

본 문서는 **바른 자세 코치 웹사이트(Posture Coach Web)**의 사용자 경험(UX) 및 사용자 인터페이스(UI) 디자인 가이드라인입니다. 웹 브라우저 화면과 아두이노 네오픽셀 LED 간의 시각적 일관성을 제공하며, 눈의 피로를 최소화하는 현대적인 다크 모드 디자인 시스템을 구현합니다.

---

## 1. 디자인 컨셉 (Design Concept)

* **컨셉명**: **Neo-Glass Dark Posture Dashboard**
* **핵심 키워드**: `Sleek Dark`, `Glassmorphism`, `Neon Signal`, `Intuitive`
* **컨셉 특징**:
  1. **Eye-Care Dark Mode**: 장시간 모니터를 주시하는 컴퓨터 사용자의 눈 피로를 완화하기 위해 심층 슬레이트 다크 테마 적용.
  2. **Glassmorphism**: 카드 컴포넌트에 반투명 블러(Backdrop Blur) 효과를 적용하여 세련되고 경쾌한 입체감 제공.
  3. **1:1 LED Color Sync**: 웹 화면의 피드백 색상과 아두이노 네오픽셀(WS2812B) LED 색상을 100% 동일하게 일치시켜 직관적인 사용자 경험 전달.

---

## 2. 컬러 시스템 (Color System)

### 2.1 메인 테마 컬러 (Background & Surface)
| 구 분 | 색상 이름 | HEX / RGBA 코드 | 용도 및 설명 |
| :--- | :--- | :--- | :--- |
| **Main Background** | Deep Slate | `#0F172A` | 대시보드 전체 배경 |
| **Card Glass Surface** | Semi Dark Glass | `rgba(30, 41, 59, 0.75)` | 반투명 패널 (Backdrop-filter: `blur(12px)`) |
| **Card Border** | Subtle Glass Border | `rgba(255, 255, 255, 0.1)` | 패널 외곽선 경계 |
| **Primary Text** | Off-White | `#F8FAFC` | 제목, 강조 텍스트, 메인 값 |
| **Secondary Text** | Slate Muted | `#94A3B8` | 부제목, 본문, 라벨 |

### 2.2 자세 상태 및 아두이노 LED 동기화 컬러 (Feedback Colors)
> [!NOTE]
> 하드웨어 네오픽셀 LED(`SET,NEO,255,R,G,B`)의 RGB 전송 값과 웹 UI 뱃지/글로우 색상이 1:1로 정확히 동기화됩니다.

```
🟢 바른 자세      (Good)       :  #22C55E  [RGB: 0, 255, 0]
🟡 자세 분석 중   (Analyzing)  :  #F59E0B  [RGB: 255, 255, 0]
🔴 거북목 주의   (Warning)    :  #EF4444  [RGB: 255, 0, 0]
⚪ 미감지 / 해제 (Inactive)   :  #64748B  [RGB: 0, 0, 0]
```

| 자세 상태 | UI 메인 색상 | Glow Effect (네온 광원) | 아두이노 전송 값 |
| :--- | :--- | :--- | :--- |
| **바른 자세** | `#22C55E` (Green) | `0 0 20px rgba(34, 197, 94, 0.4)` | `SET,NEO,255,0,255,0\n` |
| **거북목 주의** | `#EF4444` (Red) | `0 0 25px rgba(239, 68, 68, 0.6)` | `SET,NEO,255,255,0,0\n` |
| **자세 분석 중** | `#F59E0B` (Amber) | `0 0 20px rgba(245, 158, 11, 0.4)` | `SET,NEO,255,255,255,0\n` |
| **미감지 / 오프** | `#64748B` (Slate) | None | `SET,NEO,255,0,0,0\n` |

---

## 3. 타이포그래피 (Typography)

* **Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`

| 요소 | Font Size | Weight | Line Height | Letter Spacing | 예시 및 설명 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Title (H1)** | `24px` | Bold (700) | `1.3` | `-0.02em` | 대시보드 헤더 로고 텍스트 |
| **Section (H2)** | `18px` | SemiBold (600) | `1.4` | `-0.01em` | 웹캠, 상태 카드 각 영역 제목 |
| **Status Display**| `32px` | ExtraBold (800)| `1.2` | `0em` | "🟢 바른 자세" 대형 상태 표시 |
| **Body / Label** | `14px` | Regular (400) | `1.5` | `0em` | 본문, 설명문, 슬라이더 라벨 |
| **Badge / Tag** | `12px` | Medium (500) | `1.0` | `0.05em` | 상단 아두이노 연결 상태 뱃지 |

---

## 4. 레이아웃 및 카드 그리드 (Layout & Grid)

### 4.1 그리드 구조 (Desktop 2-Column Responsive Layout)
* **최대 넓이**: `1280px` (중앙 정렬)
* **컬럼 분할**:
  * **좌측 (Left Panel - 60%)**: 실시간 웹캠 비디오 및 MediaPipe Canvas 영역, 주요 시작/종료 제어 버튼
  * **우측 (Right Panel - 40%)**: 아두이노 연결 카드, 현재 자세 상태 카드, 민감도(임계값) 조절 슬라이더 카드

```
+----------------------------------------------------------------------------------+
|  🧩 바른 자세 코치 (Posture Coach)                              [🔌 아두이노 연결] |
+----------------------------------------+-----------------------------------------+
|                                        |  📊 현재 자세 상태                      |
|                                        |  +-----------------------------------+  |
|   [ 📷 실시간 웹캠 & MediaPipe ]         |  |   🟢 바른 자세 (Good Posture)    |  |
|                                        |  +-----------------------------------+  |
|   - 16:9 Aspect Ratio                  |                                         |
|   - Rounded 16px / Glass Border        |  ⚙️ 거북목 판단 민감도 (각도 설정)       |
|   - 귀/어깨 네온 핀포인트 오버레이      |  [=====|-----------------] 15°         |
|                                        |                                         |
|                                        |  💡 아두이노 시리얼 상태: CONNECTED     |
|   [📷 카메라 시작]    [🛑 카메라 종료]   |  [🔌 연결 해제]                          |
+----------------------------------------+-----------------------------------------+
| ⚠️ [경고 모달 팝업] 거북목 자세가 3초 이상 유지되었습니다. 자세를 올바르게 고치세요! |
+----------------------------------------------------------------------------------+
```

---

## 5. 웹캠 및 MediaPipe 자세 감지 UI (Webcam Canvas UI)

* **비디오 뷰어 비율**: `16:9` 고정 비율, `border-radius: 16px`, `overflow: hidden`
* **캔버스 랜드마크 시각화 가이드**:
  * **귀(Ear) 핀포인트**: 반짝이는 사이언 네온 링 (`#06B6D4`, Glow 반경 8px)
  * **어깨(Shoulder) 핀포인트**: 퍼플 네온 링 (`#A855F7`, Glow 반경 8px)
  * **귀-어깨 연결선**:
    * 바른 자세일 때: 점선(Dashed) 초록 네온 라인 (`#22C55E`)
    * 거북목 자세일 때: 점선(Dashed) 빨간 네온 라인 (`#EF4444`)
  * **각도 인디케이터 오버레이**: 캔버스 좌측 상단에 반투명 Pill 뱃지 형태로 `현재 각도: 14° (정상)` 표시.

---

## 6. 핵심 컴포넌트 UI 사양 (Component Specs)

### 6.1 메인 자세 상태 카드 (Status Card)
* **배경**: `rgba(30, 41, 59, 0.8)` + 상태별 글로우 패널
* **인디케이터**: 펄스(Pulse) 애니메이션이 적용된 대형 원형 아이콘 (파장 효과)
* **상태별 글로우 스타일**:
  * 바른 자세: `box-shadow: inset 0 0 20px rgba(34, 197, 94, 0.25), 0 8px 32px rgba(0,0,0,0.37)`
  * 거북목 자세: `box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.35), 0 8px 32px rgba(0,0,0,0.37)`

### 6.2 아두이노 연결 뱃지 (Serial Connection Badge)
* **미연결 상태**: 슬레이트 회색 뱃지 (`#64748B`) + "🔌 아두이노 미연결"
* **연결 완료 상태**: 에메랄드 초록 뱃지 (`#10B981`) + "⚡ COM3 연결됨 (115200bps)"
* **통신 오류 상태**: 로즈 빨간 뱃지 (`#F43F5E`) + "⚠️ 시리얼 통신 오류"

### 6.3 민감도(임계값) 조절 슬라이더 (Sensitivity Range Input)
* **트랙(Track)**: `height: 6px`, `background: #334155`, `border-radius: 3px`
* **진행바(Filled)**: `#06B6D4` (Cyan Gradient)
* **썸(Thumb)**: `width: 20px, height: 20px`, `background: #F8FAFC`, `box-shadow: 0 0 10px #06B6D4`

---

## 7. 애니메이션 & 인터랙션 가이드 (Animations & Interactions)

### 7.1 거북목 3초 경고 풀스크린 Pulse 애니메이션 (`@keyframes pulseAlert`)
거북목 자세가 3초 이상 지속되는 경우, 화면 뷰포트 외곽 전면에 빨간색 경고 파장이 지속적으로 깜빡입니다.

```css
@keyframes pulseAlert {
  0% {
    box-shadow: inset 0 0 0px rgba(239, 68, 68, 0);
  }
  50% {
    box-shadow: inset 0 0 50px rgba(239, 68, 68, 0.8), 0 0 30px rgba(239, 68, 68, 0.5);
  }
  100% {
    box-shadow: inset 0 0 0px rgba(239, 68, 68, 0);
  }
}

.warning-active {
  animation: pulseAlert 1.2s infinite ease-in-out;
}
```

### 7.2 경고 슬라이드다운 모달 (Slide-down Warning Modal)
상단에서 부드럽게 미끄러져 내려오는 경고 모달 창:

```css
.warning-modal {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(-120%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(239, 68, 68, 0.9);
  backdrop-filter: blur(16px);
  color: #FFFFFF;
  padding: 16px 32px;
  border-radius: 50px;
  box-shadow: 0 20px 40px rgba(239, 68, 68, 0.4);
}

.warning-modal.show {
  transform: translateX(-50%) translateY(0);
}
```

---

## 8. CSS 디자인 토큰 코드 (`design-tokens.css`)

```css
:root {
  /* Color Tokens */
  --bg-main: #0F172A;
  --bg-card: rgba(30, 41, 59, 0.75);
  --border-glass: rgba(255, 255, 255, 0.1);
  
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  
  /* Status & NeoPixel Colors */
  --status-good: #22C55E;
  --status-good-glow: rgba(34, 197, 94, 0.4);
  
  --status-warning: #EF4444;
  --status-warning-glow: rgba(239, 68, 68, 0.5);
  
  --status-analyzing: #F59E0B;
  --status-analyzing-glow: rgba(245, 158, 11, 0.4);
  
  --status-inactive: #64748B;
  
  /* Accent & Hardware */
  --accent-cyan: #06B6D4;
  --accent-purple: #A855F7;
  
  /* Layout & Geometry */
  --card-radius: 16px;
  --btn-radius: 10px;
  --glass-blur: blur(12px);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.37);
}
```

---
*작성일: 2026년 7월 31일*  
*작성자: UI/UX 디자인 전문가 (Frontend & IoT Experience)*
