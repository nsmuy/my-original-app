import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-xl text-center">
        <h1 className="text-4xl font-medium text-orange-400">MY FOUNDATION FINDER</h1>
        <p className="mt-2">
          特徴を比較して<br />自分にピッタリのファンデーションを見つけよう！
        </p>
      </div>

      <div className="flex gap-4 mt-6">

        <div className="flex flex-col items-center gap-2 rounded-md bg-white shadow-md p-4">
          <p>新規会員登録</p>
          <hr />
          <Link
            href={"/signup"}
            className="bg-orange-400 px-4 py-2 text-white rounded-md"
            >
            新規会員登録
          </Link>
        </div>

        <div className="flex flex-col items-center gap-2 rounded-md bg-white shadow-md p-4">
          <p>ログイン</p>
          <Link href={"/login"} className="bg-orange-400 px-4 py-2 text-white rounded-md">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
