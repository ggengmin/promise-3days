declare global {
  interface Window {
    Kakao: any;
  }
}

export const initKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY);
    console.log('✅ 카카오 SDK 초기화 완료');
  }
};

export const shareToKakao = (promiseId: string, content: string, creatorName: string) => {
  if (typeof window === 'undefined' || !window.Kakao) {
    alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    return;
  }

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/friend/${promiseId}`;

  console.log('✅ 카카오톡 공유 시작');
  console.log('Promise ID:', promiseId);
  console.log('Content:', content);
  console.log('Share URL:', shareUrl);

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: '너, 약속 지켰어? 🤨',
      description: `${creatorName}가 3일 약속을 공유했어!\n"${content}"\n\n3일 후 지켰는지 확인해줘!`,
      imageUrl: 'https://via.placeholder.com/1x1/FFFFFF/FFFFFF',
      imageWidth: 1,
      imageHeight: 1,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
    },
    buttons: [
      {
        title: '👇 여기 눌러서 알림 받기',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
    ],
  });

  console.log('✅ 카카오톡 공유 요청 완료');
};