import { useState, useEffect } from 'react';
import { getRooms } from '../../lib/api';
import RoomDetailsModal from './RoomDetailsModal';
import AvailabilityModal from './AvailabilityModal';
import BookingForm from '../booking/BookingForm';

// Define the Room type
export type Room = {
  _id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  price: number;
  availability: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const RoomsSection = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await getRooms();
        setRooms(roomsData);
      } catch (err) {
        setError('Failed to load rooms');
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);



  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCheckAvailability = (room: Room) => {
    setSelectedRoom(room);
    setIsAvailabilityModalOpen(true);
  };

  const handleBookNow = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <section id="rooms" className="py-20 lg:py-28 bg-gradient-to-b from-background to-primary/5">
      <div className="container-hotel">
        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up opacity-0">
          <span className="pill-tag mb-4">Accommodations</span>
          <h2 className="section-title mx-auto">Rooms & Suites</h2>
          <p className="section-subtitle mx-auto">
            Each room is a masterpiece of comfort and design, offering a unique perspective 
            of our stunning beachfront location.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading rooms...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 stagger-children">
            {rooms.map((room, index) => (
              <div
                key={room._id}
                className="animate-fade-in-up opacity-0 card-hotel group"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={room.image}
                    alt={`${room.name} - ${room.description}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full bg-card/90 text-sm font-semibold text-primary backdrop-blur-sm">
                      ${room.price}/night
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 
                    className="font-serif text-xl font-semibold text-secondary mb-2 group-hover:text-primary transition-colors cursor-pointer hover:underline"
                    onClick={() => handleViewDetails(room)}
                  >
                    {room.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{room.description}</p>
                  
                  {/* Features */}
                  <ul className="flex flex-wrap gap-2 mb-5">
                    {room.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleCheckAvailability(room)}
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-ocean-light transition-colors group/btn"
                    >
                      Check Availability
                      <svg
                        className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handleBookNow(room)}
                      className="inline-flex items-center text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors group/btn px-4 py-2 rounded-md"
                    >
                      Book Now
                      <svg
                        className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Room Details Modal */}
      <RoomDetailsModal 
        room={selectedRoom} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      {/* Availability Modal */}
      <AvailabilityModal
        room={selectedRoom}
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
      />
      
      {/* Booking Modal */}
      {selectedRoom && (
        <BookingForm
          roomId={selectedRoom._id}
          roomName={selectedRoom.name}
          roomPrice={selectedRoom.price}
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </section>
  );
};

export default RoomsSection;
