import React from 'react'
import { UserProfileType } from '@/types/UserProfile'

type UserProfileOptionButtonProps = {
  option: {label: string, value: string},
  name: 'age' | 'gender' | 'skinType',
  inputUserProfile: UserProfileType,
  setInputUserProfile: React.Dispatch<React.SetStateAction<UserProfileType>>
}

const UserProfileOptionButton = ({ option, name, inputUserProfile, setInputUserProfile }: UserProfileOptionButtonProps) => {
  return (
    <div>
      <input
        type="radio"
        id={option.label}
        name={name}
        value={option.value}
        checked={inputUserProfile[name] === option.value}
        onChange={(e) => setInputUserProfile({ ...inputUserProfile, [name]: e.target.value })}
      />
      <label htmlFor={option.label}>{option.label}</label>
    </div>
  );
};

export default UserProfileOptionButton