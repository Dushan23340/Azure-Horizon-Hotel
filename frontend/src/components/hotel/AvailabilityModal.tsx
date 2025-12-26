import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Room } from './RoomsSection';
import { checkRoomAvailability, RoomAvailabilityRequest } from '@/lib/api';

interface AvailabilityModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

const AvailabilityModal = ({ room, isOpen, onClose }: AvailabilityModalProps) => {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [isChecking, setIsChecking] = useState(false);
  const [availability, setAvailability] = useState<{ available: boolean; message: string } | null>(null);

  if (!room) return null;

  // Format date as YYYY-MM-DD in local timezone (not UTC)
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCheckAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      setAvailability({ available: false, message: 'Please select both check-in and check-out dates.' });
      return;
    }

    // Set time to midnight for accurate date comparison
    const checkIn = new Date(checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    const checkOut = new Date(checkOutDate);
    checkOut.setHours(0, 0, 0, 0);

    if (checkIn >= checkOut) {
      setAvailability({ available: false, message: 'Check-out date must be at least one day after check-in date.' });
      return;
    }

    setIsChecking(true);
    
    try {
      const request: RoomAvailabilityRequest = {
        roomId: room._id,
        checkInDate: formatDateLocal(checkInDate),
        checkOutDate: formatDateLocal(checkOutDate),
      };
      
      const response = await checkRoomAvailability(request);
      
      setAvailability({
        available: response.available,
        message: response.message
      });
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailability({
        available: false,
        message: 'Error checking availability. Please try again later.'
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleReset = () => {
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setAvailability(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Check Availability for {room.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Room Image */}
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-card/90 text-sm font-semibold text-primary backdrop-blur-sm">
                {room.price}/night
              </span>
            </div>
          </div>
          
          {/* Date Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Dates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Check-in
                </label>
                <div className="border rounded-lg p-3 bg-muted">
                  {checkInDate ? (
                    <p className="font-medium">{format(checkInDate, 'PPP')}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Select a date</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Check-out
                </label>
                <div className="border rounded-lg p-3 bg-muted">
                  {checkOutDate ? (
                    <p className="font-medium">{format(checkOutDate, 'PPP')}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Select a date</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <Calendar
                mode="range"
                selected={{ from: checkInDate, to: checkOutDate }}
                onSelect={(range) => {
                  if (range?.from) {
                    setCheckInDate(range.from);
                    // Clear availability result when dates change
                    setAvailability(null);
                  }
                  if (range?.to) {
                    setCheckOutDate(range.to);
                    // Clear availability result when dates change
                    setAvailability(null);
                  }
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const checkDate = new Date(date);
                  checkDate.setHours(0, 0, 0, 0);
                  return checkDate < today;
                }}
                initialFocus
              />
            </div>
          </div>
          
          {/* Availability Result */}
          {availability && (
            <div className={`p-4 rounded-lg ${availability.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p>{availability.message}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1" 
              onClick={handleCheckAvailability}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Check Availability'}
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleReset}
              disabled={isChecking}
            >
              Reset Dates
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={onClose}
              disabled={isChecking}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;