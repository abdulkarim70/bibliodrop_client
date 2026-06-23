"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
  Select,
  ListBox,
  TextArea,
} from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const AddBook = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: session } = authClient.useSession();

  const categories = [
    { id: "fiction", label: "Fiction" },
    { id: "sci-fi", label: "Sci-Fi" },
    { id: "academic", label: "Academic" },
    { id: "mystery", label: "Mystery" },
    { id: "biography", label: "Biography" },
  ];

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const author = formData.get("author");
    const fee = formData.get("fee");
    const description = formData.get("description");
    const category = selectedCategory;

    if (!imageFile) {
      setServerError("Please select a book cover image!");
      setIsLoading(false);
      return;
    }

    if (!category) {
      setServerError("Please select a category!");
      setIsLoading(false);
      return;
    }

    try {
      // ১. ImgBB তে ছবি আপলোড
      const imageFormData = new FormData();
      imageFormData.append("image", imageFile);

      const imgbbResponse = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: imageFormData }
      );
      const imgbbData = await imgbbResponse.json();

      if (!imgbbData.success) throw new Error("Image upload failed!");

      const imageUrl = imgbbData.data.display_url;

      // ২. বইয়ের অবজেক্ট তৈরি
      const newBook = {
        title,
        author,
        category,
        fee: parseFloat(fee),
        description,
        imageUrl,
        librarianName: session?.user?.name || "Unknown",
        librarianEmail: session?.user?.email,
      };

      // ৩. ব্যাকএন্ড API তে পাঠানো
      const backendResponse = await fetch("http://localhost:5000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      const backendData = await backendResponse.json();

      if (backendData.success) {
        toast.success("Book added successfully! (Pending Approval)");
        e.target.reset();
        setImageFile(null);
        setSelectedCategory(null);
        setTimeout(() => {
          router.push("/dashboard/librarian/inventory");
        }, 2000);
      } else {
        throw new Error(backendData.error || "Failed to add book");
      }
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
      toast.error(err.message || "Failed to add book!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-10 font-sans w-full">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full max-w-2xl p-8 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">

        <div className="text-center mb-8 border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Add a New Book</h2>
          <p className="text-sm text-gray-500">
            Fill in the details to list a new book in your inventory.
          </p>
        </div>

        <Form
          className="flex flex-col gap-5"
          onSubmit={onSubmit}
          validationBehavior="native"
        >
          {/* Row 1: Title + Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            <TextField name="title" isRequired>
              <Label className="font-semibold text-gray-800 text-sm mb-1 block">
                Book Title
              </Label>
              <Input
                placeholder="Enter the title"
                className="h-10 w-full rounded-md border border-gray-200 focus-visible:outline-none focus-visible:border-[#6a46cd] px-3"
              />
              <FieldError className="text-red-500 text-xs mt-1" />
            </TextField>

            <TextField name="author" isRequired>
              <Label className="font-semibold text-gray-800 text-sm mb-1 block">
                Author
              </Label>
              <Input
                placeholder="Enter the author name"
                className="h-10 w-full rounded-md border border-gray-200 focus-visible:outline-none focus-visible:border-[#6a46cd] px-3"
              />
              <FieldError className="text-red-500 text-xs mt-1" />
            </TextField>
          </div>

          {/* Row 2: Category + Fee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">

            {/* Category — HeroUI v3 compound Select */}
            <div className="flex flex-col gap-1">
              <Label className="font-semibold text-gray-800 text-sm block">
                Category
              </Label>
              <Select
                placeholder="Select a category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                className="w-full"
              >
                <Select.Trigger className="h-10 w-full rounded-md border border-gray-200 px-3 flex items-center justify-between focus-visible:outline-none focus-visible:border-[#6a46cd] bg-white">
                  <Select.Value className="text-sm text-gray-700" />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="w-full rounded-md border border-gray-200 bg-white shadow-md mt-1 z-50">
                  <ListBox className="p-1">
                    {categories.map((cat) => (
                      <ListBox.Item
                        key={cat.id}
                        id={cat.id}
                        textValue={cat.label}
                        className="px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-purple-50 hover:text-[#6a46cd]"
                      >
                        {cat.label}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
              {serverError.includes("category") && (
                <p className="text-red-500 text-xs mt-1">
                  Please select a category.
                </p>
              )}
            </div>

            {/* Fee */}
            <TextField name="fee" isRequired>
              <Label className="font-semibold text-gray-800 text-sm mb-1 block">
                Rental Fee (per day)
              </Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 2.50"
                className="h-10 w-full rounded-md border border-gray-200 focus-visible:outline-none focus-visible:border-[#6a46cd] px-3"
              />
              <FieldError className="text-red-500 text-xs mt-1" />
            </TextField>
          </div>

          {/* Book Cover Image */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-800 text-sm block">
              Book Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-[#6a46cd] hover:file:bg-purple-100 border border-gray-200 rounded-md p-1 cursor-pointer"
            />
            {imageFile && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Selected: {imageFile.name}
              </p>
            )}
          </div>

          {/* Description — HeroUI v3 TextArea */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="description"
              className="font-semibold text-gray-800 text-sm block"
            >
              Description
            </Label>
            <TextArea
              id="description"
              name="description"
              placeholder="Write a short description of the book..."
              rows={4}
              className="w-full rounded-md border border-gray-200 focus-visible:outline-none focus-visible:border-[#6a46cd] px-3 py-2 text-sm resize-none"
            />
          </div>

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-3 rounded-md">
              {serverError}
            </p>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            isDisabled={isLoading}
            className="w-full h-11 bg-[#6a46cd] hover:bg-[#5a38b8] text-white font-semibold rounded-xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "Uploading..." : "Add Book"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default AddBook;