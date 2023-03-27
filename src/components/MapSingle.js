import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function MapSingle({ special }) {
  const containerStyle = {
    width: '400px',
    height: '400px'
  };
  const { lat, lng, location_name } = special
  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.REACT_APP_API_KEY}`
  })

  if (lat && lng && isLoaded) {
    return(
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
        >
          <Marker
            position={center}
            title={location_name}
          />
          <></>
        </GoogleMap>
    )
  } else { return <></> }
}

export default MapSingle