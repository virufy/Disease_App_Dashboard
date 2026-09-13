import React from "react";
import { DiseaseProvider } from "./state/DiseaseContext";
import DiseaseDashboard from "./pages/disease/DiseaseDashboard";

const App: React.FC = () => {
  return (
    <DiseaseProvider>
      <DiseaseDashboard />
    </DiseaseProvider>
  );
};

export default App;
