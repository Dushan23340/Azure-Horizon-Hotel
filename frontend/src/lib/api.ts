// API service for backend communication
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:5003/api';

// Define types for our API responses
export interface RoomAvailabilityRequest {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
}

export interface RoomAvailabilityResponse {
  roomId: string;
  room: any;
  available: boolean;
  checkInDate: string;
  checkOutDate: string;
  message: string;
}

// Function to check room availability
export const checkRoomAvailability = async (
  request: RoomAvailabilityRequest
): Promise<RoomAvailabilityResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/check-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking room availability:', error);
    throw error;
  }
};

// Function to get all rooms
export const getRooms = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
};

// Define types for booking
export interface BookingRequest {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  guestEmail: string;
}

export interface BookingResponse {
  message: string;
  booking: any;
}

// Function to create a booking
export const createBooking = async (
  bookingData: BookingRequest
): Promise<BookingResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Function to get all bookings
export const getBookings = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Function to get a specific booking by ID
export const getBookingById = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

// Define types for reservation inquiry
export interface InquiryRequest {
  name: string;
  email: string;
  phone?: string;
  checkInDate: string;
  checkOutDate: string;
  guests?: string;
  message?: string;
}

export interface InquiryResponse {
  message: string;
  inquiry: any;
}

// Function to submit a reservation inquiry
export const submitInquiry = async (
  inquiryData: InquiryRequest
): Promise<InquiryResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.errors?.[0]?.msg || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    throw error;
  }
};