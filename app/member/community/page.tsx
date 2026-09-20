'use client';

import { useState, useRef } from 'react';
import { MemberSidebar } from '@/components/member/MemberSidebar';
import { MemberHeader } from '@/components/member/MemberHeader';
import { notifyCommunityMessage } from '@/lib/pwa';
import {
  Image as ImageIcon,
  Heart,
  MessageSquare,
  Trophy,
  Award,
  Trash2,
  Send,
  Sparkles,
  X,
  Plus,
  Bell
} from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  time: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

export default function MemberCommunityPage() {
  const [postText, setPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post-1',
      author: 'María Jiménez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: 'hace 23 h',
      content: '¡Completé mi sesión de fuerza hoy! Rompí mi récord en sentadilla 85 kg 🏋️‍♀️🔥',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
      likes: 14,
      isLiked: true,
      comments: [
        {
          id: 'c1',
          author: 'Carlos Ruiz (Coach)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          content: '¡Excelente técnica hoy María! Muy merecido el PR.',
          time: 'hace 20 h'
        },
        {
          id: 'c2',
          author: 'Juan Pablo Díaz',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
          content: '¡Máquina! A romperla en la próxima clase.',
          time: 'hace 18 h'
        }
      ]
    },
    {
      id: 'post-2',
      author: 'Juan Pablo Díaz',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      time: 'hace 1 día',
      content: 'Lunes de motivación con el equipo de Iron Strength. 5 días seguidos sin faltar ⚡',
      likes: 8,
      isLiked: false,
      comments: []
    }
  ]);

  const ranking = [
    { rank: 1, name: 'María Jiménez', isYou: true, sessions: '12 sesiones', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
    { rank: 2, name: 'Juan Pablo Díaz', isYou: false, sessions: '10 sesiones', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
    { rank: 3, name: 'Nicolás Díaz', isYou: false, sessions: '8 sesiones', initials: 'ND' },
    { rank: 4, name: 'Camila Vega', isYou: false, sessions: '7 sesiones', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
    { rank: 5, name: 'Sofía Romero', isYou: false, sessions: '6 sesiones', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' }
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setSelectedImage(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() && !selectedImage) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: 'María Jiménez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: 'Hace un momento',
      content: postText,
      image: selectedImage || undefined,
      likes: 1,
      isLiked: true,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleLike = (id: string) => {
    setPosts(posts.map(p => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked
        };
      }
      return p;
    }));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;

    const commentContent = newCommentText;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: 'María Jiménez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      content: commentContent,
      time: 'Ahora'
    };

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
    setNewCommentText('');

    // 🔔 Disparar notificación push para simular interacción de comunidad
    try {
      notifyCommunityMessage('María Jiménez', commentContent);
    } catch (e) {
      // silent
    }
  };

  const activePost = posts.find(p => p.id === activeCommentPostId);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181D27] flex font-sans">
      <MemberSidebar gymName="Iron Strength" memberName="María Jiménez" />

      <div className="flex-1 flex flex-col min-w-0">
        <MemberHeader gymName="Iron Strength" memberName="María Jiménez" />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717680]">
              CONECTÁ CON TU COMUNIDAD
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#181D27] mt-0.5">
              Comunidad
            </h1>
            <p className="text-xs text-[#535862] mt-0.5">
              Compartí logros, sumate a retos y motivá a otros miembros de tu gimnasio.
            </p>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Post Creator + Feed */}
            <div className="lg:col-span-8 space-y-6">
              {/* Post Creator Box */}
              <div className="bg-white rounded-3xl p-5 md:p-6 border border-[#E9EAEB] shadow-sm space-y-4">
                <form onSubmit={handleCreatePost}>
                  <div className="flex items-start gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                      alt="María"
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-200 mt-1"
                    />
                    <div className="flex-1 space-y-3">
                      <textarea
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder="Compartí tu logro o entreno de hoy, María..."
                        rows={2}
                        className="w-full bg-[#FAF8F5] border border-[#E9EAEB] rounded-2xl px-4 py-3 text-xs text-[#181D27] placeholder:text-[#A4A7AE] focus:outline-none focus:ring-2 focus:ring-[#181D27] focus:bg-white transition resize-none"
                      />

                      {/* Image Preview if selected */}
                      {selectedImage && (
                        <div className="relative inline-block rounded-2xl overflow-hidden border border-[#E9EAEB] shadow-xs">
                          <img
                            src={selectedImage}
                            alt="Previa subida"
                            className="max-h-48 rounded-2xl object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedImage(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />

                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#F2F4F7]">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#535862] hover:text-[#181D27] transition cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#F26522]" />
                      <span>{selectedImage ? 'Cambiar imagen' : 'Agregar imagen'}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!postText.trim() && !selectedImage}
                      className="px-5 py-2 bg-[#181D27] hover:bg-black text-white text-xs font-semibold rounded-xl transition shadow-xs disabled:opacity-40 cursor-pointer"
                    >
                      Publicar
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed Posts */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-3xl border border-[#E9EAEB] shadow-sm overflow-hidden space-y-4">
                    {/* Post Header */}
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-[#181D27]">{post.author}</h4>
                          <span className="text-[11px] text-[#717680]">{post.time}</span>
                        </div>
                      </div>

                      {post.author === 'María Jiménez' && (
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          title="Eliminar publicación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Post Text */}
                    {post.content && (
                      <div className="px-5 text-sm text-[#181D27] whitespace-pre-line">
                        {post.content}
                      </div>
                    )}

                    {/* Post Image */}
                    {post.image && (
                      <div className="w-full max-h-[440px] bg-neutral-100 overflow-hidden">
                        <img
                          src={post.image}
                          alt="Gym post"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Post Actions & Likes */}
                    <div className="p-5 pt-2 flex items-center justify-between border-t border-[#F2F4F7]">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-1.5 text-xs font-bold transition cursor-pointer"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              post.isLiked
                                ? 'text-red-500 fill-red-500'
                                : 'text-[#717680]'
                            }`}
                          />
                          <span className={post.isLiked ? 'text-red-600' : 'text-[#535862]'}>
                            {post.likes}
                          </span>
                        </button>

                        <button
                          onClick={() => setActiveCommentPostId(post.id)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[#535862] hover:text-[#181D27] transition cursor-pointer"
                        >
                          <MessageSquare className="w-4 h-4 text-[#717680]" />
                          <span>{post.comments.length} comentarios</span>
                        </button>
                      </div>
                    </div>

                    {/* Inline Preview of Comments if any */}
                    {post.comments.length > 0 && (
                      <div className="px-5 pb-4 space-y-2.5">
                        {post.comments.slice(0, 2).map((c) => (
                          <div key={c.id} className="bg-[#FAF8F5] rounded-xl p-3 text-xs flex gap-2.5 items-start">
                            <div className="w-6 h-6 rounded-full bg-[#181D27] text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                              {c.author.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[#181D27]">{c.author}</span>
                                <span className="text-[10px] text-[#717680]">{c.time}</span>
                              </div>
                              <p className="text-[#535862] mt-0.5">{c.content}</p>
                            </div>
                          </div>
                        ))}
                        {post.comments.length > 2 && (
                          <button
                            onClick={() => setActiveCommentPostId(post.id)}
                            className="text-xs font-semibold text-[#F26522] hover:underline cursor-pointer"
                          >
                            Ver los {post.comments.length} comentarios...
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Retos Activos + Ranking del Mes */}
            <div className="lg:col-span-4 space-y-6">
              {/* Retos Activos */}
              <div className="bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#F26522]" />
                  <h3 className="text-sm font-bold text-[#181D27]">Retos activos</h3>
                </div>

                <div className="p-4 bg-[#FDF2EC] border border-[#FAD7C5] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#D94F00]">Reto 20 Días de Constancia</span>
                    <span className="text-[10px] font-bold bg-[#F26522] text-white px-2 py-0.5 rounded-full">Activo</span>
                  </div>
                  <p className="text-xs text-[#535862]">Entrená 20 días durante este mes para desbloquear la insignia 'Titán del Mes' y 500 XP.</p>
                  <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-[#FAD7C5] mt-2">
                    <div className="bg-[#F26522] h-full rounded-full w-[60%]"></div>
                  </div>
                  <span className="text-[10px] text-[#717680] font-semibold block text-right">12 / 20 días completados (60%)</span>
                </div>
              </div>

              {/* Ranking del mes */}
              <div className="bg-white rounded-3xl p-6 border border-[#E9EAEB] shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#717680]" />
                  <h3 className="text-sm font-bold text-[#181D27]">Ranking del mes</h3>
                </div>

                <div className="space-y-2">
                  {ranking.map((item) => (
                    <div
                      key={item.rank}
                      className={`p-2.5 rounded-2xl flex items-center justify-between transition ${
                        item.isYou
                          ? 'bg-[#F9F5EE] border border-[#EBE1D0]'
                          : 'hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-bold text-[#717680] w-4 text-center">
                          {item.rank}
                        </span>

                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-neutral-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E9EAEB] text-[10px] font-bold text-[#717680] flex items-center justify-center shrink-0">
                            {item.initials}
                          </div>
                        )}

                        <div className="min-w-0">
                          <span className="text-xs font-bold text-[#181D27] block truncate">
                            {item.name} {item.isYou && <span className="text-[10px] text-[#F26522] font-semibold">tú</span>}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] text-[#717680] shrink-0">
                        {item.sessions}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de Comentarios */}
      {activePost && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-100 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F2F4F7]">
              <div>
                <h3 className="text-base font-black text-[#181D27]">Comentarios</h3>
                <p className="text-xs text-[#717680]">Publicación de {activePost.author}</p>
              </div>
              <button
                onClick={() => setActiveCommentPostId(null)}
                className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of comments */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {activePost.comments.length === 0 ? (
                <p className="text-xs text-center text-[#717680] py-6">Aún no hay comentarios. ¡Sé el primero en comentar!</p>
              ) : (
                activePost.comments.map(c => (
                  <div key={c.id} className="bg-[#FAF8F5] rounded-2xl p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#181D27]">{c.author}</span>
                      <span className="text-[10px] text-[#717680]">{c.time}</span>
                    </div>
                    <p className="text-xs text-[#535862] leading-relaxed">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add comment input */}
            <div className="pt-4 border-t border-[#F2F4F7] flex items-center gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment(activePost.id);
                }}
                placeholder="Escribe un comentario o felicitación..."
                className="flex-1 bg-[#FAF8F5] border border-[#E9EAEB] rounded-xl px-4 py-2.5 text-xs text-[#181D27] focus:outline-none focus:ring-2 focus:ring-[#181D27] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => handleAddComment(activePost.id)}
                disabled={!newCommentText.trim()}
                className="p-2.5 bg-[#181D27] hover:bg-black text-white rounded-xl transition disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
