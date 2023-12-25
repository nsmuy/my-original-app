import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl text-center">
        特徴を比較して、
        <br />
        自分にピッタリのファンデーションを見つけよう！
      </h1>

      <div className="flex gap-4 mt-6">
        <div className="flex flex-col items-center gap-2 border border-gray-700 p-4 rounded-md">
          <p>登録がまだの方はこちら</p>
          <Link href={"/signup"} className="bg-gray-700 px-4 py-2 text-white rounded-md">
            新規登録
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2 border border-gray-700 p-4 rounded-md">
          <p>ご登録がお済みの方はこちら</p>
          <Link href={"/login"} className="bg-gray-700 px-4 py-2 text-white rounded-md">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
