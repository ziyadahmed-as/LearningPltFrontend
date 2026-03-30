import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  getLesson, updateLesson,
  createContentBlock, updateContentBlock, deleteContentBlock
} from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import TiptapEditor from '../components/TiptapEditor';
import { 
  ArrowLeft, Save, Plus, Trash2, ArrowUp, ArrowDown, 
  Type, Image as ImageIcon, FileText, Video, Link as LinkIcon, 
  Layers, PackageSearch
} from 'lucide-react';
import { GlassCard } from '../components/glass-card';

const TYPE_ICONS = {
  text: <Type size={16} />,
  image: <ImageIcon size={16} />,
  pdf: <FileText size={16} />,
  video_upload: <Video size={16} />,
  video_link: <Video size={16} />,
  link: <LinkIcon size={16} />
};

function ContentBlockEditor({ block, onUpdate, onDelete }) {
  const [data, setData] = useState({ 
    title: block.title || '', 
    type: block.type || 'text',
    text_content: block.text_content || '', 
    url: block.url || '' 
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);
    formData.append('text_content', data.text_content);
    formData.append('url', data.url || '');
    if (file) formData.append('file', file);

    await onUpdate(block.id, formData);
    setSaving(false);
    setFile(null);
  };

  return (
    <GlassCard className="p-8 mb-6 bg-white border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 relative group">
            <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 text-sm font-bold text-slate-900 focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-all shadow-sm"
              value={data.title} 
              onChange={e => setData({ ...data, title: e.target.value })} 
              placeholder="Artifact Identity (Optional)" 
            />
          </div>
          <div className="md:col-span-4 relative">
             <select 
               className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-[10px] font-black text-slate-600 uppercase tracking-widest appearance-none focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-all shadow-sm"
               value={data.type} 
               onChange={e => setData({ ...data, type: e.target.value })}
             >
               <option value="text">TEXT PROTOCOL</option>
               <option value="image">IMAGE SIGNAL</option>
               <option value="pdf">PDF RECORD</option>
               <option value="video_upload">VIDEO ARCHIVE</option>
               <option value="video_link">VIDEO STREAM</option>
               <option value="link">EXTERNAL NODE</option>
             </select>
          </div>
        </div>

        {data.type === 'text' && (
          <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
            <TiptapEditor
              value={data.text_content}
              onChange={val => setData({ ...data, text_content: val })}
              placeholder="Inject knowledge content..."
            />
          </div>
        )}

        {['image', 'pdf', 'video_upload'].includes(data.type) && (
          <div className="space-y-4">
            {block.file && (
              <div className="flex items-center gap-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                {data.type === 'image' ? (
                  <img src={block.file} alt="" className="h-16 w-16 object-cover rounded-xl shadow-sm" />
                ) : (
                  <div className="h-16 w-16 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                     <FileText size={24} />
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Artifact</p>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{block.file.split('/').pop()}</p>
                </div>
              </div>
            )}
            <label className="flex items-center justify-center w-full h-24 px-4 transition bg-slate-50 border-2 border-slate-100 border-dashed rounded-[1.5rem] hover:border-indigo-600 hover:bg-white cursor-pointer group">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                     {TYPE_ICONS[data.type]}
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-indigo-600">{file ? file.name : `Upload new ${data.type.replace('_', ' ')}`}</span>
               </div>
               <input 
                 type="file" 
                 className="hidden" 
                 onChange={e => setFile(e.target.files[0])}
                 accept={data.type === 'image' ? 'image/*' : data.type === 'pdf' ? '.pdf' : 'video/*'}
               />
            </label>
          </div>
        )}

        {['video_link', 'link'].includes(data.type) && (
          <div className="relative group">
            <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 text-sm font-bold text-slate-900 focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-all shadow-sm"
              value={data.url} 
              onChange={e => setData({ ...data, url: e.target.value })} 
              placeholder="https://hub.network/..." 
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
          <button type="button" className="px-6 py-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2" onClick={() => onDelete(block.id)}>
             <Trash2 size={14} /> Purge Component
          </button>
          <button type="submit" className="px-8 py-3 bg-slate-900 text-white hover:bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all flex items-center gap-2" disabled={saving}>
             <Save size={14} /> {saving ? 'Committing...' : 'Commit Block'}
          </button>
        </div>
      </form>
    </GlassCard>
  );
}

export default function LessonEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => { loadLesson(); }, [id]);

  const loadLesson = async () => {
    try {
      const { data } = await getLesson(id);
      setLesson(data);
      setFormData({ title: data.title, description: data.description || '' });
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateLesson(id, formData);
      setLesson(data);
    } catch (err) { alert('Failed to save lesson'); } 
    finally { setSaving(false); }
  };

  const handleAddBlock = async () => {
    try {
      await createContentBlock({ 
        lesson: id, title: '', type: 'text', text_content: '', 
        order: lesson.content_blocks?.length || 0 
      });
      loadLesson();
    } catch { alert('Failed to add block'); }
  };

  const handleUpdateBlock = async (blockId, data) => {
    try {
      await updateContentBlock(blockId, data);
      loadLesson();
    } catch { alert('Failed to save block'); }
  };

  const handleDeleteBlock = async (blockId) => {
    if (window.confirm('Delete this content block?')) {
      await deleteContentBlock(blockId);
      loadLesson();
    }
  };

  const handleMoveBlock = async (index, direction) => {
    const blocks = [...lesson.content_blocks];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const current = blocks[index];
    const target = blocks[targetIndex];

    try {
      await Promise.all([
        updateContentBlock(current.id, { order: target.order }),
        updateContentBlock(target.id, { order: current.order })
      ]);
      loadLesson();
    } catch { alert('Failed to reorder blocks'); }
  };

  if (loading) {
    return (
      <DashboardLayout title="Artifact Editor" subtitle="Establishing connection...">
        <div className="flex items-center justify-center min-h-[400px]">
           <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
       <DashboardLayout title="Artifact Editor" subtitle="Error">
        <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
           <PackageSearch size={64} strokeWidth={1} />
           <p className="mt-8 text-xs font-black uppercase tracking-[0.2em]">Artifact not found in Registry.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Artifact Editor" 
      subtitle={`Node: ${lesson.title}`}
    >
      <div className="max-w-4xl mx-auto space-y-12 pb-32">
        {/* Editor Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
           <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:shadow-xl transition-all">
              <ArrowLeft size={20} />
           </button>
           <h3 className="text-xl font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-3">
              <Layers size={20} /> Identity & Payload
           </h3>
        </div>

        {/* Lesson Header Config */}
        <GlassCard className="p-10 border-slate-100 bg-white shadow-xl shadow-slate-200/50 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
           <form onSubmit={handleSave} className="relative z-10 space-y-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Registry Name</label>
                 <div className="relative group">
                    <Type className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                       className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] h-16 pl-14 pr-6 text-slate-900 font-black text-xl italic tracking-tighter focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-all shadow-sm" 
                       value={formData.title} 
                       onChange={e => setFormData({ ...formData, title: e.target.value })} 
                       required 
                    />
                 </div>
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Terminal Description</label>
                 <textarea 
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-slate-700 font-bold focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-all shadow-sm min-h-[140px]" 
                    rows="3"
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Initialize parameters for this learning interaction..."
                 />
              </div>
              <div className="flex justify-end pt-4">
                 <button className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-[1.02] transition-all flex items-center gap-3" type="submit" disabled={saving}>
                    <Save size={16} /> {saving ? 'Writing...' : 'Update Knowledge Base'}
                 </button>
              </div>
           </form>
        </GlassCard>

        {/* Content Blocks Area */}
        <div className="pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
             <div>
                <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase mb-2">Payload Segments</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sequential node transmission components</p>
             </div>
             <button onClick={handleAddBlock} className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-2 hover:bg-indigo-600 transition-all shrink-0">
                <Plus size={16} /> Initialize Block
             </button>
          </div>

          {lesson.content_blocks?.length === 0 ? (
             <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-slate-100 rounded-[3rem] shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                   <Layers size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Empty Payload</h3>
                <p className="text-sm font-medium text-slate-500 max-w-sm mb-8">Add components to sequence the transmission of knowledge material.</p>
                <button onClick={handleAddBlock} className="px-8 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all">Add Payload</button>
             </div>
          ) : (
            <div className="space-y-4">
              {lesson.content_blocks?.map((block, idx) => (
                <motion.div 
                  key={block.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-6 px-2">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border-2 border-slate-200 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400">
                         {String(idx + 1).padStart(2, '0')}
                      </div>
                      <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] italic bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
                         {TYPE_ICONS[block.type] || <Layers size={14} />} {block.type.replace('_', ' ')} Matrix
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-30 transition-all" onClick={() => handleMoveBlock(idx, -1)} disabled={idx === 0}><ArrowUp size={14} /></button>
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-30 transition-all" onClick={() => handleMoveBlock(idx, 1)} disabled={idx === lesson.content_blocks.length - 1}><ArrowDown size={14} /></button>
                    </div>
                  </div>
                  <ContentBlockEditor block={block} onUpdate={handleUpdateBlock} onDelete={handleDeleteBlock} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
