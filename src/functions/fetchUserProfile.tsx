import { db } from '@/app/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserProfileType } from '@/types/UserProfile';

export const fetchUserProfile = async ( userId: string ) => {

  if(!userId) return;

  const userProfileRef = doc(db, 'userProfiles', userId);
  const snapshot = await getDoc(userProfileRef);

  // 登録があれば、userProfileを返す
  // 登録がなければ、userIdを持つ空のuserProfileを作成
  if (snapshot.exists()) {
    return snapshot.data() as UserProfileType;
  } else {
    return {
      id: userId,
      nickname: "",
      age: "",
      gender: "",
      skinType: "",
      icon: "",
    } as UserProfileType;
  }
}