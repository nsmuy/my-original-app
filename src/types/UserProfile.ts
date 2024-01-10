export type UserProfile = {
  id: string,
  nickname: string,
  age: '' | '～10代' | '20代' | '30代' | '40代' | '50代' | '60代～',
  gender: '' | '男性' | '女性' | 'その他',
  skinType: '' | '普通肌' | '乾燥肌' | '混合肌' | '脂性肌' | '敏感肌' | 'アトピー肌',
  icon: string,
}