import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { isFirebaseConfigured } from '../lib/firebase';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register } = useAuth();
  const { toast } = useToast();

  if (!isFirebaseConfigured) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Firebase Not Configured</h2>
        <p className="text-gray-600">
          Please ensure your Firebase environment variables are properly set in the .env file.
        </p>
      </div>
    );
  }

  const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password should be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      return;
    }

    if (isLogin) {
      const success = await login(email, password);
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
      const success = await register(email, password, name);
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
            placeholder="Enter your password (min. 6 characters)"
            required
            minLength={6}
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