import React from 'react'
import { UserProfile } from '@/types/UserProfile';

type SkinTypeRadioButtonProps = {
  skinType: {label: string, value: string}
  inputUserProfile: Omit<UserProfile, 'id'>
  setInputUserProfile: React.Dispatch<React.SetStateAction<Omit<UserProfile, 'id'>>>
}

const SkinTypeRadioButton = ({skinType, inputUserProfile, setInputUserProfile}: SkinTypeRadioButtonProps) => {
  return (
    <div>
      <input
        type="radio"
        id={skinType.label}
        name="skinType"
        value={skinType.value}
        checked={inputUserProfile?.skinType === skinType.value}
        onChange={() => setInputUserProfile({ ...inputUserProfile, skinType: skinType.value as UserProfile['skinType'] })}
      />
      <label htmlFor={skinType.label} className='ml-2'>{skinType.value}</label>
    </div>
  )
}

export default SkinTypeRadioButton