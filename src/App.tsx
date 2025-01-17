import Providers from "./components/Providers";
import { useWikiConsoleLogo } from "./App.utils";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import About from "./components/About";
import NoMatch from "./components/NoMatch";
import Settings from "./components/Settings";
import Wiki from "./components/Wiki/Wiki";

const App = () => {
  useWikiConsoleLogo();

  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<About />} />
            <Route path="/settings" element={<Settings />} />
            <Route index path="/about" element={<About />} />
            <Route
              path="/wiki"
              element={
                <React.Suspense fallback={<>...</>}>
                  <Wiki />
                </React.Suspense>
              }
            >
              <Route path=":wikiTitle/*" element={<Wiki />} />
            </Route>
            <Route path="*" element={<NoMatch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  );
};

export default App;
