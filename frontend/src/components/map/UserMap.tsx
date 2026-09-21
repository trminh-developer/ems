import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { User } from '../../models';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface UserMapProps {
  users: User[];
  center?: [number, number];
  zoom?: number;
}

export const UserMap: React.FC<UserMapProps> = ({ users, center = [16.047079, 108.206230], zoom = 6 }) => {
  const navigate = useNavigate();

  const getCoordinates = (user: User): [number, number] => {
    if (user.location?.latitude && user.location?.longitude) {
      return [user.location.latitude, user.location.longitude];
    }
    // Consistent pseudo-random coordinate in Vietnam based on user id
    const hash = user.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const lat = 10.762622 + (hash % 100) / 100 * 8; // ~10 to 18
    const lng = 106.660172 + (hash % 50) / 100 * 2 - 1; // ~105 to 107
    return [lat, lng];
  };

  return (
    <div className="user-map-container rounded-4 overflow-hidden shadow-sm border position-relative z-1" style={{ height: '500px', width: '100%' }}>
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {users.map(user => {
          const coords = getCoordinates(user);
          return (
            <Marker key={user.id} position={coords}>
              <Popup>
                <div className="text-center p-1" style={{ minWidth: '120px' }}>
                  <img 
                    src={user.avatar || 'https://via.placeholder.com/150'} 
                    alt={user.firstName} 
                    className="rounded-circle mb-2 object-fit-cover shadow-sm"
                    style={{ width: '60px', height: '60px' }}
                  />
                  <h6 className="fw-bold mb-0">{user.firstName}, {user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : '?'}</h6>
                  <p className="text-muted small mb-2">{user.location?.city || 'Việt Nam'}</p>
                  <button 
                    className="btn btn-sm btn-hc-primary rounded-pill px-3"
                    onClick={() => navigate('/profile/' + user.id)}
                  >
                    Xem hồ sơ
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
