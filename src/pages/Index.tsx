import { useAuth } from "@/contexts/AuthContext";
import { Auth } from "@/components/Auth";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { useTransactions } from "@/hooks/useTransactions";

const Index = () => {
  const { user, logout } = useAuth();
  const { transactions, isLoading } = useTransactions();

  if (!user) {
    return <Auth />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer
      user={user}
      transactions={transactions}
      onLogout={logout}
    />
  );
};

export default Index;