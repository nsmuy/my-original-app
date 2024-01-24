"use client";

import React, { useState } from "react";
import { app } from "../firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const auth = getAuth(app);
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createUserWithEmailAndPassword(auth, inputEmail, inputPassword);
    router.push("/mypage");
  };

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-70%] bg-white flex flex-col items-center justify-center px-16 py-10 w-fit rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-amber-500">新規会員登録</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <label htmlFor="email" className="mt-4">
            email
          </label>
          <input id="email" type="email" placeholder="メールアドレス" className="bg-gray-100 rounded-md focus:outline-amber-500 p-2 mt-2" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} />
          <label htmlFor="password" className="mt-4">
            password
          </label>
          <input id="password" type="password" placeholder="パスワード" className="bg-gray-100 rounded-md focus:outline-amber-500 p-2 mt-2" value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} />

          <button type="submit" className="btn_bg-gradation text-white rounded-full w-[160px] h-[44px] text-xl font-bold letter-spacing-1 flex items-center justify-center self-center mt-6">
            SIGNUP
          </button>
        </form>

        <button onClick={() => router.push("/login")} className="mt-6 text-sky-500 font-bold border-b border-sky-500 hover:opacity-70">
          アカウントをお持ちの方はこちら
        </button>
      </div>
    </div>
  );
};

export default Signup;
