'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PromisePage() {
  const router = useRouter();
  const [promise, setPromise] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [creatorName, setCreatorName] = useState('');

useEffect(() => {
  if (!hasShownModal && promise.length > 5) {
    setHasShownModal(true);
    setShowModal(true);
    
    setTimeout(() => {
      setShowModal(false);
    }, 2000);
  }
}, [promise, hasShownModal]);

  const handleNext = () => {
    if (promise.trim() && creatorName.trim()) {
      sessionStorage.setItem('promise', promise);
      sessionStorage.setItem('creatorName', creatorName);
      router.push('/share');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <h1 className="font-myeongjo text-4xl md:text-5xl text-center mb-8">
          너, <span className="text-burgundy">약속</span> 지켰어?
        </h1>

        <p className="font-serif text-center text-gray-600 mb-12">
          3일 뒤까지 네가 해낼 약속을
          <br />
          선언형으로 적는다.
        </p>

        <div className="space-y-6">
          <div>
            <label className="font-serif text-sm text-gray-600 block mb-2">
              너의 이름은?
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="예: 철수"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-serif focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>

          <div>
            <label className="font-serif text-sm text-gray-600 block mb-2">
              예) 블로그 1개 무조건 쓴다. 하루에 물 2L씩 먹는다
            </label>
            <textarea
              value={promise}
              onChange={(e) => setPromise(e.target.value)}
              placeholder="여기에 약속을 적어주세요..."
              className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-lg font-serif resize-none focus:outline-none focus:border-burgundy transition-colors"
            />
          </div>

          <button
            onClick={handleNext}
            disabled={!promise.trim() || !creatorName.trim()}
            className="w-full py-4 bg-burgundy-light text-burgundy font-myeongjo text-lg rounded-full hover:bg-burgundy hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            내 약속 알리러가기
          </button>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-6 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm text-center"
            >
              <p className="font-serif text-lg leading-relaxed">
                주변 사람들에게 공유하면,
                <br />
                <span className="text-burgundy font-bold">
                  약속을 지킬 확률이 높아집니다!
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}