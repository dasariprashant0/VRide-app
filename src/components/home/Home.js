import { useEffect, useRef, useCallback, useContext } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

import AddressPicker from "../address-picker/AddressPicker";
import Header from "../common/Header";
import RideDetail from "../ride-detail/RideDetail";
import RideList from "../ride-list/RideList";

import Context from "../../context";

const Home = () => {
  const mapRef = useRef(null);
  const routeControlRef = useRef(null);

  const { selectedFrom, selectedTo, user, currentRide } = useContext(Context);

  const style = {
    width: "100%",
    height: "100vh",
  };

  useEffect(() => {
    initMap();
    initRouteControl();
  }, []);

  const drawRoute = useCallback((from, to) => {
  if (shouldDrawRoute(from, to) && routeControlRef.current) {
    const fromLatLng = L.latLng(from.y, from.x);
    const toLatLng = L.latLng(to.y, to.x);
    const waypoints = [fromLatLng, toLatLng];

    routeControlRef.current.setWaypoints(waypoints);

    // Add a marker for the 'from' location
    L.marker(fromLatLng).addTo(mapRef.current);
  }
}, []);

  useEffect(() => {
    if (shouldDrawRoute(selectedFrom, selectedTo)) {
      drawRoute(selectedFrom, selectedTo);
    }
  }, [selectedFrom, selectedTo, drawRoute]);

  const shouldDrawRoute = (selectedFrom, selectedTo) => {
    return (
      selectedFrom?.label &&
      selectedTo?.label &&
      selectedFrom?.x &&
      selectedTo?.x &&
      selectedFrom?.y &&
      selectedTo?.y
    );
  };

  const initMap = () => {
    mapRef.current = L.map("map", {
      center: [20.5937, 78.9629],
      zoom: 5,
      layers: [
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
      ],
    });
  };

  const initRouteControl = () => {
    routeControlRef.current = L.Routing.control({
      show: true,
      fitSelectedRoutes: true,
      plan: false,
      lineOptions: {
        styles: [
          {
            color: "red",
            opacity: "0.7",
            weight: 6,
          },
        ],
      },
      router: L.Routing.mapbox("pk.eyJ1IjoiYmFuc2hpMDEiLCJhIjoiY2xlOXRpbzY4MDVldTNvbm1iYnVodm41aCJ9.FUrVu3wiJzTPoOlweH7SHg"),
    })
      .addTo(mapRef.current)
      .getPlan();
  };

  const renderSidebar = () => {
    const isPassenger = user && user.role === "passenger";
    if (isPassenger && !currentRide) {
      return <AddressPicker />;
    }
    if (isPassenger && currentRide) {
      return (
        <RideDetail
          user={currentRide.driver}
          isDriver={false}
          currentRide={currentRide}
        />
      );
    }
    if (!isPassenger && !currentRide) {
      return <RideList />;
    }
    if (!isPassenger && currentRide) {
      return (
        <RideDetail
          user={currentRide.requestor}
          isDriver={true}
          currentRide={currentRide}
        />
      );
    }
    return null;
  };

  return (
    <>
      <Header />
      <div id="map" style={style} />
      {renderSidebar()}
    </>
  );
};

export default Home;
