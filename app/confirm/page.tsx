'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPromiseById } from '@/lib/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ConfirmPage() {
  const router = useRouter();
  const [promise, setPromise] = useState('');
  const [promiseId, setPromiseId] = useState('');

  useEffect(() => {
    const savedPromise = sessionStorage.getItem('promise');
    const savedId = sessionStorage.getItem('promiseId');
    
    if (!savedPromise || !savedId) {
      router.push('/promise');
      return;
    }

    setPromise(savedPromise);
    setPromiseId(savedId);
  }, [router]);

  const handlePublic = async () => {
    try {
      // Update promise to be public
      await updateDoc(doc(db, 'promises', promiseId), {
        isPublic: true,
      });
      router.push('/complete');
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    }
  };

  const handlePrivate = () => {
    router.push('/complete');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <h1 className="font-myeongjo text-4xl md:text-5xl text-center mb-12">
          너, <span className="text-burgundy">약속</span> 지켰어?
        </h1>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-2xl p-6"
          >
            <p className="font-hand text-2xl text-center mb-4">
              "{promise}"
            </p>
            <p className="font-serif text-center text-gray-600">
              라는 약속을 선언하셨네요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-2"
          >
            <p className="font-serif text-lg">
              이 약속을 <span className="text-burgundy font-bold">선언벽</span>에 걸어도 될까요?
            </p>
            <p className="font-serif text-sm text-gray-500">
              약속 벽에 걸면, 모두가 내 약속을 볼 수 있습니다.
              <br />
              하루 뒤에 삭제됩니다.
            </p>
          </motion.div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handlePublic}
              className="flex-1 py-4 bg-burgundy-light text-burgundy font-myeongjo text-lg rounded-full hover:bg-burgundy hover:text-white transition-all"
            >
              네, 좋아요
            </button>
            <button
              onClick={handlePrivate}
              className="flex-1 py-4 bg-gray-100 text-gray-600 font-serif text-lg rounded-full hover:bg-gray-200 transition-all"
            >
              나만 알래요
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
