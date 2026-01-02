import { useNavigate } from 'react-router-dom';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { Building2, ChevronRight, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function SelectOrg() {
  const navigate = useNavigate();
  const { orgs, user, selectOrg, logout, isAuthenticated, selectedOrg } = useGitHubAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/connect');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (selectedOrg) {
      navigate('/');
    }
  }, [selectedOrg, navigate]);

  const handleSelectOrg = (org: typeof orgs[0]) => {
    selectOrg(org);
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/connect');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="hero-glow fixed inset-0 pointer-events-none" />
      
      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <img 
            src={user.avatar_url} 
            alt={user.login}
            className="h-16 w-16 rounded-full mx-auto mb-4 border-2 border-primary/20"
          />
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Welcome, {user.name || user.login}
          </h1>
          <p className="text-muted-foreground text-sm">
            Select an organization to analyze
          </p>
        </div>

        {/* Org List */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {orgs.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Organizations Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You don't have access to any GitHub organizations.
              </p>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {orgs.map((org, index) => (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrg(org)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group animate-slide-in"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <img 
                    src={org.avatar_url} 
                    alt={org.login}
                    className="h-10 w-10 rounded-lg"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-foreground">{org.login}</h3>
                    {org.description && (
                      <p className="text-xs text-muted-foreground truncate">{org.description}</p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
