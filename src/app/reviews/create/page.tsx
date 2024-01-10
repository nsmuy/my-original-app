"use client"

import React, { useState } from 'react';
import { useAuthContext } from '../../../auth/AuthContext'
import { useRouter } from 'next/navigation';
import useLoginGuard from '@/auth/useLoginGuard';
import { Product } from '@/types/Product';
import ProductFiltersSelector from '@/components/ProductFilterSelector';
import FilteredProductsList from '@/components/FilteredProductsList';
import { Reviews } from '@/types/Reviews';
import { getAuth } from "firebase/auth";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"; 
import { db } from '@/app/firebase';
import { v4 as uuidv4 } from 'uuid';

const CreateReviews = () => {

  useLoginGuard();
  // const router = useRouter();
  const { loading } = useAuthContext();

  if (loading) {
    return <div>ローディング中...</div>;
  }

  const auth = getAuth();
  const user = auth.currentUser;

  // チェックボックスの状態を管理する状態変数
  const [checkedFilters, setCheckedFilters] = useState<{
    brands: { [key: string]: boolean };
    types: { [key: string]: boolean };
  }>({
    brands: {
      dior: false,
      shiseido: false,
      nars: false,
      albion: false,
    },
    types: {
      liquid: false,
      powder: false,
      cream: false,
      cushion: false,
    },
  });

  //比較するために選んだ商品を保存する状態変数
  const [selectedProducts, setSelectedProducts] = useState<
  Product[]>([]);

  const [reviews, setReviews] = useState<Reviews>({
    reviewId: "",
    productId: "",
    userId: "",
    luminosity: "",
    coverage: "",
    longevity: "",
    moisturizing: "",
    comments: "",
    sendAt: "",
  });

  const ratingOptions = {
    luminosity: [
      { label: "マット", value: "1" },
      { label: "セミマット", value: "2" },
      { label: "どちらでもない", value: "3" },
      { label: "セミツヤ", value: "4" },
      { label: "ツヤ", value: "5" }
    ],
    coverage: [
      { label: "ナチュラル", value: "1" },
      { label: "ややナチュラル", value: "2" },
      { label: "普通", value: "3" },
      { label: "カバー", value: "4" },
      { label: "ハイカバー", value: "5" }
    ],
    longevity: [
      { label: "崩れやすい", value: "1" },
      { label: "やや崩れやすい", value: "2" },
      { label: "普通", value: "3" },
      { label: "崩れにくい", value: "4" },
      { label: "非常に崩れにくい", value: "5" }
    ],
    moisturizing: [
      { label:"低い", value: "1" },
      { label:"やや低い", value: "2" },
      { label:"普通", value: "3" },
      { label:"やや高い", value: "4" },
      { label:"高い", value: "5" }
    ]
  }

  const handlePostReviews = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //重複をチェックする
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("userId", "==", user?.uid), where("productId", "==", selectedProducts[0].id));
    const querySnapshot = await getDocs(q);

    if(!querySnapshot.empty) {
      alert("口コミは一度しか書けません。");
      return;
    }

    await addDoc(collection(db, "reviews"), {
      ...reviews,
      reviewId: uuidv4(),
      productId: selectedProducts[0].id,
      userId: user?.uid,
      sendAt: new Date().toISOString(),
    });
  }

  return (
    <div>
      <h2>口コミしたい商品を選んでね！</h2>
      
      {/* 商品を絞り込み */}
      <ProductFiltersSelector
        checkedFilters={checkedFilters}
        setCheckedFilters={setCheckedFilters}
      />

      {/* フィルタリングした商品を表示 */}
      <FilteredProductsList
        checkedFilters={checkedFilters}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        singleSelectMode={true}
      />

      {selectedProducts.length > 0 && (
        <div>
          <h3>口コミ入力欄</h3>

          <form onSubmit={(e) => handlePostReviews(e)}>

            <div>
              <label>ツヤ感：</label>
                {ratingOptions.luminosity.map(option => (
                  <div key={option.value}>
                    <input
                      type="radio"
                      id={`luminosity_${option.value}`}
                      name="luminosity"
                      value={option.value}
                      onChange={(e) => setReviews({ ...reviews, luminosity: e.target.value })}
                      required
                    />
                    <label htmlFor={`luminosity_${option.value}`}>{option.label}</label>
                </div>
              ))}
            </div>

            <div>
              <label>カバー感：</label>
                {ratingOptions.coverage.map(option => (
                  <div key={option.value}>
                    <input
                      type="radio"
                      id={`coverage_${option.value}`}
                      name="coverage"
                      value={option.value}
                      onChange={(e) => setReviews({ ...reviews, coverage: e.target.value })}
                      required
                    />
                    <label htmlFor={`coverage_${option.value}`}>{option.label}</label>
                </div>
              ))}
            </div>

            <div>
              <label>崩れにくさ：</label>
                {ratingOptions.longevity.map(option => (
                  <div key={option.value}>
                    <input
                      type="radio"
                      id={`longevity_${option.value}`}
                      name="longevity"
                      value={option.value}
                      onChange={(e) => setReviews({ ...reviews, longevity: e.target.value })}
                      required
                    />
                    <label htmlFor={`longevity_${option.value}`}>{option.label}</label>
                </div>
              ))}
            </div>

            <div>
              <label>保湿力：</label>
                {ratingOptions.moisturizing.map(option => (
                  <div key={option.value}>
                    <input
                      type="radio"
                      id={`moisturizing_${option.value}`}
                      name="moisturizing"
                      value={option.value}
                      onChange={(e) => setReviews({ ...reviews, moisturizing: e.target.value })}
                      required
                    />
                    <label htmlFor={`moisturizing_${option.value}`}>{option.label}</label>
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="comments">コメント</label>
              <textarea
                id="comments"
                name="comments"
                value={reviews.comments}
                onChange={(e) => setReviews({ ...reviews, comments: e.target.value })}
                required
              />
            </div>

            <button type="submit">口コミを投稿する</button>
          </form>
        </div>
      )}

    </div>
  )
}

export default CreateReviews