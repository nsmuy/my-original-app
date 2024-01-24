import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const fetchDownloadURL = async (uploadIcon, userId, currentIcon) => {
  // アイコンが登録されている場合、一度Firebase Strageにアップロードし公開URLを取得
  if (uploadIcon !== undefined && uploadIcon !== null) {
    const storage = getStorage();
    const iconRef = ref(storage, `userIcons/userIcon_${userId}`);
    await uploadBytes(iconRef, uploadIcon);
    return getDownloadURL(iconRef);
  } else {
    // アイコンが登録されていない場合、デフォルトの画像を使用
    if(currentIcon) {
      return currentIcon;
    } else {
      const storage = getStorage();
      const defaultIconRef = ref(storage, `userIcons/userIcon_default.png`);
      return getDownloadURL(defaultIconRef);
    }
  }
}

// 画像を状態関数にセットし、プレビューを表示する関数
export const updateAndPreviewFile = (e, setUploadIcon) => {
  setUploadIcon(e.target.files[0]);

  for (let i = 0; i < e.target.files.length; i++) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const previewElement = document.getElementById("preview");
      if (previewElement) {
        previewElement.innerHTML = '<img src="' + e.target.result + '">';
      }
    };
    fileReader.readAsDataURL(e.target.files[i]);
  }
};