"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaImage, 
  FaTimes, 
  FaSpinner, 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaListUl, 
  FaListOl, 
  FaLink, 
  FaAlignLeft, 
  FaAlignCenter, 
  FaAlignRight, 
  FaQuoteRight, 
  FaTable
} from 'react-icons/fa';
import Link from 'next/link';

const CustomEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command, val = null) => {
    if (typeof document !== 'undefined') {
      document.execCommand(command, false, val);
      if (editorRef.current) {
        editorRef.current.focus();
        onChange({ target: { value: editorRef.current.innerHTML } });
      }
    }
  };

  const handleTableInsert = () => {
    const cols = prompt('Enter number of columns', '2');
    const rows = prompt('Enter number of rows', '2');
    if (cols && rows) {
      const table = document.createElement('table');
      table.border = '1';
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      
      for (let i = 0; i < parseInt(rows); i++) {
        const tr = table.insertRow();
        for (let j = 0; j < parseInt(cols); j++) {
          const td = tr.insertCell();
          td.innerHTML = `Cell ${i+1},${j+1}`;
          td.style.border = '1px solid #ccc';
          td.style.padding = '8px';
        }
      }
      
      execCommand('insertHTML', table.outerHTML);
    }
  };

  return (
    <div className="border rounded-lg border-gray-300 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-300 p-1 flex flex-wrap items-center gap-1">
        <select 
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          onChange={(e) => execCommand('formatBlock', e.target.value)}
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>
        
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('bold')} title="Bold"><FaBold /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('italic')} title="Italic"><FaItalic /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('underline')} title="Underline"><FaUnderline /></button>
        
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('insertUnorderedList')} title="Bullet List"><FaListUl /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('insertOrderedList')} title="Numbered List"><FaListOl /></button>
        
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('justifyLeft')} title="Align Left"><FaAlignLeft /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('justifyCenter')} title="Align Center"><FaAlignCenter /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('justifyRight')} title="Align Right"><FaAlignRight /></button>
        
        <div className="border-l border-gray-300 h-6 mx-1"></div>
        
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => { const url = prompt('Enter link URL'); if (url) execCommand('createLink', url); }} title="Insert Link"><FaLink /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={() => execCommand('formatBlock', '<blockquote>')} title="Quote"><FaQuoteRight /></button>
        <button type="button" className="p-1.5 rounded hover:bg-gray-200" onClick={handleTableInsert} title="Insert Table"><FaTable /></button>
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[200px] focus:outline-none"
        onInput={(e) => onChange({ target: { value: e.currentTarget.innerHTML } })}
      />
    </div>
  );
};

export default function BlogManagement() {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    thumbnail: null,
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef(null);
  
  const fetchBlogs = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/blogs?page=${page}&limit=${pagination.limit}&sortBy=createdAt&sortOrder=desc`);
      const data = await res.json();
      
      if (data.success) {
        setBlogs(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBlogs();
  }, []);
  
  const handlePageChange = (newPage) => {
    fetchBlogs(newPage);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  const handleContentChange = (e) => {
    setFormData({ ...formData, content: e.target.value });
    
    if (formErrors.content) {
      setFormErrors({ ...formErrors, content: '' });
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
      setFormErrors({ ...formErrors, thumbnail: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { 
      setFormErrors({ ...formErrors, thumbnail: 'Image size should be less than 5MB' });
      return;
    }
    
    setFormData({ ...formData, thumbnail: file });
    setPreviewUrl(URL.createObjectURL(file));
    
    if (formErrors.thumbnail) {
      setFormErrors({ ...formErrors, thumbnail: '' });
    }
  };
  
  const openCreateForm = () => {
    setFormMode('create');
    setFormData({
      title: '',
      description: '',
      content: '',
      thumbnail: null,
    });
    setPreviewUrl('');
    setFormErrors({});
    setIsFormOpen(true);
  };
  
  const openEditForm = (blog) => {
    setFormMode('edit');
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      thumbnail: null,
    });
    setPreviewUrl(blog.thumbnail ? blog.thumbnail : '');
    setFormErrors({});
    setIsFormOpen(true);
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setSubmitSuccess(false);
  };
  
  const openDeleteModal = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.content || formData.content === '<p><br></p>' || formData.content === '<br>') {
      errors.content = 'Content is required';
    }
    
    if (formMode === 'create' && !formData.thumbnail) {
      errors.thumbnail = 'Thumbnail image is required';
    }
    
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append('content', formData.content);
    
    if (formData.thumbnail) {
      formDataObj.append('thumbnail', formData.thumbnail);
    }
    
    try {
      let response;
      
      if (formMode === 'create') {
        response = await fetch('/api/blogs', {
          method: 'POST',
          body: formDataObj,
        });
      } else {
        formDataObj.append('_id', selectedBlog._id);
        response = await fetch(`/api/blogs/${selectedBlog._id}`, {
          method: 'PUT',
          body: formDataObj,
        });
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitSuccess(true);
        fetchBlogs(pagination.page); 
        
        setTimeout(() => {
          closeForm();
        }, 2000);
      } else {
        setFormErrors({ form: data.message || 'An error occurred while saving the blog' });
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      setFormErrors({ form: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (!selectedBlog) return;
    
    try {
      const response = await fetch(`/api/blogs/${selectedBlog._id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        closeDeleteModal();
        fetchBlogs(pagination.page); // Refresh the blog list
      } else {
        console.error('Error deleting blog:', data.message);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
          <p className="text-gray-600">Create and manage blog posts</p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center shadow-md"
        >
          <FaPlus className="mr-2" />
          Add New Blog
        </button>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-8 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <FaImage className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No Blogs Found</h3>
            <p className="text-gray-600 mb-4">You haven't created any blogs yet.</p>
            <button
              onClick={openCreateForm}
              className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Create Your First Blog
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-24 relative rounded-md overflow-hidden bg-gray-100">
                        {blog.thumbnail ? (
                          <img 
                            src={blog.thumbnail} 
                            alt={blog.title} 
                            fill
                            sizes="(max-width: 768px) 100px, 150px"
                            className="object-cover" 
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FaImage className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-medium text-gray-900 truncate">{blog.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-600 truncate">{blog.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Link 
                          href={`/blogs/${blog._id}`} 
                          target="_blank"
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                          title="View Blog"
                        >
                          <FaEye className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => openEditForm(blog)}
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-full transition-colors"
                          title="Edit Blog"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(blog)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Blog"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {blogs.length} of {pagination.total} blogs
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded ${
                    pagination.page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Previous
                </button>
                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded ${
                        pagination.page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className={`px-3 py-1 rounded ${
                    pagination.page === pagination.totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Blog Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">
                {formMode === 'create' ? 'Create New Blog' : 'Edit Blog'}
              </h3>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]">
              {submitSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start">
                  <div className="text-green-500 mr-3 mt-0.5">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Blog {formMode === 'create' ? 'created' : 'updated'} successfully!</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {formErrors.form && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start">
                      <div className="text-red-500 mr-3 mt-0.5">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-red-800">{formErrors.form}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                          formErrors.title
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                        placeholder="Enter blog title"
                      />
                      {formErrors.title && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="2"
                        className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                          formErrors.description
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                        placeholder="Enter a short description"
                      ></textarea>
                      {formErrors.description && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <div className={`${formErrors.content ? 'border border-red-300 rounded-md' : ''}`}>
                        <CustomEditor 
                          value={formData.content} 
                          onChange={handleContentChange} 
                        />
                      </div>
                      {formErrors.content && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail {formMode === 'create' && <span className="text-red-500">*</span>}
                      </label>
                      
                      <div className="flex items-center space-x-6">
                        <div className="w-32 h-32 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center relative">
                          {previewUrl ? (
                            <>
                              <img
                                src={previewUrl} 
                                alt="Thumbnail preview" 
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, thumbnail: null });
                                  setPreviewUrl('');
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                  }
                                }}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                              >
                                <FaTimes className="h-3 w-3 text-gray-600" />
                              </button>
                            </>
                          ) : (
                            <FaImage className="h-8 w-8 text-gray-300" />
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center">
                            <input
                              type="file"
                              id="thumbnail"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/jpeg,image/png,image/gif,image/webp"
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current.click()}
                              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Choose Image
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF or WEBP up to 5MB</p>
                          {formErrors.thumbnail && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.thumbnail}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                        isSubmitting
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                      } inline-flex items-center`}
                    >
                      {isSubmitting && <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                      {isSubmitting
                        ? 'Saving...'
                        : formMode === 'create'
                        ? 'Create Blog'
                        : 'Update Blog'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-100">
              <h3 className="text-lg font-semibold text-red-800">Delete Blog</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold">{selectedBlog.title}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 rounded-lg text-white font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}