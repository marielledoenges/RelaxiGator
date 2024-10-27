import React, { useState, useEffect } from 'react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedFood, setSelectedFood] =  useState({
    name: "search a food!",
    calories: "-",
    carbs: "-",
    fat: "-",
    protein: "-"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;

  const fetchResults = async (searchQuery) => {
    if (searchQuery) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.spoonacular.com/food/ingredients/autocomplete?query=${searchQuery}&number=5&apiKey=${apiKey}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setResults(data);
        //console.log(data[0].name);
      } catch (err) {
        setError('Error fetching results');
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const fetchFoodMacros = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response_one = await fetch(`https://api.spoonacular.com/food/ingredients/search?query=${id.name}&apiKey=${apiKey}`);
      var temp = await response_one.json()
      console.log(temp);
      console.log(temp.results[0].id);
      const response = await fetch(`https://api.spoonacular.com/recipes/${temp.results[0].id}/nutritionWidget.json?apiKey=${apiKey}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      data.name = id.name;
      setSelectedFood(data);
    } catch (err) {
      setError('Error fetching food data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      fetchResults(query);
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [query]);

  return (
    <div className=" max-w-screen mx-auto p-6 bg-white rounded-lg shadow-lg mb-4 flex flex-col md:flex-row">
  {/* Search Bar */}
  <div className="flex-1 mr-4">
    <input
      type="text"
      placeholder="Search for food..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="w-full p-6 border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
    />
    {isLoading && <p className="text-lg text-gray-600">Loading...</p>}
    {error && <p className="text-lg text-red-600">{error}</p>}
    <ul className="mt-4 space-y-2">
      {results.map((item) => (
        <li
          key={item.id}
          onClick={() => fetchFoodMacros(item)}
          className="p-4 border border-gray-200 rounded-lg hover:bg-blue-100 cursor-pointer transition duration-200 text-lg"
        >
          {item.name}
        </li>
      ))}
    </ul>
  </div>

  {/* Selected Food Information */}
  <div className="flex-none w-1/2">
    {selectedFood && (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedFood.name}</h2>
        <div className="space-y-2">
          <p className="text-lg text-gray-600">
            <span className="font-semibold">Calories:</span> {selectedFood.calories}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-semibold">Carbs:</span> {selectedFood.carbs}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-semibold">Fat:</span> {selectedFood.fat}
          </p>
          <p className="text-lg text-gray-600">
            <span className="font-semibold">Protein:</span> {selectedFood.protein}
          </p>
        </div>
      </div>
    )}
  </div>
</div>
  );
};

export default SearchBar;