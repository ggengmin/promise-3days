# 배포 가이드 📦

## 1️⃣ Firebase 프로젝트 설정

### Firebase Console 설정
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **Firestore Database** 활성화
   - 프로덕션 모드로 시작
   - 위치: `asia-northeast3` (Seoul) 권장
4. **Cloud Messaging** 활성화
   - 프로젝트 설정 > 클라우드 메시징
   - 웹 푸시 인증서(VAPID) 생성
5. **Authentication** (선택사항)
   - 필요시 익명 인증 활성화

### Firestore 보안 규칙
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /promises/{promiseId} {
      // 모두가 읽기 가능
      allow read: if true;
      // 모두가 생성 가능
      allow create: if true;
      // FCM 토큰 추가를 위한 업데이트 허용
      allow update: if true;
    }
  }
}
```

### Firebase Functions 설정
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화 (이미 파일이 있으므로 스킵 가능)
# firebase init

# Functions 배포
cd functions
npm install
npm run deploy
```

---

## 2️⃣ Kakao Developers 설정

### 앱 생성 및 설정
1. [Kakao Developers](https://developers.kakao.com/) 로그인
2. **내 애플리케이션** > **애플리케이션 추가하기**
3. 앱 정보 입력 후 생성

### 플랫폼 등록
1. 앱 선택 > **플랫폼** > **Web 플랫폼 등록**
2. 사이트 도메인 등록:
   - 개발: `http://localhost:3000`
   - 배포: `https://promise-3days.vercel.app`

### JavaScript 키 확인
1. **앱 키** 메뉴에서 **JavaScript 키** 복사
2. `.env.local`에 추가

### 카카오 로그인 (선택사항)
현재는 로그인 없이 공유만 사용하므로 설정 불필요

---

## 3️⃣ 환경 변수 설정

### 로컬 개발 (.env.local)
```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BHr5...

# Kakao
NEXT_PUBLIC_KAKAO_APP_KEY=your_javascript_key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Service Worker 설정
`public/firebase-messaging-sw.js` 파일 수정:
```javascript
firebase.initializeApp({
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID"
});
```

---

## 4️⃣ Vercel 배포

### 방법 1: Vercel CLI (추천)
```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포 (첫 배포)
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 2: GitHub 연동
1. GitHub에 저장소 생성 및 푸시
2. [Vercel Dashboard](https://vercel.com/dashboard)에서 **New Project**
3. GitHub 저장소 선택
4. 환경 변수 추가 (아래 참조)
5. **Deploy** 클릭

### Vercel 환경 변수 설정
Vercel Dashboard > Project > Settings > Environment Variables

모든 `NEXT_PUBLIC_*` 환경 변수를 추가:
- Environment: Production, Preview, Development 모두 체크
- 값은 `.env.local`과 동일하게 설정
- **주의**: `NEXT_PUBLIC_SITE_URL`은 `https://promise-3days.vercel.app`로 변경

### Vercel 도메인 확인
배포 후 Vercel이 제공하는 도메인 확인:
- `https://promise-3days.vercel.app`
- 또는 커스텀 도메인 설정

---

## 5️⃣ 배포 후 확인사항

### ✅ 체크리스트
- [ ] Firebase 프로젝트 생성 및 설정
- [ ] Firestore 보안 규칙 설정
- [ ] Cloud Functions 배포
- [ ] FCM VAPID 키 발급
- [ ] Service Worker 파일 수정
- [ ] Kakao JavaScript 키 발급
- [ ] Kakao 플랫폼 도메인 등록
- [ ] Vercel 환경 변수 설정
- [ ] Vercel 배포 완료
- [ ] 푸시 알림 테스트
- [ ] 카카오톡 공유 테스트

### 테스트 시나리오
1. 약속 작성 페이지 접속
2. 약속 입력 후 카카오톡 공유
3. 친구 페이지에서 알림 권한 허용
4. Firebase Console에서 Firestore 데이터 확인
5. Cloud Functions 로그 확인

---

## 6️⃣ 도메인 설정 (선택사항)

### 커스텀 도메인 연결
1. Vercel Dashboard > Project > Settings > Domains
2. 도메인 입력 (예: `promise.yourdomain.com`)
3. DNS 설정 (제공된 CNAME 레코드 추가)
4. Kakao Developers에서 새 도메인 추가
5. 환경 변수 업데이트

---

## 🔧 트러블슈팅

### Firebase Functions 오류
```bash
# 로그 확인
firebase functions:log

# 특정 함수 로그
firebase functions:log --only checkAndSendNotifications
```

### 푸시 알림 테스트
```bash
# HTTP 엔드포인트로 수동 실행
curl https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/triggerNotificationCheck
```

### Vercel 빌드 실패
- Node.js 버전 확인 (18 권장)
- 환경 변수 누락 확인
- `package.json` 의존성 확인

---

## 📞 도움이 필요하면

1. Firebase Console 로그 확인
2. Vercel 빌드 로그 확인
3. 브라우저 개발자 도구 콘솔 확인
4. README.md 참조

Happy Deploying! 🚀
