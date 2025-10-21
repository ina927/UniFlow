'use client';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Landing Page</h1>
      <button
              type='button'
              className='pill-btn pill-secondary'
              onClick={() => router.push('/login')}
      > Log in</button>
    </div>
  );
}

