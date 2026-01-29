'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CompletePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="font-myeongjo text-4xl md:text-5xl mb-6">
            약속을 지킬 의지가
            <br />
            보이시군요!! 👍
          </h1>
          <p className="font-serif text-lg text-gray-600">
            3일 뒤, 다시 알림이 갈 예정입니다.
            <br />
            <span className="text-burgundy font-bold">꼭 해내시길 바랍니다.</span>
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => router.push('/wall')}
          className="w-full py-4 bg-burgundy text-white font-myeongjo text-lg rounded-full hover:bg-burgundy-dark transition-all"
        >
          선언벽 구경가기
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-serif text-sm text-gray-500 mt-6"
        >
          3일은 짧으면 짧지만, 어떤 일을 해내기엔 충분한 시간이기도 합니다.
          <br />
          작심삼일이 되지 말고, 서로 공유하며 약속을 지켜볼까요?
        </motion.p>
      </motion.div>
    </div>
  );
}
