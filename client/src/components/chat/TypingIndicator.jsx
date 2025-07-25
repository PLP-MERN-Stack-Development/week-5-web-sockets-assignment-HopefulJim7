// src/components/Chat/TypingIndicator.jsx
import { Loader2 } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2 px-4 py-2 text-muted">
      <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
      <span>Typing...</span>
    </div>
  );
}