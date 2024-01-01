export type UserProfile = {
  id: string,
  nickname: string,
  age: '' | '0-19' | '20-29' | '30-39' | '40-49' | '50-59' | '60+',
  gender: '' | 'male' | 'female' | 'other',
  skinType: '' | 'normal' | 'dry' | 'combination' | 'oily' | 'sensitive' | 'atopic',
}