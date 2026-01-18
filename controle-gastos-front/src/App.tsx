import { Routes, Route } from "react-router-dom";
import "./App.css";

import { AppLayout } from "./layouts/AppLayout";
import { HomePage } from "./pages/HomePage";
import { CategoriaFormularioPage } from "./pages/CategoriasPage";
import { PessoaFormularioPage } from "./pages/PessoasPage";
import { TransacaoFormularioPage } from "./pages/TransacoesPage";
import { RelatorioPorPessoaPage } from "./pages/RelatorioPorPessoaPage";
import { RelatorioPorCategoriaPage } from "./pages/RelatorioPorCategoriaPage";

function App() {
  return (
    <Routes>
      {/* Layout Principal */}
      <Route element={<AppLayout />}>
        {/* Home */}
        <Route index element={<HomePage />} />

        {/* Cadastros */}
        <Route path="pessoas" element={<PessoaFormularioPage />} />
        <Route path="categorias" element={<CategoriaFormularioPage />} />
        <Route path="transacoes" element={<TransacaoFormularioPage />} />

        {/* Relatórios */}
        <Route path="relatorios/por-pessoa" element={<RelatorioPorPessoaPage />} />
        <Route path="relatorios/por-categoria" element={<RelatorioPorCategoriaPage />} />
      </Route>
    </Routes>
  );
}

export default App;
