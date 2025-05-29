import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { ProfilePage } from "./components/ProfilePage";
import { OnboardingPage } from "./components/OnboardingPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "leaderboard" | "profile">("home");
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Authenticated>
        <AppContent currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </Authenticated>
      
      <Unauthenticated>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-indigo-600 mb-4">MindPath</h1>
              <p className="text-xl text-gray-600">Your journey to mental wellness starts here</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
      
      <Toaster />
    </div>
  );
}

function AppContent({ 
  currentPage, 
  setCurrentPage 
}: { 
  currentPage: string;
  setCurrentPage: (page: "home" | "leaderboard" | "profile") => void;
}) {
  const profile = useQuery(api.profiles.getCurrentProfile);
  
  if (profile === undefined) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <OnboardingPage />;
  }

  return (
    <>
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-indigo-600">MindPath</h1>
              <div className="flex items-center space-x-2 text-sm">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Level {profile.level}
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  {profile.totalXp} XP
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                  🔥 {profile.currentStreak}
                </span>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "home", label: "Home", icon: "🏠" },
              { id: "leaderboard", label: "Leaderboard", icon: "🏆" },
              { id: "profile", label: "Profile", icon: "👤" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentPage(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  currentPage === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {currentPage === "home" && <HomePage />}
        {currentPage === "leaderboard" && <LeaderboardPage />}
        {currentPage === "profile" && <ProfilePage />}
      </main>
    </>
  );
}
