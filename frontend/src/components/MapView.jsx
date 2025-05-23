import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon issue with Leaflet in React/Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper to auto-fit map to markers
function FitBounds({ points }) {
  const map = useMap();
  if (points.length === 0) return null;
  const bounds = L.latLngBounds(points.map((p) => [p.latitude, p.longitude]));
  map.fitBounds(bounds, { padding: [50, 50] });
  return null;
}

export default function MapView({ points }) {
  // Only show the last 25
  const lastPoints = points.slice(-25).filter((p) => p.latitude && p.longitude);

  // Default center if no points
  const center = lastPoints.length
    ? [lastPoints[0].latitude, lastPoints[0].longitude]
    : [20, 0];

  return (
    <MapContainer
      center={center}
      zoom={2}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "1rem",
        marginBottom: "2rem",
      }}
      scrollWheelZoom={true}
      className="shadow-lg"
    >
      {/* Dark map theme from CartoDB */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
      />
      <MarkerClusterGroup>
        {lastPoints.map((p, i) => (
          <Marker key={i} position={[p.latitude, p.longitude]}>
            <Popup>
              <div>
                <div>
                  <b>User:</b> {p.user_email || p.email}
                </div>
                <div>
                  <b>Tenant:</b> {p.tenant}
                </div>
                <div>
                  <b>Timestamp:</b> {p.timestamp}
                </div>
                <div>
                  <b>IP:</b> {p.ip1}
                </div>
                <div>
                  <b>Country:</b> {p.ip1_country}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      <FitBounds points={lastPoints} />
    </MapContainer>
  );
}
