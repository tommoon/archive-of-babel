import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// Determine if the application is running in development mode
const isDevelopment = window.location.hostname === "localhost";

export const useAnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isDevelopment && location.hash) {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
      });
    }
  }, [location]);
};
