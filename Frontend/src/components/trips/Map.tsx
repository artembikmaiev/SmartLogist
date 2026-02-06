"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/config/api.config';

// Fix for default marker icons
if (typeof window !== 'undefined') {
    const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;
}

interface MapProps {
    origin?: { lat: number; lng: number; label: string };
    destination?: { lat: number; lng: number; label: string };
    onMapClick?: (lat: number, lng: number) => void;
    onRouteInfo?: (distanceKm: number, durationMinutes: number, geometry: any) => void;
    height?: string;
    vehicleDimensions?: {
        height?: number;
        width?: number;
        length?: number;
        weight?: number;
        isHazardous?: boolean;
    };
    initialRouteGeometry?: string;
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

function AutoBounds({ origin, destination, isInteracting }: { origin?: { lat: number; lng: number }; destination?: { lat: number; lng: number }, isInteracting: boolean }) {
    const map = useMap();

    useEffect(() => {
        if (isInteracting) return;

        const points: [number, number][] = [];
        // Only include non-zero points
        if (origin && (origin.lat !== 0 || origin.lng !== 0)) points.push([origin.lat, origin.lng]);
        if (destination && (destination.lat !== 0 || destination.lng !== 0)) points.push([destination.lat, destination.lng]);

        if (points.length > 0) {
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
        }
    }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng, map, isInteracting]);
    return null;
}

function MapEvents({ onClick, onInteraction }: { onClick?: (lat: number, lng: number) => void, onInteraction: (interacting: boolean) => void }) {
    useMapEvents({
        click(e) {
            onClick?.(e.latlng.lat, e.latlng.lng);
        },
        movestart() { onInteraction(true); },
        dragstart() { onInteraction(true); },
        zoomstart() { onInteraction(true); }
    });
    return null;
}

function InvalidateSize() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [map]);
    return null;
}

export default function Map({ origin, destination, onMapClick, onRouteInfo, height = '400px', vehicleDimensions, initialRouteGeometry }: MapProps) {
    const [route, setRoute] = useState<[number, number][]>(() => {
        if (initialRouteGeometry) {
            try {
                return JSON.parse(initialRouteGeometry);
            } catch (e) {
                console.error('Failed to parse initialRouteGeometry', e);
            }
        }
        return [];
    });
    const [isInteracting, setIsInteracting] = useState(false);

    // Synchronize route with initialRouteGeometry when it changes (e.g., trip selection changes)
    useEffect(() => {
        if (initialRouteGeometry) {
            try {
                const parsed = JSON.parse(initialRouteGeometry);
                if (Array.isArray(parsed)) {
                    setRoute(parsed);
                }
            } catch (e) {
                console.error('Failed to parse updated initialRouteGeometry', e);
            }
        } else if (!origin || !destination) {
            setRoute([]);
        }
    }, [initialRouteGeometry, origin?.lat, destination?.lat]);

    // Default to Kyiv if no origin or origin is [0,0]
    const center: [number, number] = origin && (origin.lat !== 0 || origin.lng !== 0)
        ? [origin.lat, origin.lng]
        : [50.4501, 30.5234];

    const [lastParams, setLastParams] = useState<string>("");

    useEffect(() => {
        if (initialRouteGeometry && route.length > 0) return;

        if (origin && destination) {
            // Prevent routing if coordinates are [0,0]
            if ((origin.lat === 0 && origin.lng === 0) || (destination.lat === 0 && destination.lng === 0)) {
                console.warn('Skipping route fetch: Origin or destination has [0,0] coordinates');
                setRoute([]);
                return;
            }

            const params = JSON.stringify({
                origin: { lat: origin.lat, lng: origin.lng },
                destination: { lat: destination.lat, lng: destination.lng },
                dims: vehicleDimensions
            });

            if (params === lastParams) return;

            const timer = setTimeout(() => {
                setLastParams(params);
                fetchRoute(origin, destination);
            }, 800); // Debounce route requests

            return () => clearTimeout(timer);
        } else {
            setRoute([]);
            setLastParams("");
        }
    }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng, JSON.stringify(vehicleDimensions)]);

    const fetchRoute = async (start: any, end: any) => {
        try {
            let endpoint = `${API_ENDPOINTS.ROADS.ROUTE}?startLat=${start.lat}&startLng=${start.lng}&endLat=${end.lat}&endLng=${end.lng}`;

            if (vehicleDimensions) {
                if (vehicleDimensions.height) endpoint += `&height=${vehicleDimensions.height}`;
                if (vehicleDimensions.width) endpoint += `&width=${vehicleDimensions.width}`;
                if (vehicleDimensions.length) endpoint += `&length=${vehicleDimensions.length}`;
                if (vehicleDimensions.weight) endpoint += `&weight=${vehicleDimensions.weight}`;
                if (vehicleDimensions.isHazardous) endpoint += `&isHazardous=true`;
            }

            const data: any = await apiClient.get(endpoint);

            if (data.geometry && data.geometry.length > 0) {
                setRoute(data.geometry);

                if (onRouteInfo) {
                    onRouteInfo(data.distanceKm, data.durationMinutes, data.geometry);
                }
            }
        } catch (err) {
            console.error('Routing failed', err);
            setRoute([[start.lat, start.lng], [end.lat, end.lng]]);
            if (onRouteInfo) onRouteInfo(0, 0, []);
        }
    };

    return (
        <div style={{ height, width: '100%' }} className="rounded-xl overflow-hidden border border-slate-200 relative z-0">
            <MapContainer
                center={center}
                zoom={6}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ChangeView center={center} />
                <MapEvents
                    onClick={onMapClick}
                    onInteraction={setIsInteracting}
                />
                <InvalidateSize />
                <AutoBounds
                    origin={origin}
                    destination={destination}
                    isInteracting={isInteracting}
                />

                {origin && (origin.lat !== 0 || origin.lng !== 0) && (
                    <Marker position={[origin.lat, origin.lng]}>
                        <Popup>{origin.label}</Popup>
                    </Marker>
                )}

                {destination && (destination.lat !== 0 || destination.lng !== 0) && (
                    <Marker position={[destination.lat, destination.lng]}>
                        <Popup>{destination.label}</Popup>
                    </Marker>
                )}

                {route.length > 0 && (
                    <Polyline
                        positions={route as any}
                        color="#2563eb"
                        weight={4}
                        opacity={0.7}
                    />
                )}
            </MapContainer>

            {(origin || destination) && (
                <button
                    onClick={() => setIsInteracting(false)}
                    className="absolute bottom-6 right-4 z-[1000] bg-white p-2 rounded-lg shadow-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="Центрувати мапу"
                >
                    <Navigation className="w-5 h-5 focus:ring-0" />
                </button>
            )}
        </div>
    );
}
