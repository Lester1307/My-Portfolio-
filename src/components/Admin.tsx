import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  Check, 
  ChevronRight, 
  FileEdit, 
  FolderGit2, 
  Lock, 
  Mail, 
  MessageSquare, 
  Plus, 
  Save, 
  Sparkles, 
  Trash2, 
  Unlock 
} from 'lucide-react';
import { Project, Skill, ContactMessage } from '../types';

interface AdminProps {
  projects: Project[];
  skills: Skill[];
  fetchData: () => Promise<void>;
}

type AdminSubTab = 'messages' | 'projects' | 'skills';

export default function Admin({ projects, skills, fetchData }: AdminProps) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');
  const [savedPassword, setSavedPassword] = useState('');

  // Tab State
  const [subTab, setSubTab] = useState<AdminSubTab>('messages');

  // Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Form States
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '',
    description: '',
    category: 'Full-Stack',
    technologies: [],
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    order: 0
  });
  const [techInput, setTechInput] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [skillForm, setSkillForm] = useState<Partial<Skill>>({
    name: '',
    category: 'Frontend',
    level: 80
  });
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [showSkillForm, setShowSkillForm] = useState(false);

  // Status logs
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Check sessionStorage for previous login
  useEffect(() => {
    const cached = sessionStorage.getItem('admin_pass');
    if (cached) {
      handleVerification(cached);
    }
  }, []);

  const handleVerification = async (passToCheck: string) => {
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passToCheck })
      });
      if (response.ok) {
        setIsAuthorized(true);
        setSavedPassword(passToCheck);
        sessionStorage.setItem('admin_pass', passToCheck);
        setAuthError('');
        loadMessages(passToCheck);
      } else {
        setAuthError('Invalid passcode. Try "admin123".');
        sessionStorage.removeItem('admin_pass');
      }
    } catch (e) {
      setAuthError('Connection error verifying admin.');
    }
  };

  const submitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerification(password);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setSavedPassword('');
    sessionStorage.removeItem('admin_pass');
  };

  // API Request helper
  const adminRequest = async (url: string, method: string, body?: any) => {
    setActionLoading(true);
    setFormSuccess('');
    setFormError('');
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': savedPassword
        },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await response.json();
      if (response.ok) {
        await fetchData(); // Refresh portfolio data
        return { success: true, data };
      } else {
        setFormError(data.error || 'Server returned an error');
        return { success: false };
      }
    } catch (e) {
      setFormError('Failed to connect to the server');
      return { success: false };
    } finally {
      setActionLoading(false);
    }
  };

  // Messages APIs
  const loadMessages = async (pass = savedPassword) => {
    setLoadingMessages(true);
    try {
      const response = await fetch('/api/messages', {
        headers: { 'x-admin-password': pass }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (e) {
      console.error('Error loading messages', e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const toggleMessageRead = async (msg: ContactMessage) => {
    const newStatus = msg.status === 'unread' ? 'read' : 'unread';
    const req = await adminRequest(`/api/messages/${msg.id}`, 'PUT', { status: newStatus });
    if (req.success) {
      loadMessages();
    }
  };

  const deleteMessage = async (id: string) => {
    if (!window.confirm('Delete this message permanently?')) return;
    const req = await adminRequest(`/api/messages/${id}`, 'DELETE');
    if (req.success) {
      loadMessages();
    }
  };

  // Projects form handlers
  const handleAddTech = () => {
    if (!techInput.trim()) return;
    const techs = projectForm.technologies || [];
    if (!techs.includes(techInput.trim())) {
      setProjectForm({
        ...projectForm,
        technologies: [...techs, techInput.trim()]
      });
    }
    setTechInput('');
  };

  const handleRemoveTech = (index: number) => {
    const techs = projectForm.technologies || [];
    setProjectForm({
      ...projectForm,
      technologies: techs.filter((_, i) => i !== index)
    });
  };

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      setFormError('Title and Description are required.');
      return;
    }

    const url = editingProjectId ? `/api/projects/${editingProjectId}` : '/api/projects';
    const method = editingProjectId ? 'PUT' : 'POST';

    const res = await adminRequest(url, method, projectForm);
    if (res.success) {
      setFormSuccess(editingProjectId ? 'Project updated!' : 'Project created!');
      resetProjectForm();
    }
  };

  const editProject = (proj: Project) => {
    setProjectForm(proj);
    setEditingProjectId(proj.id);
    setShowProjectForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const res = await adminRequest(`/api/projects/${id}`, 'DELETE');
    if (res.success) {
      setFormSuccess('Project deleted successfully.');
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      category: 'Full-Stack',
      technologies: [],
      imageUrl: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      order: projects.length + 1
    });
    setEditingProjectId(null);
    setShowProjectForm(false);
  };

  // Skills form handlers
  const submitSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name) {
      setFormError('Skill name is required.');
      return;
    }

    const url = editingSkillId ? `/api/skills/${editingSkillId}` : '/api/skills';
    const method = editingSkillId ? 'PUT' : 'POST';

    const res = await adminRequest(url, method, skillForm);
    if (res.success) {
      setFormSuccess(editingSkillId ? 'Skill updated!' : 'Skill added!');
      resetSkillForm();
    }
  };

  const editSkill = (sk: Skill) => {
    setSkillForm(sk);
    setEditingSkillId(sk.id);
    setShowSkillForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteSkill = async (id: string) => {
    if (!window.confirm('Delete this skill?')) return;
    const res = await adminRequest(`/api/skills/${id}`, 'DELETE');
    if (res.success) {
      setFormSuccess('Skill deleted.');
    }
  };

  const resetSkillForm = () => {
    setSkillForm({
      name: '',
      category: 'Frontend',
      level: 80
    });
    setEditingSkillId(null);
    setShowSkillForm(false);
  };

  // Unread messages count
  const unreadCount = messages.filter(m => m.status === 'unread').length;

  if (!isAuthorized) {
    return (
      <div className="mx-auto max-w-md py-20 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-neutral-900 bg-neutral-900/30 p-6 sm:p-8 space-y-6 shadow-2xl shadow-black/20"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-neutral-100">Access Control Panel</h2>
            <p className="text-xs text-neutral-500 font-mono">AUTHORIZED PERSONNEL ONLY</p>
          </div>

          <form onSubmit={submitAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-neutral-400">ENTER ACCESS CODE</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-center text-sm font-mono text-white placeholder-neutral-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition-colors cursor-pointer"
            >
              <Unlock className="h-4 w-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="text-center">
            <span className="text-[10px] font-mono text-neutral-600">
              Default passcode: <code className="bg-neutral-950 px-1 py-0.5 rounded text-neutral-500">admin123</code>
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-display text-2xl font-bold text-neutral-100">Administrative Dashboard</h1>
            <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Store, update, and manage your portfolio projects, skills, and client inquiries. Connected to Cloud Firestore.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-neutral-800 hover:bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          Logout Session
        </button>
      </div>

      {/* Global Form Feedback */}
      {formSuccess && (
        <div className="mb-6 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-emerald-400 flex items-center space-x-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}
      {formError && (
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 text-xs text-red-400 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Admin Tab Switching Bar */}
      <div className="flex border-b border-neutral-900 mb-8 overflow-x-auto pb-px">
        <button
          onClick={() => { setSubTab('messages'); loadMessages(); }}
          className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-mono font-medium tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
            subTab === 'messages'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Client Inquiries</span>
          {unreadCount > 0 && (
            <span className="ml-1 rounded-full bg-emerald-500 text-neutral-950 px-1.5 py-0.5 text-[9px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('projects')}
          className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-mono font-medium tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
            subTab === 'projects'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <FolderGit2 className="h-4 w-4" />
          <span>Manage Projects</span>
        </button>

        <button
          onClick={() => setSubTab('skills')}
          className={`flex items-center space-x-2 px-5 py-3 border-b-2 text-xs font-mono font-medium tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
            subTab === 'skills'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Manage Skills</span>
        </button>
      </div>

      {/* TAB CONTENT: MESSAGES */}
      {subTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-neutral-100 flex items-center space-x-2">
              <Mail className="h-5 w-5 text-neutral-500" />
              <span>Inbox Messages</span>
            </h2>
            <button
              onClick={() => loadMessages()}
              disabled={loadingMessages}
              className="text-xs font-mono text-neutral-500 hover:text-white"
            >
              {loadingMessages ? 'Refreshing...' : 'REFRESH INBOX'}
            </button>
          </div>

          {loadingMessages ? (
            <div className="text-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent mx-auto mb-2" />
              <span className="text-xs font-mono text-neutral-500">Querying messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 border border-neutral-900 rounded-xl bg-neutral-900/10">
              <MessageSquare className="h-6 w-6 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-400">No visitor inquiries found.</p>
              <p className="text-xs text-neutral-600 mt-1">Submit messages via the public Contact section to test.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`rounded-xl border p-5 space-y-4 transition-all duration-200 ${
                    msg.status === 'unread' 
                      ? 'bg-neutral-900/40 border-emerald-500/20' 
                      : 'bg-neutral-900/10 border-neutral-900'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-sm font-semibold text-neutral-100">{msg.name}</span>
                      <span className="block text-xs text-neutral-400">{msg.email}</span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-xs font-mono text-neutral-500 uppercase">SUBJECT: {msg.subject}</span>
                    <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-900 whitespace-pre-wrap select-all">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                    <button
                      onClick={() => toggleMessageRead(msg)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                        msg.status === 'unread' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                          : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{msg.status === 'unread' ? 'MARK AS READ' : 'MARK UNREAD'}</span>
                    </button>

                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="p-1.5 text-neutral-500 hover:text-red-400 rounded transition-colors"
                      title="Delete permanently"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PROJECTS */}
      {subTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-neutral-100">Portfolio Project Database</h2>
            <button
              onClick={() => { resetProjectForm(); setShowProjectForm(!showProjectForm); }}
              className="flex items-center space-x-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-neutral-950 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{showProjectForm ? 'Hide Form' : 'Add New Project'}</span>
            </button>
          </div>

          {/* Project Create/Edit Form */}
          {showProjectForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={submitProject}
              className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4"
            >
              <h3 className="font-display font-bold text-neutral-200">
                {editingProjectId ? 'Modify Existing Project' : 'Publish New Project Showcase'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Category *</label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-300"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Image URL</label>
                  <input
                    type="url"
                    value={projectForm.imageUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Display Order Index</label>
                  <input
                    type="number"
                    value={projectForm.order}
                    onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Live Deployment URL</label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Technologies chip lists */}
              <div className="space-y-1.5">
                <label className="text-xs text-neutral-400">Technologies / Stack</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="e.g. Docker, Redux"
                    className="flex-1 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs text-neutral-300 border border-neutral-700"
                  >
                    Add Chip
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(projectForm.technologies || []).map((tech, i) => (
                    <span 
                      key={tech} 
                      className="rounded bg-neutral-950 text-[10px] font-mono text-emerald-400 px-2 py-0.5 flex items-center border border-neutral-800"
                    >
                      {tech}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTech(i)}
                        className="ml-1 text-red-400 hover:text-red-300 text-xs font-bold font-mono"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={projectForm.featured}
                  onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                  className="rounded border-neutral-800 bg-neutral-950 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="featured" className="text-xs text-neutral-400">Feature this project in landing highlights</label>
              </div>

              <div className="flex space-x-2 pt-2 border-t border-neutral-900">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-neutral-950 cursor-pointer flex items-center space-x-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{actionLoading ? 'Saving...' : 'Save Project Data'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs text-neutral-400 border border-neutral-800"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* List Projects */}
          <div className="space-y-3">
            {projects.map((proj) => (
              <div 
                key={proj.id}
                className="rounded-xl border border-neutral-900 bg-neutral-900/10 p-4 flex items-center justify-between flex-wrap gap-3"
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={proj.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=100&auto=format&fit=crop'} 
                    className="h-12 w-16 object-cover rounded-md border border-neutral-900 shrink-0" 
                    alt="" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                      {proj.title}
                      {proj.featured && (
                        <span className="bg-emerald-500 text-neutral-950 px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase">FEATURED</span>
                      )}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-500">{proj.category.toUpperCase()} / #{proj.order}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => editProject(proj)}
                    className="p-1.5 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white"
                    title="Edit project details"
                  >
                    <FileEdit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-1.5 rounded hover:bg-neutral-900 text-neutral-400 hover:text-red-400"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SKILLS */}
      {subTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-neutral-100">Technical Competencies Database</h2>
            <button
              onClick={() => { resetSkillForm(); setShowSkillForm(!showSkillForm); }}
              className="flex items-center space-x-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-neutral-950 transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{showSkillForm ? 'Hide Form' : 'Add New Skill'}</span>
            </button>
          </div>

          {showSkillForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={submitSkill}
              className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4"
            >
              <h3 className="font-display font-bold text-neutral-200">
                {editingSkillId ? 'Update Skill Proficiency' : 'Record New Skill Tech'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Skill / Tech Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Webpack"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-neutral-400">Stack Category *</label>
                  <select
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-300"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-neutral-400">Expertise / Proficiency Level *</label>
                  <span className="font-mono text-emerald-400">{skillForm.level}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={skillForm.level}
                  onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                  className="w-full accent-emerald-500 bg-neutral-950 h-2 rounded-full cursor-pointer"
                />
              </div>

              <div className="flex space-x-2 pt-2 border-t border-neutral-900">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-semibold text-neutral-950 cursor-pointer flex items-center space-x-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{actionLoading ? 'Saving...' : 'Save Skill'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetSkillForm}
                  className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs text-neutral-400 border border-neutral-800"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          {/* List Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map((sk) => (
              <div 
                key={sk.id}
                className="rounded-xl border border-neutral-900 bg-neutral-900/10 p-3 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-neutral-200">{sk.name}</h4>
                  <span className="text-[10px] font-mono text-neutral-500">{sk.category} • {sk.level}%</span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => editSkill(sk)}
                    className="p-1 rounded hover:bg-neutral-900 text-neutral-400 hover:text-white"
                  >
                    <FileEdit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSkill(sk.id)}
                    className="p-1 rounded hover:bg-neutral-900 text-neutral-400 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
