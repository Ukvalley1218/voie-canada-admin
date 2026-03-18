import { useState, useEffect } from 'react';
import api from '../services/api';

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    serviceType: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.serviceType) params.append('serviceType', filter.serviceType);
      params.append('page', filter.page);
      params.append('limit', filter.limit);

      const response = await api.get(`/inquiries?${params}`);
      setInquiries(response.data || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status });
      fetchInquiries();
      if (selectedInquiry?._id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (error) {
      console.error('Error updating status:', error);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-dark">Inquiries</h1>
        <span className="text-sm text-text-muted">
          Total: {pagination.total || 0} inquiries
        </span>
      </div>

      {/* Filters */}
      <div className="card-admin p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value, page: 1 })}
            className="input-admin w-auto"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filter.serviceType}
            onChange={(e) => setFilter({ ...filter, serviceType: e.target.value, page: 1 })}
            className="input-admin w-auto"
          >
            <option value="">All Services</option>
            <option value="immigration">Immigration</option>
            <option value="education">Education</option>
          </select>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="card-admin overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-text-muted">No inquiries found</div>
        ) : (
          <>
            <table className="table-admin">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry._id}>
                    <td className="font-medium">{inquiry.name}</td>
                    <td>{inquiry.email}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        inquiry.serviceType === 'immigration'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {inquiry.serviceType}
                      </span>
                    </td>
                    <td>
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry._id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs border-0 ${getStatusBadge(inquiry.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap">{formatDate(inquiry.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="text-primary-blue hover:text-blue-700 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="p-4 border-t border-admin-border flex items-center justify-between">
                <button
                  onClick={() => setFilter({ ...filter, page: filter.page - 1 })}
                  disabled={filter.page === 1}
                  className="btn-admin-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-text-muted">
                  Page {filter.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setFilter({ ...filter, page: filter.page + 1 })}
                  disabled={filter.page === pagination.pages}
                  className="btn-admin-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card-admin max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-admin-border flex items-center justify-between">
              <h2 className="text-lg font-heading font-semibold">Inquiry Details</h2>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-text-muted hover:text-text-dark"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="label-admin">Name</label>
                <p className="text-text-dark">{selectedInquiry.name}</p>
              </div>
              <div>
                <label className="label-admin">Email</label>
                <p className="text-text-dark">{selectedInquiry.email}</p>
              </div>
              {selectedInquiry.phone && (
                <div>
                  <label className="label-admin">Phone</label>
                  <p className="text-text-dark">{selectedInquiry.phone}</p>
                </div>
              )}
              <div>
                <label className="label-admin">Service Type</label>
                <p className="text-text-dark capitalize">{selectedInquiry.serviceType}</p>
              </div>
              {selectedInquiry.specificService && (
                <div>
                  <label className="label-admin">Specific Service</label>
                  <p className="text-text-dark">{selectedInquiry.specificService}</p>
                </div>
              )}
              {selectedInquiry.message && (
                <div>
                  <label className="label-admin">Message</label>
                  <p className="text-text-dark whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              )}
              <div>
                <label className="label-admin">Status</label>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(selectedInquiry.status)}`}>
                    {selectedInquiry.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="label-admin">Submitted</label>
                <p className="text-text-dark">{formatDate(selectedInquiry.createdAt)}</p>
              </div>
            </div>
            <div className="p-4 border-t border-admin-border flex justify-end gap-2">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="btn-admin-secondary"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedInquiry.email}`}
                className="btn-admin-primary"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;