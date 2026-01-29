'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPromiseById, addFCMToken } from '@/lib/firestore';
import { requestNotificationPermission } from '@/lib/firebase';
import type { PromiseData } from '@/lib/firestore';

export default function FriendPage() {
  const params = useParams();
  const router = useRouter();
  const promiseId = params.id as string;
  
  const [promise, setPromise] = useState<PromiseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (promiseId) {
      loadPromise();
    }
  }, [promiseId]);

  const loadPromise = async () => {
    try {
      const data = await getPromiseById(promiseId);
      setPromise(data);
    } catch (error) {
      console.error('Error loading promise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const token = await requestNotificationPermission();
      
      if (token) {
        await addFCMToken(promiseId, token);
        setSubscribed(true);
      } else {
        alert('알림 권한이 필요합니다. 브라우저 설정에서 알림을 허용해주세요.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('알림 설정 중 오류가 발생했습니다.');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="font-serif text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!promise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center">
          <p className="font-serif text-xl text-gray-400 mb-6">
            약속을 찾을 수 없습니다 😢
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-burgundy text-white font-serif rounded-full"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  const notificationDate = new Date(promise.notificationDate.seconds * 1000);
  const formattedDate = `${notificationDate.getMonth() + 1}월 ${notificationDate.getDate()}일`;

  if (subscribed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <div className="text-6xl mb-6">✅</div>
          <h1 className="font-myeongjo text-3xl mb-4">
            알림 설정 완료!
          </h1>
          <p className="font-serif text-gray-600 mb-8">
            3일 후 ({formattedDate})에
            <br />
            {promise.creatorName}의 약속을 확인하라는
            <br />
            알림을 보내드릴게요!
          </p>
          <button
            onClick={() => router.push('/wall')}
            className="px-8 py-3 bg-burgundy text-white font-serif rounded-full hover:bg-burgundy-dark transition-all"
          >
            선언벽 구경가기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <h1 className="font-myeongjo text-4xl md:text-5xl text-center mb-12">
          너, <span className="text-burgundy">약속</span> 지켰어? 🤨
        </h1>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="font-serif text-lg mb-4">
              <span className="text-burgundy font-bold">{promise.creatorName}</span>가
              <br />
              너에게 약속을 공유했어!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 rounded-2xl p-6"
          >
            <p className="font-hand text-2xl text-center text-gray-800">
              "{promise.content}"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-2"
          >
            <p className="font-serif text-lg">
              📅 3일 후: <span className="text-burgundy font-bold">{formattedDate}</span>
            </p>
            <p className="font-serif text-gray-600">
              그때 지켰는지 확인하려면?
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleSubscribe}
            disabled={subscribing}
            className="w-full py-4 bg-burgundy text-white font-myeongjo text-lg rounded-full hover:bg-burgundy-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">🔔</span>
            {subscribing ? '설정 중...' : '알림 받기'}
          </motion.button>

          <p className="font-serif text-xs text-center text-gray-500">
            딱 한 번만 누르면 돼!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
