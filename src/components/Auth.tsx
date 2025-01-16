import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      const success = login(email, password);
      if (success) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } else {
      if (!name) {
        toast({
          title: "Error",
          description: "Please enter your name",
          variant: "destructive",
        });
        return;
      }
      const success = register(email, password, name);
      if (success) {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Email already exists",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{isLogin ? 'Login' : 'Create Account'}</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <Button type="submit" className="w-full">
          {isLogin ? 'Login' : 'Register'}
        </Button>
      </form>
      
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};