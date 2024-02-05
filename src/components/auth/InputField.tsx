import React from 'react'

type InputFieldProps = {
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  type: string,
  placeholder: string,
}

const InputField = ({ inputValue, setInputValue, type, placeholder}: InputFieldProps) => {
  return (
    <div className='w-full flex flex-col'>
      <label 
        htmlFor={type}
        className="mt-4"
      >
        {type}
      </label>
      <input
        id={type}
        type={type}
        placeholder={placeholder}
        className="bg-gray-100 rounded-md focus:outline-amber-500 p-2 mt-2"
        value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
    </div>
  )
}

export default InputField