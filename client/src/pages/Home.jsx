import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to ChatFlow</CardTitle>
          <Separator className="my-2" />
          <p className="text-muted-foreground text-sm">
            Secure, real-time messaging powered by Socket.IO and JWT
          </p>
        </CardHeader>
        <CardContent className="flex justify-center gap-4 mt-4">
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}