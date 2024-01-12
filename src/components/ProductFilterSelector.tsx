import React from 'react'
import { allBrands, allTypes } from '@/constants/productData';

const ProductFilterSelector = ({ checkedFilters, setCheckedFilters} : {
  checkedFilters: {
    brands: { [key: string]: boolean };
    types: { [key: string]: boolean };
  },
  setCheckedFilters: React.Dispatch<React.SetStateAction<{
    brands: { [key: string]: boolean };
    types: { [key: string]: boolean };
  }>>
}) => {

  return (
    <div>
      <form>
        {/* ブランド選択 */}
        <h3 className='mt-4'>ブランドを選択</h3>

        {Object.entries(allBrands).map(([key, label]) => (
          <div key={key}>
            <input
              id={key}
              type="checkbox"
              checked={checkedFilters.brands[key]}
              onChange={(e) => {
                setCheckedFilters({
                  ...checkedFilters,
                  brands: {
                    ...checkedFilters.brands,
                    [key]: e.target.checked,
                  },
                });
              }}
            />
            <label htmlFor={key}>{label}</label>
          </div>
        ))}

        {/* ファンデーションタイプから選ぶ */}
        <h3 className='mt-4'>種別を選択</h3>

        {Object.entries(allTypes).map(([key, label]) => (
          <div key={key}>
            <input
              id={key}
              type="checkbox"
              checked={checkedFilters.types[key]}
              onChange={(e) => {
                setCheckedFilters({
                  ...checkedFilters,
                  types: {
                    ...checkedFilters.types,
                    [key]: e.target.checked,
                  },
                });
              }}
            />
            <label htmlFor={key}>{label}</label>
          </div>
        ))}

      </form>
    </div>
  )
}

export default ProductFilterSelector