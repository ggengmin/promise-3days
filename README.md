# 너, 약속 지켰어? - 3일 약속 프로젝트

3일 뒤까지 지킬 약속을 선언하고 친구들과 공유하는 웹 애플리케이션입니다.

## 🚀 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend**: Firebase
  - Firestore (데이터베이스)
  - Cloud Functions (예약 알림)
  - Cloud Messaging (푸시 알림)
- **Deployment**: Vercel

## 📋 설치 및 실행

### 1. 환경 변수 설정

`.env.example` 파일을 `.env.local`로 복사하고 값을 채워주세요:

\`\`\`bash
cp .env.example .env.local
\`\`\`

필요한 환경 변수:
- Firebase 설정 값들
- Kakao JavaScript Key
- Site URL

### 2. Firebase 설정

#### Firestore 규칙 설정
Firebase Console > Firestore Database > 규칙에 다음을 추가:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /promises/{promiseId} {
      allow read: if true;
      allow create: if true;
      allow update: if true;
    }
  }
}
\`\`\`

#### FCM 설정
1. Firebase Console > 프로젝트 설정 > 클라우드 메시징
2. 웹 푸시 인증서 생성 (VAPID Key)
3. `.env.local`에 VAPID Key 추가

#### Service Worker 설정
`public/firebase-messaging-sw.js` 파일의 Firebase 설정을 본인의 프로젝트 설정으로 변경하세요.

### 3. Kakao Developers 설정

1. [Kakao Developers](https://developers.kakao.com/)에서 앱 생성
2. 플랫폼 > Web > 사이트 도메인 등록:
   - 개발: `http://localhost:3000`
   - 배포: `https://promise-3days.vercel.app`
3. JavaScript 키를 `.env.local`에 추가

### 4. 패키지 설치 및 실행

\`\`\`bash
# 프론트엔드 패키지 설치
npm install

# 개발 서버 실행
npm run dev
\`\`\`

http://localhost:3000 에서 확인

### 5. Firebase Functions 배포

\`\`\`bash
# Functions 디렉토리로 이동
cd functions

# 패키지 설치
npm install

# Firebase CLI 설치 (없는 경우)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# Functions 배포
npm run deploy
\`\`\`

## 📱 기능

### 페이지 구조
1. **인트로 페이지** (`/`): 3초 후 자동 이동
2. **약속 작성** (`/promise`): 약속 내용 입력
3. **공유 선택** (`/share`): 카카오톡 공유
4. **공개 동의** (`/confirm`): 선언벽 공개 여부
5. **완료 페이지** (`/complete`): 완료 메시지
6. **선언벽** (`/wall`): 다른 사람들의 약속 확인
7. **친구 페이지** (`/friend/[id]`): 알림 구독

### 주요 기능
- ✅ 약속 작성 및 저장
- ✅ 카카오톡 링크 공유
- ✅ 푸시 알림 구독
- ✅ 3일 후 자동 알림 발송
- ✅ 선언벽에서 약속 드래그
- ✅ 24시간 후 공개 약속 자동 삭제

## 🎨 디자인 컬러

- **화이트**: `#FFFFFF`
- **블랙**: `#1A1A1A`
- **버건디**: `#8B1E1E`
- **버건디 라이트**: `#FFE5E5`
- **그레이**: `#757575`

## 🚀 Vercel 배포

### 1. Vercel 프로젝트 생성

\`\`\`bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel
\`\`\`

### 2. 환경 변수 설정
Vercel Dashboard > Settings > Environment Variables에서 모든 환경 변수 추가

### 3. 빌드 설정
- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`

## 📝 Cloud Functions

### 자동 실행 Functions
- `checkAndSendNotifications`: 매 시간마다 실행, 알림 전송 체크
- `cleanupOldPromises`: 매일 실행, 24시간 지난 공개 약속 삭제

### 수동 테스트 Function
- `triggerNotificationCheck`: HTTP 엔드포인트로 수동 실행 가능

## 🔔 푸시 알림 흐름

1. 친구가 공유 링크 클릭
2. "알림 받기" 버튼 클릭
3. 브라우저 알림 권한 요청
4. FCM 토큰 생성 및 Firestore 저장
5. Cloud Functions가 3일 후 체크
6. FCM을 통해 푸시 알림 발송

## 🛠️ 트러블슈팅

### FCM 알림이 안 올 때
1. 브라우저 알림 권한 확인
2. Service Worker 등록 확인 (DevTools > Application > Service Workers)
3. FCM 토큰 생성 확인
4. Cloud Functions 로그 확인

### Kakao 공유가 안 될 때
1. Kakao Developers에서 도메인 등록 확인
2. JavaScript 키 확인
3. 브라우저 콘솔에서 Kakao SDK 로드 확인

## 📄 라이선스

MIT License
