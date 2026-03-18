import { useState, useEffect } from 'react';
import api from '../services/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [filter, setFilter] = useState({ category: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: 'immigration',
    subcategory: '',
    icon: '',
    image: '',
    benefits: [''],
    processSteps: [],
    faqs: [],
    isActive: true
  });

  useEffect(() => {
    fetchServices();
  }, [filter]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      // Admin sees all services, including inactive
      const response = await api.get(`/services?${params}`);
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        benefits: formData.benefits.filter(b => b.trim()),
        processSteps: formData.processSteps.filter(s => s.title?.trim()),
        faqs: formData.faqs.filter(f => f.question?.trim() && f.answer?.trim())
      };

      if (editingService) {
        await api.put(`/services/${editingService._id}`, data);
      } else {
        await api.post('/services', data);
      }

      setShowModal(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      longDescription: service.longDescription || '',
      category: service.category || 'immigration',
      subcategory: service.subcategory || '',
      icon: service.icon || '',
      image: service.image || '',
      benefits: service.benefits?.length ? service.benefits : [''],
      processSteps: service.processSteps?.length ? service.processSteps : [],
      faqs: service.faqs?.length ? service.faqs : [],
      isActive: service.isActive ?? true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const toggleActive = async (service) => {
    try {
      await api.put(`/services/${service._id}`, { isActive: !service.isActive });
      fetchServices();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longDescription: '',
      category: 'immigration',
      subcategory: '',
      icon: '',
      image: '',
      benefits: [''],
      processSteps: [],
      faqs: [],
      isActive: true
    });
  };

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] });
  };

  const updateBenefit = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const removeBenefit = (index) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({ ...formData, benefits: newBenefits.length ? newBenefits : [''] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-dark">Services</h1>
        <button
          onClick={() => { resetForm(); setEditingService(null); setShowModal(true); }}
          className="btn-admin-primary"
        >
          Add Service
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
          <option value="immigration">Immigration</option>
          <option value="education">Education</option>
        </select>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service._id} className="card-admin p-4">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  service.category === 'immigration'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {service.category}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-text-dark mb-2">{service.title}</h3>
              <p className="text-sm text-text-muted mb-4 line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-primary-blue hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(service)}
                    className="text-yellow-600 hover:text-yellow-700 text-sm"
                  >
                    {service.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
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
                {editingService ? 'Edit Service' : 'Add Service'}
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
                <label className="label-admin">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-admin"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="label-admin">Long Description</label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="input-admin"
                  rows={4}
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
                    <option value="immigration">Immigration</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="label-admin">Subcategory</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="input-admin"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-admin">Icon URL</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="input-admin"
                  />
                </div>
                <div>
                  <label className="label-admin">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input-admin"
                  />
                </div>
              </div>

              <div>
                <label className="label-admin">Benefits</label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                      className="input-admin flex-1"
                      placeholder="Enter benefit"
                    />
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBenefit}
                  className="text-primary-blue hover:text-blue-700 text-sm"
                >
                  + Add Benefit
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm text-text-dark">Active</label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-admin-border">
                <button type="button" onClick={() => setShowModal(false)} className="btn-admin-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-admin-primary">
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;