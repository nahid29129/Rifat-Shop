import { useAuthStore } from "../store/auth";
import { Button } from "../components/ui/button";

export function Account() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Account</h1>
        <Button variant="outline" onClick={logout}>Sign Out</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Order History</h2>
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-muted-foreground">
            No orders found.
          </div>
        </div>
      </div>
    </div>
  );
}
