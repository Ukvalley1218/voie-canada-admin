import { useState, useEffect } from 'react';
import api from '../services/api';

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [settings, setSettings] = useState({
    siteName: '',
    siteTagline: '',
    logo: '',
    hero: {
      badge: { text: '', icon: 'flag' },
      headline: '',
      subheadline: '',
      description: '',
      backgroundImage: '',
      overlayOpacity: 0.75,
      overlayDirection: 'left',
      textPosition: 'left',
      primaryCTA: { text: '', link: '' },
      secondaryCTA: { text: '', link: '' },
      showStats: true,
      stats: []
    },
    trustStats: [],
    processSteps: [],
    differentiator: {
      title: '',
      headline: '',
      description: '',
      points: [],
      imagurl: ''
    },
    faqs: [],
    contact: {
      email: '',
      phone: '',
      whatsapp: '',
      offices: []
    },
    socialLinks: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: ''
    },
    ctaSection: {
      headline: '',
      description: '',
      primaryButton: { text: '', link: '' },
      secondaryButton: { text: '', link: '' }
    },
    certifications: [],
    homepageSections: [],
    statsSection: {
      title: '',
      subtitle: '',
      stats: [],
      backgroundColor: 'gray'
    },
    testimonialsSection: {
      title: '',
      subtitle: '',
      description: '',
      backgroundColor: 'gray'
    },
    ctaBanner: {
      headline: '',
      description: '',
      backgroundImage: '',
      backgroundColor: 'blue',
      primaryButton: { text: '', link: '' },
      secondaryButton: { text: '', link: '' }
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings/public');
      if (response.success && response.data) {
        setSettings(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (path, value) => {
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current = newSettings;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    setSettings(newSettings);
  };

  const addTrustStat = () => {
    const newStats = [...settings.trustStats, { number: '', label: '' }];
    setSettings({ ...settings, trustStats: newStats });
  };

  const updateTrustStat = (index, field, value) => {
    const newStats = [...settings.trustStats];
    newStats[index] = { ...newStats[index], [field]: value };
    setSettings({ ...settings, trustStats: newStats });
  };

  const removeTrustStat = (index) => {
    const newStats = settings.trustStats.filter((_, i) => i !== index);
    setSettings({ ...settings, trustStats: newStats });
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'stats', label: 'Stats Section' },
    { id: 'homepage', label: 'Homepage Sections' },
    { id: 'process', label: 'Process Steps' },
    { id: 'differentiator', label: 'Why Choose Us' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'cta', label: 'CTA Banner' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'social', label: 'Social Links' },
    { id: 'certifications', label: 'Certifications' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl lg:text-2xl font-heading font-bold text-text-dark">Website Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-admin-primary disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="card-admin p-2 overflow-x-auto">
            <div className="flex lg:flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-blue text-white'
                      : 'text-text-muted hover:bg-secondary-gray'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="card-admin p-6">
            {/* Hero Section */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold mb-4">Hero Section</h2>

                {/* Badge */}
                <div className="bg-secondary-gray rounded-lg p-4">
                  <h3 className="font-medium mb-3">Badge (Top Label)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-admin">Badge Text</label>
                      <input
                        type="text"
                        value={settings.hero?.badge?.text || ''}
                        onChange={(e) => handleInputChange('hero.badge.text', e.target.value)}
                        className="input-admin"
                        placeholder="IMMIGRATION CANADA"
                      />
                    </div>
                    <div>
                      <label className="label-admin">Badge Icon</label>
                      <select
                        value={settings.hero?.badge?.icon || 'flag'}
                        onChange={(e) => handleInputChange('hero.badge.icon', e.target.value)}
                        className="input-admin bg-white"
                      >
                        <option value="flag">Flag</option>
                        <option value="globe">Globe</option>
                        <option value="star">Star</option>
                        <option value="check">Check</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <label className="label-admin">Headline</label>
                  <input
                    type="text"
                    value={settings.hero?.headline || ''}
                    onChange={(e) => handleInputChange('hero.headline', e.target.value)}
                    className="input-admin"
                    placeholder="Your Pathway to Canada"
                  />
                </div>
                <div>
                  <label className="label-admin">Subheadline</label>
                  <input
                    type="text"
                    value={settings.hero?.subheadline || ''}
                    onChange={(e) => handleInputChange('hero.subheadline', e.target.value)}
                    className="input-admin"
                    placeholder="Immigration & Education Made Personal"
                  />
                </div>
                <div>
                  <label className="label-admin">Description</label>
                  <textarea
                    value={settings.hero?.description || ''}
                    onChange={(e) => handleInputChange('hero.description', e.target.value)}
                    className="input-admin"
                    rows={3}
                    placeholder="Helping professionals, entrepreneurs, and students..."
                  />
                </div>

                {/* Background Image */}
                <div>
                  <label className="label-admin">Background Image URL</label>
                  <input
                    type="text"
                    value={settings.hero?.backgroundImage || ''}
                    onChange={(e) => handleInputChange('hero.backgroundImage', e.target.value)}
                    className="input-admin"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {settings.hero?.backgroundImage && (
                    <img
                      src={settings.hero.backgroundImage}
                      alt="Preview"
                      className="mt-2 w-full h-32 object-cover rounded"
                    />
                  )}
                </div>

                {/* Overlay Settings */}
                <div className="bg-secondary-gray rounded-lg p-4">
                  <h3 className="font-medium mb-3">Overlay Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-admin">Overlay Opacity (0-1)</label>
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.05"
                        value={settings.hero?.overlayOpacity ?? 0.75}
                        onChange={(e) => handleInputChange('hero.overlayOpacity', parseFloat(e.target.value))}
                        className="input-admin"
                      />
                    </div>
                    <div>
                      <label className="label-admin">Overlay Direction</label>
                      <select
                        value={settings.hero?.overlayDirection || 'left'}
                        onChange={(e) => handleInputChange('hero.overlayDirection', e.target.value)}
                        className="input-admin bg-white"
                      >
                        <option value="left">Left (Text on Left)</option>
                        <option value="right">Right (Text on Right)</option>
                        <option value="bottom">Bottom (Text on Top)</option>
                        <option value="full">Full (Even Overlay)</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="label-admin">Text Position</label>
                    <select
                      value={settings.hero?.textPosition || 'left'}
                      onChange={(e) => handleInputChange('hero.textPosition', e.target.value)}
                      className="input-admin bg-white"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-admin">Primary CTA Text</label>
                    <input
                      type="text"
                      value={settings.hero?.primaryCTA?.text || ''}
                      onChange={(e) => handleInputChange('hero.primaryCTA.text', e.target.value)}
                      className="input-admin"
                      placeholder="Explore Immigration Options"
                    />
                  </div>
                  <div>
                    <label className="label-admin">Primary CTA Link</label>
                    <input
                      type="text"
                      value={settings.hero?.primaryCTA?.link || ''}
                      onChange={(e) => handleInputChange('hero.primaryCTA.link', e.target.value)}
                      className="input-admin"
                      placeholder="/immigration"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-admin">Secondary CTA Text</label>
                    <input
                      type="text"
                      value={settings.hero?.secondaryCTA?.text || ''}
                      onChange={(e) => handleInputChange('hero.secondaryCTA.text', e.target.value)}
                      className="input-admin"
                      placeholder="Discover Education Programs"
                    />
                  </div>
                  <div>
                    <label className="label-admin">Secondary CTA Link</label>
                    <input
                      type="text"
                      value={settings.hero?.secondaryCTA?.link || ''}
                      onChange={(e) => handleInputChange('hero.secondaryCTA.link', e.target.value)}
                      className="input-admin"
                      placeholder="/education"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Show Stats in Hero</h3>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.hero?.showStats !== false}
                        onChange={(e) => handleInputChange('hero.showStats', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-text-muted">Display stats</span>
                    </label>
                  </div>

                  {(settings.hero?.stats || []).map((stat, index) => (
                    <div key={index} className="flex gap-4 items-center mb-2">
                      <input
                        type="text"
                        value={stat.value || ''}
                        onChange={(e) => {
                          const newStats = [...(settings.hero?.stats || [])];
                          newStats[index] = { ...newStats[index], value: e.target.value };
                          handleInputChange('hero.stats', newStats);
                        }}
                        className="input-admin w-32"
                        placeholder="500+"
                      />
                      <input
                        type="text"
                        value={stat.label || ''}
                        onChange={(e) => {
                          const newStats = [...(settings.hero?.stats || [])];
                          newStats[index] = { ...newStats[index], label: e.target.value };
                          handleInputChange('hero.stats', newStats);
                        }}
                        className="input-admin flex-1"
                        placeholder="Families Settled"
                      />
                      <button
                        onClick={() => {
                          const newStats = settings.hero?.stats?.filter((_, i) => i !== index) || [];
                          handleInputChange('hero.stats', newStats);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newStats = [...(settings.hero?.stats || []), { value: '', label: '' }];
                      handleInputChange('hero.stats', newStats);
                    }}
                    className="text-primary-blue hover:text-blue-700 mt-2"
                  >
                    + Add Stat
                  </button>
                </div>
              </div>
            )}

            {/* Trust Stats - Now part of Stats Section */}
            {activeTab === 'trust' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold mb-4">Trust Statistics</h2>
                {settings.trustStats?.map((stat, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <input
                      type="text"
                      value={stat.number}
                      onChange={(e) => updateTrustStat(index, 'number', e.target.value)}
                      className="input-admin w-32"
                      placeholder="500+"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateTrustStat(index, 'label', e.target.value)}
                      className="input-admin flex-1"
                      placeholder="Families Settled"
                    />
                    <button
                      onClick={() => removeTrustStat(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addTrustStat}
                  className="text-primary-blue hover:text-blue-700"
                >
                  + Add Stat
                </button>
              </div>
            )}

            {/* Process Steps */}
            {activeTab === 'process' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold mb-4">How It Works - Process Steps</h2>
                <p className="text-text-muted text-sm mb-4">Define the steps in your client journey process.</p>

                {(settings.processSteps || []).map((step, index) => (
                  <div key={index} className="bg-secondary-gray rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-text-dark">Step {step.number || index + 1}</span>
                      <button
                        onClick={() => {
                          const newSteps = settings.processSteps.filter((_, i) => i !== index);
                          handleInputChange('processSteps', newSteps);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="label-admin">Step Number</label>
                        <input
                          type="number"
                          value={step.number || index + 1}
                          onChange={(e) => {
                            const newSteps = [...settings.processSteps];
                            newSteps[index] = { ...newSteps[index], number: parseInt(e.target.value) || index + 1 };
                            handleInputChange('processSteps', newSteps);
                          }}
                          className="input-admin"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="label-admin">Title</label>
                        <input
                          type="text"
                          value={step.title || ''}
                          onChange={(e) => {
                            const newSteps = [...settings.processSteps];
                            newSteps[index] = { ...newSteps[index], title: e.target.value };
                            handleInputChange('processSteps', newSteps);
                          }}
                          className="input-admin"
                          placeholder="Free Consultation"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="label-admin">Description</label>
                      <textarea
                        value={step.description || ''}
                        onChange={(e) => {
                          const newSteps = [...settings.processSteps];
                          newSteps[index] = { ...newSteps[index], description: e.target.value };
                          handleInputChange('processSteps', newSteps);
                        }}
                        className="input-admin"
                        rows={2}
                        placeholder="Share your goals with us..."
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const newSteps = [...(settings.processSteps || []), {
                      number: (settings.processSteps?.length || 0) + 1,
                      title: '',
                      description: ''
                    }];
                    handleInputChange('processSteps', newSteps);
                  }}
                  className="text-primary-blue hover:text-blue-700"
                >
                  + Add Step
                </button>
              </div>
            )}

            {/* FAQs */}
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold mb-4">Frequently Asked Questions</h2>
                <p className="text-text-muted text-sm mb-4">Add common questions and answers for your visitors.</p>

                {(settings.faqs || []).map((faq, index) => (
                  <div key={index} className="bg-secondary-gray rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-text-dark">FAQ {index + 1}</span>
                      <button
                        onClick={() => {
                          const newFaqs = settings.faqs.filter((_, i) => i !== index);
                          handleInputChange('faqs', newFaqs);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mb-3">
                      <label className="label-admin">Category</label>
                      <select
                        value={faq.category || 'general'}
                        onChange={(e) => {
                          const newFaqs = [...settings.faqs];
                          newFaqs[index] = { ...newFaqs[index], category: e.target.value };
                          handleInputChange('faqs', newFaqs);
                        }}
                        className="input-admin bg-white"
                      >
                        <option value="general">General</option>
                        <option value="immigration">Immigration</option>
                        <option value="education">Education</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="label-admin">Question</label>
                      <input
                        type="text"
                        value={faq.question || ''}
                        onChange={(e) => {
                          const newFaqs = [...settings.faqs];
                          newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                          handleInputChange('faqs', newFaqs);
                        }}
                        className="input-admin"
                        placeholder="How long does the immigration process take?"
                      />
                    </div>
                    <div>
                      <label className="label-admin">Answer</label>
                      <textarea
                        value={faq.answer || ''}
                        onChange={(e) => {
                          const newFaqs = [...settings.faqs];
                          newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                          handleInputChange('faqs', newFaqs);
                        }}
                        className="input-admin"
                        rows={3}
                        placeholder="Processing times vary by program..."
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const newFaqs = [...(settings.faqs || []), {
                      question: '',
                      answer: '',
                      category: 'general'
                    }];
                    handleInputChange('faqs', newFaqs);
                  }}
                  className="text-primary-blue hover:text-blue-700"
                >
                  + Add FAQ
                </button>
              </div>
            )}

            {/* Differentiator */}
            {activeTab === 'differentiator' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold mb-4">Why Choose Us Section</h2>
                <div>
                  <label className="label-admin">Section Title</label>
                  <input
                    type="text"
                    value={settings.differentiator?.title || ''}
                    onChange={(e) => handleInputChange('differentiator.title', e.target.value)}
                    className="input-admin"
                    placeholder="Why Choose Us"
                  />
                </div>
                <div>
                  <label className="label-admin">Headline</label>
                  <input
                    type="text"
                    value={settings.differentiator?.headline || ''}
                    onChange={(e) => handleInputChange('differentiator.headline', e.target.value)}
                    className="input-admin"
                    placeholder="Inclusive Education & Tailored Immigration Support"
                  />
                </div>
                <div>
                  <label className="label-admin">Description</label>
                  <textarea
                    value={settings.differentiator?.description || ''}
                    onChange={(e) => handleInputChange('differentiator.description', e.target.value)}
                    className="input-admin"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="label-admin">Section Image URL</label>
                  <input
                    type="text"
                    value={settings.differentiator?.imagurl || ''}
                    onChange={(e) => handleInputChange('differentiator.imagurl', e.target.value)}
                    className="input-admin"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {settings.differentiator?.imagurl && (
                    <img src={settings.differentiator.imagurl} alt="Preview" className="mt-2 w-48 h-32 object-cover rounded" />
                  )}
                </div>
                {/* Points */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-medium">Key Points</label>
                    <button
                      onClick={() => {
                        const newPoints = [...(settings.differentiator?.points || []), { title: '', description: '' }];
                        handleInputChange('differentiator.points', newPoints);
                      }}
                      className="text-primary-blue hover:text-blue-700 text-sm"
                    >
                      + Add Point
                    </button>
                  </div>
                  {(settings.differentiator?.points || []).map((point, index) => (
                    <div key={index} className="bg-secondary-gray rounded-lg p-4 mb-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-text-muted">Point {index + 1}</span>
                        <button
                          onClick={() => {
                            const newPoints = settings.differentiator.points.filter((_, i) => i !== index);
                            handleInputChange('differentiator.points', newPoints);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        value={point.title || ''}
                        onChange={(e) => {
                          const newPoints = [...settings.differentiator.points];
                          newPoints[index] = { ...newPoints[index], title: e.target.value };
                          handleInputChange('differentiator.points', newPoints);
                        }}
                        className="input-admin mb-2"
                        placeholder="Point title"
                      />
                      <input
                        type="text"
                        value={point.description || ''}
                        onChange={(e) => {
                          const newPoints = [...settings.differentiator.points];
                          newPoints[index] = { ...newPoints[index], description: e.target.value };
                          handleInputChange('differentiator.points', newPoints);
                        }}
                        className="input-admin"
                        placeholder="Point description"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold mb-4">Contact Information</h2>
                <div>
                  <label className="label-admin">Email</label>
                  <input
                    type="email"
                    value={settings.contact?.email || ''}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    className="input-admin"
                    placeholder="info@voiecanada.com"
                  />
                </div>
                <div>
                  <label className="label-admin">Phone</label>
                  <input
                    type="text"
                    value={settings.contact?.phone || ''}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    className="input-admin"
                    placeholder="+1 (XXX) XXX-XXXX"
                  />
                </div>
                <div>
                  <label className="label-admin">WhatsApp</label>
                  <input
                    type="text"
                    value={settings.contact?.whatsapp || ''}
                    onChange={(e) => handleInputChange('contact.whatsapp', e.target.value)}
                    className="input-admin"
                    placeholder="+1XXXXXXXXXX"
                  />
                </div>

                {/* Offices Section */}
                <div className="border-t pt-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-heading font-semibold">Our Offices</h3>
                    <button
                      onClick={() => {
                        const newOffices = [...(settings.contact?.offices || []), {
                          country: '',
                          city: '',
                          address: '',
                          phone: '',
                          email: '',
                          hours: '',
                          mapLink: ''
                        }];
                        handleInputChange('contact.offices', newOffices);
                      }}
                      className="text-primary-blue hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Office
                    </button>
                  </div>

                  {(settings.contact?.offices || []).map((office, index) => (
                    <div key={index} className="bg-secondary-gray rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-text-dark">Office {index + 1}</span>
                        <button
                          onClick={() => {
                            const newOffices = settings.contact.offices.filter((_, i) => i !== index);
                            handleInputChange('contact.offices', newOffices);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label-admin">Country</label>
                          <input
                            type="text"
                            value={office.country || ''}
                            onChange={(e) => {
                              const newOffices = [...settings.contact.offices];
                              newOffices[index] = { ...newOffices[index], country: e.target.value };
                              handleInputChange('contact.offices', newOffices);
                            }}
                            className="input-admin"
                            placeholder="Canada"
                          />
                        </div>
                        <div>
                          <label className="label-admin">City</label>
                          <input
                            type="text"
                            value={office.city || ''}
                            onChange={(e) => {
                              const newOffices = [...settings.contact.offices];
                              newOffices[index] = { ...newOffices[index], city: e.target.value };
                              handleInputChange('contact.offices', newOffices);
                            }}
                            className="input-admin"
                            placeholder="Toronto"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="label-admin">Address</label>
                        <input
                          type="text"
                          value={office.address || ''}
                          onChange={(e) => {
                            const newOffices = [...settings.contact.offices];
                            newOffices[index] = { ...newOffices[index], address: e.target.value };
                            handleInputChange('contact.offices', newOffices);
                          }}
                          className="input-admin"
                          placeholder="123 Main Street, Suite 400"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="label-admin">Phone</label>
                          <input
                            type="text"
                            value={office.phone || ''}
                            onChange={(e) => {
                              const newOffices = [...settings.contact.offices];
                              newOffices[index] = { ...newOffices[index], phone: e.target.value };
                              handleInputChange('contact.offices', newOffices);
                            }}
                            className="input-admin"
                            placeholder="+1 (416) XXX-XXXX"
                          />
                        </div>
                        <div>
                          <label className="label-admin">Email</label>
                          <input
                            type="email"
                            value={office.email || ''}
                            onChange={(e) => {
                              const newOffices = [...settings.contact.offices];
                              newOffices[index] = { ...newOffices[index], email: e.target.value };
                              handleInputChange('contact.offices', newOffices);
                            }}
                            className="input-admin"
                            placeholder="toronto@voiecanada.com"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="label-admin">Working Hours</label>
                        <input
                          type="text"
                          value={office.hours || ''}
                          onChange={(e) => {
                            const newOffices = [...settings.contact.offices];
                            newOffices[index] = { ...newOffices[index], hours: e.target.value };
                            handleInputChange('contact.offices', newOffices);
                          }}
                          className="input-admin"
                          placeholder="Mon-Fri: 9:00 AM - 6:00 PM EST"
                        />
                      </div>
                      <div className="mt-3">
                        <label className="label-admin">Google Maps Link</label>
                        <input
                          type="text"
                          value={office.mapLink || ''}
                          onChange={(e) => {
                            const newOffices = [...settings.contact.offices];
                            newOffices[index] = { ...newOffices[index], mapLink: e.target.value };
                            handleInputChange('contact.offices', newOffices);
                          }}
                          className="input-admin"
                          placeholder="https://maps.google.com/?q=..."
                        />
                        <p className="text-xs text-text-muted mt-1">Paste a Google Maps share link or coordinates</p>
                      </div>
                    </div>
                  ))}

                  {(!settings.contact?.offices || settings.contact.offices.length === 0) && (
                    <p className="text-text-muted text-sm">No offices added yet. Click "Add Office" to add one.</p>
                  )}
                </div>
              </div>
            )}

            {/* Social Links */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold mb-4">Social Media Links</h2>
                {['facebook', 'instagram', 'linkedin', 'twitter', 'youtube'].map((platform) => (
                  <div key={platform}>
                    <label className="label-admin">{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                    <input
                      type="text"
                      value={settings.socialLinks?.[platform] || ''}
                      onChange={(e) => handleInputChange(`socialLinks.${platform}`, e.target.value)}
                      className="input-admin"
                      placeholder={`https://${platform}.com/voiecanada`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* CTA Section */}
            {activeTab === 'cta' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold mb-4">Call-to-Action Section</h2>
                <div>
                  <label className="label-admin">Headline</label>
                  <input
                    type="text"
                    value={settings.ctaSection?.headline || ''}
                    onChange={(e) => handleInputChange('ctaSection.headline', e.target.value)}
                    className="input-admin"
                    placeholder="Start Your Canadian Journey Today"
                  />
                </div>
                <div>
                  <label className="label-admin">Description</label>
                  <textarea
                    value={settings.ctaSection?.description || ''}
                    onChange={(e) => handleInputChange('ctaSection.description', e.target.value)}
                    className="input-admin"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-admin">Primary Button Text</label>
                    <input
                      type="text"
                      value={settings.ctaSection?.primaryButton?.text || ''}
                      onChange={(e) => handleInputChange('ctaSection.primaryButton.text', e.target.value)}
                      className="input-admin"
                      placeholder="Free Assessment"
                    />
                  </div>
                  <div>
                    <label className="label-admin">Primary Button Link</label>
                    <input
                      type="text"
                      value={settings.ctaSection?.primaryButton?.link || ''}
                      onChange={(e) => handleInputChange('ctaSection.primaryButton.link', e.target.value)}
                      className="input-admin"
                      placeholder="/assessment"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-admin">Secondary Button Text</label>
                    <input
                      type="text"
                      value={settings.ctaSection?.secondaryButton?.text || ''}
                      onChange={(e) => handleInputChange('ctaSection.secondaryButton.text', e.target.value)}
                      className="input-admin"
                      placeholder="Book Consultation"
                    />
                  </div>
                  <div>
                    <label className="label-admin">Secondary Button Link</label>
                    <input
                      type="text"
                      value={settings.ctaSection?.secondaryButton?.link || ''}
                      onChange={(e) => handleInputChange('ctaSection.secondaryButton.link', e.target.value)}
                      className="input-admin"
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stats Section */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h2 className="text-lg font-heading font-semibold mb-4">Stats Section</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-admin">Section Title</label>
                    <input
                      type="text"
                      value={settings.statsSection?.title || ''}
                      onChange={(e) => handleInputChange('statsSection.title', e.target.value)}
                      className="input-admin"
                      placeholder="Trusted by Hundreds of Families"
                    />
                  </div>
                  <div>
                    <label className="label-admin">Section Subtitle</label>
                    <input
                      type="text"
                      value={settings.statsSection?.subtitle || ''}
                      onChange={(e) => handleInputChange('statsSection.subtitle', e.target.value)}
                      className="input-admin"
                      placeholder="Our track record speaks for itself"
                    />
                  </div>
                </div>
                <div>
                  <label className="label-admin">Background Color</label>
                  <select
                    value={settings.statsSection?.backgroundColor || 'gray'}
                    onChange={(e) => handleInputChange('statsSection.backgroundColor', e.target.value)}
                    className="input-admin bg-white"
                  >
                    <option value="white">White</option>
                    <option value="gray">Gray</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Statistics</h3>
                    <button
                      onClick={() => {
                        const newStats = [...(settings.statsSection?.stats || []), { number: '', label: '', icon: 'check', description: '' }];
                        handleInputChange('statsSection.stats', newStats);
                      }}
                      className="text-primary-blue hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Stat
                    </button>
                  </div>
                  {(settings.statsSection?.stats || []).map((stat, index) => (
                    <div key={index} className="bg-secondary-gray rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-text-dark">Stat {index + 1}</span>
                        <button
                          onClick={() => {
                            const newStats = settings.statsSection.stats.filter((_, i) => i !== index);
                            handleInputChange('statsSection.stats', newStats);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label-admin">Number (e.g., 500+)</label>
                          <input
                            type="text"
                            value={stat.number || ''}
                            onChange={(e) => {
                              const newStats = [...settings.statsSection.stats];
                              newStats[index] = { ...newStats[index], number: e.target.value };
                              handleInputChange('statsSection.stats', newStats);
                            }}
                            className="input-admin"
                            placeholder="500+"
                          />
                        </div>
                        <div>
                          <label className="label-admin">Label</label>
                          <input
                            type="text"
                            value={stat.label || ''}
                            onChange={(e) => {
                              const newStats = [...settings.statsSection.stats];
                              newStats[index] = { ...newStats[index], label: e.target.value };
                              handleInputChange('statsSection.stats', newStats);
                            }}
                            className="input-admin"
                            placeholder="Families Settled"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <label className="label-admin">Icon</label>
                          <select
                            value={stat.icon || 'check'}
                            onChange={(e) => {
                              const newStats = [...settings.statsSection.stats];
                              newStats[index] = { ...newStats[index], icon: e.target.value };
                              handleInputChange('statsSection.stats', newStats);
                            }}
                            className="input-admin bg-white"
                          >
                            <option value="users">Users</option>
                            <option value="graduation">Graduation</option>
                            <option value="check">Check</option>
                            <option value="globe">Globe</option>
                            <option value="star">Star</option>
                          </select>
                        </div>
                        <div>
                          <label className="label-admin">Description</label>
                          <input
                            type="text"
                            value={stat.description || ''}
                            onChange={(e) => {
                              const newStats = [...settings.statsSection.stats];
                              newStats[index] = { ...newStats[index], description: e.target.value };
                              handleInputChange('statsSection.stats', newStats);
                            }}
                            className="input-admin"
                            placeholder="Successfully helped families relocate"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Homepage Sections */}
            {activeTab === 'homepage' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-heading font-semibold">Homepage Sections</h2>
                  <button
                    onClick={() => {
                      const newSections = [...(settings.homepageSections || []), {
                        id: `section-${Date.now()}`,
                        type: 'image-content',
                        title: '',
                        subtitle: '',
                        description: '',
                        image: '',
                        imageAlt: '',
                        points: [],
                        cta: { primary: { text: '', link: '' }, secondary: { text: '', link: '' } },
                        backgroundColor: 'white',
                        order: (settings.homepageSections?.length || 0) + 1,
                        isActive: true
                      }];
                      handleInputChange('homepageSections', newSections);
                    }}
                    className="btn-admin-primary text-sm"
                  >
                    + Add Section
                  </button>
                </div>

                {(settings.homepageSections || []).map((section, index) => (
                  <div key={section.id || index} className="bg-secondary-gray rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-text-dark">Section {index + 1}</span>
                        <span className={`px-2 py-1 rounded text-xs ${section.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                          {section.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newSections = [...settings.homepageSections];
                            newSections[index] = { ...newSections[index], isActive: !newSections[index].isActive };
                            handleInputChange('homepageSections', newSections);
                          }}
                          className="text-primary-blue hover:text-blue-700 text-sm"
                        >
                          {section.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => {
                            const newSections = settings.homepageSections.filter((_, i) => i !== index);
                            handleInputChange('homepageSections', newSections);
                          }}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="label-admin">Type</label>
                        <select
                          value={section.type || 'image-content'}
                          onChange={(e) => {
                            const newSections = [...settings.homepageSections];
                            newSections[index] = { ...newSections[index], type: e.target.value };
                            handleInputChange('homepageSections', newSections);
                          }}
                          className="input-admin bg-white"
                        >
                          <option value="image-content">Image Left / Content Right</option>
                          <option value="content-image">Content Left / Image Right</option>
                        </select>
                      </div>
                      <div>
                        <label className="label-admin">Order</label>
                        <input
                          type="number"
                          value={section.order || index + 1}
                          onChange={(e) => {
                            const newSections = [...settings.homepageSections];
                            newSections[index] = { ...newSections[index], order: parseInt(e.target.value) || index + 1 };
                            handleInputChange('homepageSections', newSections);
                          }}
                          className="input-admin"
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="label-admin">Title</label>
                        <input
                          type="text"
                          value={section.title || ''}
                          onChange={(e) => {
                            const newSections = [...settings.homepageSections];
                            newSections[index] = { ...newSections[index], title: e.target.value };
                            handleInputChange('homepageSections', newSections);
                          }}
                          className="input-admin"
                          placeholder="Study in Canada"
                        />
                      </div>
                      <div>
                        <label className="label-admin">Subtitle</label>
                        <input
                          type="text"
                          value={section.subtitle || ''}
                          onChange={(e) => {
                            const newSections = [...settings.homepageSections];
                            newSections[index] = { ...newSections[index], subtitle: e.target.value };
                            handleInputChange('homepageSections', newSections);
                          }}
                          className="input-admin"
                          placeholder="Education Pathways"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="label-admin">Description</label>
                      <textarea
                        value={section.description || ''}
                        onChange={(e) => {
                          const newSections = [...settings.homepageSections];
                          newSections[index] = { ...newSections[index], description: e.target.value };
                          handleInputChange('homepageSections', newSections);
                        }}
                        className="input-admin"
                        rows={3}
                        placeholder="Section description..."
                      />
                    </div>

                    <div className="mb-4">
                      <label className="label-admin">Image URL</label>
                      <input
                        type="text"
                        value={section.image || ''}
                        onChange={(e) => {
                          const newSections = [...settings.homepageSections];
                          newSections[index] = { ...newSections[index], image: e.target.value };
                          handleInputChange('homepageSections', newSections);
                        }}
                        className="input-admin"
                        placeholder="https://images.unsplash.com/..."
                      />
                      {section.image && (
                        <img src={section.image} alt="Preview" className="mt-2 w-32 h-20 object-cover rounded" />
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="label-admin">Background Color</label>
                      <select
                        value={section.backgroundColor || 'white'}
                        onChange={(e) => {
                          const newSections = [...settings.homepageSections];
                          newSections[index] = { ...newSections[index], backgroundColor: e.target.value };
                          handleInputChange('homepageSections', newSections);
                        }}
                        className="input-admin bg-white"
                      >
                        <option value="white">White</option>
                        <option value="gray">Gray</option>
                      </select>
                    </div>

                    {/* Points */}
                    <div className="border-t pt-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-medium">Points</label>
                        <button
                          onClick={() => {
                            const newSections = [...settings.homepageSections];
                            const points = [...(newSections[index].points || []), { title: '', description: '', icon: 'check' }];
                            newSections[index] = { ...newSections[index], points };
                            handleInputChange('homepageSections', newSections);
                          }}
                          className="text-primary-blue hover:text-blue-700 text-sm"
                        >
                          + Add Point
                        </button>
                      </div>
                      {(section.points || []).map((point, pIndex) => (
                        <div key={pIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={point.title || ''}
                            onChange={(e) => {
                              const newSections = [...settings.homepageSections];
                              const points = [...newSections[index].points];
                              points[pIndex] = { ...points[pIndex], title: e.target.value };
                              newSections[index] = { ...newSections[index], points };
                              handleInputChange('homepageSections', newSections);
                            }}
                            className="input-admin flex-1"
                            placeholder="Point title"
                          />
                          <input
                            type="text"
                            value={point.description || ''}
                            onChange={(e) => {
                              const newSections = [...settings.homepageSections];
                              const points = [...newSections[index].points];
                              points[pIndex] = { ...points[pIndex], description: e.target.value };
                              newSections[index] = { ...newSections[index], points };
                              handleInputChange('homepageSections', newSections);
                            }}
                            className="input-admin flex-1"
                            placeholder="Point description"
                          />
                          <select
                            value={point.icon || 'check'}
                            onChange={(e) => {
                              const newSections = [...settings.homepageSections];
                              const points = [...newSections[index].points];
                              points[pIndex] = { ...points[pIndex], icon: e.target.value };
                              newSections[index] = { ...newSections[index], points };
                              handleInputChange('homepageSections', newSections);
                            }}
                            className="input-admin bg-white w-28"
                          >
                            <option value="check">Check</option>
                            <option value="academic">Academic</option>
                            <option value="work">Work</option>
                            <option value="globe">Globe</option>
                            <option value="rocket">Rocket</option>
                            <option value="heart">Heart</option>
                            <option value="lightbulb">Lightbulb</option>
                          </select>
                          <button
                            onClick={() => {
                              const newSections = [...settings.homepageSections];
                              const points = newSections[index].points.filter((_, i) => i !== pIndex);
                              newSections[index] = { ...newSections[index], points };
                              handleInputChange('homepageSections', newSections);
                            }}
                            className="text-red-500 hover:text-red-700 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="border-t pt-4">
                      <label className="font-medium mb-2 block">CTA Buttons</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label-admin">Primary Button Text</label>
                          <input
                            type="text"
                            value={section.cta?.primary?.text || ''}
                            onChange={(e) => {
                              const newSections = [...settings.homepageSections];
                              newSections[index] = {
                                ...newSections[index],
                                cta: { ...newSections[index].cta, primary: { ...newSections[index].cta?.primary, text: e.target.value } }
                              };
                              handleInputChange('homepageSections', newSections);
                            }}
                            className="input-admin"
                            placeholder="Learn More"
                          />
                        </div>
                        <div>
                          <label className="label-admin">Primary Button Link</label>
                          <input
                            type="text"
                            value={section.cta?.primary?.link || ''}
                            onChange={(e) => {
                              const newSections = [...settings.homepageSections];
                              newSections[index] = {
                                ...newSections[index],
                                cta: { ...newSections[index].cta, primary: { ...newSections[index].cta?.primary, link: e.target.value } }
                              };
                              handleInputChange('homepageSections', newSections);
                            }}
                            className="input-admin"
                            placeholder="/page"
                          />
                        </div>
                        <div>
                          <label className="label-admin">Secondary Button Text</label>
                          <input
                            type="text"
                            value={section.cta?.secondary?.text || ''}
                            onChange={(e) => {
                              const newSections = [...settings.homepageSections];
                              newSections[index] = {
                                ...newSections[index],
                                cta: { ...newSections[index].cta, secondary: { ...newSections[index].cta?.secondary, text: e.target.value } }
                              };
                              handleInputChange('homepageSections', newSections);
                            }}
                            className="input-admin"
                            placeholder="Contact Us"
                          />
                        </div>
                        <div>
                          <label className="label-admin">Secondary Button Link</label>
                          <input
                            type="text"
                            value={section.cta?.secondary?.link || ''}
                            onChange={(e) => {
                              const newSections = [...settings.homepageSections];
                              newSections[index] = {
                                ...newSections[index],
                                cta: { ...newSections[index].cta, secondary: { ...newSections[index].cta?.secondary, link: e.target.value } }
                              };
                              handleInputChange('homepageSections', newSections);
                            }}
                            className="input-admin"
                            placeholder="/contact"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {(!settings.homepageSections || settings.homepageSections.length === 0) && (
                  <p className="text-text-muted text-center py-8">No homepage sections added yet. Click "Add Section" to create one.</p>
                )}
              </div>
            )}

            {/* Testimonials Section Settings */}
            {activeTab === 'testimonials' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold mb-4">Testimonials Section</h2>
                <div>
                  <label className="label-admin">Section Title</label>
                  <input
                    type="text"
                    value={settings.testimonialsSection?.title || ''}
                    onChange={(e) => handleInputChange('testimonialsSection.title', e.target.value)}
                    className="input-admin"
                    placeholder="Success Stories"
                  />
                </div>
                <div>
                  <label className="label-admin">Section Subtitle</label>
                  <input
                    type="text"
                    value={settings.testimonialsSection?.subtitle || ''}
                    onChange={(e) => handleInputChange('testimonialsSection.subtitle', e.target.value)}
                    className="input-admin"
                    placeholder="Real Journeys. Real Success."
                  />
                </div>
                <div>
                  <label className="label-admin">Description</label>
                  <textarea
                    value={settings.testimonialsSection?.description || ''}
                    onChange={(e) => handleInputChange('testimonialsSection.description', e.target.value)}
                    className="input-admin"
                    rows={3}
                    placeholder="From visa approvals to inclusive education placements..."
                  />
                </div>
                <div>
                  <label className="label-admin">Background Color</label>
                  <select
                    value={settings.testimonialsSection?.backgroundColor || 'gray'}
                    onChange={(e) => handleInputChange('testimonialsSection.backgroundColor', e.target.value)}
                    className="input-admin bg-white"
                  >
                    <option value="white">White</option>
                    <option value="gray">Gray</option>
                  </select>
                </div>
                <p className="text-text-muted text-sm">
                  Note: Individual testimonials are managed in the Testimonials section of the admin panel.
                </p>
              </div>
            )}

            {/* CTA Banner */}
            {activeTab === 'cta' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold mb-4">CTA Banner</h2>
                <div>
                  <label className="label-admin">Headline</label>
                  <input
                    type="text"
                    value={settings.ctaBanner?.headline || ''}
                    onChange={(e) => handleInputChange('ctaBanner.headline', e.target.value)}
                    className="input-admin"
                    placeholder="Start Your Canadian Journey Today"
                  />
                </div>
                <div>
                  <label className="label-admin">Description</label>
                  <textarea
                    value={settings.ctaBanner?.description || ''}
                    onChange={(e) => handleInputChange('ctaBanner.description', e.target.value)}
                    className="input-admin"
                    rows={3}
                    placeholder="Take the first step towards your Canadian dream..."
                  />
                </div>
                <div>
                  <label className="label-admin">Background Image URL</label>
                  <input
                    type="text"
                    value={settings.ctaBanner?.backgroundImage || ''}
                    onChange={(e) => handleInputChange('ctaBanner.backgroundImage', e.target.value)}
                    className="input-admin"
                    placeholder="https://images.unsplash.com/..."
                  />
                  {settings.ctaBanner?.backgroundImage && (
                    <img src={settings.ctaBanner.backgroundImage} alt="Preview" className="mt-2 w-48 h-24 object-cover rounded" />
                  )}
                </div>
                <div>
                  <label className="label-admin">Background Style</label>
                  <select
                    value={settings.ctaBanner?.backgroundColor || 'blue'}
                    onChange={(e) => handleInputChange('ctaBanner.backgroundColor', e.target.value)}
                    className="input-admin bg-white"
                  >
                    <option value="blue">Blue</option>
                    <option value="gradient">Gradient</option>
                    <option value="image">Image Background</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-admin">Primary Button Text</label>
                    <input
                      type="text"
                      value={settings.ctaBanner?.primaryButton?.text || ''}
                      onChange={(e) => handleInputChange('ctaBanner.primaryButton.text', e.target.value)}
                      className="input-admin"
                      placeholder="Free Assessment"
                    />
                  </div>
                  <div>
                    <label className="label-admin">Primary Button Link</label>
                    <input
                      type="text"
                      value={settings.ctaBanner?.primaryButton?.link || ''}
                      onChange={(e) => handleInputChange('ctaBanner.primaryButton.link', e.target.value)}
                      className="input-admin"
                      placeholder="/assessment"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-admin">Secondary Button Text</label>
                    <input
                      type="text"
                      value={settings.ctaBanner?.secondaryButton?.text || ''}
                      onChange={(e) => handleInputChange('ctaBanner.secondaryButton.text', e.target.value)}
                      className="input-admin"
                      placeholder="Book Consultation"
                    />
                  </div>
                  <div>
                    <label className="label-admin">Secondary Button Link</label>
                    <input
                      type="text"
                      value={settings.ctaBanner?.secondaryButton?.link || ''}
                      onChange={(e) => handleInputChange('ctaBanner.secondaryButton.link', e.target.value)}
                      className="input-admin"
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Certifications */}
            {activeTab === 'certifications' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold mb-4">Certifications & Affiliations</h2>
                {(settings.certifications || []).map((cert, index) => (
                  <div key={index} className="p-4 bg-secondary-gray rounded-lg">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="label-admin">Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const newCerts = [...settings.certifications];
                            newCerts[index].name = e.target.value;
                            setSettings({ ...settings, certifications: newCerts });
                          }}
                          className="input-admin"
                          placeholder="ICCRC"
                        />
                      </div>
                      <div>
                        <label className="label-admin">Logo URL</label>
                        <input
                          type="text"
                          value={cert.logo || ''}
                          onChange={(e) => {
                            const newCerts = [...settings.certifications];
                            newCerts[index].logo = e.target.value;
                            setSettings({ ...settings, certifications: newCerts });
                          }}
                          className="input-admin"
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label-admin">Description</label>
                      <input
                        type="text"
                        value={cert.description}
                        onChange={(e) => {
                          const newCerts = [...settings.certifications];
                          newCerts[index].description = e.target.value;
                          setSettings({ ...settings, certifications: newCerts });
                        }}
                        className="input-admin"
                        placeholder="Immigration Consultants of Canada Regulatory Council"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newCerts = [...(settings.certifications || []), { name: '', description: '', logo: '' }];
                    setSettings({ ...settings, certifications: newCerts });
                  }}
                  className="text-primary-blue hover:text-blue-700"
                >
                  + Add Certification
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;