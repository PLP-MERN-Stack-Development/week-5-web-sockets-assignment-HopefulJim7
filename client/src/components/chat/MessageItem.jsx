// src/components/Chat/MessageItem.jsx
export default function MessageItem({ message, isUser }) {
  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div className={`px-4 py-2 rounded-xl max-w-md break-words text-sm
        ${isUser ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
        {message}
      </div>
    </div>
  );
}
