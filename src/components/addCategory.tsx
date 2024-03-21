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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function AddCategoryModal({ fetchData }: { fetchData: () => void }) {
  const [inputValue, setInputValue] = useState(''); // State to store the input value
  const [open, setOpen] = useState(false); // State to manage the dialog open/close
  const handleChange = (event: any) => {
    setInputValue(event.target.value); // Update the input value when it changes
  };

  const handleSubmit = () => {
    if (!inputValue) {
      toast.error('Please enter a category name'); // Show an error toast if no category name is entered
      return;
    }
    console.log('Input value:', inputValue); // Log the input value
    fetch('https://antropolis.vercel.app/api/V1/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: inputValue }), // Send the category name as JSON in the request body
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here
        console.log('Response data:', data);
        if (data.success) {
          toast.success('Category added successfully'); // Show a success toast if the category is added successfully
          setInputValue(''); // Clear the input value
          setOpen(false); // Close the dialog
          fetchData(); // Fetch the updated category list
        }
      })
      .catch((error) => {
        // Handle any errors here
        toast.error('An error occurred'); // Show an error toast if an error occurs
        console.error('Error:', error);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className='border px-5 py-2 rounded-full border-white'>
          Add Category
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[350px]'>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Input
            id='name'
            value={inputValue}
            onChange={handleChange}
            placeholder='Name'
            className='bg-[#F2F2F2]'
            required // Added required attribute
          />
        </div>
        <DialogFooter>
          <button
            className='bg-black w-full text-white py-2 rounded-md'
            type='submit'
            onClick={handleSubmit}
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
