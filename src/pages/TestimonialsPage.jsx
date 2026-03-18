import { useState, useEffect } from 'react';
import api from '../services/api';

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [filter, setFilter] = useState({ category: '' });

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    quote: '',
    photo: '',
    videoUrl: '',
    category: 'professional',
    isFeatured: false,
    isActive: true
  });

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.category) params.append('category', filter.category);
      // Admin sees all testimonials
      const response = await api.get(`/testimonials?${params}`);
      setTestimonials(response.data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await api.put(`/testimonials/${editingTestimonial._id}`, formData);
      } else {
        await api.post('/testimonials', formData);
      }

      setShowModal(false);
      setEditingTestimonial(null);
      resetForm();
      fetchTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name || '',
      role: testimonial.role || '',
      company: testimonial.company || '',
      quote: testimonial.quote || '',
      photo: testimonial.photo || '',
      videoUrl: testimonial.videoUrl || '',
      category: testimonial.category || 'professional',
      isFeatured: testimonial.isFeatured || false,
      isActive: testimonial.isActive ?? true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const toggleActive = async (testimonial) => {
    try {
      await api.put(`/testimonials/${testimonial._id}`, { isActive: !testimonial.isActive });
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling active:', error);
    }
  };

  const toggleFeatured = async (testimonial) => {
    try {
      await api.put(`/testimonials/${testimonial._id}`, { isFeatured: !testimonial.isFeatured });
      fetchTestimonials();
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      company: '',
      quote: '',
      photo: '',
      videoUrl: '',
      category: 'professional',
      isFeatured: false,
      isActive: true
    });
  };

  const categoryLabels = {
    professional: 'Professional',
    entrepreneur: 'Entrepreneur',
    student: 'Student',
    family: 'Family'
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-dark">Testimonials</h1>
        <button
          onClick={() => { resetForm(); setEditingTestimonial(null); setShowModal(true); }}
          className="btn-admin-primary"
        >
          Add Testimonial
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
          <option value="professional">Professional</option>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="student">Student</option>
          <option value="family">Family</option>
        </select>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial._id} className="card-admin p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    testimonial.category === 'professional' ? 'bg-blue-100 text-blue-800' :
                    testimonial.category === 'entrepreneur' ? 'bg-green-100 text-green-800' :
                    testimonial.category === 'student' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {categoryLabels[testimonial.category] || testimonial.category}
                  </span>
                  {testimonial.isFeatured && (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {testimonial.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {testimonial.photo && (
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mb-3"
                />
              )}

              <h3 className="font-heading font-semibold text-text-dark mb-1">{testimonial.name}</h3>
              <p className="text-sm text-text-muted mb-2">{testimonial.role} {testimonial.company && `• ${testimonial.company}`}</p>
              <p className="text-sm text-text-dark line-clamp-3 mb-4">"{testimonial.quote}"</p>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="text-primary-blue hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFeatured(testimonial)}
                    className={`text-sm ${testimonial.isFeatured ? 'text-yellow-600' : 'text-gray-400'}`}
                  >
                    {testimonial.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => toggleActive(testimonial)}
                    className="text-yellow-600 hover:text-yellow-700 text-sm"
                  >
                    {testimonial.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial._id)}
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
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
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
                <label className="label-admin">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-admin"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-admin">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input-admin"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <label className="label-admin">Company/Location</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-admin"
                    placeholder="e.g., Toronto, Canada"
                  />
                </div>
              </div>

              <div>
                <label className="label-admin">Quote *</label>
                <textarea
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="input-admin"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="label-admin">Photo URL</label>
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                  className="input-admin"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div>
                <label className="label-admin">Video URL (optional)</label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="input-admin"
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <label className="label-admin">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-admin"
                  required
                >
                  <option value="professional">Professional</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="student">Student</option>
                  <option value="family">Family</option>
                </select>
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
                  {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsPage;