import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const useFetch = (url) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Si no hay URL, no hacer nada
    if (!url) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resp = await fetch(url, {
          credentials: "include", // Añadido para mantener las credenciales
        });

        if (!resp.ok) {
          setIsError(true);
          setIsLoading(false);
          toast.error(
            `Error ${resp.status}: ${
              resp.statusText || "No se pudo completar la petición"
            }`
          );
          return;
        }

        const result = await resp.json();
        setData(result);
      } catch (error) {
        setIsError(true);
        toast.error(
          `Error de conexión: ${
            error.message || "No se pudo conectar al servidor"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { isLoading, isError, data };
};

export default useFetch;
