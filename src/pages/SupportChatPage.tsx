import React from 'react';
import { SideNavBar } from '../components/layout/SideNavBar';
import { TopAppBar } from '../components/layout/TopAppBar';
import { ChatSidebar } from '../components/sections/chat/ChatSidebar';
import { ChatMessage } from '../components/sections/chat/ChatMessage';
import { MoreVertical, Paperclip, Send } from 'lucide-react';

export const SupportChatPage: React.FC = () => {
  const avatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuAySVEGNsHf2LW0MDYJHHsqPuE_N5yxtsHCgT9FFNRvEUWQN-WaNRweMf8D8KZpAt0quyaRZPydnC2D6cqqjWo1M4VOfzwyjXUKdglptLpKQhlkauQWD2Z2kzNKW3Dz6MsCuiTQNthTwCRiZgPkMXdpm8smmoq420dkSi4Ssl0IaYQQVVU8u7zsi6HFqtdD7eRSX-v3bXSZs_dJOWQHWLRY8QZcNMWj4UZce78vhwUmWdsPxzaayTud9RXZcdtGPyQkYchpYAtbVrk";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <SideNavBar />
      
      <div className="flex flex-col min-h-screen lg:pl-64">
        <TopAppBar />
        
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Nachrichten</h1>
            <p className="text-lg text-slate-500">Kläre Details direkt mit deinem Installationsteam.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px] mb-20">
            <ChatSidebar />

            <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200/50 flex flex-col overflow-hidden h-[600px] lg:h-auto">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 lg:hidden">
                    <img src={avatarUrl} alt="Lukas Weber" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-primary">Chat mit Lukas Weber</h3>
                    <p className="text-xs text-green-600 flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Online
                    </p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 flex flex-col gap-4">
                <div className="flex justify-center my-4">
                  <div className="bg-slate-200/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Gestern, 14:30 - Projektstatus aktualisiert
                  </div>
                </div>

                <ChatMessage 
                  avatar={avatarUrl}
                  content="Hallo! Wir planen aktuell den Montage-Termin für deine Anlage in der nächsten Woche. Hättest du am Dienstag ab 08:00 Uhr Zeit?"
                  time="09:15"
                />

                <ChatMessage 
                  content="Hallo Herr Weber. Dienstag passt grundsätzlich gut. Muss ich den ganzen Tag vor Ort sein?"
                  time="09:42"
                  isOutgoing={true}
                />

                <ChatMessage 
                  avatar={avatarUrl}
                  content="Nein, das ist nicht zwingend erforderlich. Es reicht, wenn jemand morgens kurz aufschließt, damit wir an den Zählerschrank kommen."
                  time="09:50"
                />

                <ChatMessage 
                  avatar={avatarUrl}
                  time="09:51"
                  isAttachment={true}
                  fileName="Montage_Ablaufplan.pdf"
                  fileSize="2.4 MB"
                />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex items-end gap-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all p-2">
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-white" title="Datei anhängen">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <textarea
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm text-primary py-2.5 max-h-32 min-h-[44px]"
                    placeholder="Schreibe eine Nachricht..."
                    rows={1}
                  ></textarea>
                  <button className="bg-secondary text-primary hover:opacity-90 transition-opacity rounded-lg p-2.5 flex items-center justify-center shadow-sm" title="Senden">
                    <Send className="w-5 h-5 fill-primary" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
