import React, { useContext, useState } from "react";
import { Sparkles, ArrowRight, Target, Brain, Trophy } from "lucide-react";
import HERO_IMAGE from "../assets/hero.png";
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

const APP_FEATURES = [
  {
    title: "AI-Powered Mock Interviews",
    description: "Practice with our advanced AI that simulates real interview scenarios and provides instant feedback on your responses."
  },
  {
    title: "Personalized Learning Path",
    description: "Get customized study plans based on your strengths, weaknesses, and target job positions."
  },
  {
    title: "Real-time Performance Analytics",
    description: "Track your progress with detailed analytics and insights to improve your interview skills continuously."
  }
];

const LandingPage = () => {
  const { user } = useContext(UserContext);  
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const navigate = useNavigate(); 
  
  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true); 
    } else {
      navigate("/dashboard"); 
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full min-h-screen bg-white">
        {/* Subtle Background Element */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-50/30 to-white z-0" />

        <div className="container mx-auto px-4 pt-6 pb-20 relative z-10">
          {/* Header */}
          <header className="flex justify-between items-center mb-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="text-xl text-black font-semibold">
                Interview Prep AI
              </div>
            </div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* Hero Content */}
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="flex items-center gap-2 text-sm text-amber-700 font-medium bg-amber-50 px-4 py-2 rounded-full border border-amber-200 mb-10">
              <Sparkles className="w-4 h-4" />
              AI-Powered Interview Preparation
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl text-black font-bold mb-8 leading-tight">
              Ace Your Interviews with{" "}
              <span className="text-amber-500">
                AI-Powered
              </span>{" "}
              Learning
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-10 max-w-2xl leading-relaxed">
              Transform your interview skills with personalized AI coaching, real-time feedback, and comprehensive practice sessions designed to boost your confidence.
            </p>

            {/* CTA Button */}
            <button
              className="bg-black text-white text-base font-medium px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              onClick={handleCTA}
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Hero Image - Centered */}
            <div className="mt-16 mb-16">
              <div className="w-full max-w-5xl mx-auto">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <img
                    src={HERO_IMAGE}
                    alt="Interview Prep AI Hero"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">10K+</div>
                <div className="text-gray-600">Successful Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">50+</div>
                <div className="text-gray-600">Industry Experts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-4">
                Features that will make you{" "}
                <span className="text-amber-500">
                  shine
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover powerful tools designed to elevate your interview performance and land your dream job.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {APP_FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl border border-gray-200 hover:border-amber-200 transition-colors"
                >
                  <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center mb-6">
                    {index === 0 && <Brain className="w-6 h-6 text-white" />}
                    {index === 1 && <Target className="w-6 h-6 text-white" />}
                    {index === 2 && <Trophy className="w-6 h-6 text-white" />}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black text-white text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-base">Made with ❤️ by Septian Juliansyah</span>
        </div>
        <p className="text-gray-400 text-sm">© 2024 Interview Prep AI. All rights reserved.</p>
      </div>

      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && (
            <Login setCurrentPage={setCurrentPage} />
          )}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;