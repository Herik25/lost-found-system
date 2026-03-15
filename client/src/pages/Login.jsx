import { useState } from "react";
import API from "../api/api";
import useAuthStore from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setErrors({
      ...errors,
      [e.target.name]: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.email) newErrors.email = true;
    if (!form.password) newErrors.password = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in both email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      login(res.data.user, res.data.token);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-primary flex flex-col font-sans overflow-x-hidden">
      {/* Top Banner */}
      <div className="px-8 py-2 md:py-3 w-full">
        <h1 className="text-white text-lg md:text-2xl font-black tracking-wide">
          ASA: LOST AND TRACK SYSTEM
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white flex flex-col lg:flex-row relative py-8">
        {/* Left Side */}
        <div className="w-full xl:w-[60%] flex flex-col justify-center px-8 lg:px-20 py-12 lg:py-0 relative">
          <div className="z-10">
            <h2 className="text-6xl font-bold text-primary tracking-tight leading-[1.1] mb-2">
              Lost Something At CSU?
            </h2>
            <h2 className="text-6xl font-bold text-primary tracking-tight leading-[1.1] mb-8">
              ASA is Here To Help
            </h2>
            
            <p className="text-primary/80 text-lg lg:text-xl max-w-2xl leading-snug mb-12 font-medium">
              Don't stress. Whether you're in the classroom or the office, we'll help you find your way back to your belongings.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
              <Link 
                to="/report-lost" 
                className="w-full sm:w-auto px-10 py-3 rounded-xl border border-slate-700 bg-white text-black font-semibold text-lg text-center hover:bg-slate-50 transition-colors shadow-lg"
              >
                Post Item
              </Link>
              <Link 
                to="/browse" 
                className="w-full sm:w-auto px-14 py-3 rounded-xl border border-slate-700 bg-secondary text-black font-semibold text-lg text-center hover:brightness-95 transition-all shadow-lg"
              >
                Browse
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="sm:w-[90%] sm:ml-auto xl:w-[40%] bg-primary sm:rounded-l-[40px] p-10 flex items-center relative">
          {/* Card */}
          <div className="w-full max-w-[500px] flex flex-col justify-center bg-white rounded-[24px] p-8 sm:p-10 shadow-2xl relative h-full">
            <h2 className="text-[32px] font-black text-black text-center mb-8 tracking-tighter">LOGIN</h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className={`w-full px-6 py-3 rounded-full border text-[13px] focus:outline-none transition-colors placeholder:text-black font-medium ${errors.email ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-0' : 'border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary'}`}
                />
              </div>

              <div>
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className={`w-full px-6 py-3 rounded-full border text-[13px] focus:outline-none transition-colors placeholder:text-black font-medium ${errors.password ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-0' : 'border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary'}`}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 mt-1 rounded-full border border-slate-700 bg-secondary text-black text-[13px] font-bold hover:brightness-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-[11px] text-black font-medium">or Sign-Up with</span>
            </div>

            <div className="flex justify-center gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <button key={i} type="button" className="w-[34px] h-[34px] rounded-full bg-[#e2e2e2] hover:bg-[#d0d0d0] transition-colors"></button>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-[10px] text-black font-medium mb-[2px]">
                By creating an account you agree to chacha
              </p>
              <p className="text-[10px] font-bold text-black mb-8">
                Terms of Services and Privacy Policy
              </p>

              <p className="text-[11px] text-black font-medium">
                Don't have an account?{" "}
                <Link to="/register" className="font-bold text-black hover:underline">
                  Sign-up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* bottom space */}
      <div className="px-8 py-2 md:py-3 w-full border-white h-14">
      </div>
    </section>
  );
}

export default Login;