// src/pages/Chat.jsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatBox from '../components/Chat/ChatBox';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Welcome, {user?.username || 'Guest'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChatBox username={user?.username || 'Anonymous'} />
        </CardContent>
      </Card>
    </div>
  );
}

// // src/pages/Chat.jsx
// import ChatBox from '../components/Chat/ChatBox';

// export default function ChatPage() {
//   const username = "jimHope";
//   return <ChatBox username={username} />;
// }