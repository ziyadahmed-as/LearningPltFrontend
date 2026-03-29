import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { GlassCard } from "../components/glass-card";
import { GradientButton } from "../components/gradient-button";
import { BookOpen, Upload, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function InstructorOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    email: "",
    expertise: "",
    experience: "",
    education: "",
    bio: "",
    linkedin: "",
    portfolio: "",
    proposedCourses: "",
    cvFile: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setError('');
      try {
        const formDataPayload = new FormData();
        formDataPayload.append("role", "INSTRUCTOR");
        formDataPayload.append("username", formData.username);
        formDataPayload.append("email", formData.email);
        formDataPayload.append("password", formData.password);
        formDataPayload.append("password_confirm", formData.password_confirm);
        formDataPayload.append("first_name", formData.first_name);
        formDataPayload.append("last_name", formData.last_name);
        formDataPayload.append("expertise", formData.expertise);
        formDataPayload.append("years_of_experience", parseInt(formData.experience) || 0);
        formDataPayload.append("education_level", formData.education);
        formDataPayload.append("bio", formData.bio);
        formDataPayload.append("linkedin", formData.linkedin);
        formDataPayload.append("portfolio", formData.portfolio);
        formDataPayload.append("proposed_courses", formData.proposedCourses);
        if (formData.cvFile) {
          formDataPayload.append("cv_file", formData.cvFile);
        }

        await register(formDataPayload);
        setStep(4); // Success step
      } catch (err) {
        console.error(err);
        const data = err.response?.data;
        if (data) {
           const firstKey = Object.keys(data)[0];
           setError(Array.isArray(data[firstKey]) ? data[firstKey][0] : JSON.stringify(data));
        } else {
           setError('Registration failed. Please check your inputs.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({...formData, cvFile: e.target.files[0]});
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 selection:text-indigo-200 p-6 relative overflow-hidden flex items-center justify-center font-sans tracking-tight">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15)_0%,transparent_50%)] z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] z-0" />
      
      {/* Animated Blobs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px]"
        animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ zIndex: 0 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]"
        animate={{ y: [0, -60, 0], x: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ zIndex: 0 }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div 
              className="inline-flex items-center gap-3 mb-8 cursor-pointer group" 
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)] group-hover:rotate-6 transition-transform">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <span className="text-4xl font-black text-white tracking-tighter">
                FATRA
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">Join the Elite Faculty</h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto font-light leading-relaxed">Shape the future of education in Ethiopia. Share your expertise with over 50k+ students globally.</p>
          </div>

          {step !== 4 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Progress & Info */}
              <div className="lg:col-span-4 space-y-6">
                <GlassCard className="p-8 bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[2rem]">
                   <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Application Status</h3>
                   <div className="space-y-8">
                     {[1,2,3].map((s) => (
                       <div key={s} className="flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-black transition-all duration-500 ${step === s ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)] text-white scale-110' : step > s ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                           {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                         </div>
                         <div>
                            <p className={`text-sm font-bold uppercase tracking-wider ${step === s ? 'text-white' : 'text-slate-500'}`}>
                              {s === 1 ? 'Personal' : s === 2 ? 'Professional' : 'Proposal'}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">
                               {step === s ? 'Current Section' : step > s ? 'Complete' : 'Pending'}
                            </p>
                         </div>
                       </div>
                     ))}
                   </div>
                   
                   <div className="mt-12 pt-8 border-t border-white/5">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-indigo-400 uppercase">Overall Progress</span>
                        <span className="text-lg font-black">{Math.round((step / 3) * 100)}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(step / 3) * 100}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                   </div>
                </GlassCard>
                
                <div className="p-1 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 to-transparent">
                  <div className="p-8 rounded-[calc(2rem-1px)] bg-slate-950/40 border border-white/5 backdrop-blur-md">
                    <h4 className="text-white font-black text-sm uppercase tracking-widest mb-4">Instructor Benefits</h4>
                    <ul className="space-y-4">
                      {[
                        'Industry-Leading Revenue Share',
                        'AI-Assisted Content Creation',
                        'Deep Analytic Dashboards',
                        'Global Exposure & Certification'
                      ].map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs text-slate-400 font-medium leading-tight">
                           <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                           {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Form */}
              <div className="lg:col-span-8">
                <GlassCard className="p-10 bg-slate-900/60 border-white/10 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-3 mb-8"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">!</div>
                      {error}
                    </motion.div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        className="space-y-8"
                      >
                        <h2 className="text-2xl font-black text-white">Identity & Access</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                            <input
                              type="text"
                              value={formData.first_name}
                              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                              placeholder="Jane"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                            <input
                              type="text"
                              value={formData.last_name}
                              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                              placeholder="Smith"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                            <input
                              type="text"
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                              placeholder="dr_smith"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                              placeholder="jane@academy.edu"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                            <input
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                              placeholder="••••••••"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                            <input
                              type="password"
                              value={formData.password_confirm}
                              onChange={(e) => setFormData({...formData, password_confirm: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                              placeholder="••••••••"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Bio</label>
                          <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium min-h-[140px]"
                            placeholder="Briefly describe your academic background and teaching style..."
                            required
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                      >
                        <h2 className="text-2xl font-black text-white">Professional Vertical</h2>
                        
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Domain Expertise</label>
                          <input
                            type="text"
                            value={formData.expertise}
                            onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                            placeholder="e.g. Theoretical Physics, ML Engineering"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Education Level</label>
                            <input
                              type="text"
                              value={formData.education}
                              onChange={(e) => setFormData({...formData, education: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                              placeholder="Ph.D., M.Sc., etc."
                              required
                            />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Years of Experience</label>
                            <input
                              type="number"
                              value={formData.experience}
                              onChange={(e) => setFormData({...formData, experience: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                              placeholder="10"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">LinkedIn URL</label>
                            <input
                              type="url"
                              value={formData.linkedin}
                              onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                              placeholder="https://linkedin.com/..."
                            />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Portfolio/CV Link</label>
                            <input
                              type="url"
                              value={formData.portfolio}
                              onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium"
                              placeholder="https://yourpage.com"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                      >
                        <h2 className="text-2xl font-black text-white">Course Proposal</h2>
                        
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detailed Proposal</label>
                          <textarea
                            value={formData.proposedCourses}
                            onChange={(e) => setFormData({...formData, proposedCourses: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-medium min-h-[180px]"
                            placeholder="List potential course titles and briefly explain their scope..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Verify Credentials (PDF/DOC)</label>
                          <div className="relative group/file">
                            <input
                              id="cv"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileChange}
                              className="hidden"
                              required
                            />
                            <label
                              htmlFor="cv"
                              className="flex flex-col items-center justify-center gap-4 px-8 py-12 bg-white/5 border-2 border-dashed border-white/10 rounded-[2rem] hover:bg-white/10 hover:border-indigo-500/50 cursor-pointer transition-all duration-300"
                            >
                              <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover/file:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-indigo-400" />
                              </div>
                              <div className="text-center">
                                <p className="text-white font-bold">{formData.cvFile ? formData.cvFile.name : "Click or Drop CV to Upload"}</p>
                                <p className="text-slate-500 text-xs font-medium mt-1">Maximum file size: 10MB</p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-4 pt-10 mt-10 border-t border-white/5">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={() => setStep(step - 1)}
                          className="flex-1 py-4 px-6 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all active:scale-95"
                        >
                          Previous
                        </button>
                      )}
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-[2] relative group py-4 px-6 rounded-2xl bg-white text-indigo-950 font-black overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {loading ? (
                            <div className="w-6 h-6 border-4 border-indigo-950/20 border-t-indigo-950 rounded-full animate-spin" />
                          ) : (
                            <>
                              {step === 3 ? "Submit Global Application" : "Progress to Next Step"}
                              <TrendingUp className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  </form>
                </GlassCard>
              </div>
            </div>
          ) : (
            /* Success State */
            <GlassCard className="p-20 text-center bg-slate-900/40 border-white/5 backdrop-blur-3xl rounded-[3rem] max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-600" />
               <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <div className="w-28 h-28 bg-green-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                  <CheckCircle className="w-14 h-14 text-green-400" />
                </div>
              </motion.div>
              
              <h2 className="text-4xl font-black text-white mb-6">Success, Instructor!</h2>
              <p className="text-xl text-slate-400 mb-12 font-light leading-relaxed">
                Your application has been received. Our review committee will evaluate your credentials within 72 hours. Check your inbox for the next steps.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate("/")}
                  className="px-8 py-4 bg-white text-indigo-950 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Return to Hub
                </button>
                <button 
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
                >
                  Enter Account
                </button>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}

