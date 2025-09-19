"use client";

import { useState, useEffect } from "react";
import { getManualBooks, saveManualBooks } from "@/utils/bookStorage";
import { X, ChevronDown } from "lucide-react";

const EMPTY_BOOK = {
  id: "",
  title: "",
  originalPrice: "",
  salePrice: "",
  image: "",
  description: "",
  publisher: "",
  language: "English",
  pages: "",
  stock: "",
  category: "Self-Help",
};

const BookForm = ({ bookToEdit, onClose, onSave }) => {
  const [book, setBook] = useState(EMPTY_BOOK);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const categories = [
    "Self-Help",
    "Psychology",
    "Finance",
    "Novel",
    "History",
    "Spirituality",
    "Islamic",
    "Academic",
  ];

  useEffect(() => {
    setBook(bookToEdit ? { ...EMPTY_BOOK, ...bookToEdit } : EMPTY_BOOK);
  }, [bookToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value),
    }));
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const manualBooks = getManualBooks();

      if (book.id) {
        const updatedBooks = manualBooks.map((b) =>
          b.id === book.id ? book : b
        );
        saveManualBooks(updatedBooks);
      } else {
        const newBook = {
          ...book,
          id: "manual-" + Date.now().toString(),
        };
        saveManualBooks([...manualBooks, newBook]);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine label position
  const shouldFloatLabel = (fieldName, value) => {
    return Boolean(focusedField === fieldName || value);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {book.id ? "Edit Book" : "Add New Book"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Title */}
          <div className="relative">
            <input
              type="text"
              name="title"
              value={book.title || ""}
              onChange={handleChange}
              onFocus={() => handleFocus("title")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloatLabel("title", book.title)
                  ? "top-0 text-sm text-blue-600 bg-white px-1 -translate-y-1/2"
                  : "top-1/2 text-gray-500 -translate-y-1/2"
              }`}
            >
              Title*
            </label>
          </div>

          {/* Original Price */}
          <div className="relative">
            <input
              type="number"
              name="originalPrice"
              value={book.originalPrice || ""}
              onChange={handleNumberChange}
              onFocus={() => handleFocus("originalPrice")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              min="0"
              step="1"
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloatLabel("originalPrice", book.originalPrice)
                  ? "top-0 text-sm text-blue-600 bg-white px-1 -translate-y-1/2"
                  : "top-1/2 text-gray-500 -translate-y-1/2"
              }`}
            >
              Original Price*
            </label>
          </div>

          {/* Sale Price */}
          <div className="relative">
            <input
              type="number"
              name="salePrice"
              value={book.salePrice || ""}
              onChange={handleNumberChange}
              onFocus={() => handleFocus("salePrice")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              min="0"
              step="1"
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloatLabel("salePrice", book.salePrice)
                  ? "top-0 text-sm text-blue-600 bg-white px-1 -translate-y-1/2"
                  : "top-1/2 text-gray-500 -translate-y-1/2"
              }`}
            >
              Sale Price*
            </label>
          </div>

          {/* Stock */}
          <div className="relative">
            <input
              type="number"
              name="stock"
              value={book.stock || ""}
              onChange={handleNumberChange}
              onFocus={() => handleFocus("stock")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              min="0"
              step="1"
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloatLabel("stock", book.stock)
                  ? "top-0 text-sm text-blue-600 bg-white px-1 -translate-y-1/2"
                  : "top-1/2 text-gray-500 -translate-y-1/2"
              }`}
            >
              Stock*
            </label>
          </div>

          {/* Image URL */}
          <div className="relative">
            <input
              type="url"
              name="image"
              value={book.image || ""}
              onChange={handleChange}
              onFocus={() => handleFocus("image")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloatLabel("image", book.image)
                  ? "top-0 text-sm text-blue-600 bg-white px-1 -translate-y-1/2"
                  : "top-1/2 text-gray-500 -translate-y-1/2"
              }`}
            >
              Image URL
            </label>
          </div>

          {/* Category */}
          <div className="relative">
            <select
              name="category"
              value={book.category || "Self-Help"}
              onChange={handleChange}
              onFocus={() => handleFocus("category")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <label className="absolute left-3 top-0 text-sm text-blue-600 bg-white px-1 -translate-y-1/2 pointer-events-none">
              Category
            </label>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Publisher */}
          <div className="relative">
            <input
              type="text"
              name="publisher"
              value={book.publisher || ""}
              onChange={handleChange}
              onFocus={() => handleFocus("publisher")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloatLabel("publisher", book.publisher)
                  ? "top-0 text-sm text-blue-600 bg-white px-1 -translate-y-1/2"
                  : "top-1/2 text-gray-500 -translate-y-1/2"
              }`}
            >
              Publisher
            </label>
          </div>

          {/* Language */}
          <div className="relative">
            <input
              type="text"
              name="language"
              value={book.language || ""}
              onChange={handleChange}
              onFocus={() => handleFocus("language")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloatLabel("language", book.language)
                  ? "top-0 text-sm text-blue-600 bg-white px-1 -translate-y-1/2"
                  : "top-1/2 text-gray-500 -translate-y-1/2"
              }`}
            >
              Language
            </label>
          </div>

          {/* Pages */}
          <div className="relative">
            <input
              type="number"
              name="pages"
              value={book.pages || ""}
              onChange={handleNumberChange}
              onFocus={() => handleFocus("pages")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              min="1"
              step="1"
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloatLabel("pages", book.pages)
                  ? "top-0 text-sm text-blue-600 bg-white px-1 -translate-y-1/2"
                  : "top-1/2 text-gray-500 -translate-y-1/2"
              }`}
            >
              Pages
            </label>
          </div>

          {/* Description (Full width) */}
          <div className="relative md:col-span-2">
            <textarea
              name="description"
              value={book.description || ""}
              onChange={handleChange}
              onFocus={() => handleFocus("description")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows="3"
            />
            <label
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                shouldFloatLabel("description", book.description)
                  ? "top-0 text-sm text-blue-600 bg-white px-1 -translate-y-1/2"
                  : "top-3 text-gray-500"
              }`}
            >
              Description
            </label>
          </div>

          {/* Form Actions */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 cursor-pointer border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : book.id ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
