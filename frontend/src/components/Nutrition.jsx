import React, { useState, useEffect } from 'react';
import Searchbar from "./SearchBar";


const Nutrition = () => {
  return (
    <div className=" min-h-screen flex justify-center items-center flex-col gap-20 ">
        <div className="text-4xl font-bold flex justify-center items-center">
          Nutrition Search
        </div>
        <Searchbar/>
    </div>
  );
};

export default Nutrition;