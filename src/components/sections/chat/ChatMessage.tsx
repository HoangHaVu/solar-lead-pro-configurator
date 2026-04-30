import React from 'react';
import { CheckCheck, Download, FileText } from 'lucide-react';

interface ChatMessageProps {
  content: string | React.ReactNode;
  time: string;
  isOutgoing?: boolean;
  avatar?: string;
  isAttachment?: boolean;
  fileName?: string;
  fileSize?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  time,
  isOutgoing,
  avatar,
  isAttachment,
  fileName,
  fileSize,
}) => {
  if (isAttachment) {
    return (
      <div className={`flex items-start gap-3 max-w-[85%] ${isOutgoing ? 'self-end flex-row-reverse' : ''}`}>
        {!isOutgoing && (
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 hidden md:block">
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <div className="bg-white text-primary font-bold text-sm px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors border border-slate-100">
            <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm">{fileName}</p>
              <p className="text-xs text-slate-400 font-normal">{fileSize}</p>
            </div>
            <Download className="w-4 h-4 text-slate-300 ml-4" />
          </div>
          <span className="text-[10px] text-slate-400 ml-1">{time}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 max-w-[85%] ${isOutgoing ? 'self-end flex-row-reverse' : ''}`}>
      {!isOutgoing && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 hidden md:block">
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      )}
      <div className={`flex flex-col gap-1 ${isOutgoing ? 'items-end' : ''}`}>
        <div
          className={`font-medium text-sm px-4 py-3 rounded-2xl shadow-sm ${
            isOutgoing
              ? 'bg-primary text-white rounded-tr-none'
              : 'bg-white text-primary rounded-tl-none border border-slate-100'
          }`}
        >
          {content}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400">{time}</span>
          {isOutgoing && <CheckCheck className="w-3 h-3 text-primary" />}
        </div>
      </div>
    </div>
  );
};
