import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";

interface Subscription {
  id: number;
  name: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: string;
  description?: string;
}

const Subscriptions = () => {
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [nextBillingDate, setNextBillingDate] = useState("");
  const [description, setDescription] = useState("");

  const handleAddSubscription = () => {
    if (!name || !amount || !nextBillingDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newSubscription: Subscription = {
      id: Date.now(),
      name,
      amount: parseFloat(amount),
      billingCycle,
      nextBillingDate,
      description,
    };

    setSubscriptions([...subscriptions, newSubscription]);
    setName("");
    setAmount("");
    setNextBillingDate("");
    setDescription("");

    toast({
      title: "Success",
      description: "Subscription added successfully",
    });
  };

  const handleDeleteSubscription = (id: number) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    toast({
      title: "Success",
      description: "Subscription deleted successfully",
    });
  };

  const totalMonthly = subscriptions
    .filter((sub) => sub.billingCycle === "monthly")
    .reduce((sum, sub) => sum + sub.amount, 0);

  const totalYearly = subscriptions
    .filter((sub) => sub.billingCycle === "yearly")
    .reduce((sum, sub) => sum + sub.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Subscription Tracker</h1>
          <div className="w-10" />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Add New Subscription</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Netflix, Spotify, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Billing Cycle</label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={billingCycle === "monthly" ? "default" : "outline"}
                    onClick={() => setBillingCycle("monthly")}
                  >
                    Monthly
                  </Button>
                  <Button
                    type="button"
                    variant={billingCycle === "yearly" ? "default" : "outline"}
                    onClick={() => setBillingCycle("yearly")}
                  >
                    Yearly
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Next Billing Date</label>
                <Input
                  type="date"
                  value={nextBillingDate}
                  onChange={(e) => setNextBillingDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (Optional)</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add notes about this subscription"
                />
              </div>
              <Button className="w-full" onClick={handleAddSubscription}>
                Add Subscription
              </Button>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-lg font-semibold">Active Subscriptions</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Monthly Total:</span>
                <span>{formatCurrency(totalMonthly)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Yearly Total:</span>
                <span>{formatCurrency(totalYearly)}</span>
              </div>
            </div>
            <div className="space-y-4">
              {subscriptions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active subscriptions
                </p>
              ) : (
                subscriptions.map((subscription) => (
                  <Card key={subscription.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{subscription.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(subscription.amount)} / {subscription.billingCycle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Next billing: {subscription.nextBillingDate}
                        </p>
                        {subscription.description && (
                          <p className="text-sm mt-2">{subscription.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteSubscription(subscription.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;