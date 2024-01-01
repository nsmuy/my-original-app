import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from './AuthContext';

//ログインしていない場合はログインページに遷移
const useLoginGuard = () => {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

};

export default useLoginGuard;
