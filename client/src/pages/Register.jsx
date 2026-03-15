import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div className="flex flex-col w-full">
    <label className="text-[12px] text-gray-700 font-medium ml-3 mb-0.5">{label}</label>
    <div className={`bg-[#e2e2e2] rounded-full h-10 px-5 flex items-center relative overflow-hidden transition-all ${error ? 'ring-1 ring-red-500 bg-red-50' : ''}`}>
      {/* underline from the design */}
      <div className={`absolute bottom-[10px] left-4 right-4 h-px pointer-events-none ${error ? 'bg-red-500' : 'bg-gray-500'}`}></div>
      <input 
        type={type}
        name={name}
        onChange={onChange}
        value={value}
        className="w-full bg-transparent outline-none text-[15px] z-10 relative pb-1 text-slate-800 focus:outline-none focus:ring-0"
      />
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange }) => (
  <div className="flex flex-col w-full">
    <label className="text-[12px] text-gray-700 font-medium ml-3 mb-0.5">{label}</label>
    <div className="bg-[#e2e2e2] rounded-full h-10 px-5 flex items-center relative overflow-hidden">
      <div className="absolute bottom-[10px] left-4 right-4 h-px bg-gray-500 pointer-events-none"></div>
      <select 
        name={name}
        onChange={onChange}
        value={value}
        className="w-full bg-transparent outline-none text-[15px] z-10 relative pb-1 text-slate-800 appearance-none cursor-pointer focus:outline-none focus:ring-0"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  </div>
);

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
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
    if (!form.firstName) newErrors.firstName = true;
    if (!form.lastName) newErrors.lastName = true;
    if (!form.email) newErrors.email = true;
    if (!form.password) newErrors.password = true;
    if (!form.confirmPassword) newErrors.confirmPassword = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all fields");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setErrors({ password: true, confirmPassword: true });
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        role: form.role
      };
      
      const res = await API.post("/auth/register", payload);
      if (res.status === 201) {
        toast.success("Registration successful! Please sign in.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans">
      {/* Top green bar */}
      <div className="w-full h-10 bg-primary"></div>

      {/* Main Content Area */}
      <main className="flex-1 relative flex items-center justify-center py-10 lg:py-16 w-full overflow-hidden">
        {/* Background dark green shape for Desktop */}
        <div className="absolute right-0 top-12 bottom-12 w-[85%] lg:w-[80%] bg-primary rounded-l-[4rem] hidden lg:block z-0"></div>

        <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-[1150px] mx-auto flex flex-col lg:flex-row items-stretch px-5 lg:px-0">
          
          {/* Left Side: Form Card */}
          <div className="relative w-full lg:w-[48%] flex-shrink-0 lg:ml-12 lg:-mt-6">
             {/* Drop shadow background for mobile */}
             <div className="absolute w-screen -left-3 -bottom-3 h-full bg-primary rounded-tl-[2.5rem] rounded-bl-[2.5rem] lg:hidden -z-10"></div>
             
             <div className="bg-white border border-black rounded-[3rem] p-8 md:p-12 pt-16 shadow-xl relative w-full h-full flex flex-col">
                
                {/* Title Badge overlaying the top border */}
                <div className="absolute -top-[23px] left-6 md:left-10 bg-white border-[1.5px] border-black rounded-full px-7 py-2.5 shadow-sm z-20">
                   <h2 className="text-primary text-xl md:text-[22px] font-black tracking-wide">
                     REGISTRATION FORM
                   </h2>
                </div>

                <div className="flex flex-col gap-[14px] mt-2 mb-4 flex-1">
                   <div className="flex gap-4">
                     <InputField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
                     <InputField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} />
                   </div>
                   <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
                   <InputField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} />
                   <InputField label="Confirm Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
                   <SelectField label="Role" name="role" value={form.role} onChange={handleChange} />
                </div>

                <p className="text-center text-xs text-slate-500 font-medium pt-2">
                   Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                </p>

                <div className="w-full flex lg:hidden text-left flex-col md:justify-center md:items-center p-10 bg-primary rounded-3xl mt-8 mb-5 z-10 relative">
                  <h1 className="text-[2.5rem] md:text-5xl font-black text-white mb-4 uppercase tracking-wider leading-tight">
                    SIGN-UP NOW
                  </h1>
                  <p className="text-white/95 text-[15px] leading-[1.7] md:text-center mb-4 font-medium">
                    Join the ASA Lost and Found Tracking System and help the campus
                    community reconnect with lost items. Every day, users report lost
                    belongings and share found items to help return them to their rightful
                    owners.
                  </p>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-[#ffe400] absolute -bottom-5 right-10 text-black font-extrabold text-[1.1rem] px-18 lg:self-end py-3.5 rounded-full hover:bg-[#ebd300] transition-colors shadow-lg disabled:opacity-70 active:scale-95 whitespace-nowrap"
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>
             </div>
          </div>

          {/* Right Side: Text & CTA */}
          <div className="hidden w-full lg:flex flex-col justify-center items-center lg:items-start p-10 lg:pl-18 bg-primary lg:bg-transparent rounded-3xl lg:rounded-none mt-10 lg:mt-0 z-10 text-center lg:text-left">
             <h1 className="text-[2.5rem] md:text-5xl font-black text-white mb-6 uppercase tracking-wider leading-tight">
               SIGN-UP NOW
             </h1>
             <p className="text-white/95 text-[15px] leading-[1.7] mb-12 font-medium">
               Join the ASA Lost and Found Tracking System and help the campus
               community reconnect with lost items. Every day, users report lost
               belongings and share found items to help return them to their rightful
               owners.
             </p>
             <button 
               type="submit" 
               disabled={loading}
               className="bg-[#ffe400] text-black font-extrabold text-[1.1rem] px-18 lg:self-end py-3.5 rounded-full hover:bg-[#ebd300] transition-colors shadow-lg disabled:opacity-70 active:scale-95 whitespace-nowrap"
             >
               {loading ? 'Registering...' : 'Register'}
             </button>
          </div>

        </form>
      </main>

      {/* Bottom green bar with badge */}
      <div className="w-full h-12 bg-primary relative mt-auto">
      </div>
    </div>
  );
}

export default Register;