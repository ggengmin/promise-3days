'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { initKakao, shareToKakao } from '@/lib/kakao';
import { createPromise } from '@/lib/firestore';

export default function SharePage() {
  const router = useRouter();
  const [promise, setPromise] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [promiseId, setPromiseId] = useState('');
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const savedPromise = sessionStorage.getItem('promise');
    const savedName = sessionStorage.getItem('creatorName');
    
    if (!savedPromise || !savedName) {
      router.push('/promise');
      return;
    }

    setPromise(savedPromise);
    setCreatorName(savedName);
    initKakao();

    // 페이지 로드 시 Promise 생성
    const initializePromise = async () => {
      const id = await createPromise(savedPromise, savedName, false);
      setPromiseId(id);
      sessionStorage.setItem('promiseId', id);
    };
    
    initializePromise();
  }, [router]);

  const handleKakaoShare = () => {
    if (!promiseId) {
      alert('잠시만 기다려주세요...');
      return;
    }

    // 🔍 디버깅: 생성된 링크 확인
    const shareUrl = `https://promise-3days.vercel.app/friend/${promiseId}`;
    alert(`공유할 링크:\n${shareUrl}\n\n이 링크가 맞는지 확인해주세요!`);

    // 카카오톡 공유만 실행
    shareToKakao(promiseId, promise, creatorName);
  };

  const handleNext = () => {
    router.push('/confirm');
  };

  const handleSkip = () => {
    router.push('/confirm');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <h1 className="font-myeongjo text-4xl md:text-5xl text-center mb-8">
          너, <span className="text-burgundy">약속</span> 지켰어?
        </h1>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <p className="font-hand text-2xl text-center text-gray-800">
            "{promise}"
          </p>
        </div>

        {/* 🔍 디버깅: Promise ID 표시 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-xs">
          <p className="font-mono">Debug Info:</p>
          <p className="font-mono">Promise ID: {promiseId || '로딩중...'}</p>
          <p className="font-mono">Link: https://promise-3days.vercel.app/friend/{promiseId}</p>
        </div>

        <p className="font-serif text-center text-gray-600 mb-8">
          친구에게 약속을 공유해보세요!
          <br />
        </p>

        <div className="space-y-4">
          <button
            onClick={handleKakaoShare}
            disabled={isSharing || !promiseId}
            className="w-full py-4 bg-[#FEE500] text-[#000000] font-myeongjo text-lg rounded-full hover:bg-[#FDD835] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="text-2xl">💬</span>
            카카오톡으로 공유하기
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-4 bg-gray-100 text-gray-600 font-serif rounded-full hover:bg-gray-200 transition-all"
          >
            다음으로
          </button>
        </div>
      </motion.div>
    </div>
  );
}