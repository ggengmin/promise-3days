'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getPublicPromises } from '@/lib/firestore';
import type { PromiseData } from '@/lib/firestore';

interface FloatingPromise extends PromiseData {
  x: number;
  y: number;
  rotation: number;
}

export default function WallPage() {
  const router = useRouter();
  const [promises, setPromises] = useState<FloatingPromise[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    loadPromises();
  }, []);

const loadPromises = async () => {
  try {
    const publicPromises = await getPublicPromises();
    
    // Assign random positions and rotations
    const floatingPromises = publicPromises.map((promise: PromiseData) => ({
      ...promise,
      x: Math.random() * (window.innerWidth - 200),
      y: Math.random() * (window.innerHeight - 200) + 100,
      rotation: Math.random() * 20 - 10,
    }));

    setPromises(floatingPromises);
  } catch (error) {
    console.error('Error loading promises:', error);
  }
};

  const handleDrag = (id: string, x: number, y: number) => {
    setPromises((prev) =>
      prev.map((p) => (p.id === id ? { ...p, x, y } : p))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-burgundy-light/20 to-white overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-10 py-6 px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-myeongjo text-3xl mb-1">
              <span className="text-burgundy">약속</span> 선언벽
            </h1>
            <p className="font-serif text-sm text-gray-600">
              다른 사람들의 약속을 구경해보세요
            </p>
          </div>
          <button
            onClick={() => router.push('/promise')}
            className="px-6 py-3 bg-burgundy text-white font-serif rounded-full hover:bg-burgundy-dark transition-all"
          >
            내 약속 선언하기
          </button>
        </div>
      </div>

      {/* Floating Promises */}
      <div className="pt-32 pb-12 px-6 relative min-h-screen">
        {promises.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="font-serif text-xl text-gray-400 mb-4">
                아직 선언된 약속이 없어요 😢
              </p>
              <button
                onClick={() => router.push('/promise')}
                className="px-8 py-3 bg-burgundy text-white font-serif rounded-full hover:bg-burgundy-dark transition-all"
              >
                첫 약속 선언하기
              </button>
            </motion.div>
          </div>
        ) : (
          promises.map((promise, index) => (
            <motion.div
              key={promise.id}
              drag
              dragMomentum={false}
              dragElastic={0.1}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{
                position: 'absolute',
                left: promise.x,
                top: promise.y,
                rotate: promise.rotation,
              }}
              onDrag={(e, info) => {
                const newX = Math.max(
                  0,
                  Math.min(window.innerWidth - 200, promise.x + info.delta.x)
                );
                const newY = Math.max(
                  100,
                  Math.min(window.innerHeight - 200, promise.y + info.delta.y)
                );
                handleDrag(promise.id!, newX, newY);
              }}
              className="cursor-move"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 w-48 border-2 border-gray-100 hover:shadow-xl transition-shadow">
                <p className="font-hand text-lg text-gray-800 mb-3 leading-relaxed">
                  {promise.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 font-serif">
                  <span className="text-burgundy">🤝</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
        <p className="font-serif text-sm text-gray-600">
          💡 약속들을 드래그해서 움직여보세요!
        </p>
      </div>
    </div>
  );
}
