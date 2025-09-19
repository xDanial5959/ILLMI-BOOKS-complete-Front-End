"use client";

import { useState, useEffect } from "react";
import { getBooks, getManualBooks, saveManualBooks } from "@/utils/bookStorage";
import BookForm from "./BookForm";
import { Edit2, Trash2, Plus, AlertTriangle } from "lucide-react";

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [manualBooks, setManualBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    refreshBooks();
  }, []);

  const refreshBooks = () => {
    setBooks(getBooks());
    setManualBooks(getManualBooks());
  };

  const handleDelete = (id) => {
    if (confirm("Permanently delete this book?")) {
      const updatedBooks = manualBooks.filter((book) => book.id !== id);
      saveManualBooks(updatedBooks);
      refreshBooks();
    }
  };

  const handleEdit = (book) => {
    setBookToEdit({
      id: book.id, // Keep the original ID
      title: "",
      publisher: "",
      originalPrice: "",
      salePrice: "",
      stock: "",
      category: "",
      image: "",
    });
    setShowForm(true);
  };

  if (!isClient)
    return (
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-pulse h-40"
          />
        ))}
      </div>
    );

  return (
    <div className="space-y-6 md:mt-0 mt-15">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Books Management</h2>
        <button
          onClick={() => {
            setBookToEdit(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
        >
          <Plus size={18} />
          Add New Book
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {book.image && (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.publisher}</p>
                      {typeof book.id === "number" && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                          Static
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="text-gray-500 line-through">
                      Rs. {book.originalPrice}
                    </p>
                    <p className="font-medium">Rs. {book.salePrice}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      book.stock > 5
                        ? "bg-green-100 text-green-800"
                        : book.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.stock} in stock
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {book.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {typeof book.id !== "number" ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">Read-only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-start space-x-3">
              {book.image && (
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.publisher}</p>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 line-through text-sm">
                      Rs. {book.originalPrice}
                    </p>
                    <p className="font-medium">Rs. {book.salePrice}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                      book.stock > 5
                        ? "bg-green-100 text-green-800"
                        : book.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {book.stock} in stock
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{book.category}</span>
                  {typeof book.id !== "number" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <BookForm
          bookToEdit={bookToEdit}
          onClose={() => setShowForm(false)}
          onSave={refreshBooks}
        />
      )}
    </div>
  );
};

export default BookTable;
