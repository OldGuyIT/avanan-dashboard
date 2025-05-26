import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import React from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";

// Rainbow colors for lines
const rainbowColors = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#8B00FF", // Violet
];

// Helper to parse geo string
function parseGeo(str) {
  if (!str) return null;
  const match = str.match(/\(?([-\d.]+),([-\d.]+)\)?/);
  if (!match) return null;
  return [parseFloat(match[1]), parseFloat(match[2])];
}

// Custom DivIcons
const blackCircleIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:18px;height:18px;background:#000;border-radius:50%;border:2px solid #000;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});
const whiteCircleIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:18px;height:18px;background:#fff;border-radius:50%;border:2px solid #000;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// Helper to auto-fit map to ip1 markers
function FitBounds({ points }) {
  const map = useMap();
  const coords = points
    .map((p) => parseGeo(p.ip1_geo))
    .filter((c) => c && !isNaN(c[0]) && !isNaN(c[1]));
  if (coords.length === 0) return null;
  const bounds = L.latLngBounds(coords);
  map.fitBounds(bounds, { padding: [50, 50] });
  return null;
}

export default function DashboardMapView({ points }) {
  // Sort newest to oldest by timestamp
  const sortedPoints = [...points].sort((a, b) =>
    b.timestamp && a.timestamp
      ? b.timestamp.localeCompare(a.timestamp)
      : 0
  );

  // Take the newest 7, filter for valid ip1_geo
  const lastPoints = sortedPoints
    .slice(0, 7)
    .filter((p) => {
      const c = parseGeo(p.ip1_geo);
      return c && !isNaN(c[0]) && !isNaN(c[1]);
    });

  // US bounds (approximate)
  const US_LAT_MIN = 24;
  const US_LAT_MAX = 50;
  const US_LNG_MIN = -125;
  const US_LNG_MAX = -66;

  // Check if any IP1 or IP2 is outside US bounds
  const hasOutsideUS = lastPoints.some((p) => {
    const ip1 = parseGeo(p.ip1_geo);
    const ip2 = parseGeo(p.ip2_geo);
    const isOutside = (coords) =>
      coords &&
      (coords[0] < US_LAT_MIN ||
        coords[0] > US_LAT_MAX ||
        coords[1] < US_LNG_MIN ||
        coords[1] > US_LNG_MAX);
    return isOutside(ip1) || isOutside(ip2);
  });

  // Fixed center for US, zoom out if any point is outside US
  const center = [37.8, -96];
  const zoom = hasOutsideUS ? 2 : 4;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "0rem",
        marginBottom: "2rem",
      }}
      scrollWheelZoom={true}
      className="shadow-lg"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
      />
      <MarkerClusterGroup>
        {lastPoints.map((p, i) => {
          const ip1Coords = parseGeo(p.ip1_geo);
          const ip2Coords = parseGeo(p.ip2_geo);
          return (
            <React.Fragment key={i}>
              {ip1Coords && (
                <Marker position={ip1Coords} icon={blackCircleIcon}>
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
                        <b>IP1:</b> {p.ip1}
                      </div>
                      <div>
                        <b>Country:</b> {p.ip1_country}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
              {ip2Coords && (
                <Marker position={ip2Coords} icon={whiteCircleIcon}>
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
                        <b>IP2:</b> {p.ip2}
                      </div>
                      <div>
                        <b>Country:</b> {p.ip2_country}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
              {ip1Coords && ip2Coords && (
                <Polyline
                  positions={[ip1Coords, ip2Coords]}
                  pathOptions={{ color: rainbowColors[i % rainbowColors.length], weight: 3, opacity: 0.85 }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MarkerClusterGroup>
      {/* <FitBounds points={lastPoints} /> */}
    </MapContainer>
  );
}