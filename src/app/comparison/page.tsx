"use client"

import React, { useEffect } from 'react';
import { useRouter } from "next/navigation"
import { useAuthContext } from '../../auth/AuthContext';

const Comparison = () => {

  const router = useRouter();
  const { user, loading } = useAuthContext();

  // ユーザーがログインしていない場合、ログインページにリダイレクト
  useEffect(() => {
    if (!user && !loading) {
      router.push('/');
    }
  }, [user, router, loading]);

  if (loading) {
    return <div>ローディング中...</div>;
  }

  return (
    <div>
      <h2>比較ページ</h2>
    </div>
  )
}

export default Comparison