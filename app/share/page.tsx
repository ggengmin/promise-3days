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
    // 카카오톡 공유만 실행 (페이지 이동 X)
    shareToKakao(promiseId, promise, creatorName);

    // 공유 후 바로 confirm으로 이동하지 말고
    // 사용자가 공유를 완료하면 수동으로 이동하도록 변경
  };
  const handleNext = () => {
    // 공유 완료 후 또는 스킵 시 다음 페이지로
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
        <p className="font-serif text-center text-gray-600 mb-8">
          친구에게 약속을 공유해보세요!
          <br />
        </p>
        <div className="space-y-4">
          <button
            onClick={handleKakaoShare}
            disabled={isSharing || !promiseId}
            className="w-full py-4 bg-[
#FEE500] text-[
#000000] font-myeongjo text-lg rounded-full hover:bg-[
#FDD835] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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