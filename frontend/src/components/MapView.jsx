import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapView({ points }) {
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "300px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {points.map((p, i) =>
        p.ip1_geo && p.ip1_geo.x && p.ip1_geo.y ? (
          <Marker key={i} position={[p.ip1_geo.y, p.ip1_geo.x]}>
            <Popup>
              <div>
                <strong>{p.tenant}</strong>
                <br />
                {p.ip1_city}, {p.ip1_country}
                <br />
                {p.ip1}
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}