import React, { useState } from 'react';
import { createBooking, checkRoomAvailability } from '../../lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar } from '../ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../ui/popover';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface BookingFormProps {
  roomId: string;
  roomName: string;
  roomPrice: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  roomId, 
  roomName, 
  roomPrice, 
  isOpen,
  onClose, 
  onSuccess 
}) => {
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if a date is in the past (for check-in calendar)
  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Check if a date is valid for check-out (must be at least one day after check-in)
  const isCheckOutDateDisabled = (date: Date): boolean => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    if (checkInDate) {
      const minCheckOut = new Date(checkInDate);
      minCheckOut.setDate(minCheckOut.getDate() + 1);
      minCheckOut.setHours(0, 0, 0, 0);
      return checkDate < minCheckOut;
    }
    
    // If no check-in selected, minimum check-out is tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return checkDate < tomorrow;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }

    if (!guestEmail.trim()) {
      newErrors.guestEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(guestEmail)) {
      newErrors.guestEmail = 'Email is invalid';
    }

    if (!checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    } else {
      // Check-in cannot be in the past (but can be today)
      const checkIn = new Date(checkInDate);
      checkIn.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (checkIn < today) {
        newErrors.checkInDate = 'Check-in date cannot be in the past';
      }
    }

    if (!checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    }

    if (checkInDate && checkOutDate) {
      // Set time to midnight for accurate date comparison
      const checkIn = new Date(checkInDate);
      checkIn.setHours(0, 0, 0, 0);
      const checkOut = new Date(checkOutDate);
      checkOut.setHours(0, 0, 0, 0);
      
      if (checkIn >= checkOut) {
        newErrors.checkOutDate = 'Check-out date must be at least one day after check-in date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format date as YYYY-MM-DD in local timezone (not UTC)
  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleCheckAvailability = async () => {
    if (!validateForm()) return;

    setIsCheckingAvailability(true);
    setAvailabilityMessage('');
    setIsAvailable(null);

    try {
      const response = await checkRoomAvailability({
        roomId: roomId,
        checkInDate: formatDateLocal(checkInDate!),
        checkOutDate: formatDateLocal(checkOutDate!),
      });

      setAvailabilityMessage(response.message);
      setIsAvailable(response.available);
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailabilityMessage('Error checking availability. Please try again.');
      setIsAvailable(false);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    if (isAvailable === false) {
      setErrors({ ...errors, submit: 'Room is not available for selected dates' });
      return;
    }

    setIsBooking(true);
    setErrors({}); // Clear previous errors

    try {
      await createBooking({
        roomId,
        checkInDate: formatDateLocal(checkInDate!),
        checkOutDate: formatDateLocal(checkOutDate!),
        guestName,
        guestEmail,
      });

      // Reset form state
      setGuestName('');
      setGuestEmail('');
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setAvailabilityMessage('');
      setIsAvailable(null);
      setErrors({});

      // Show success notification
      toast.success('Booking Confirmed!', {
        description: `Your booking for ${roomName} has been confirmed. We look forward to hosting you!`,
      });

      // Call success callback and close
      onSuccess();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      const errorMessage = error?.message || 'Error creating booking. Please try again.';
      setErrors({ ...errors, submit: errorMessage });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {roomName}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{roomName}</span>
                <span className="text-lg font-bold">${roomPrice}/night</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Full Name</Label>
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter your full name"
              />
              {errors.guestName && (
                <p className="text-red-500 text-sm">{errors.guestName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email</Label>
              <Input
                id="guestEmail"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {errors.guestEmail && (
                <p className="text-red-500 text-sm">{errors.guestEmail}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInDate">Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    initialFocus
                    disabled={isDateDisabled}
                  />
                </PopoverContent>
              </Popover>
              {errors.checkInDate && (
                <p className="text-red-500 text-sm">{errors.checkInDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutDate">Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    initialFocus
                    disabled={isCheckOutDateDisabled}
                  />
                </PopoverContent>
              </Popover>
              {errors.checkOutDate && (
                <p className="text-red-500 text-sm">{errors.checkOutDate}</p>
              )}
            </div>
          </div>

          {availabilityMessage && (
            <div className={`p-4 rounded-md ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {availabilityMessage}
            </div>
          )}

          {errors.submit && (
            <div className="p-4 rounded-md bg-red-100 text-red-800">
              {errors.submit}
            </div>
          )}
        </div>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCheckAvailability}
              disabled={isCheckingAvailability}
            >
              {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
            </Button>
            <Button
              type="button"
              onClick={handleBooking}
              disabled={isBooking || isAvailable === false}
            >
              {isBooking ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;