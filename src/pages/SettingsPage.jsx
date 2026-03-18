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
      headline: '',
      subheadline: '',
      description: '',
      backgroundImage: '',
      primaryCTA: { text: '', link: '' },
      secondaryCTA: { text: '', link: '' }
    },
    trustStats: [],
    differentiator: {
      title: '',
      headline: '',
      description: '',
      points: []
    },
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
    certifications: []
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
    { id: 'trust', label: 'Trust Stats' },
    { id: 'differentiator', label: 'Why Choose Us' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'social', label: 'Social Links' },
    { id: 'cta', label: 'CTA Section' },
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-dark">Website Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-admin-primary disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="card-admin p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
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

        {/* Content */}
        <div className="flex-1">
          <div className="card-admin p-6">
            {/* Hero Section */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <h2 className="text-lg font-heading font-semibold mb-4">Hero Section</h2>
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
                <div>
                  <label className="label-admin">Background Image URL</label>
                  <input
                    type="text"
                    value={settings.hero?.backgroundImage || ''}
                    onChange={(e) => handleInputChange('hero.backgroundImage', e.target.value)}
                    className="input-admin"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
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
              </div>
            )}

            {/* Trust Stats */}
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
              </div>
            )}

            {/* Contact Info */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
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