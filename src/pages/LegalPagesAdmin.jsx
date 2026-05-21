import { useState, useEffect } from 'react';
import api from '../services/api';

const LegalPagesAdmin = () => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [privacyPolicy, setPrivacyPolicy] = useState({
    title: 'Privacy Policy',
    lastUpdated: new Date().toISOString().split('T')[0],
    sections: []
  });

  const [termsOfService, setTermsOfService] = useState({
    title: 'Terms of Service',
    lastUpdated: new Date().toISOString().split('T')[0],
    sections: []
  });

  useEffect(() => {
    fetchLegalPages();
  }, []);

  const fetchLegalPages = async () => {
    setLoading(true);
    try {
      const [privacyRes, termsRes] = await Promise.all([
        api.get('/settings/legal/privacy-policy'),
        api.get('/settings/legal/terms-of-service')
      ]);

      if (privacyRes.data && privacyRes.data.sections) {
        setPrivacyPolicy(privacyRes.data);
      }
      if (termsRes.data && termsRes.data.sections) {
        setTermsOfService(termsRes.data);
      }
    } catch (error) {
      console.error('Error fetching legal pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeTab === 'privacy') {
        await api.put('/settings/legal/privacy-policy', {
          ...privacyPolicy,
          lastUpdated: new Date().toISOString()
        });
      } else {
        await api.put('/settings/legal/terms-of-service', {
          ...termsOfService,
          lastUpdated: new Date().toISOString()
        });
      }
      alert('Changes saved successfully!');
      fetchLegalPages();
    } catch (error) {
      console.error('Error saving legal page:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const currentContent = activeTab === 'privacy' ? privacyPolicy : termsOfService;
  const setCurrentContent = activeTab === 'privacy' ? setPrivacyPolicy : setTermsOfService;

  const addSection = () => {
    setCurrentContent(prev => ({
      ...prev,
      sections: [...prev.sections, { title: '', content: '' }]
    }));
  };

  const updateSection = (index, field, value) => {
    setCurrentContent(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const removeSection = (index) => {
    setCurrentContent(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const moveSection = (index, direction) => {
    const newSections = [...currentContent.sections];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setCurrentContent(prev => ({ ...prev, sections: newSections }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-dark">Legal Pages</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-admin-primary"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'privacy'
              ? 'bg-primary-blue text-white'
              : 'bg-gray-100 text-text-dark hover:bg-gray-200'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'terms'
              ? 'bg-primary-blue text-white'
              : 'bg-gray-100 text-text-dark hover:bg-gray-200'
          }`}
        >
          Terms of Service
        </button>
      </div>

      {/* Content */}
      <div className="card-admin p-6">
        {/* Title */}
        <div className="mb-6">
          <label className="label-admin">Page Title</label>
          <input
            type="text"
            value={currentContent.title}
            onChange={(e) => setCurrentContent(prev => ({ ...prev, title: e.target.value }))}
            className="input-admin"
            placeholder="Enter page title"
          />
        </div>

        {/* Last Updated */}
        <div className="mb-6">
          <label className="label-admin">Last Updated Date</label>
          <input
            type="date"
            value={currentContent.lastUpdated ? new Date(currentContent.lastUpdated).toISOString().split('T')[0] : ''}
            onChange={(e) => setCurrentContent(prev => ({ ...prev, lastUpdated: e.target.value }))}
            className="input-admin"
          />
        </div>

        {/* Sections */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-text-dark">Content Sections</h3>
            <button
              onClick={addSection}
              className="btn-admin-secondary text-sm"
            >
              + Add Section
            </button>
          </div>

          {currentContent.sections.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <p>No sections added yet. Click "Add Section" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentContent.sections.map((section, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-text-muted">Section {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveSection(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="Move up"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveSection(index, 1)}
                        disabled={index === currentContent.sections.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        title="Move down"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeSection(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Delete section"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="label-admin">Section Title</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(index, 'title', e.target.value)}
                      className="input-admin"
                      placeholder="Enter section title"
                    />
                  </div>

                  <div>
                    <label className="label-admin">Section Content</label>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(index, 'content', e.target.value)}
                      className="input-admin"
                      rows={5}
                      placeholder="Enter section content"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalPagesAdmin;