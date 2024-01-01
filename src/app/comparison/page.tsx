"use client"

import React from 'react';
import { useAuthContext } from '../../auth/AuthContext';
import useLoginGuard from '@/auth/useLoginGuard';

const Comparison = () => {

  useLoginGuard();
  const { loading } = useAuthContext();

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