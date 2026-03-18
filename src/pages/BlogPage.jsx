import { useState, useEffect } from 'react';
import api from '../services/api';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [filter, setFilter] = useState({ category: '', status: '' });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Immigration',
    tags: [],
    featuredImage: '',
    isPublished: false
  });

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      // Admin sees all posts (including drafts)
      const response = await api.get(`/blog?${params}`);
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tags: formData.tags.filter(t => t.trim())
      };

      if (editingPost) {
        await api.put(`/blog/${editingPost._id}`, data);
      } else {
        await api.post('/blog', data);
      }

      setShowModal(false);
      setEditingPost(null);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'Immigration',
      tags: post.tags || [],
      featuredImage: post.featuredImage || '',
      isPublished: post.isPublished || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const togglePublish = async (post) => {
    try {
      await api.put(`/blog/${post._id}`, { isPublished: !post.isPublished });
      fetchPosts();
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Immigration',
      tags: [],
      featuredImage: '',
      isPublished: false
    });
  };

  const addTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const updateTag = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const removeTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags.length ? newTags : [] });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categoryLabels = {
    'Immigration': 'Immigration',
    'Education': 'Education',
    'Settlement': 'Settlement',
    'General': 'General'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-dark">Blog Posts</h1>
        <button
          onClick={() => { resetForm(); setEditingPost(null); setShowModal(true); }}
          className="btn-admin-primary"
        >
          Add Post
        </button>
      </div>

      {/* Filter */}
      <div className="card-admin p-4 mb-6 flex gap-4">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="input-admin w-auto"
        >
          <option value="">All Categories</option>
          <option value="Immigration">Immigration</option>
          <option value="Education">Education</option>
          <option value="Settlement">Settlement</option>
          <option value="General">General</option>
        </select>
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="input-admin w-auto"
        >
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post._id} className="card-admin p-4 flex items-start gap-4">
              {post.featuredImage && (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-text-dark">{post.title}</h3>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-primary-blue hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => togglePublish(post)}
                      className="text-yellow-600 hover:text-yellow-700 text-sm"
                    >
                      {post.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-text-muted line-clamp-2 mb-2">{post.excerpt}</p>
                <div className="text-xs text-text-muted">
                  {post.publishedAt && (
                    <span>Published: {formatDate(post.publishedAt)}</span>
                  )}
                  {post.author && (
                    <span className="ml-4">By: {post.author}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="card-admin max-w-3xl w-full my-8">
            <div className="p-4 border-b border-admin-border flex items-center justify-between">
              <h2 className="text-lg font-heading font-semibold">
                {editingPost ? 'Edit Post' : 'Add Post'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-text-muted hover:text-text-dark"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="label-admin">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-admin"
                  required
                />
              </div>

              <div>
                <label className="label-admin">Slug (auto-generated if empty)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input-admin"
                  placeholder="post-url-slug"
                />
              </div>

              <div>
                <label className="label-admin">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="input-admin"
                  rows={2}
                  placeholder="Brief summary of the post..."
                />
              </div>

              <div>
                <label className="label-admin">Content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input-admin"
                  rows={10}
                  required
                  placeholder="Full blog post content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-admin">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-admin"
                    required
                  >
                    <option value="Immigration">Immigration</option>
                    <option value="Education">Education</option>
                    <option value="Settlement">Settlement</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="label-admin">Featured Image URL</label>
                  <input
                    type="text"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    className="input-admin"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="label-admin">Tags</label>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => updateTag(index, e.target.value)}
                      className="input-admin flex-1"
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="text-primary-blue hover:text-blue-700 text-sm"
                >
                  + Add Tag
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isPublished" className="text-sm text-text-dark">Publish immediately</label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-admin-border">
                <button type="button" onClick={() => setShowModal(false)} className="btn-admin-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;