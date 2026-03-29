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
    <div className="min-h-screen p-6 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 opacity-90" style={{ zIndex: 0 }} />
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1758599879693-9e06f55a4ded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBpbnN0cnVjdG9yJTIwdGVhY2hpbmd8ZW58MXx8fHwxNzc0NzE0NzAzfDA&ixlib=rb-4.1.0&q=80&w=1080')", zIndex: 0 }} />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ zIndex: 0 }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-indigo-600" />
              </div>
              <span className="text-3xl font-bold text-white">
                Fatra Academy
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Become an Instructor</h1>
            <p className="text-white/80">Join our community of expert educators and inspire thousands</p>
          </div>

          {step !== 4 ? (
            <>
              {/* Progress Indicator */}
              <GlassCard className="p-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Step {step} of 3</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{Math.round((step / 3) * 100)}% Complete</span>
                </div>
                <div className="w-full bg-gray-700/30 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </GlassCard>

              {/* Form */}
              <GlassCard className="p-8">
                {error && <div className="alert alert-error mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Personal Information</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group mb-0">
                          <label className="form-label" style={{ color: "var(--text-primary)" }}>First Name *</label>
                          <input
                            type="text"
                            placeholder="Jane"
                            value={formData.first_name}
                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                            className="form-input bg-white/5 border-white/10 text-white"
                            required
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label className="form-label" style={{ color: "var(--text-primary)" }}>Last Name *</label>
                          <input
                            type="text"
                            placeholder="Smith"
                            value={formData.last_name}
                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                            className="form-input bg-white/5 border-white/10 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group mb-0">
                          <label className="form-label" style={{ color: "var(--text-primary)" }}>Username *</label>
                          <input
                            type="text"
                            placeholder="janesmith123"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                            className="form-input bg-white/5 border-white/10 text-white"
                            required
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label className="form-label" style={{ color: "var(--text-primary)" }}>Email Address *</label>
                          <input
                            type="email"
                            placeholder="jane.smith@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="form-input bg-white/5 border-white/10 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group mb-0">
                          <label className="form-label" style={{ color: "var(--text-primary)" }}>Password *</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            className="form-input bg-white/5 border-white/10 text-white"
                            required
                          />
                        </div>
                        <div className="form-group mb-0">
                          <label className="form-label" style={{ color: "var(--text-primary)" }}>Confirm Password *</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password_confirm}
                            onChange={(e) => setFormData({...formData, password_confirm: e.target.value})}
                            className="form-input bg-white/5 border-white/10 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ color: "var(--text-primary)" }}>Bio *</label>
                        <textarea
                          placeholder="Tell us about yourself, your teaching philosophy, and why you want to teach..."
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                          className="form-textarea bg-white/5 border-white/10 text-white min-h-[120px]"
                          required
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Professional Experience</h2>
                      
                      <div className="form-group">
                        <label className="form-label" style={{ color: "var(--text-primary)" }}>Area of Expertise *</label>
                        <input
                          type="text"
                          placeholder="e.g., Advanced Mathematics, Computer Science, Physics"
                          value={formData.expertise}
                          onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                          className="form-input bg-white/5 border-white/10 text-white"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label" style={{ color: "var(--text-primary)" }}>Education Qualification *</label>
                          <input
                            type="text"
                            placeholder="Ph.D. in Computer Science, MIT"
                            value={formData.education}
                            onChange={(e) => setFormData({...formData, education: e.target.value})}
                            className="form-input bg-white/5 border-white/10 text-white"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ color: "var(--text-primary)" }}>Years of Teaching Experience *</label>
                          <input
                            type="number"
                            placeholder="e.g., 10"
                            value={formData.experience}
                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                            className="form-input bg-white/5 border-white/10 text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label" style={{ color: "var(--text-primary)" }}>LinkedIn Profile</label>
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/yourprofile"
                            value={formData.linkedin}
                            onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                            className="form-input bg-white/5 border-white/10 text-white"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label" style={{ color: "var(--text-primary)" }}>Portfolio/Website</label>
                          <input
                            type="url"
                            placeholder="https://yourwebsite.com"
                            value={formData.portfolio}
                            onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                            className="form-input bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Course Proposal & Documents</h2>
                      
                      <div className="form-group">
                        <label className="form-label" style={{ color: "var(--text-primary)" }}>Proposed Courses *</label>
                        <textarea
                          placeholder="Describe the courses you want to create (topics, target audience, course structure)..."
                          value={formData.proposedCourses}
                          onChange={(e) => setFormData({...formData, proposedCourses: e.target.value})}
                          className="form-textarea bg-white/5 border-white/10 text-white min-h-[160px]"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" style={{ color: "var(--text-primary)" }}>Upload CV/Resume *</label>
                        <div className="relative mt-2">
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
                            className="flex items-center justify-center gap-2 px-6 py-6 bg-white/5 border-2 border-dashed border-white/20 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
                          >
                            <Upload className="w-6 h-6 text-indigo-400" />
                            <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
                              {formData.cvFile ? formData.cvFile.name : "Click to upload (PDF, DOC, DOCX)"}
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-5 mt-6">
                        <h4 className="font-semibold text-indigo-300 mb-2 text-sm uppercase tracking-wider">What happens next?</h4>
                        <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                          <li className="flex gap-2"><span>•</span> Our team will review your application within 3-5 business days</li>
                          <li className="flex gap-2"><span>•</span> You'll receive an email with the decision</li>
                          <li className="flex gap-2"><span>•</span> If approved, you'll get access to our instructor dashboard</li>
                          <li className="flex gap-2"><span>•</span> Start creating and publishing your courses!</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-6 mt-6 border-t border-white/10">
                    {step > 1 && (
                      <GradientButton
                        type="button"
                        variant="secondary"
                        onClick={() => setStep(step - 1)}
                        className="flex-1"
                      >
                        Back
                      </GradientButton>
                    )}
                    <GradientButton type="submit" className="flex-1" disabled={loading}>
                      {loading ? "Processing..." : (step === 3 ? "Submit Application" : "Continue")}
                    </GradientButton>
                  </div>
                </form>
              </GlassCard>
            </>
          ) : (
            /* Success Message */
            <GlassCard className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Application Submitted!</h2>
              <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
                Thank you for applying to become an instructor on Fatra Academy. We'll review your application and get back to you within 3-5 business days.
              </p>
              
              <div className="flex gap-3 justify-center">
                <GradientButton onClick={() => navigate("/")}>
                  Back to Home
                </GradientButton>
                <GradientButton variant="secondary" onClick={() => navigate("/login")}>
                  Sign In
                </GradientButton>
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </div>
  );
}
