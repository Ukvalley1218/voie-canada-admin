import { useState, useEffect } from 'react';
import api from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    immigrationInquiries: 0,
    educationInquiries: 0,
    totalServices: 0,
    totalBlogPosts: 0,
    totalTestimonials: 0
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [inquiriesRes, servicesRes, blogRes, testimonialsRes] = await Promise.all([
        api.get('/inquiries?limit=5'),
        api.get('/services'),
        api.get('/blog?limit=5'),
        api.get('/testimonials?limit=5')
      ]);

      // Calculate stats
      const inquiries = inquiriesRes.data || [];
      const newInquiries = inquiries.filter(i => i.status === 'new').length;
      const immigrationInquiries = inquiries.filter(i => i.serviceType === 'immigration').length;
      const educationInquiries = inquiries.filter(i => i.serviceType === 'education').length;

      setStats({
        totalInquiries: inquiriesRes.pagination?.total || inquiries.length,
        newInquiries,
        immigrationInquiries,
        educationInquiries,
        totalServices: servicesRes.data?.length || 0,
        totalBlogPosts: blogRes.pagination?.total || 0,
        totalTestimonials: testimonialsRes.data?.length || 0
      });

      setRecentInquiries(inquiries.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statCards = [
    {
      title: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      title: 'New Inquiries',
      value: stats.newInquiries,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      title: 'Immigration',
      value: stats.immigrationInquiries,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-primary-blue'
    },
    {
      title: 'Education',
      value: stats.educationInquiries,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      color: 'bg-purple-500'
    }
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
      <h1 className="text-2xl font-heading font-bold text-text-dark mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card-admin p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">{stat.title}</p>
                <p className="text-3xl font-heading font-bold text-text-dark">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="card-admin">
          <div className="p-4 border-b border-admin-border">
            <h2 className="text-lg font-heading font-semibold text-text-dark">Recent Inquiries</h2>
          </div>
          <div className="p-4">
            {recentInquiries.length === 0 ? (
              <p className="text-text-muted text-center py-8">No inquiries yet</p>
            ) : (
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry._id} className="flex items-center justify-between p-3 bg-secondary-gray rounded-lg">
                    <div>
                      <p className="font-medium text-text-dark">{inquiry.name}</p>
                      <p className="text-sm text-text-muted">{inquiry.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                      <p className="text-xs text-text-muted mt-1">{inquiry.serviceType}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card-admin">
          <div className="p-4 border-b border-admin-border">
            <h2 className="text-lg font-heading font-semibold text-text-dark">Content Overview</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary-gray rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="ml-3 font-medium text-text-dark">Services</span>
              </div>
              <span className="text-2xl font-heading font-bold text-text-dark">{stats.totalServices}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary-gray rounded-lg">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <span className="ml-3 font-medium text-text-dark">Blog Posts</span>
              </div>
              <span className="text-2xl font-heading font-bold text-text-dark">{stats.totalBlogPosts}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary-gray rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="ml-3 font-medium text-text-dark">Testimonials</span>
              </div>
              <span className="text-2xl font-heading font-bold text-text-dark">{stats.totalTestimonials}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;