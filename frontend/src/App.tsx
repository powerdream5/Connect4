import "./App.css";
import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/landingpage";
import { GameContextProvider } from "./context/game.context";

const queryClient = new QueryClient();

const Dashboard = React.lazy(() => import("./components/dashboard"));
const Game = React.lazy(() => import("./components/game"));

function App() {
  return (
    <GameContextProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/dashboard" element={<Dashboard />}></Route>
              <Route path="/game" element={<Game />}></Route>
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </GameContextProvider>
  );
}

export default App;
