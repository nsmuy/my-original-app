"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/UserProfile";
import { db } from "@/app/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useAuthContext } from "@/auth/AuthContext";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import defaultIcon from "@/assets/userIcon_default.png";
import Image from "next/image";
import { ageOptions, genderOptions, skinTypeOptions } from "@/constants/userData";
import UserProfileOptionButton from "./UserProfileOptionButton";

type RegisterUserProfileProps = {
  setIsFirstVisit: React.Dispatch<React.SetStateAction<boolean>>;
};

const RegisterUserProfile = ({ setIsFirstVisit }: RegisterUserProfileProps) => {
  const { user } = useAuthContext();
  const [uploadIcon, setUploadIcon] = useState<File>();
  const [inputUserProfile, setInputUserProfile] = useState<Omit<UserProfile, "id">>({
    nickname: "",
    age: "",
    gender: "",
    skinType: "",
    icon: "",
  });

  // firebaseにユーザープロフィールを保存
  const handleUserProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      let iconUrl: string = "";

      if (uploadIcon !== undefined && uploadIcon !== null) {
        // 公開URLを取得するために、一度Firebase Strageにアップロードする
        const storage = getStorage();
        const iconRef = ref(storage, `userIcons/userIcon_${user?.uid}`);
        await uploadBytes(iconRef, uploadIcon);
        iconUrl = await getDownloadURL(iconRef);
        setInputUserProfile({ ...inputUserProfile, icon: iconUrl });
      } else {
        const storage = getStorage();
        const defaultIconRef = ref(storage, `userIcons/userIcon_default.png`);
        console.log(defaultIconRef);
        iconUrl = await getDownloadURL(defaultIconRef);
        setInputUserProfile({ ...inputUserProfile, icon: iconUrl });
      }

      // idをセットしてuserProfileを更新
      const registrationUserProfile = { ...inputUserProfile, id: user.uid, icon: iconUrl };
      await setDoc(doc(db, "userProfiles", user.uid), registrationUserProfile);
      setInputUserProfile({ nickname: "", age: "", gender: "", skinType: "", icon: "" });
      setIsFirstVisit(false);
    }
  };

  // 画像を状態関数にセットし、プレビューを表示する関数
  const updateAndPreviewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadIcon(e.target.files![0]);

    for (let i = 0; i < e.target.files!.length; i++) {
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        const previewElement = document.getElementById("preview");
        if (previewElement) {
          previewElement.innerHTML = '<img src="' + e.target!.result + '">';
        }
      };
      fileReader.readAsDataURL(e.target.files![i]);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-6">
      <h3 className="text-amber-500 font-bold text-center border-b border-amber-200 pb-4">
        こんにちは！
        <br />
        まずはプロフィールを入力してください
      </h3>

      <form onSubmit={handleUserProfile} className="mt-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <label htmlFor="nickname" className="mb-2 text-amber-500">
              ニックネーム
            </label>
            <input type="text" id="nickname" value={inputUserProfile.nickname} onChange={(e) => setInputUserProfile({ ...inputUserProfile, nickname: e.target.value })} className="bg-amber-50 rounded-md focus:outline-amber-500 px-2 py-1 w-80" required />
          </div>

          <div>
            <label htmlFor="icon" className="text-amber-500">
              アイコン
            </label>
            <input
              type="file"
              id="icon"
              accept="image/*" //画像ファイルだけ受け付ける
              onChange={(e) => updateAndPreviewFile(e)}
            />
            <div id="preview" className="w-40 h-40 border border-amber-500 rounded-full overflow-hidden">
              <Image src={defaultIcon} alt="初期画像"></Image>
            </div>
          </div>

          <div>
            <p className="mb-2 text-amber-500">性別</p>
            {genderOptions.map((gender) => (
              <UserProfileOptionButton
                key={gender.label}
                option={gender}
                name="gender"
                inputUserProfile={inputUserProfile}
                setInputUserProfile={setInputUserProfile}
              />
            ))}
          </div>

          <div>
            <p className="mb-2 text-amber-500">年齢層</p>
            {ageOptions.map((age) => (
              <UserProfileOptionButton
                key={age.label}
                option={age}
                name="age"
                inputUserProfile={inputUserProfile}
                setInputUserProfile={setInputUserProfile}
              />
            ))}
          </div>

          <div>
            <p className="mb-2 text-amber-500">肌タイプ</p>
            {skinTypeOptions.map((skinType) => (
              <UserProfileOptionButton
                key={skinType.label}
                option={skinType}
                name="skinType"
                inputUserProfile={inputUserProfile}
                setInputUserProfile={setInputUserProfile}
              />
            ))}
          </div>

          <button type="submit" className="btn_bg-gradation text-white rounded-full w-[160px] h-[44px] text-xl font-bold letter-spacing-1 flex items-center justify-center self-center mt-6">
            登録
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterUserProfile;
