#include <DHT.h>
#include <Adafruit_NeoPixel.h>
#include <Servo.h>
#include <SoftwareSerial.h>
#include <DFRobotDFPlayerMini.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <LedControl.h>

// ========== 하드웨어 핀 정의 (요청 목록 반영) ==========
#define PIN_DHT       4
#define PIN_DCMOTOR   5   // [주의] LED 핀과 중복됨
#define PIN_LED       5   // [주의] DC모터 핀과 중복됨
#define PIN_BUZZER    6
#define PIN_NEOPIXEL  7
#define PIN_SERVO     8
#define PIN_DOT_CLK   9
#define PIN_DOT_CS    10  // [주의] MP3 핀과 중복됨
#define PIN_DOT_DIN   11  // [주의] MP3 핀과 중복됨
#define PIN_MP3_RX    10  // [주의] 도트매트릭스와 중복됨
#define PIN_MP3_TX    11  // [주의] 도트매트릭스와 중복됨
#define PIN_US_ECHO   12
#define PIN_US_TRIG   13
#define PIN_LDR       A0  // [주의] 미세먼지 OUT과 중복됨
#define PIN_DUST_OUT  A0  // [주의] 조도센서 핀과 중복됨
#define PIN_SOIL      A1
#define PIN_DUST_LED  2
#define PIN_SW        A3

// ========== 라이브러리 객체 생성 ==========
DHT dht(PIN_DHT, DHT11); 
Adafruit_NeoPixel strip(4, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);
Servo myServo;
SoftwareSerial mp3Serial(PIN_MP3_RX, PIN_MP3_TX);
DFRobotDFPlayerMini myDFPlayer;
LiquidCrystal_I2C lcd(0x27, 16, 2); // I2C 주소는 0x27 또는 0x3F가 일반적입니다.
LedControl lc = LedControl(PIN_DOT_DIN, PIN_DOT_CLK, PIN_DOT_CS, 1);

// ========== 시리얼 통신 버퍼 ==========
const byte MAX_CMD_LEN = 40; // 최대 수신 명령어 길이
char cmdBuffer[MAX_CMD_LEN];
byte cmdIndex = 0;

void setup() {
  // Web Serial 통신 속도 (115200bps 권장)
  Serial.begin(115200);
  mp3Serial.begin(9600); // DFPlayer 통신 속도

  // 1. 센서 및 부품 초기화
  dht.begin();
  strip.begin();
  strip.show();
  myServo.attach(PIN_SERVO);
  lcd.init();
  lcd.backlight();
  lc.shutdown(0, false);
  lc.setIntensity(0, 8);
  lc.clearDisplay(0);
  
  if (myDFPlayer.begin(mp3Serial)) {
    myDFPlayer.volume(10); // 기본 볼륨
  }

  // 2. 핀 모드 설정
  pinMode(PIN_DCMOTOR, OUTPUT);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_US_TRIG, OUTPUT);
  pinMode(PIN_US_ECHO, INPUT);
  pinMode(PIN_DUST_LED, OUTPUT);
  pinMode(PIN_SW, INPUT_PULLUP);
  
  Serial.println(F("SYSTEM:READY"));
}

void loop() {
  // 시리얼 데이터 수신 처리 (비동기, 메인루프 블로킹 방지)
  while (Serial.available() > 0) {
    char c = Serial.read();
    
    // 개행 문자('\n')를 명령어의 끝으로 인식
    if (c == '\n') {
      cmdBuffer[cmdIndex] = '\0'; // 문자열 종료 처리
      parseCommand(cmdBuffer);    // 명령어 해석 로직 호출
      cmdIndex = 0;               // 버퍼 인덱스 초기화
    } 
    // 버퍼가 가득 차지 않았고 캐리지리턴('\r')이 아닌 일반 문자인 경우 저장
    else if (c != '\r' && cmdIndex < MAX_CMD_LEN - 1) {
      cmdBuffer[cmdIndex++] = c;
    }
  }
}

// ========== 명령어 파싱 및 실행 로직 ==========
void parseCommand(char* cmd) {
  // 쉼표(,)를 기준으로 데이터 분리 (예: SET,SERVO,90)
  char* action = strtok(cmd, ",");
  char* target = strtok(NULL, ",");
  char* val1_str = strtok(NULL, ",");
  char* val2_str = strtok(NULL, ",");
  char* val3_str = strtok(NULL, ",");

  // 잘못된 명령 형식 예외 처리
  if (action == NULL || target == NULL) {
    Serial.println(F("ERROR:INVALID_FORMAT"));
    return;
  }

  // [명령 1] 부품 상태 설정 (SET)
  if (strcmp(action, "SET") == 0) {
    int val1 = val1_str ? atoi(val1_str) : 0;
    int val2 = val2_str ? atoi(val2_str) : 0;
    int val3 = val3_str ? atoi(val3_str) : 0;

    if (strcmp(target, "SERVO") == 0) {
      myServo.write(val1);
      Serial.println(F("OK:SERVO"));
    } 
    else if (strcmp(target, "LED") == 0) {
      digitalWrite(PIN_LED, val1);
      Serial.println(F("OK:LED"));
    }
    else if (strcmp(target, "DC") == 0) {
      analogWrite(PIN_DCMOTOR, val1); // 0~255 속도 제어
      Serial.println(F("OK:DC"));
    }
    else if (strcmp(target, "BUZZER") == 0) {
      if (val1 > 0) tone(PIN_BUZZER, val1, val2); // 주파수(val1), 지속시간(val2)
      else noTone(PIN_BUZZER);
      Serial.println(F("OK:BUZZER"));
    }
    else if (strcmp(target, "NEO") == 0) {
      // SET,NEO,인덱스,R,G,B (전체 켤 때는 인덱스를 255로 규약)
      if (val1 == 255) {
        for(int i=0; i<4; i++) strip.setPixelColor(i, strip.Color(val2, val3, atoi(strtok(NULL, ","))));
      } else {
        strip.setPixelColor(val1, strip.Color(val2, val3, atoi(strtok(NULL, ","))));
      }
      strip.show();
      Serial.println(F("OK:NEO"));
    }
    else if (strcmp(target, "LCD") == 0) {
      // SET,LCD,줄번호,메시지
      lcd.setCursor(0, val1);
      lcd.print("                "); // 해당 줄 지우기
      lcd.setCursor(0, val1);
      if (val2_str) lcd.print(val2_str);
      Serial.println(F("OK:LCD"));
    }
    else if (strcmp(target, "MP3") == 0) {
      if (val1 == 1) myDFPlayer.play(val2);       // 트랙 번호 재생
      else if (val1 == 2) myDFPlayer.pause();     // 일시정지
      else if (val1 == 3) myDFPlayer.volume(val2);// 볼륨 조절(0~30)
      Serial.println(F("OK:MP3"));
    }
    else {
      Serial.println(F("ERROR:UNKNOWN_TARGET"));
    }
  }
  
  // [명령 2] 센서 값 요청 (GET)
  else if (strcmp(action, "GET") == 0) {
    if (strcmp(target, "DHT") == 0) {
      float h = dht.readHumidity();
      float t = dht.readTemperature();
      if (isnan(h) || isnan(t)) Serial.println(F("ERROR:DHT_FAIL"));
      else {
        Serial.print(F("RES,DHT,"));
        Serial.print(t); Serial.print(F(",")); Serial.println(h);
      }
    }
    else if (strcmp(target, "US") == 0) {
      digitalWrite(PIN_US_TRIG, LOW); delayMicroseconds(2);
      digitalWrite(PIN_US_TRIG, HIGH); delayMicroseconds(10);
      digitalWrite(PIN_US_TRIG, LOW);
      long duration = pulseIn(PIN_US_ECHO, HIGH, 30000); // 30ms 타임아웃
      long distance = duration * 0.034 / 2;
      Serial.print(F("RES,US,")); Serial.println(distance);
    }
    else if (strcmp(target, "LDR") == 0) {
      Serial.print(F("RES,LDR,")); Serial.println(analogRead(PIN_LDR));
    }
    else if (strcmp(target, "SOIL") == 0) {
      Serial.print(F("RES,SOIL,")); Serial.println(analogRead(PIN_SOIL));
    }
    else if (strcmp(target, "SW") == 0) {
      Serial.print(F("RES,SW,")); Serial.println(digitalRead(PIN_SW));
    }
    else {
      Serial.println(F("ERROR:UNKNOWN_TARGET"));
    }
  } 
  else {
    Serial.println(F("ERROR:UNKNOWN_ACTION"));
  }
}