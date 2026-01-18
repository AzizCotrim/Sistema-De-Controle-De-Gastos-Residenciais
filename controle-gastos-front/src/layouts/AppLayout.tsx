import { NavLink, Outlet } from "react-router-dom";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  color: isActive ? "#111" : "#444",
  background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
  fontWeight: isActive ? 600 : 500,
});

export function AppLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f6f7fb 0%, #ffffff 60%)",
      }}
    >
      {/* Topbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backdropFilter: "blur(8px)",
          background: "rgba(255,255,255,0.85)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: 0.2 }}>
              Controle de Gastos
            </span>
            <span style={{ fontSize: 12, color: "#666" }}>
              Histórico, cadastros e relatórios
            </span>
          </div>

          <nav style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <NavLink to="/" style={linkStyle}>
              Início
            </NavLink>
            <NavLink to="/transacoes" style={linkStyle}>
              Transações
            </NavLink>
            <NavLink to="/pessoas" style={linkStyle}>
              Pessoas
            </NavLink>
            <NavLink to="/categorias" style={linkStyle}>
              Categorias
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Conteúdo */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: 18 }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            padding: 16,
          }}
        >
          <Outlet />
        </div>

        <footer style={{ padding: 16, textAlign: "center", color: "#777", fontSize: 12 }}>
          © {new Date().getFullYear()} Sistema de Controle de Gastos
        </footer>
      </main>
    </div>
  );
}
