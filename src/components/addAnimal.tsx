'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Category } from '@/app/page';

/**
 * Renders a modal for adding an animal.
 * @param categories - An array of category objects.
 */
export function AddAnimalModal({
  categories,
  fetchData,
}: {
  categories: any;
  fetchData: () => void;
}) {
  const [name, setName] = useState(''); // State for storing the name of the animal
  const [category, setCategory] = useState(''); // State for storing the selected category
  const [image, setImage] = useState(null); // State for storing the selected image
  const [open, setOpen] = useState(false); // State for controlling the modal open/close
  const [error, setError] = useState(''); // State for storing error messages
  const [uploading, setUploading] = useState(false); // State for tracking image uploading status

  /**
   * Handles the change event for the name input field.
   * @param event - The change event object.
   */
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  /**
   * Handles the change event for the category select field.
   * @param selectedCategoryId - The ID of the selected category.
   */
  const handleCategoryChange = (selectedCategoryId: string) => {
    setCategory(selectedCategoryId);
  };

  /**
   * Handles the change event for the image input field.
   * @param event - The change event object.
   */
  const handleImageChange = async (event: any) => {
    const [imgData] = event.target.files;
    const formData = new FormData();
    formData.append('file', imgData);
    formData.append('upload_preset', 'nextjs');
    try {
      setUploading(true);
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dbukuhw7w/image/upload',
        formData,
      );

      if (res.data.url) {
        const fileName = event.target.files[0].name;
        const fileNameElement = document.getElementById('fileName');
        if (fileNameElement) {
          fileNameElement.textContent = fileName;
        }
        setImage(res.data.url);
        setUploading(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false); // Ensure uploading is set to false on error
      setError('Error uploading image. Please try again.');
    }
  };

  /**
   * Handles the submit event for the form.
   */
  const handleSubmit = async () => {
    if (!name || !category || !image) {
      setError('Please fill out all fields');
      return;
    }
    setError('');
    setUploading(true);
    const data = {
      title: name,
      categoryId: category,
      image,
    };
    try {
      const res = await axios.post(
        'https://antropolis.vercel.app/api/V1/animals',
        data,
      );
      if (res.data.success) {
        toast.success('Animal added successfully');
        setOpen(false);
        setName('');
        fetchData();
      } else {
        toast.error('Failed to add animal');
      }
    } catch (error) {
      console.error('Error adding animal:', error);
      toast.error('Failed to add animal');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className='border px-5 py-2 rounded-full border-white'>
          Add Animal
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[350px]'>
        <DialogHeader>
          <DialogTitle>Add Animal</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Input
            id='name'
            value={name}
            onChange={handleNameChange}
            className='bg-[#F2F2F2]'
            placeholder='Name'
          />
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger className='w-full bg-[#F2F2F2]'>
              <SelectValue placeholder='Select a category' />
            </SelectTrigger>
            <SelectContent className='bg-[#F2F2F2]'>
              {categories.map((cat: any) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label
            htmlFor='fileInput'
            className='flex items-center px-4 py-5 bg-[#F2F2F2] rounded-lg hover:bg-gray-300 cursor-pointer relative'
          >
            <input
              type='file'
              id='fileInput'
              className='hidden absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              onChange={handleImageChange}
              accept='image/*'
            />
            <span className='text-sm bg-gray-300 px-2 py-1 rounded-md absolute  right-2 top-1/2 transform -translate-y-1/2'>
              upload
            </span>
            <span
              id='fileName'
              className='text-sm text-gray-500 truncate overflow-ellipsis pl-2'
            ></span>
          </label>
          {error && <p className='text-red-500'>{error}</p>}
        </div>
        <DialogFooter>
          <button
            className={`bg-black w-full text-white py-2 rounded-md ${
              uploading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            type='submit'
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Create Animal'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
