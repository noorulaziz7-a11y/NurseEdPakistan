import { BrowserRouter, Routes, Route } from "react-router-dom";

// Placeholder router. Existing routing stays in place until migrated.
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={null} />
      </Routes>
    </BrowserRouter>
  );
}
