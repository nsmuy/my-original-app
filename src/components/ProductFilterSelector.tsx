import React from 'react'

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

  const handleFiltersChange = (
    category: 'brands' | 'types',
    value: string,
    checked: boolean
  ) => {
    setCheckedFilters(prevState => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [value]: checked
      }
    }));
  }

  return (
    <div>
      <form>
        {/* ブランド選択 */}
        <h3 className='mt-4'>ブランドを選択</h3>
        <input
          id="dior"
          type="checkbox"
          checked={checkedFilters.brands.dior}
          onChange={(e) =>handleFiltersChange('brands', 'dior', e.target.checked)}
        />
        <label htmlFor="dior">DIOR</label>

        <input
          id="shiseido"
          type="checkbox"
          checked={checkedFilters.brands.shiseido}
          onChange={(e) =>handleFiltersChange('brands', 'shiseido', e.target.checked)}
        />
        <label htmlFor="dior">SHISEIDO</label>

        <input
          id="nars"
          type="checkbox"
          checked={checkedFilters.brands.nars}
          onChange={(e) =>handleFiltersChange('brands', 'nars', e.target.checked)}
        />
        <label htmlFor="nars">NARS</label>

        <input
          id="albion"
          type="checkbox"
          checked={checkedFilters.brands.albion}
          onChange={(e) =>handleFiltersChange('brands', 'albion', e.target.checked)}
        />
        <label htmlFor="albion">ALBION</label>

        {/* ファンデーションタイプから選ぶ */}
        <h3 className='mt-4'>種別を選択</h3>
      
        <input
          id="liquid"
          type="checkbox"
          checked={checkedFilters.types.liquid}
          onChange={(e) =>handleFiltersChange('types', 'liquid', e.target.checked)}
        />
        <label htmlFor="liquid">リキッド</label>

        <input
          id="powder"
          type="checkbox"
          checked={checkedFilters.types.powder}
          onChange={(e) =>handleFiltersChange('types', 'powder', e.target.checked)}
        />
        <label htmlFor="powder">パウダー</label>

        <input
          id="cream"
          type="checkbox"
          checked={checkedFilters.types.cream}
          onChange={(e) =>handleFiltersChange('types', 'cream', e.target.checked)}
        />
        <label htmlFor="cream">クリーム</label>

        <input
          id="cushion"
          type="checkbox"
          checked={checkedFilters.types.cushion}
          onChange={(e) =>handleFiltersChange('types', 'cushion', e.target.checked)}
        />
        <label htmlFor="cushion">クッション</label>

      </form>
    </div>
  )
}

export default ProductFilterSelector