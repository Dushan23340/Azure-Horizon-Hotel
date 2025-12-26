import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Room } from './RoomsSection';

interface RoomDetailsModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

const RoomDetailsModal = ({ room, isOpen, onClose }: RoomDetailsModalProps) => {
  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">{room.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Room Image */}
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-card/90 text-sm font-semibold text-primary backdrop-blur-sm">
                {room.price}/night
              </span>
            </div>
          </div>
          
          {/* Room Description */}
          <div>
            <p className="text-muted-foreground">{room.description}</p>
          </div>
          
          {/* Room Features */}
          <div>
            <h3 className="text-lg font-medium mb-3">Features & Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {room.features.map((feature, index) => (
                <Badge key={index} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Detailed Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Accommodation Details</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Spacious living area</li>
                <li>• Premium bedding and linens</li>
                <li>• Private bathroom with luxury toiletries</li>
                <li>• Climate control system</li>
                <li>• Safe and storage facilities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Amenities Included</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Free high-speed Wi-Fi</li>
                <li>• Flat-screen TV with premium channels</li>
                <li>• Tea and coffee making facilities</li>
                <li>• Daily housekeeping</li>
                <li>• 24/7 room service</li>
              </ul>
            </div>
          </div>
          
          {/* Booking CTA */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <a 
              href="#contact" 
              className="flex-1 btn-primary text-center"
              onClick={onClose}
            >
              Book This Room
            </a>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsModal;