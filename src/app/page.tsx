'use client';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { AddAnimalModal } from '@/components/addAnimal';
import { AddCategoryModal } from '@/components/addCategory';

export type Category = {
  _id: string;
  title: string;
};

export type Animal = {
  _id: string;
  title: string;
  image: string;
  categoryId: string;
};
/**
 * Represents the Home component.
 * This component fetches categories and animals data from an API and displays them.
 */
export default function Home(): JSX.Element {
  // State variables
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);

  /**
   * Fetches categories and animals data from the API.
   */
  const fetchData = useCallback(() => {
    axios
      .get('https://antropolis.vercel.app/api/V1/categories')
      .then((response) => setCategories(response.data?.data))
      .catch((error) => console.error('Error fetching categories:', error));

    axios
      .get('https://antropolis.vercel.app/api/V1/animals')
      .then((response) => {
        const data = response.data?.data;
        setAnimals(data);
        setFilteredAnimals(data);
      })
      .catch((error) => console.error('Error fetching animals:', error));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    /**
     * Filters the animals based on the active category.
     * If no active category is selected, all animals are displayed.
     * @param categoryId - The ID of the category to filter by.
     */
    const filterAnimals = (categoryId: string | null) => {
      if (categoryId !== null) {
        const filtered = animals.filter(
          (animal) => animal.categoryId === categoryId,
        );
        setFilteredAnimals(filtered);
      } else {
        setFilteredAnimals(animals);
      }
    };

    if (activeCategory !== null) {
      filterAnimals(categories[activeCategory]?._id);
    } else {
      setFilteredAnimals(animals);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, categories, animals]);

  /**
   * Handles the click event of a category button.
   * @param index - The index of the clicked category button.
   */
  const handleClick = (index: number) => {
    setActiveCategory((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <main className='container py-20 bg-black text-white min-h-screen'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2 space-x-5'>
          {/* Render category buttons */}
          {categories.map((category, index) => (
            <button
              className={`my-1 border px-5 py-2 rounded-full ${
                activeCategory === index
                  ? 'border-green-500 text-green-500'
                  : 'text-red-500 border-red-500'
              }`}
              key={category._id}
              onClick={() => handleClick(index)}
            >
              {category.title}
            </button>
          ))}
        </div>
        <div className='justify-self-start lg:justify-self-end space-x-4 grid-cols-1'>
          {/* Render modals */}
          <AddAnimalModal categories={categories} fetchData={fetchData} />
          <AddCategoryModal fetchData={fetchData} />
        </div>
      </div>
      <div>
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-20'>
          {/* Render animals */}
          {filteredAnimals.map((animal) => (
            <div key={animal._id} className='flex flex-col items-center'>
              <div className='bg-[#050505] w-[160px] h-[190px] rounded-md flex items-center justify-center'>
                <Image
                  src={animal.image}
                  alt='animal.png'
                  width={1000}
                  height={1000}
                  className='p-5'
                />
              </div>
              <h2 className='text-center uppercase mt-3'>{animal.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
