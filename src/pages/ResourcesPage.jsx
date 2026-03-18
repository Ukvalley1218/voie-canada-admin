import { useState, useEffect } from 'react';
import api from '../services/api';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [filter, setFilter] = useState({ category: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF Guide',
    category: 'Immigration',
    fileUrl: '',
    externalUrl: '',
    isFeatured: false,
    isActive: true
  });

  useEffect(() => {
    fetchResources();
  }, [filter]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      const response = await api.get(`/resources?${params}`);
      setResources(response.data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await api.put(`/resources/${editingResource._id}`, formData);
      } else {
        await api.post('/resources', formData);
      }

      setShowModal(false);
      setEditingResource(null);
      resetForm();
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title || '',
      description: resource.description || '',
      type: resource.type || 'PDF Guide',
      category: resource.category || 'Immigration',
      fileUrl: resource.fileUrl || '',
      externalUrl: resource.externalUrl || '',
      isFeatured: resource.isFeatured || false,
      isActive: resource.isActive ?? true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.delete(`/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const toggleActive = async (resource) => {
    try {
      await api.put(`/resources/${resource._id}`, { isActive: !resource.isActive });
      fetchResources();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const toggleFeatured = async (resource) => {
    try {
      await api.put(`/resources/${resource._id}`, { isFeatured: !resource.isFeatured });
      fetchResources();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'PDF Guide',
      category: 'Immigration',
      fileUrl: '',
      externalUrl: '',
      isFeatured: false,
      isActive: true
    });
  };

  const typeLabels = {
    'PDF Guide': 'PDF Guide',
    'Video': 'Video',
    'Article': 'Article',
    'Tool': 'Tool',
    'Checklist': 'Checklist'
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
        <h1 className="text-2xl font-heading font-bold text-text-dark">Resources</h1>
        <button
          onClick={() => { resetForm(); setEditingResource(null); setShowModal(true); }}
          className="btn-admin-primary"
        >
          Add Resource
        </button>
      </div>

      {/* Filter */}
      <div className="card-admin p-4 mb-6">
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
      </div>

      {/* Resources List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource) => (
            <div key={resource._id} className="card-admin p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {resource.type}
                </span>
                <div className="flex gap-1">
                  {resource.isFeatured && (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    resource.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {resource.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 mb-2 inline-block">
                {resource.category}
              </span>

              <h3 className="font-heading font-semibold text-text-dark mb-2">{resource.title}</h3>
              <p className="text-sm text-text-muted mb-4 line-clamp-2">{resource.description}</p>

              {resource.downloadCount !== undefined && (
                <p className="text-xs text-text-muted mb-2">
                  Downloads: {resource.downloadCount || 0}
                </p>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleEdit(resource)}
                  className="text-primary-blue hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFeatured(resource)}
                    className={`text-sm ${resource.isFeatured ? 'text-yellow-600' : 'text-gray-400'}`}
                  >
                    {resource.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => toggleActive(resource)}
                    className="text-yellow-600 hover:text-yellow-700 text-sm"
                  >
                    {resource.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(resource._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="card-admin max-w-2xl w-full my-8">
            <div className="p-4 border-b border-admin-border flex items-center justify-between">
              <h2 className="text-lg font-heading font-semibold">
                {editingResource ? 'Edit Resource' : 'Add Resource'}
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
                <label className="label-admin">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-admin"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-admin">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-admin"
                    required
                  >
                    <option value="PDF Guide">PDF Guide</option>
                    <option value="Video">Video</option>
                    <option value="Article">Article</option>
                    <option value="Tool">Tool</option>
                    <option value="Checklist">Checklist</option>
                  </select>
                </div>
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
              </div>

              <div>
                <label className="label-admin">File URL</label>
                <input
                  type="text"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  className="input-admin"
                  placeholder="https://example.com/file.pdf"
                />
              </div>

              <div>
                <label className="label-admin">External URL</label>
                <input
                  type="text"
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  className="input-admin"
                  placeholder="https://external-link.com"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-text-dark">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-text-dark">Active</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-admin-border">
                <button type="button" onClick={() => setShowModal(false)} className="btn-admin-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  {editingResource ? 'Update Resource' : 'Create Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;