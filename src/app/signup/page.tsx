"use client";

import React, { useState } from 'react'
import { app } from "../firebase"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation";

const Signup = () => {

  const router = useRouter();
  const auth = getAuth(app);
  const [inputEmail, setInputEmail] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await createUserWithEmailAndPassword(auth, inputEmail, inputPassword)
    router.push("/mypage");
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className='text-2xl'>新規会員登録</h2>

      <form onSubmit={handleSubmit} className='flex flex-col'>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          type="email"
          placeholder="メールアドレス"
          className="border border-gray-300 p-2 m-2"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
        />
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          type="password"
          placeholder="パスワード"
          className="border border-gray-300 p-2 m-2"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />

        <button type="submit">登録する</button>
      </form>

        <button onClick={() => router.push("/login")} >登録している方はこちら</button>
        <button onClick={() => router.push("/")} >トップページに戻る</button>
    </div>
  )
}

export default Signup