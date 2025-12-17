import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { SyllabusUpload } from "./pages/SyllabusUpload";
import { StudyPlanner } from "./pages/StudyPlanner";
import { AITutor } from "./pages/AITutor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="upload" element={<SyllabusUpload />} />
          <Route path="planner" element={<StudyPlanner />} />
          <Route path="tutor" element={<AITutor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
