import React from "react";
import Goals from "../components/Goals";

const GoalsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 animate-gradient-xy"
            style={{ backgroundSize: '400% 400%' }}
        >
            <div className="container mx-auto px-4 py-8">
                <div className="backdrop-blur-sm bg-white/10 rounded-lg shadow-xl p-8">
                    <Goals />
                </div>
            </div>
        </div>
    );
};

export default GoalsPage;