import { useState, useEffect, useCallback } from "react";
import API from "../api/api";
import useAuthStore from "../store/authStore";
import { CopyCheck, XCircle, AlertCircle, RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";

function AdminDashboard() {
  const token = useAuthStore((state) => state.token);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/claims", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClaims(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch claim requests");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleAction = async (claimId, action) => {
    try {
      await API.put(`/claims/${action}/${claimId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Claim successfully ${action}d!`);
      // Refresh claims after action
      fetchClaims();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || `Failed to ${action} claim`);
    }
  };

  if (loading && claims.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 font-medium">Manage and review incoming claim requests</p>
        </div>
        <button 
          onClick={fetchClaims} 
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors shrink-0 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh Claims
        </button>
      </div>

      {claims.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 text-center py-20 px-8 rounded-4xl max-w-3xl mx-auto flex flex-col items-center">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-slate-100 shadow-inner">
            <FileText size={40} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">No claims to review</h2>
          <p className="text-slate-500 font-medium text-lg">All caught up! There are no pending claims at the moment.</p>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-xs tracking-wider">
                  <th className="px-6 py-5">Item Details</th>
                  <th className="px-6 py-5">Claimant</th>
                  <th className="px-6 py-5 min-w-[300px]">Proof of Ownership</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 align-top">
                      {claim.item ? (
                        <div>
                          <p className="font-bold text-slate-900 text-[15px]">{claim.item.title}</p>
                          <p className="text-sm text-slate-500 mt-1 capitalize">{claim.item.category}</p>
                        </div>
                      ) : (
                        <span className="text-red-500 text-sm italic">Item deleted</span>
                      )}
                    </td>
                    <td className="px-6 py-5 align-top">
                      {claim.claimant ? (
                        <div>
                          <p className="font-bold text-slate-900">{claim.claimant.fullName}</p>
                          <p className="text-sm text-slate-500 mt-1">{claim.claimant.email}</p>
                        </div>
                      ) : (
                        <span className="text-red-500 text-sm italic">User deleted</span>
                      )}
                    </td>
                    <td className="px-6 py-5 align-top">
                      <p className="text-slate-600 text-sm leading-relaxed max-w-md">
                        {claim.proofDescription}
                      </p>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        ${claim.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          claim.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                          'bg-amber-100 text-amber-700'}`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      {claim.status === "pending" ? (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-2">
                          <button 
                            onClick={() => handleAction(claim._id, 'approve')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm shadow-green-500/20 w-fit"
                          >
                            <CopyCheck size={16} /> Approve
                          </button>
                          <button 
                            onClick={() => handleAction(claim._id, 'reject')}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm shadow-red-500/20 w-fit"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-right text-slate-400 text-sm italic">
                          Closed
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
