import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState({
    symbol: "₦",
    rate: 1,
    code: "NGN",
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locationRes = await axios.get("https://ipapi.co/json/");
        const countryCode = locationRes.data.country;

        if (countryCode === "NG") {
          setCurrency({ symbol: "₦", rate: 1, code: "NGN" });
        } else if (["FR", "DE", "NL", "IT", "ES", "PT", "BE"].includes(countryCode)) {
          setCurrency({ symbol: "€", rate: 1 / 700, code: "EUR" });
        } else {
          setCurrency({ symbol: "$", rate: 1 / 600, code: "USD" });
        }
      } catch (err) {
        console.error("Failed to fetch IP location:", err);
      }
    };

    fetchLocation();
  }, []);

  return (
    <CurrencyContext.Provider value={currency}>
      {children}
    </CurrencyContext.Provider>
  );
};
