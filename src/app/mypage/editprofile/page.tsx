"use client";

import React, { useState, useEffect } from "react";
import { UserProfileType } from "@/types/UserProfile";
import useLoginGuard from "@/auth/useLoginGuard";
import { app, db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ageOptions, skinTypeOptions } from "@/constants/userData";
import UserProfileOptionButton from "@/components/mypage/UserProfileOptionButton";
import { fetchDownloadURL, updateAndPreviewFile } from "@/functions/uploadAndPreviewIcon";
import defaultIcon from "@/assets/userIcon_default.png";
import Image from "next/image";
import { useAuthContext } from "@/auth/AuthContext";
import { fetchUserProfile } from "@/functions/fetchUserProfile";

const EditProfile = () => {
  useLoginGuard();
  const router = useRouter();
  const auth = getAuth(app);
  const { user } = useAuthContext();

  // 元のプロフィールを保持する状態変数
  const [originalProfile, setOriginalProfile] = useState<UserProfileType | undefined>(undefined);

  // 編集したプロフィールを保持する状態変数
  const [editedProfile, setEditedProfile] = useState<UserProfileType>({
    id: "",
    nickname: "",
    age: "",
    gender: "",
    skinType: "",
    icon: "",
  });

  // アイコンをアップロードする状態変数
  const [uploadIcon, setUploadIcon] = useState<File | undefined>(undefined);

  // Firebaseからログインしているユーザープロフィールを取得
  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    } else {
      const userId = auth.currentUser.uid;
      const loadUserProfile = async () => {
        const userProfile = await fetchUserProfile(userId);
        if (userProfile) {
          setOriginalProfile(userProfile);
          setEditedProfile(userProfile);
        }
      };
      loadUserProfile();
    }
  }, [auth.currentUser, router]);

  // ユーザープロフィールを更新
  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user && editedProfile) {
      const newIconUrl = await fetchDownloadURL(uploadIcon, user, editedProfile.icon);

      const userProfileRef = doc(db, "userProfiles", editedProfile.id);

      try {
        await updateDoc(userProfileRef, {
          ...editedProfile,
          icon: newIconUrl,
        });

        const userProfileStateRef = doc(db, "userProfileState", editedProfile.id);
        await updateDoc(userProfileStateRef, { isFirstVisit: false, isRegistered: true });

      } catch (error) {
        alert("プロフィールの更新に失敗しました");
      }
      router.push("/mypage");
    }
  };

  return (
    <div className="mt-8">
      <div className="inner">
        <h2 className="font-bold border-b border-amber-200">プロフィール編集</h2>

        {editedProfile && (
          <form onSubmit={handleEditProfile}>
            <div className="mt-4">
              <label htmlFor="nickname" className="mb-2 font-bold block">
                ニックネーム
              </label>
              <input id="nickname" type="text" placeholder="ニックネーム" className="bg-white border rounded-md focus:outline-amber-500 px-2 py-1 w-80" value={editedProfile?.nickname || ""} onChange={(e) => setEditedProfile({ ...editedProfile, nickname: e.target.value })} />
            </div>

            <div className="mt-4">
              <label htmlFor="icon" className="mb-2 font-bold block">
                アイコン
              </label>
              <input
                type="file"
                id="icon"
                accept="image/*" //画像ファイルだけ受け付ける
                onChange={(e) => updateAndPreviewFile(e, setUploadIcon)}
              />
              <div id="preview" className="w-40 h-40 border border-amber-500 rounded-full overflow-hidden">
                <Image src={editedProfile?.icon || defaultIcon} alt="初期画像" width={100} height={100} style={{ objectFit: "cover" }} priority></Image>
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 font-bold">年齢層</p>
              {ageOptions.map((option) => (
                <div key={`age_${option.value}`} className="inline-block mr-4">
                  <UserProfileOptionButton option={option} name="age" inputUserProfile={editedProfile} setInputUserProfile={setEditedProfile} />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <p className="mb-2 font-bold">肌タイプ</p>
              {skinTypeOptions.map((option) => (
                <div key={`skinType_${option.value}`} className="inline-block mr-4">
                  <UserProfileOptionButton option={option} name="skinType" inputUserProfile={editedProfile} setInputUserProfile={setEditedProfile} />
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-4">
              <button type="button" onClick={() => router.push("/mypage")} className="bg-gray-500 text-white rounded-md font-bold px-4 py-2">
                戻る
              </button>

              <button type="submit" className="bg-amber-500 text-white rounded-md font-bold px-4 py-2">
                更新
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
