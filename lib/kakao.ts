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

  const shareUrl = `https://promise-3days.vercel.app/friend/${promiseId}`;

  console.log('=== 카카오톡 공유 ===');
  console.log('URL:', shareUrl);

  try {
    window.Kakao.Share.sendDefault({
      objectType: 'text',
      text: `${creatorName}가 3일 약속을 공유했어!\n\n"${content}"\n\n3일 후 지켰는지 확인해줘!`,
      link: {
        mobileWebUrl: shareUrl,
        webUrl: shareUrl,
      },
      buttonTitle: '👇 여기 눌러서 알림 받기',
    });
    
    console.log('✅ 공유 완료');
  } catch (error) {
    console.error('❌ 공유 실패:', error);
    alert('카카오톡 공유에 실패했습니다.');
  }
};