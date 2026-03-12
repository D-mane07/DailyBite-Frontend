import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
} from "../pages/redux/UserSlice";
import { setLocation } from "../pages/redux/MapSlice";

const CITY_STORAGE_KEY = "vingo_current_city";
const STATE_STORAGE_KEY = "vingo_current_state";
const ADDRESS_STORAGE_KEY = "vingo_current_address";
const LOCATION_STORAGE_KEY = "vingo_current_location";

const EXTERNAL_REQUEST_CONFIG = {
  withCredentials: false,
  timeout: 12000,
};

const useGetCurrentCity = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;

    const apiKey = import.meta.env.VITE_GEO_API;
    const publicHttp = axios.create({
      withCredentials: false,
      timeout: 12000,
    });

    const persistAndDispatch = ({
      city = null,
      state = null,
      address = null,
      lat = null,
      lon = null,
    }) => {
      if (!active) {
        return;
      }

      dispatch(setCurrentCity(city));
      dispatch(setCurrentState(state));
      dispatch(setCurrentAddress(address));

      if (typeof lat === "number" && typeof lon === "number") {
        dispatch(setLocation({ lat, lon }));
        localStorage.setItem(
          LOCATION_STORAGE_KEY,
          JSON.stringify({ lat, lon })
        );
      }

      if (city) {
        localStorage.setItem(CITY_STORAGE_KEY, city);
      }
      if (state) {
        localStorage.setItem(STATE_STORAGE_KEY, state);
      }
      if (address) {
        localStorage.setItem(ADDRESS_STORAGE_KEY, address);
      }
    };

    const hydrateFromStorage = () => {
      const city = localStorage.getItem(CITY_STORAGE_KEY);
      const state = localStorage.getItem(STATE_STORAGE_KEY);
      const address = localStorage.getItem(ADDRESS_STORAGE_KEY);
      const rawLocation = localStorage.getItem(LOCATION_STORAGE_KEY);

      let parsedLocation = null;
      try {
        parsedLocation = rawLocation ? JSON.parse(rawLocation) : null;
      } catch {
        parsedLocation = null;
      }

      if (city || state || address || parsedLocation) {
        persistAndDispatch({
          city: city || null,
          state: state || null,
          address: address || null,
          lat: parsedLocation?.lat,
          lon: parsedLocation?.lon,
        });
      }
    };

    const reverseLookupByLatLon = async (latitude, longitude) => {
      if (!apiKey) {
        console.error("Geo API key missing");
        return false;
      }

      try {
        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`;
        const { data } = await publicHttp.get(url, EXTERNAL_REQUEST_CONFIG);
        const info = data?.results?.[0];

        if (!info) {
          return false;
        }

        const city = info.city || info.county || info.state || null;
        const state = info.state || null;
        const address = info.formatted || null;

        persistAndDispatch({
          city,
          state,
          address,
          lat: latitude,
          lon: longitude,
        });

        return Boolean(city || state || address);
      } catch (error) {
        console.error("Reverse geocode failed", error);
        return false;
      }
    };

    const ipLocationFallback = async () => {
      try {
        const { data } = await publicHttp.get(
          "https://ipwho.is/",
          EXTERNAL_REQUEST_CONFIG
        );

        if (!data?.success) {
          return false;
        }

        const lat = Number(data.latitude);
        const lon = Number(data.longitude);
        const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);

        if (hasCoords && (await reverseLookupByLatLon(lat, lon))) {
          return true;
        }

        const city = data?.city || null;
        const state = data?.region || data?.country || null;
        const address = [data?.city, data?.region, data?.country]
          .filter(Boolean)
          .join(", ");

        persistAndDispatch({
          city,
          state,
          address: address || null,
          lat: hasCoords ? lat : null,
          lon: hasCoords ? lon : null,
        });

        return Boolean(city || state || address);
      } catch (error) {
        console.error("IP location fallback failed", error);
        return false;
      }
    };

    const publicIpFallback = async () => {
      try {
        const { data: ipData } = await publicHttp.get(
          "https://api64.ipify.org?format=json",
          EXTERNAL_REQUEST_CONFIG
        );
        const ip = ipData?.ip;

        if (!ip) {
          return false;
        }

        const { data } = await publicHttp.get(
          `https://ipwho.is/${ip}`,
          EXTERNAL_REQUEST_CONFIG
        );

        if (!data?.success) {
          return false;
        }

        const lat = Number(data.latitude);
        const lon = Number(data.longitude);
        const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);

        if (hasCoords && (await reverseLookupByLatLon(lat, lon))) {
          return true;
        }

        const city = data?.city || null;
        const state = data?.region || data?.country || null;
        const address = [data?.city, data?.region, data?.country]
          .filter(Boolean)
          .join(", ");

        persistAndDispatch({
          city,
          state,
          address: address || null,
          lat: hasCoords ? lat : null,
          lon: hasCoords ? lon : null,
        });

        return Boolean(city || state || address);
      } catch (error) {
        console.error("Public IP fallback failed", error);
        return false;
      }
    };

    const resolveFromGeolocation = () =>
      new Promise((resolve) => {
        if (!("geolocation" in navigator)) {
          resolve(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            const ok = await reverseLookupByLatLon(latitude, longitude);
            resolve(ok);
          },
          () => resolve(false),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      });

    const resolveCity = async () => {
      hydrateFromStorage();

      const fromGeolocation = await resolveFromGeolocation();
      if (fromGeolocation) {
        return;
      }

      const fromIpLocation = await ipLocationFallback();
      if (fromIpLocation) {
        return;
      }

      await publicIpFallback();
    };

    resolveCity();

    return () => {
      active = false;
    };
  }, [dispatch]);
};

export default useGetCurrentCity;
