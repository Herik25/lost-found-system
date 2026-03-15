import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import useAuthStore from "../store/authStore";
import { MapPin, Tag, Clock, Package, AlertCircle, ArrowLeft, Send } from "lucide-react";

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Claim form states
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [proofDescription, setProofDescription] = useState("");
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState("");

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load item details. It might have been removed.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setSubmittingClaim(true);
    setClaimError("");
    
    try {
      await API.post("/claims", {
        itemId: id,
        proofDescription
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setClaimSuccess(true);
      setShowClaimForm(false);
    } catch (err) {
      console.error(err);
      setClaimError(err.response?.data?.message || "Failed to submit claim. Please try again.");
    } finally {
      setSubmittingClaim(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-2xl flex items-center gap-3 font-semibold text-lg max-w-2xl mx-auto shadow-sm mt-10">
        <AlertCircle size={28} className="text-red-500 shrink-0" />
        {error || "Item not found."}
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pb-20">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-primary font-medium transition-colors mb-6"
      >
        <ArrowLeft size={18} /> Back to items
      </button>

      {claimSuccess && (
        <div className="mb-8 bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-start gap-4">
          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full mt-1">
            <Send size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-800 mb-1">Claim Request Submitted Successfully</h3>
            <p className="text-emerald-700">
              The administrator will review your provided proof statement momentarily. You will be contacted once it is approved.
            </p>
          </div>
        </div>
      )}

      <div className="glass-card p-6 md:p-10 rounded-4xl flex flex-col lg:flex-row gap-10">
        {/* Images Column */}
        <div className="lg:w-1/2 space-y-4">
          {item.images && item.images.length > 0 ? (
            <div className="aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
              <img 
                src={`http://localhost:5000/${item.images[0].replace(/\\/g, '/')}`} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-4/3 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
              <Package size={64} className="mb-4 opacity-50" />
              <p className="font-medium">No image available</p>
            </div>
          )}

          {item.images && item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {item.images.slice(1).map((imgUrl, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer hover:ring-2 ring-primary transition-all">
                  <img src={`http://localhost:5000/${imgUrl.replace(/\\/g, '/')}`} alt={`thumbnail-${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Column */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded-full uppercase tracking-wide border border-slate-200">
              {item.type}
            </span>
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full uppercase tracking-wide border border-primary/20">
              {item.status}
            </span>
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <Tag size={18} className="text-slate-400" /> {item.category}
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-slate-400" /> {item.type === 'lost' ? item.locationLost : item.locationFound}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-slate-400" /> 
              {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
            <p className="text-slate-600 leading-relaxed min-h-24">
              {item.description}
            </p>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-200">
            {item.type === "found" && item.status !== "claimed" && !claimSuccess && !showClaimForm && (
              <button 
                onClick={() => setShowClaimForm(true)}
                className="w-full btn-primary h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-2xl shadow-emerald-600/20"
              >
                Request Claim
              </button>
            )}

            {showClaimForm && (
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 animate-fade-in relative">
                <h3 className="font-bold text-slate-800 mb-2">Claim Verification Process</h3>
                <p className="text-sm text-slate-500 mb-4">
                  Provide detailed identifiable proof that you are the rightful owner of this item. Be specific (e.g. wallpaper on phone, contents inside wallet, specific scratch or damage).
                </p>
                
                <form onSubmit={handleClaimSubmit}>
                  <textarea
                    required
                    value={proofDescription}
                    onChange={(e) => setProofDescription(e.target.value)}
                    placeholder="Describe specific details only the owner would know..."
                    className="w-full p-4 bg-white border border-slate-300 rounded-2xl resize-none h-32 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-4"
                  />
                  
                  {claimError && <p className="text-red-500 text-sm font-bold mb-4">{claimError}</p>}
                  
                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowClaimForm(false)}
                      className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={submittingClaim || !proofDescription.trim()}
                      className="flex-1 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      {submittingClaim ? 'Submitting...' : 'Submit Evidence'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
