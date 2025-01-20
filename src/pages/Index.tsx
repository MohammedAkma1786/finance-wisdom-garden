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

  // Only pass serializable data to DashboardContainer
  const serializedUser = {
    id: user.id,
    name: user.name
  };

  return (
    <DashboardContainer
      user={serializedUser}
      transactions={transactions || []}
      onLogout={logout}
    />
  );
};

export default Index;