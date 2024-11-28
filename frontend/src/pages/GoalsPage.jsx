import React from "react";
import Goals from "../components/Goals";

const GoalsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
            <div className="container mx-auto px-4 py-8">
                <div className="p-8">
                    <Goals />
                </div>
            </div>
        </div>
    );
};

export default GoalsPage;