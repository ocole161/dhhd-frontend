import { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function MapAll({ specials }) {
  const containerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = {
    lat: 39.73715,
    lng: -104.989174
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.REACT_APP_API_KEY}`
  })

  const [userPosition, setUserPosition] = useState(null)
  // 
  if (navigator.geolocation && userPosition === null) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPosition(pos);
      }
    )
  }

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userPosition ? userPosition : center}
        zoom={15}
      >
        {specials.map(special => {
          return (
            <Marker 
              key={special.id}
              position={{
                lat: parseFloat(special.lat),
                lng: parseFloat(special.lng)
              }}
              title={special.location_name}
            />
          )}
        )}
        <Marker position={userPosition} title="Your location" icon='https://img.icons8.com/color/48/null/user-location.png' />
        <></>
      </GoogleMap>
  ) : <></>
}

export default MapAll