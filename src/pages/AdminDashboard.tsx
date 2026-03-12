import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, stationsAPI, Station } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus, Pencil, Trash2, Radio, Music } from 'lucide-react';
import StationForm from '@/components/StationForm';

export default function AdminDashboard() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = auth.getUser();

  useEffect(() => {
    if (!auth.isAuthenticated() || !auth.isAdmin()) {
      navigate('/admin/login');
      return;
    }
    loadStations();
  }, [navigate]);

  const loadStations = async () => {
    try {
      const token = auth.getToken();
      if (!token) return;

      const data = await stationsAPI.getAllAdmin(token);
      setStations(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load stations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate('/admin/login');
    toast({
      title: 'Logged out',
      description: 'You have been signed out successfully',
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this station?')) return;

    try {
      const token = auth.getToken();
      if (!token) return;

      await stationsAPI.delete(token, id);
      toast({
        title: 'Success',
        description: 'Station deleted successfully',
      });
      loadStations();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete station',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (station: Station) => {
    setEditingStation(station);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingStation(null);
    loadStations();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Radio className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 border-b shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">RadioTRN Admin</h1>
                <p className="text-sm text-white/90">Station Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-white/80">{user?.role}</p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-white/30 text-white hover:bg-white/20 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Stations
              </CardTitle>
              <Music className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Stations
              </CardTitle>
              <Radio className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stations.filter(s => s.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Inactive Stations
              </CardTitle>
              <Radio className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stations.filter(s => !s.isActive).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stations List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Radio Stations</CardTitle>
                <CardDescription>Manage your radio station listings</CardDescription>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Station
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Music className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No stations yet. Click "Add Station" to create one.</p>
                </div>
              ) : (
                stations.map((station) => (
                  <div
                    key={station.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: station.color }}
                      >
                        <Radio className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{station.name}</h3>
                          {station.isActive ? (
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{station.tagline}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">{station.genre}</span>
                          <span className="text-xs text-gray-400">{station.streamUrl}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(station)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(station.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Station Form Modal */}
      {showForm && (
        <StationForm
          station={editingStation}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
