import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  User, 
  Phone, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ChevronRight, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { fetchMessages, markMessageAsRead } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await fetchMessages();
      const data = res?.data?.data || res?.data || [];
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markMessageAsRead(id);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-950 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
      
      {/* Left Sidebar: Message List */}
      <div className={`w-full lg:w-96 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${selectedMessage ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h2 className="font-bold text-slate-900 dark:text-white">Inbox</h2>
          </div>
          <span className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold">
            {messages.filter(m => !m.isRead).length} Unread
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">No messages found in your inbox.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {messages.map((msg) => (
                <div 
                  key={msg._id} 
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.isRead) handleMarkAsRead(msg._id);
                  }}
                  className={`p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    selectedMessage?._id === msg._id 
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500' 
                      : 'border-l-4 border-transparent'
                  } ${!msg.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold ${!msg.isRead ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                      {msg.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{msg.fullName}</p>
                    {!msg.isRead && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Message Detail */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${!selectedMessage ? 'hidden lg:flex' : 'flex'}`}>
        {selectedMessage ? (
          <>
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <button 
                onClick={() => setSelectedMessage(null)}
                className="lg:hidden flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Inbox
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  selectedMessage.isRead ? 'bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                }`}>
                  {selectedMessage.isRead ? 'Read' : 'New Message'}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
              {/* Sender Profile Card */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl font-black shadow-lg">
                  {selectedMessage.fullName.charAt(0)}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedMessage.fullName}
                    {selectedMessage.userId && (
                      <span className="px-2 py-0.5 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded uppercase font-bold tracking-tighter">
                        Registered User
                      </span>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {selectedMessage.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedMessage.phone}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Message Detail</span>
                </div>
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{selectedMessage.subject}</h4>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Mail className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Message Selected</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                Select a conversation from the inbox to view the details and sender information.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
