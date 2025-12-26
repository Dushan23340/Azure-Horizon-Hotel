import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '@/components/hotel/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { getBookings, getAllUsers } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/hotel/Navbar';
import Footer from '@/components/hotel/Footer';

const UserDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab === 'bookings') return 'bookings';
    if (tab === 'profile') return 'profile';
    return 'profile';
  });
  
  // Auto-switch to bookings tab for admin users when component mounts (unless profile tab is explicitly selected)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    
    // Only auto-switch to bookings if the user didn't explicitly request the profile tab
    if (isAuthenticated && user?.role === 'admin' && activeTab === 'profile' && tab !== 'profile') {
      const timer = setTimeout(() => {
        setActiveTab('bookings');
      }, 100); // Small delay to ensure user data is loaded
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user?.role, activeTab]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const fetchBookings = async () => {
    if (!isAuthenticated) return;
    
    setBookingsLoading(true);
    try {
      const userBookings = await getBookings();
      setBookings(userBookings);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    
    setUsersLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings' && isAuthenticated) {
      if (user?.role === 'admin') {
        fetchBookings();
        fetchUsers();
      } else {
        fetchBookings();
      }
    }
  }, [activeTab, isAuthenticated, user?.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex justify-center items-center h-64 pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="py-10 pt-20">
          <div className="container-hotel">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-serif mb-4">Access Denied</h2>
              <p className="mb-6">Please log in to access your dashboard</p>
              <Button onClick={() => navigate('/')}>Go to Home</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="container-hotel py-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif text-center mb-8">Welcome, {user.name}</h1>
            
            <Card className="mb-8">
              {user?.role !== 'admin' && (
                <CardHeader>
                  <CardTitle className="text-xl">Dashboard</CardTitle>
                </CardHeader>
              )}
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {user?.role !== 'admin' && (
                    <Button
                      variant={activeTab === 'profile' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('profile')}
                    >
                      My Profile
                    </Button>
                  )}
                  {user?.role !== 'admin' && (
                    <Button
                      variant={activeTab === 'bookings' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('bookings')}
                    >
                      My Bookings
                    </Button>
                  )}
                </div>
                
                {activeTab === 'profile' && <UserProfile />}
                
                {activeTab === 'bookings' && user?.role === 'admin' ? (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-serif">Admin Dashboard</h2>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>All Bookings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 mb-4">
                          <Button onClick={fetchBookings} disabled={bookingsLoading}>
                            {bookingsLoading ? 'Loading Bookings...' : 'Refresh All Bookings'}
                          </Button>
                          <Button onClick={fetchUsers} disabled={usersLoading}>
                            {usersLoading ? 'Loading Users...' : 'Refresh Users'}
                          </Button>
                        </div>
                        
                        {bookingsLoading ? (
                          <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        ) : bookings.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-lg">No bookings found.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {bookings.map((booking) => (
                              <Card key={booking._id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h3 className="font-medium">{booking.roomId?.name || 'Room'}</h3>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                                      </p>
                                      <p className="text-sm">Guest: {booking.guestName}</p>
                                      <p className="text-sm">Status: <span className="capitalize">{booking.status}</span></p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">${booking.totalAmount || booking.roomId?.price || 0}/night</p>
                                      <p className="text-sm text-muted-foreground">{booking.guestEmail}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>All Users</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {usersLoading ? (
                          <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        ) : users.length === 0 ? (
                          <div className="text-center py-4">
                            <p className="text-lg">No users found.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {users.map((userItem) => (
                              <Card key={userItem._id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h3 className="font-medium">{userItem.name}</h3>
                                      <p className="text-sm text-muted-foreground">{userItem.email}</p>
                                      <p className="text-sm">Role: <span className="capitalize">{userItem.role}</span></p>
                                      <p className="text-sm">Status: <span className="capitalize">{userItem.isActive ? 'Active' : 'Inactive'}</span></p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-muted-foreground">{userItem.phone || 'No phone'}</p>
                                      <p className="text-sm text-muted-foreground">{new Date(userItem.createdAt).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : activeTab === 'bookings' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-serif">My Bookings</h2>
                      <Button onClick={fetchBookings} disabled={bookingsLoading}>
                        {bookingsLoading ? 'Loading...' : 'Refresh'}
                      </Button>
                    </div>
                    
                    {bookingsLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-lg">You have no bookings yet.</p>
                        <Button className="mt-4" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                          Book a Room
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {bookings.map((booking) => (
                          <Card key={booking._id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium">{booking.roomId?.name || 'Room'}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm">Status: <span className="capitalize">{booking.status}</span></p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${booking.totalAmount || booking.roomId?.price || 0}/night</p>
                                  <p className="text-sm text-muted-foreground">{booking.guestName}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserDashboard;