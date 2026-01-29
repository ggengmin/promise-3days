# 프로젝트 구조 📁

```
promise-3days/
├── app/                          # Next.js 앱 라우터
│   ├── layout.tsx               # 루트 레이아웃 (Kakao SDK 로드)
│   ├── globals.css              # 글로벌 스타일
│   ├── page.tsx                 # 페이지 1: 인트로 (3초 후 자동 이동)
│   ├── promise/
│   │   └── page.tsx             # 페이지 2: 약속 작성
│   ├── share/
│   │   └── page.tsx             # 페이지 2.5: 카카오톡 공유
│   ├── confirm/
│   │   └── page.tsx             # 페이지 3: 선언벽 공개 동의
│   ├── complete/
│   │   └── page.tsx             # 페이지 4: 완료 메시지
│   ├── wall/
│   │   └── page.tsx             # 페이지 5: 선언벽 (드래그 가능)
│   └── friend/
│       └── [id]/
│           └── page.tsx         # 페이지 6: 친구 전용 (알림 구독)
│
├── lib/                          # 유틸리티 라이브러리
│   ├── firebase.ts              # Firebase 초기화 및 FCM
│   ├── firestore.ts             # Firestore CRUD 함수
│   └── kakao.ts                 # 카카오톡 공유 함수
│
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts             # 예약 알림 & 자동 삭제 함수
│   ├── package.json
│   └── tsconfig.json
│
├── public/                       # 정적 파일
│   └── firebase-messaging-sw.js # FCM 서비스 워커
│
├── .env.example                  # 환경 변수 예시
├── .gitignore
├── package.json                  # 프로젝트 의존성
├── tsconfig.json                 # TypeScript 설정
├── tailwind.config.js            # Tailwind 설정 (커스텀 컬러, 폰트)
├── postcss.config.js
├── next.config.js
├── firebase.json                 # Firebase 설정
├── vercel.json                   # Vercel 배포 설정
├── README.md                     # 프로젝트 설명
└── DEPLOYMENT.md                 # 배포 가이드
```

## 주요 파일 설명

### 📄 app/page.tsx (페이지 1)
- 인트로 페이지
- 3초 후 `/promise`로 자동 리다이렉트
- Framer Motion 애니메이션

### 📄 app/promise/page.tsx (페이지 2)
- 약속 작성 폼
- 이름 + 약속 내용 입력
- 2초 모달 (주변 사람들에게 공유 안내)
- sessionStorage에 저장 후 `/share`로 이동

### 📄 app/share/page.tsx (페이지 2.5)
- 카카오톡 링크 공유
- Firestore에 약속 저장
- 카카오톡 SDK로 링크 공유
- "나만 알래요" 옵션

### 📄 app/confirm/page.tsx (페이지 3)
- 선언벽 공개 동의
- "네, 좋아요" → isPublic: true
- "나만 알래요" → isPublic: false

### 📄 app/complete/page.tsx (페이지 4)
- 완료 메시지
- "선언벽 구경가기" 버튼

### 📄 app/wall/page.tsx (페이지 5)
- 공개된 약속들 표시
- Framer Motion으로 드래그 가능
- 화면 밖으로 안 나가도록 제한
- 24시간 지난 약속은 자동 삭제됨

### 📄 app/friend/[id]/page.tsx (페이지 6)
- 친구 전용 페이지
- 약속 내용 + 작성자 표시
- "알림 받기" 버튼 → FCM 토큰 생성
- 알림 권한 요청
- Firestore에 FCM 토큰 저장

### 📄 lib/firebase.ts
- Firebase 초기화
- FCM 권한 요청 함수
- 메시지 리스너 설정

### 📄 lib/firestore.ts
- Promise 인터페이스 정의
- CRUD 함수들:
  - `createPromise`: 새 약속 생성
  - `getPromiseById`: 약속 조회
  - `addFCMToken`: FCM 토큰 추가
  - `getPublicPromises`: 공개 약속 목록
  - `deleteOldPromises`: 24시간 지난 약속 삭제

### 📄 lib/kakao.ts
- Kakao SDK 초기화
- `shareToKakao`: 카카오톡 링크 공유 함수

### 📄 functions/src/index.ts
- `checkAndSendNotifications`: 매 시간마다 실행
  - 3일이 지난 약속 확인
  - FCM으로 푸시 알림 발송
- `cleanupOldPromises`: 매일 실행
  - 24시간 지난 공개 약속 삭제
- `triggerNotificationCheck`: 수동 테스트용 HTTP 함수

### 📄 public/firebase-messaging-sw.js
- FCM 서비스 워커
- 백그라운드 알림 수신
- 알림 클릭 핸들러

## 데이터 플로우

### 약속 생성 플로우
```
1. 사용자가 약속 작성
   ↓
2. sessionStorage에 임시 저장
   ↓
3. 카카오톡 공유 선택
   ↓
4. Firestore에 약속 저장 (isPublic: false)
   ↓
5. 카카오톡 링크 생성 및 공유
   ↓
6. 선언벽 공개 동의
   ↓
7. isPublic 업데이트 (선택적)
```

### 알림 구독 플로우
```
1. 친구가 링크 클릭 (/friend/[id])
   ↓
2. Firestore에서 약속 조회
   ↓
3. "알림 받기" 클릭
   ↓
4. 브라우저 알림 권한 요청
   ↓
5. FCM 토큰 생성
   ↓
6. Firestore의 fcmTokens 배열에 추가
   ↓
7. 3일 후 Cloud Functions가 알림 발송
```

## Firestore 데이터 구조

### promises 컬렉션
```typescript
{
  content: string              // 약속 내용
  creatorName: string          // 작성자 이름
  isPublic: boolean            // 선언벽 공개 여부
  createdAt: Timestamp         // 생성 시간
  notificationDate: Timestamp  // 알림 발송 시간 (3일 후)
  fcmTokens: string[]          // 구독한 친구들의 FCM 토큰
  status: 'pending' | 'notified' | 'completed'
}
```

## 환경 변수

### Frontend (.env.local)
- `NEXT_PUBLIC_FIREBASE_*`: Firebase 설정
- `NEXT_PUBLIC_FIREBASE_VAPID_KEY`: FCM VAPID 키
- `NEXT_PUBLIC_KAKAO_APP_KEY`: Kakao JavaScript 키
- `NEXT_PUBLIC_SITE_URL`: 사이트 URL

### Backend (Firebase Functions)
- Firebase Admin SDK는 자동으로 인증됨
- 추가 환경 변수 불필요

## 배포 환경

### Development
- URL: `http://localhost:3000`
- Firebase Emulator (선택적)

### Production
- Frontend: Vercel (`https://promise-3days.vercel.app`)
- Backend: Firebase Cloud Functions
- Database: Firestore
- Messaging: FCM
