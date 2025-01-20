import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { setFirebaseConfig } from '../lib/firebase';
import { useToast } from './ui/use-toast';

export const FirebaseConfig = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(config).some(value => !value)) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }
    
    setFirebaseConfig(config);
    toast({
      title: "Success",
      description: "Firebase configuration saved successfully"
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">Firebase Configuration</h2>
        <p className="text-sm text-muted-foreground text-center">
          Please enter your Firebase configuration details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            placeholder="Enter API Key"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="authDomain">Auth Domain</Label>
          <Input
            id="authDomain"
            value={config.authDomain}
            onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
            placeholder="Enter Auth Domain"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectId">Project ID</Label>
          <Input
            id="projectId"
            value={config.projectId}
            onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
            placeholder="Enter Project ID"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storageBucket">Storage Bucket</Label>
          <Input
            id="storageBucket"
            value={config.storageBucket}
            onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
            placeholder="Enter Storage Bucket"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="messagingSenderId">Messaging Sender ID</Label>
          <Input
            id="messagingSenderId"
            value={config.messagingSenderId}
            onChange={(e) => setConfig({ ...config, messagingSenderId: e.target.value })}
            placeholder="Enter Messaging Sender ID"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appId">App ID</Label>
          <Input
            id="appId"
            value={config.appId}
            onChange={(e) => setConfig({ ...config, appId: e.target.value })}
            placeholder="Enter App ID"
          />
        </div>

        <Button type="submit" className="w-full">
          Save Configuration
        </Button>
      </form>
    </Card>
  );
};