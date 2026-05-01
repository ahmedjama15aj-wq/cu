import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageSquare, User, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';
import { PractitionerProfile } from '../types';
import { collection, query, orderBy, onSnapshot, addDoc, setDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: string;
}

interface Props {
  practitioner: PractitionerProfile;
  onClose: () => void;
}

export const Chat: React.FC<Props> = ({ practitioner, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roomId = [user?.uid, practitioner.uid].sort().join('_');

  useEffect(() => {
    setMessages([]); // Clear messages when room changes
    if (!user || !roomId) return;

    const messagesRef = collection(db, 'conversations', roomId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Message[];
      setMessages(loadedMessages);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `conversations/${roomId}/messages`);
    });

    return () => unsubscribe();
  }, [roomId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const messageData = {
      text: inputText,
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous User',
      createdAt: new Date().toISOString()
    };
    
    setInputText('');

    try {
      const messagesRef = collection(db, 'conversations', roomId, 'messages');
      await addDoc(messagesRef, messageData);
      
      const convRef = doc(db, 'conversations', roomId);
      await setDoc(convRef, {
        lastUpdated: new Date().toISOString(),
        participants: roomId.split('_')
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `conversations/${roomId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-[2rem] shadow-2xl border border-orange-100 overflow-hidden flex flex-col w-full max-w-lg h-[80vh] max-h-[600px]"
      >
        {/* Chat Header */}
        <div className="bg-white p-5 border-b border-slate-100 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-200 text-slate-400 shrink-0 overflow-hidden">
              {practitioner.photoURL ? (
                <img src={practitioner.photoURL} alt={practitioner.displayName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-orange-600/50" />
              )}
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm leading-tight">Chat with {practitioner.displayName.split(' ')[0]}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-[8px] text-slate-400 uppercase tracking-widest font-black">Practitioner is Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/20">
          {messages.length === 0 && (
            <div className="text-center py-10 px-6">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Start your inquiry</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'What is the pricing for therapy?',
                  'How long is a typical session?',
                  'Do you treat lower back pain?'
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInputText(q)}
                    className="text-[10px] font-bold text-left bg-white border border-slate-100 p-4 rounded-2xl text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isMine = msg.senderId === user?.uid;
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: isMine ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] p-3.5 rounded-2xl text-xs shadow-sm
                    ${isMine 
                      ? 'bg-orange-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'}
                  `}>
                    <p className="leading-relaxed font-medium">{msg.text}</p>
                    <div className={`
                      text-[7px] mt-1.5 font-bold uppercase tracking-widest opacity-60
                      ${isMine ? 'text-right' : 'text-left'}
                    `}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-slate-50 px-5 py-3.5 rounded-2xl text-xs outline-none font-medium text-slate-700 focus:bg-orange-50/30 focus:border-orange-200 border border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white p-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
