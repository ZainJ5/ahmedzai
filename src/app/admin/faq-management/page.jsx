"use client";

import React, { useState, useEffect } from 'react';
import { 
  FaQuestion, 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaToggleOn, 
  FaToggleOff,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function FaqManagement() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState('add'); 
  const [currentFaq, setCurrentFaq] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isActive: true,
    order: 0
  });
  
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/faq');
      const data = await response.json();
      
      if (response.ok) {
        setFaqs(data.faqs);
      } else {
        toast.error('Failed to fetch FAQs');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFaqs();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      isActive: true,
      order: 0
    });
    setFormMode('add');
    setCurrentFaq(null);
  };
  
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
    setFormMode('add');
  };
  
  const handleEdit = (faq) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
      order: faq.order
    });
    setCurrentFaq(faq);
    setFormMode('edit');
    setShowForm(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Question and answer are required');
      return;
    }
    
    try {
      let response;
      
      if (formMode === 'add') {
        response = await fetch('/api/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch(`/api/faq/${currentFaq._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(formMode === 'add' ? 'FAQ added successfully' : 'FAQ updated successfully');
        resetForm();
        setShowForm(false);
        fetchFaqs();
      } else {
        toast.error(data.error || 'Failed to save FAQ');
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('FAQ deleted successfully');
        fetchFaqs();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };
  
  const handleToggleStatus = async (faq) => {
    try {
      const response = await fetch(`/api/faq/${faq._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...faq,
          isActive: !faq.isActive
        })
      });
      
      if (response.ok) {
        toast.success(`FAQ ${!faq.isActive ? 'activated' : 'deactivated'} successfully`);
        fetchFaqs();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update FAQ status');
      }
    } catch (error) {
      console.error('Error updating FAQ status:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };
  
  const handleMoveUp = async (faq, index) => {
    if (index === 0) return;
    
    try {
      const prevFaq = faqs[index - 1];
      const currentOrder = faq.order;
      const prevOrder = prevFaq.order;
      
      await Promise.all([
        fetch(`/api/faq/${faq._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...faq, order: prevOrder })
        }),
        fetch(`/api/faq/${prevFaq._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...prevFaq, order: currentOrder })
        })
      ]);
      
      fetchFaqs();
    } catch (error) {
      console.error('Error reordering FAQs:', error);
      toast.error('Failed to reorder FAQs');
    }
  };
  
  const handleMoveDown = async (faq, index) => {
    if (index === faqs.length - 1) return;
    
    try {
      const nextFaq = faqs[index + 1];
      const currentOrder = faq.order;
      const nextOrder = nextFaq.order;
      
      await Promise.all([
        fetch(`/api/faq/${faq._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...faq, order: nextOrder })
        }),
        fetch(`/api/faq/${nextFaq._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nextFaq, order: currentOrder })
        })
      ]);
      
      fetchFaqs();
    } catch (error) {
      console.error('Error reordering FAQs:', error);
      toast.error('Failed to reorder FAQs');
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">FAQ Management</h1>
          <p className="text-gray-600">Manage frequently asked questions that appear on your website</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
        >
          <FaPlus className="mr-2" /> Add New FAQ
        </button>
      </div>
      
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">{formMode === 'add' ? 'Add New FAQ' : 'Edit FAQ'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="question" className="block text-gray-700 font-medium mb-2">
                Question
              </label>
              <input
                type="text"
                id="question"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the question"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="answer" className="block text-gray-700 font-medium mb-2">
                Answer
              </label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the answer"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="order" className="block text-gray-700 font-medium mb-2">
                Display Order
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
            </div>
            
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700">Active (visible on site)</span>
              </label>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors"
              >
                {formMode === 'add' ? 'Add FAQ' : 'Update FAQ'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : faqs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-gray-100 inline-block p-5 rounded-full mb-4">
              <FaQuestion className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-gray-800 font-medium text-lg">No FAQs found</h3>
            <p className="text-gray-600 mt-1">Add your first FAQ to get started</p>
            <button
              onClick={handleAddNew}
              className="mt-4 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2" /> Add New FAQ
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {faqs.map((faq, index) => (
                  <tr key={faq._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-gray-900 font-medium">{faq.order}</span>
                        <div className="ml-2 flex flex-col">
                          <button 
                            onClick={() => handleMoveUp(faq, index)}
                            disabled={index === 0}
                            className={`p-1 ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-blue-600'}`}
                          >
                            <FaArrowUp size={12} />
                          </button>
                          <button 
                            onClick={() => handleMoveDown(faq, index)}
                            disabled={index === faqs.length - 1}
                            className={`p-1 ${index === faqs.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:text-blue-600'}`}
                          >
                            <FaArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{faq.question}</div>
                      <div className="text-gray-500 text-sm mt-1 line-clamp-2">{faq.answer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleToggleStatus(faq)}
                        className={`inline-flex items-center ${
                          faq.isActive ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {faq.isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                        <span className="ml-2">
                          {faq.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(faq._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}