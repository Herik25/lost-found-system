import { useState } from "react";
import API from "../api/api";
import useAuthStore from "../store/authStore";
import {
  Camera,
  MapPin,
  Tag,
  FileText,
  Send,
  X,
  ArrowLeft,
  Image as ImageIcon,
  Package,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function ReportLost() {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    locationLost: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: false,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    setErrors((prev) => ({ ...prev, images: false }));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.title) newErrors.title = true;
    if (!form.category) newErrors.category = true;
    if (!form.locationLost) newErrors.locationLost = true;
    if (!form.description) newErrors.description = true;
    if (images.length === 0) newErrors.images = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.images && Object.keys(newErrors).length === 1) {
        toast.error("Please upload at least one image of the item!");
      } else if (newErrors.images) {
        toast.error("Please fill in all required fields and upload an image!");
      } else {
        toast.error("Please fill in all required fields!");
      }
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });
    data.append("type", "lost");
    images.forEach((img) => {
      data.append("images", img);
    });

    try {
      await API.post("/items", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Lost item successfully reported!");
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to report item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div
          className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"
        >
          <Send size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Report Submitted!
        </h2>
        <p className="text-slate-500 text-lg">
          Your lost item has been registered. Redirecting to dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/dashboard"
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Report Lost Item</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-5 gap-8"
      >
        {/* Left Side: Form Details */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-8 rounded-4xl space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 ml-1">
                <Tag size={16} className="text-primary" /> Item Title
              </label>
              <input
                name="title"
                placeholder="Ex: Blue Leather Wallet"
                onChange={handleChange}
                className={`input-field mb-0 ${errors.title ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-0" : ""}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 ml-1">
                  <Package size={16} className="text-primary" /> Category
                </label>
                <select
                  name="category"
                  onChange={handleChange}
                  className={`input-field mb-0 py-[11px] ${errors.category ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-0" : ""}`}
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Personal Effects">Personal Effects</option>
                  <option value="Documents">Documents</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 ml-1">
                  <MapPin size={16} className="text-primary" /> Last Seen
                  Location
                </label>
                <input
                  name="locationLost"
                  placeholder="Ex: Library, Floor 2"
                  onChange={handleChange}
                  className={`input-field mb-0 ${errors.locationLost ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-0" : ""}`}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 ml-1">
                <FileText size={16} className="text-primary" /> Detailed
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe specific marks, contents, or circumstances..."
                rows={4}
                onChange={handleChange}
                className={`input-field mb-0 resize-none ${errors.description ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-0" : ""}`}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Media Upload */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-8 rounded-4xl h-full flex flex-col">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4 ml-1">
              <Camera size={16} className="text-primary" /> Item Photos
            </label>

            <div className="flex-1 space-y-4">
              <div
                className={`relative group border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all text-center cursor-pointer ${errors.images ? "border-red-500 bg-red-50" : "border-slate-200 hover:border-primary hover:bg-primary/5"}`}
                onClick={() => document.getElementById("image-upload").click()}
              >
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon size={24} />
                </div>
                <p className="font-bold text-slate-700">Drop files here</p>
                <p className="text-sm text-slate-400 mt-1">
                  or click to browse
                </p>
              </div>

              {/* Previews */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {previews.map((url, index) => (
                  <div
                    key={url}
                    className="relative aspect-square rounded-xl overflow-hidden group"
                  >
                    <img
                      src={url}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-8 flex items-center justify-center gap-2 h-14"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Submit Report <Send size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ReportLost;
