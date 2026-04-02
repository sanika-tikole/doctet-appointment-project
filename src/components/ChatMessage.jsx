import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const { role, text, timestamp } = message;
  const isUser = role === 'user';

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2 mb-4">
        <div className="flex flex-col items-end max-w-[78%]">
          <div className="bg-[#6367FF] text-white px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm text-sm leading-relaxed">
            {text}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 mr-1">{formatTime(timestamp)}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#6367FF] flex items-center justify-center shrink-0 shadow-sm">
          <User size={15} className="text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6367FF] to-[#8494FF] flex items-center justify-center shrink-0 shadow-sm">
        <Bot size={15} className="text-white" />
      </div>
      <div className="flex flex-col items-start max-w-[78%]">
        <div className="bg-[#FFDBFD] text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm text-sm leading-relaxed whitespace-pre-line">
          {text}
        </div>
        <span className="text-[10px] text-gray-400 mt-1 ml-1">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
}
