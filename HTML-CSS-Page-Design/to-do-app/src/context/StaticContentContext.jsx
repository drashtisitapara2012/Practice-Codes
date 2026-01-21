import { createContext, useContext, useEffect, useState } from "react";
import { client } from "../sanity/client";

const StaticContentContext = createContext();
export const useStaticContent = () => useContext(StaticContentContext);

export const StaticContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaticContent = async () => {
      try {
        setLoading(true);
        const data = await client.fetch(`*[_type == "staticContent"]`);
        
        // Convert array to object for easy access
        const contentMap = data.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {});
        
        setContent(contentMap);
        console.log('Fetched static content:', contentMap);
      } catch (err) {
        console.error(' Error fetching static content:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaticContent();
  }, []);

  // Helper function to get content with fallback
  const getText = (key, fallback = '') => {
    return content[key] || fallback;
  };

  return (
    <StaticContentContext.Provider value={{ content, getText, loading, error }}>
      {children}
    </StaticContentContext.Provider>
  );
};