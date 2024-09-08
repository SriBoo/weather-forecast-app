import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



interface City {
  name: string;
  country: string;
  timezone: string;
  lat: number; // Latitude for weather API requests
  lon: number; // Longitude for weather API requests
}

const CitiesTable: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    fetchCities();
  }, [page, searchTerm]);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=50&start=${page * 50}&q=${searchTerm}`
      );
      setCities((prevCities) => [...prevCities, ...response.data.records.map((record: any) => record.fields)]);
      setLoading(false);
    } catch (error) {
      setError('Error fetching cities');
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCities([]);
    setPage(0);
  };

  const handleCityClick = (cityName: string) => {
    navigate(`/weather/${cityName}`); // Navigate to weather page
  };

  const handleCityRightClick = (event: React.MouseEvent, cityName: string) => {
    event.preventDefault(); // Prevent default right-click behavior
    window.open(`/weather/${cityName}`, '_blank'); // Open in a new tab
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading]);

  return (
    <div className="p-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search cities..."
        className="mb-4 p-2 border rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">City Name</th>
            <th className="border p-2">Country</th>
            <th className="border p-2">Timezone</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city, index) => (
            <tr key={index}>
              <td
                className="border p-2 cursor-pointer"
                onClick={() => handleCityClick(city.name)}
                onContextMenu={(e) => handleCityRightClick(e, city.name)}
              >
                {city.name}
              </td>
              <td className="border p-2">{city.country}</td>
              <td className="border p-2">{city.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default CitiesTable;
