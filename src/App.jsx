import React, { useState, useMemo } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom";

/* =========================
   CONTEXTO GLOBAL DO CLIENTE
   ========================= */

const ClientContext = React.createContext(null);

function useClient() {
  return React.useContext(ClientContext);
}

const mockCitiesBA = [
  "Salvador",
  "Feira de Santana",
  "Vitória da Conquista",
  "Camaçari",
  "Itabuna",
];

const industrySegments = [
  "Alimentício e Bebidas",
  "Metalúrgico e Siderúrgico",
  "Químico e Petroquímico",
  "Construção Civil",
  "Têxtil e Vestuário",
  "Automobilístico e Autopeças",
  "Farmacêutico e Cosméticos",
  "Madeira e Mobiliário",
  "Papel e Celulose",
  "Plástico e Borracha",
  "Elétrico e Eletrônico",
  "Mineração",
  "Agronegócio/Agroindústria",
  "Outro",
];

const sizeOptions = [
  { value: "1-19", label: "1-19 (Micro)" },
  { value: "20-49", label: "20-49 (Pequena)" },
  { value: "50-99", label: "50-99 (Pequena)" },
  { value: "100-249", label: "100-249 (Média)" },
  { value: "250-499", label: "250-499 (Média)" },
  { value: "500+", label: "500+ (Grande)" },
];

const priceTable = {
  "1-19": { monthly: "R$ 350,00 a R$ 500,00", setup: "R$ 800,00" },
  "20-49": { monthly: "R$ 600,00 a R$ 900,00", setup: "R$ 1.200,00" },
  "50-99": { monthly: "R$ 1.000,00 a R$ 1.500,00", setup: "R$ 2.000,00" },
  "100-249": { monthly: "R$ 1.800,00 a R$ 2.500,00", setup: "R$ 3.000,00" },
  "250-499": { monthly: "R$ 3.000,00 a R$ 4.500,00", setup: "R$ 5.000,00" },
  "500+": { monthly: "Sob consulta", setup: "Sob consulta" },
};

/* =========================
   PROTEÇÃO DE ROTAS DO CLIENTE
   ========================= */

function RequireClientAuth({ children }) {
  const { clientAccount } = useClient();
  const location = useLocation();
  if (!clientAccount) {
    return <Navigate to="/cliente/login" replace state={{ from: location }} />;
  }
  return children;
}

/* =========================
   LAYOUT BASE DO PORTAL
   ========================= */

function PublicHeader() {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
            S
          </span>
          <span className="font-semibold text-lg">SESI Saúde Connect</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/cliente" className="hover:text-blue-600">
            Área do Cliente
          </Link>
          <Link to="/sesi" className="hover:text-blue-600">
            Visão SESI
          </Link>
        </nav>
      </div>
    </header>
  );
}

function ClientLayout() {
  const { clientAccount, setClientAccount } = useClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    setClientAccount(null);
    navigate("/cliente/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header fixo */}
      <header className="w-full bg-white shadow-sm z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
              S
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">SESI Saúde Connect</span>
              <span className="text-xs text-gray-500">
                Portal do Cliente - SST
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative">
              <span className="material-icons text-gray-600">notifications</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center gap-2">
              <div className="text-right text-xs">
                <div className="font-semibold">
                  {clientAccount?.companyName ?? "Empresa"}
                </div>
                <div className="text-gray-500">Cliente SESI</div>
              </div>
              <div className="relative group">
                <div className="h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold cursor-pointer">
                  {clientAccount?.contactName
                    ? clientAccount.contactName.charAt(0)
                    : "C"}
                </div>
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
                  <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">
                    Perfil
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo com sidebar */}
      <div className="flex flex-1 max-w-6xl mx-auto w-full mt-4 px-2 gap-4 pb-6">
        <aside className="w-56 bg-white rounded-lg shadow-sm p-3 text-sm h-fit">
          <nav className="flex flex-col gap-1">
            <ClientNavLink to="/cliente/dashboard" label="Dashboard" />
            <ClientNavLink to="/cliente/documentos" label="Meus Documentos" />
            <ClientNavLink to="/cliente/agendamentos" label="Agendamentos" />
            <ClientNavLink to="/cliente/mensagens" label="Mensagens" />
            <ClientNavLink to="/cliente/ajuda" label="Ajuda" />
          </nav>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function ClientNavLink({ to, label }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded text-sm ${
        active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
      }`}
    >
      {label}
    </Link>
  );
}

/* =========================
   /cliente - Landing pública
   ========================= */

function ClientLanding() {
  const [step, setStep] = useState("form"); // form | loading | result
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    cnpj: "",
    role: "",
    city: "",
    segment: "",
    sizeRange: "",
    hasMachines: false,
    hasAgents: false,
    hasPericulosidade: false,
  });

  const { setLeadData } = useClient();
  const navigate = useNavigate();

  const applicableNRs = useMemo(() => {
    const list = [
      { code: "NR-01", name: "Gerenciamento de Riscos Ocupacionais" },
      { code: "NR-07", name: "PCMSO" },
    ];
    if (formData.hasMachines) {
      list.push({ code: "NR-12", name: "Segurança em Máquinas" });
    }
    if (formData.hasAgents) {
      list.push({ code: "NR-15", name: "Insalubridade" });
    }
    if (formData.hasPericulosidade) {
      list.push({ code: "NR-16", name: "Periculosidade" });
    }
    // Exemplo simples de "outras NRs conforme segmento"
    if (formData.segment === "Construção Civil") {
      list.push({ code: "NR-18", name: "Condições e Meio Ambiente de Trabalho" });
    }
    if (formData.segment === "Elétrico e Eletrônico") {
      list.push({ code: "NR-10", name: "Segurança em Instalações e Serviços em Eletricidade" });
    }
    return list;
  }, [formData]);

  const priceInfo = priceTable[formData.sizeRange] ?? {
    monthly: "Informe o porte para estimar",
    setup: "Informe o porte para estimar",
  };

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Validação simples
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.companyName ||
      !formData.cnpj ||
      !formData.city ||
      !formData.segment ||
      !formData.sizeRange
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    setStep("loading");
    setTimeout(() => {
      setStep("result");
    }, 2000);
  }

  function handleCreateAccount() {
    setLeadData({
      ...formData,
      applicableNRs,
      priceInfo,
    });
    navigate("/cliente/cadastro");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <section className="bg-blue-50 border-b">
          <div className="max-w-6xl mx-auto py-12 px-4 grid md:grid-cols-2 gap-10 items-center">
            {/* Hero */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Simplifique a gestão de SST da sua empresa
              </h1>
              <p className="text-gray-700 mb-6 text-sm md:text-base">
                Atenda às Normas Regulamentadoras com a expertise do SESI Bahia,
                integrando PGR, PCMSO, eSocial e laudos em um único ambiente.
              </p>
              <a
                href="#form-contato"
                className="inline-block bg-blue-600 text-white px-5 py-3 rounded-md text-sm font-semibold hover:bg-blue-700"
              >
                Solicitar Orçamento Gratuito
              </a>
            </div>

            {/* Cards de serviços */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                "PGR - Programa de Gerenciamento de Riscos",
                "PCMSO - Saúde Ocupacional",
                "Exames Ocupacionais",
                "Laudos Técnicos",
                "Gestão eSocial",
              ].map(item => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-sm p-3 border flex flex-col justify-between"
                >
                  <div className="font-semibold text-xs mb-1">{item}</div>
                  <div className="text-[11px] text-gray-500">
                    Inclui suporte consultivo, indicadores e integração com eSocial.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulário e Diagnóstico */}
        <section id="form-contato" className="max-w-6xl mx-auto py-10 px-4">
          {step === "form" && (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Primeiro contato
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Informe os dados da empresa para analisarmos as NRs aplicáveis
                  e sugerirmos um pacote de serviços.
                </p>
                <form
                  className="space-y-3 text-sm"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <label className="block mb-1">
                      Nome completo do solicitante*
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1">E-mail corporativo*</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Telefone/WhatsApp*</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(00) 00000-0000"
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1">Nome da empresa*</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">CNPJ*</label>
                      <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                        placeholder="00.000.000/0000-00"
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1">Cargo na empresa</label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Cidade/UF*</label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border rounded px-2 py-1 text-sm"
                      >
                        <option value="">Selecione</option>
                        {mockCitiesBA.map(city => (
                          <option key={city} value={city}>
                            {city} / BA
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1">
                      Segmento da indústria*
                    </label>
                    <select
                      name="segment"
                      value={formData.segment}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="">Selecione</option>
                      {industrySegments.map(seg => (
                        <option key={seg} value={seg}>
                          {seg}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">
                      Quantidade de funcionários*
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {sizeOptions.map(opt => (
                        <label
                          key={opt.value}
                          className="flex items-center gap-2 text-xs border rounded px-2 py-1 cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="sizeRange"
                            value={opt.value}
                            checked={formData.sizeRange === opt.value}
                            onChange={handleChange}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* checkboxes de cenário de risco */}
                  <div className="space-y-1 text-xs">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="hasMachines"
                        checked={formData.hasMachines}
                        onChange={handleChange}
                      />
                      <span>
                        A empresa possui máquinas e equipamentos industriais?
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="hasAgents"
                        checked={formData.hasAgents}
                        onChange={handleChange}
                      />
                      <span>
                        Existem atividades com exposição a agentes químicos,
                        ruído ou calor?
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="hasPericulosidade"
                        checked={formData.hasPericulosidade}
                        onChange={handleChange}
                      />
                      <span>
                        Existem atividades com inflamáveis, explosivos ou
                        eletricidade?
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700"
                  >
                    Analisar Necessidades
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4 text-sm">
                <h3 className="font-semibold mb-2">
                  O que vamos analisar
                </h3>
                <ul className="list-disc ml-5 space-y-1 text-xs text-gray-600">
                  <li>Perfil da empresa e do segmento industrial.</li>
                  <li>Riscos ocupacionais e NRs aplicáveis.</li>
                  <li>
                    Combinação de PGR, PCMSO, exames ocupacionais e eSocial.
                  </li>
                  <li>
                    Necessidade de laudos de Insalubridade e Periculosidade.
                  </li>
                  <li>Prazo típico de implantação e estimativa de valores.</li>
                </ul>
              </div>
            </div>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-700">
                Analisando perfil da sua empresa...
              </p>
            </div>
          )}

          {step === "result" && (
            <div className="grid md:grid-cols-3 gap-4">
              {/* NRs aplicáveis */}
              <div className="bg-white rounded-lg shadow-sm border p-4 text-sm md:col-span-1">
                <h3 className="font-semibold mb-2">
                  NRs aplicáveis à sua empresa
                </h3>
                <ul className="space-y-1 text-xs">
                  {applicableNRs.map(nr => (
                    <li key={nr.code}>
                      <span className="font-semibold">{nr.code}</span> -{" "}
                      <span>{nr.name}</span>
                    </li>
                  ))}
                  <li className="mt-2 text-gray-500">
                    Outras NRs podem ser avaliadas em visita técnica.
                  </li>
                </ul>
              </div>

              {/* Pacote de serviços recomendados */}
              <div className="bg-white rounded-lg shadow-sm border p-4 text-sm md:col-span-1">
                <h3 className="font-semibold mb-2">
                  Pacote de serviços recomendados
                </h3>
                <ul className="space-y-1 text-xs">
                  <li>✅ Elaboração do PGR completo</li>
                  <li>✅ Elaboração e gestão do PCMSO</li>
                  <li>✅ Exames ocupacionais conforme PCMSO</li>
                  <li>✅ Gestão do eSocial (S-2220 e S-2240)</li>
                  <li>✅ Acesso ao sistema InfoSesi</li>
                  {formData.hasAgents && (
                    <li>⚡ Laudo de Insalubridade</li>
                  )}
                  {formData.hasPericulosidade && (
                    <li>⚡ Laudo de Periculosidade</li>
                  )}
                </ul>
              </div>

              {/* Investimento e prazos */}
              <div className="bg-white rounded-lg shadow-sm border p-4 text-sm md:col-span-1">
                <h3 className="font-semibold mb-2">
                  Investimento estimado
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Baseado no porte indicado:{" "}
                  <span className="font-semibold">
                    {formData.sizeRange || "não informado"}
                  </span>
                </p>
                <div className="text-xs space-y-1">
                  <p>
                    <span className="font-semibold">Valor mensal: </span>
                    {priceInfo.monthly}
                  </p>
                  <p>
                    <span className="font-semibold">Implantação: </span>
                    {priceInfo.setup}
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-1 text-xs">
                    Prazo de implantação
                  </h4>
                  <p className="text-xs text-gray-600">
                    Timeline típica de 30 a 45 dias úteis para início completo
                    dos serviços (PGR, PCMSO, cadastro de trabalhadores e
                    agendamento de exames).
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === "result" && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleCreateAccount}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700"
              >
                Aceitar Proposta e Criar Minha Conta
              </button>
              <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-50">
                Solicitar Contato de um Consultor
              </button>
              <button
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-50"
                onClick={() => alert("Simulação de download de PDF")}
              >
                Baixar Proposta em PDF
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* =========================
   /cliente/cadastro
   ========================= */

function ClientSignup() {
  const { leadData, setClientAccount } = useClient();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!leadData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicHeader />
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
          <p className="text-sm mb-4">
            Não encontramos os dados do orçamento. Refaça a simulação.
          </p>
          <Link
            to="/cliente"
            className="text-sm text-blue-600 hover:underline"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!password || password.length < 4) {
      alert("Defina uma senha com pelo menos 4 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não conferem.");
      return;
    }
    if (!acceptTerms) {
      alert("É preciso aceitar os termos.");
      return;
    }

    setClientAccount({
      companyName: leadData.companyName,
      cnpj: leadData.cnpj,
      segment: leadData.segment,
      sizeRange: leadData.sizeRange,
      contactName: leadData.fullName,
      email: leadData.email,
    });

    alert("Cadastro concluído com sucesso.");
    navigate("/cliente/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-xl font-semibold mb-4">
          Finalizar cadastro do cliente
        </h1>
        <div className="bg-white border rounded-lg p-4 mb-4 text-sm">
          <h2 className="font-semibold mb-2">Dados da empresa</h2>
          <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-700">
            <p>
              <span className="font-semibold">Empresa: </span>
              {leadData.companyName}
            </p>
            <p>
              <span className="font-semibold">CNPJ: </span>
              {leadData.cnpj}
            </p>
            <p>
              <span className="font-semibold">Segmento: </span>
              {leadData.segment}
            </p>
            <p>
              <span className="font-semibold">Porte: </span>
              {leadData.sizeRange}
            </p>
            <p>
              <span className="font-semibold">Cidade: </span>
              {leadData.city} / BA
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-4 text-sm space-y-3">
          <div>
            <label className="block mb-1">Criar senha de acesso</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block mb-1">Confirmar senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={e => setAcceptTerms(e.target.checked)}
            />
            <span>
              Li e aceito os termos de uso e a política de privacidade.
            </span>
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700"
          >
            Finalizar Cadastro
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================
   /cliente/login
   ========================= */

function ClientLogin() {
  const { setClientAccount } = useClient();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/cliente/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Demo: aceita qualquer combinação e cria conta mockada
    setClientAccount({
      companyName: "Metalúrgica ABC Ltda",
      cnpj: "12.345.678/0001-90",
      segment: "Metalúrgico e Siderúrgico",
      sizeRange: "100-249",
      contactName: "João Gestor",
      email,
    });
    navigate(from, { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white border rounded-lg shadow-sm p-6 w-full max-w-md text-sm">
          <h1 className="text-xl font-semibold mb-4">
            Login do Cliente
          </h1>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-blue-700"
            >
              Entrar
            </button>
          </form>
          <div className="flex justify-between mt-3 text-xs">
            <button className="text-blue-600 hover:underline">
              Esqueci minha senha
            </button>
            <Link
              to="/cliente"
              className="text-blue-600 hover:underline"
            >
              Ainda não tem conta? Solicite um orçamento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   /cliente/dashboard
   ========================= */

function ClientDashboard() {
  const { clientAccount } = useClient();
  const [showUploadM1, setShowUploadM1] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);

  const today = new Date().toLocaleDateString("pt-BR");

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    setUploadFiles(files.map(f => f.name));
  }

  return (
    <div className="space-y-4">
      {/* Card de boas vindas */}
      <div className="bg-white rounded-lg shadow-sm border p-4 text-sm flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold mb-1">
            Olá, {clientAccount?.companyName || "Cliente"}!
          </h1>
          <p className="text-xs text-gray-600">
            Bem-vindo ao SESI Saúde Connect.
          </p>
        </div>
        <div className="text-xs text-gray-500">
          Último acesso: {today}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Status atual */}
        <div className="bg-white rounded-lg shadow-sm border p-4 text-sm md:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <div className="text-xs text-gray-500">
                Status da jornada
              </div>
              <div className="font-semibold text-sm">
                Aguardando envio da Planilha M1
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Precisamos dos dados dos seus funcionários para iniciar a elaboração
            do PGR.
          </p>
          <div className="mb-3">
            <div className="flex justify-between text-[11px] text-gray-600 mb-1">
              <span>Progresso da jornada</span>
              <span>25%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-2 bg-blue-600 w-1/4" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <button
              className="bg-blue-600 text-white px-3 py-2 rounded font-semibold hover:bg-blue-700"
              onClick={() => setShowUploadM1(true)}
            >
              Enviar Planilha M1
            </button>
            <button className="text-blue-600 hover:underline">
              O que é a Planilha M1?
            </button>
          </div>
        </div>

        {/* Consultor SESI */}
        <div className="bg-white rounded-lg shadow-sm border p-4 text-sm">
          <h2 className="font-semibold mb-2 text-sm">
            Seu Consultor SESI
          </h2>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">
              M
            </div>
            <div className="text-xs">
              <p className="font-semibold">Maria Silva</p>
              <p className="text-gray-500">Consultora de Relacionamento</p>
              <p className="text-gray-600 mt-1">WhatsApp: (71) 99999-0000</p>
            </div>
          </div>
          <button className="mt-3 w-full border border-blue-600 text-blue-600 px-3 py-2 rounded text-xs font-semibold hover:bg-blue-50">
            Enviar Mensagem
          </button>
        </div>
      </div>

      {/* Timeline da jornada e pendências */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 text-sm md:col-span-2">
          <h2 className="font-semibold mb-3 text-sm">
            Jornada de implantação
          </h2>
          <ol className="text-xs space-y-2">
            <TimelineItem
              status="done"
              title="Proposta Aceita"
              date="20/11/2025"
            />
            <TimelineItem
              status="done"
              title="Contrato Assinado"
              date="22/11/2025"
            />
            <TimelineItem
              status="pending"
              title="Envio da Planilha M1"
              date="Pendente"
              highlight
            />
            <TimelineItem
              status="waiting"
              title="Visita Técnica"
              date="05/12/2025 (previsto)"
            />
            <TimelineItem
              status="waiting"
              title="Elaboração do PGR"
              date="12/12/2025 (previsto)"
            />
            <TimelineItem
              status="waiting"
              title="Entrega e Validação do PGR"
              date="Após 12/12/2025"
            />
            <TimelineItem
              status="waiting"
              title="Elaboração do PCMSO"
              date="19/12/2025 (previsto)"
            />
            <TimelineItem
              status="waiting"
              title="Entrega e Validação do PCMSO"
              date="Após 19/12/2025"
            />
            <TimelineItem
              status="waiting"
              title="Treinamento do Sistema InfoSesi"
              date="A agendar"
            />
            <TimelineItem
              status="waiting"
              title="Início dos Agendamentos de Exames"
              date="Após PCMSO"
            />
          </ol>
        </div>

        <div className="space-y-4">
          {/* Pendências */}
          <div className="bg-white rounded-lg shadow-sm border p-4 text-sm">
            <h2 className="font-semibold mb-3 text-sm">
              Minhas pendências
            </h2>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span>Enviar Planilha M1</span>
                </div>
                <button
                  className="border border-blue-600 text-blue-600 px-2 py-1 rounded text-[11px] hover:bg-blue-50"
                  onClick={() => setShowUploadM1(true)}
                >
                  Upload
                </button>
              </li>
              <li className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span>✍️</span>
                  <span>Validar dados do contrato</span>
                </div>
                <button className="border border-gray-300 text-gray-700 px-2 py-1 rounded text-[11px] hover:bg-gray-50">
                  Revisar
                </button>
              </li>
            </ul>
          </div>

          {/* Documentos recentes */}
          <div className="bg-white rounded-lg shadow-sm border p-4 text-sm">
            <h2 className="font-semibold mb-3 text-sm">
              Meus documentos recentes
            </h2>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between">
                <span>Contrato de Prestação de Serviços</span>
                <span className="text-green-600 font-semibold">
                  Disponível
                </span>
              </li>
              <li className="flex justify-between">
                <span>PGR - Metalúrgica ABC</span>
                <span className="text-yellow-600 font-semibold">
                  Em elaboração
                </span>
              </li>
              <li className="flex justify-between">
                <span>PCMSO 2025</span>
                <span className="text-gray-500 font-semibold">
                  Aguardando PGR
                </span>
              </li>
            </ul>
          </div>

          {/* Próximos agendamentos */}
          <div className="bg-white rounded-lg shadow-sm border p-4 text-sm">
            <h2 className="font-semibold mb-2 text-sm">
              Próximos agendamentos
            </h2>
            <p className="text-xs text-gray-600">
              Nenhum agendamento ainda. Após a conclusão do PCMSO você poderá
              agendar os exames.
            </p>
          </div>
        </div>
      </div>

      {/* Modal upload M1 */}
      {showUploadM1 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md text-sm">
            <h2 className="text-sm font-semibold mb-2">
              Enviar Planilha M1
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              Faça upload da planilha com os dados dos trabalhadores. Aceitamos
              arquivos em formato XLSX ou CSV.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg py-6 px-4 text-center text-xs mb-3">
              <p className="mb-2">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="text-xs"
              />
            </div>
            {uploadFiles.length > 0 && (
              <div className="mb-3 text-xs">
                <p className="font-semibold mb-1">Arquivos selecionados:</p>
                <ul className="list-disc ml-5">
                  {uploadFiles.map((name, idx) => (
                    <li key={idx}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-end gap-2 text-xs">
              <button
                className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
                onClick={() => setShowUploadM1(false)}
              >
                Cancelar
              </button>
              <button
                className="px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                onClick={() => {
                  alert("Upload registrado no sistema (mock).");
                  setShowUploadM1(false);
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineItem({ status, title, date, highlight }) {
  let color = "bg-gray-300";
  let icon = "⏳";
  if (status === "done") {
    color = "bg-green-500";
    icon = "✅";
  } else if (status === "pending") {
    color = "bg-yellow-400";
    icon = "⚠️";
  }

  return (
    <li
      className={`flex gap-3 ${
        highlight ? "bg-yellow-50 border border-yellow-100 rounded px-2 py-1" : ""
      }`}
    >
      <div className="flex flex-col items-center">
        <div className={`h-4 w-4 rounded-full ${color}`} />
        <div className="flex-1 w-px bg-gray-200" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs">{icon}</span>
          <span className="font-semibold text-xs">{title}</span>
        </div>
        <span className="text-[11px] text-gray-500">{date}</span>
      </div>
    </li>
  );
}

/* =========================
   /cliente/documentos
   ========================= */

function ClientDocuments() {
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [uploaded, setUploaded] = useState([]);

  const docs = [
    {
      name: "Contrato SESI nº 2025/1234",
      type: "Contratuais",
      status: "Disponível",
      date: "22/11/2025",
    },
    {
      name: "Proposta Comercial",
      type: "Contratuais",
      status: "Disponível",
      date: "20/11/2025",
    },
    {
      name: "PGR - Metalúrgica ABC",
      type: "PGR",
      status: "Em elaboração",
      date: "Previsto 12/12/2025",
    },
    {
      name: "PCMSO 2025",
      type: "PCMSO",
      status: "Aguardando PGR",
      date: "Previsto 19/12/2025",
    },
    {
      name: "Modelo Planilha M1",
      type: "Outros",
      status: "Disponível",
      date: "23/11/2025",
    },
  ];

  const filtered = docs.filter(doc => {
    const typeOk = typeFilter === "Todos" || doc.type === typeFilter;
    const statusOk = statusFilter === "Todos" || doc.status === statusFilter;
    return typeOk && statusOk;
  });

  function handleUpload(e) {
    const files = Array.from(e.target.files || []);
    setUploaded(prev => [...prev, ...files.map(f => f.name)]);
  }

  return (
    <div className="space-y-4 text-sm">
      <h1 className="text-lg font-semibold">Meus Documentos</h1>

      <div className="flex flex-wrap gap-3 text-xs bg-white border rounded-lg p-3">
        <div>
          <label className="block mb-1">Tipo</label>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option>Todos</option>
            <option>Contratuais</option>
            <option>PGR</option>
            <option>PCMSO</option>
            <option>ASOs</option>
            <option>Laudos</option>
            <option>Outros</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option>Todos</option>
            <option>Disponível</option>
            <option>Em elaboração</option>
            <option>Pendente validação</option>
            <option>Aguardando PGR</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-3">
        <h2 className="font-semibold text-sm mb-2">Documentos SESI</h2>
        <div className="space-y-2 text-xs">
          {filtered.map(doc => (
            <div
              key={doc.name}
              className="flex items-center justify-between border-b last:border-b-0 py-2"
            >
              <div>
                <div className="font-semibold">{doc.name}</div>
                <div className="text-gray-500">
                  {doc.type} • {doc.date}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`px-2 py-1 rounded text-[10px] ${
                    doc.status === "Disponível"
                      ? "bg-green-50 text-green-700"
                      : doc.status === "Em elaboração"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {doc.status}
                </span>
                <div className="flex gap-2 text-[11px]">
                  <button className="border border-gray-300 px-2 py-1 rounded hover:bg-gray-50">
                    Visualizar
                  </button>
                  <button
                    className="border border-blue-600 text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                    onClick={() => alert("Simulação de download")}
                  >
                    Download
                  </button>
                  {doc.status === "Pendente validação" && (
                    <button className="border border-green-600 text-green-600 px-2 py-1 rounded hover:bg-green-50">
                      Validar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-xs text-gray-500">Nenhum documento encontrado.</p>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-3 text-xs">
        <h2 className="font-semibold text-sm mb-2">Envio de documentos do cliente</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg py-6 px-4 text-center mb-3">
          <p className="mb-2">
            Arraste arquivos ou clique para enviar
          </p>
          <input type="file" multiple onChange={handleUpload} />
        </div>
        {uploaded.length > 0 && (
          <div>
            <p className="font-semibold mb-1">Arquivos enviados:</p>
            <ul className="list-disc ml-5">
              {uploaded.map((file, idx) => (
                <li key={idx}>{file}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   /cliente/agendamentos
   ========================= */

function ClientScheduling() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    worker: "",
    examType: "",
    preferredDate: "",
    unit: "",
  });

  const appointments = [
    {
      worker: "João Silva",
      examType: "Periódico",
      date: "10/12/2025",
      time: "09:00",
      unit: "SESI Feira de Santana",
      status: "Confirmado",
    },
    {
      worker: "Maria Santos",
      examType: "Admissional",
      date: "12/12/2025",
      time: "14:00",
      unit: "SESI Salvador",
      status: "Aguardando confirmação",
    },
  ];

  function handleNewAppointmentSubmit(e) {
    e.preventDefault();
    setShowNew(false);
    setToast("Agendamento solicitado. Aguarde confirmação.");
    setTimeout(() => setToast(""), 3000);
  }

  const daysWithAppointments = ["10", "12"];

  return (
    <div className="space-y-4 text-sm">
      <h1 className="text-lg font-semibold">Agendamentos de Exames</h1>

      {/* Calendário simples mockado */}
      <div className="bg-white border rounded-lg p-3 text-xs">
        <h2 className="font-semibold mb-2">Calendário - Dezembro 2025</h2>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["D", "S", "T", "Q", "Q", "S", "S"].map(d => (
            <div key={d} className="font-semibold text-[11px]">
              {d}
            </div>
          ))}
          {Array.from({ length: 31 }).map((_, index) => {
            const day = index + 1;
            const label = String(day);
            const active = daysWithAppointments.includes(label);
            const isSelected = selectedDay === label;
            return (
              <button
                key={label}
                className={`h-8 w-8 flex items-center justify-center rounded text-[11px] ${
                  active
                    ? "bg-blue-100 text-blue-700 border border-blue-400"
                    : "bg-gray-50 text-gray-700"
                } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setSelectedDay(label)}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-gray-500">
          Dias destacados possuem agendamentos.
        </p>
      </div>

      {/* Lista de agendamentos */}
      <div className="bg-white border rounded-lg p-3 text-xs">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">Lista de agendamentos</h2>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded text-[11px] font-semibold hover:bg-blue-700"
            onClick={() => setShowNew(true)}
          >
            Novo agendamento
          </button>
        </div>

        <table className="w-full text-[11px] border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-2 py-1 text-left">Funcionário</th>
              <th className="border px-2 py-1 text-left">Tipo de exame</th>
              <th className="border px-2 py-1 text-left">Data / Hora</th>
              <th className="border px-2 py-1 text-left">Unidade SESI</th>
              <th className="border px-2 py-1 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, idx) => {
              const matchDay = selectedDay
                ? a.date.split("/")[0] === selectedDay
                : true;
              if (!matchDay) return null;
              return (
                <tr key={idx}>
                  <td className="border px-2 py-1">{a.worker}</td>
                  <td className="border px-2 py-1">{a.examType}</td>
                  <td className="border px-2 py-1">
                    {a.date} • {a.time}
                  </td>
                  <td className="border px-2 py-1">{a.unit}</td>
                  <td className="border px-2 py-1">
                    <span
                      className={`px-2 py-1 rounded ${
                        a.status === "Confirmado"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal novo agendamento */}
      {showNew && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg p-5 w-full max-w-md text-xs">
            <h2 className="font-semibold mb-2">
              Novo agendamento de exame
            </h2>
            <form
              className="space-y-3"
              onSubmit={handleNewAppointmentSubmit}
            >
              <div>
                <label className="block mb-1">Funcionário</label>
                <select
                  value={newAppointment.worker}
                  onChange={e =>
                    setNewAppointment(prev => ({
                      ...prev,
                      worker: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Selecione</option>
                  <option>João Silva</option>
                  <option>Maria Santos</option>
                  <option>Novo colaborador</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Tipo de exame</label>
                <select
                  value={newAppointment.examType}
                  onChange={e =>
                    setNewAppointment(prev => ({
                      ...prev,
                      examType: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Selecione</option>
                  <option>Admissional</option>
                  <option>Periódico</option>
                  <option>Demissional</option>
                  <option>Retorno ao Trabalho</option>
                  <option>Mudança de Risco</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Data preferencial</label>
                <input
                  type="date"
                  value={newAppointment.preferredDate}
                  onChange={e =>
                    setNewAppointment(prev => ({
                      ...prev,
                      preferredDate: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block mb-1">Unidade SESI</label>
                <select
                  value={newAppointment.unit}
                  onChange={e =>
                    setNewAppointment(prev => ({
                      ...prev,
                      unit: e.target.value,
                    }))
                  }
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Selecione</option>
                  <option>Feira de Santana</option>
                  <option>Salvador</option>
                  <option>Vitória da Conquista</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="px-3 py-2 rounded border border-gray-300 hover:bg-gray-50"
                  onClick={() => setShowNew(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Solicitar agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast simples */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white text-xs px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}

/* =========================
   /cliente/mensagens
   ========================= */

function ClientMessages() {
  const [activeChat, setActiveChat] = useState("sesi");
  const [input, setInput] = useState("");

  const chats = {
    sesi: {
      name: "Equipe SESI Saúde",
      messages: [
        {
          from: "SESI",
          text: "Bom dia! Já recebemos o contrato assinado. Agora precisamos da Planilha M1.",
          time: "09:12",
        },
        {
          from: "Cliente",
          text: "Perfeito, estou organizando com o RH.",
          time: "09:30",
        },
        {
          from: "SESI",
          text: "Qualquer dúvida posso enviar o modelo preenchido como exemplo.",
          time: "09:32",
        },
      ],
    },
    suporte: {
      name: "Suporte Técnico InfoSesi",
      messages: [
        {
          from: "Cliente",
          text: "Não estou conseguindo acessar o módulo de exames.",
          time: "14:05",
        },
        {
          from: "SESI",
          text: "Já liberamos o seu perfil. Tente novamente por favor.",
          time: "14:10",
        },
      ],
    },
  };

  const current = chats[activeChat];

  function handleSend() {
    if (!input.trim()) return;
    alert("Mensagem enviada (mock).");
    setInput("");
  }

  return (
    <div className="flex gap-4 h-[450px] text-sm">
      {/* lista de conversas */}
      <div className="w-60 bg-white border rounded-lg flex flex-col">
        <div className="border-b px-3 py-2 text-xs font-semibold">
          Conversas
        </div>
        <button
          className={`px-3 py-3 text-xs text-left border-b hover:bg-gray-50 ${
            activeChat === "sesi" ? "bg-blue-50" : ""
          }`}
          onClick={() => setActiveChat("sesi")}
        >
          <div className="font-semibold">Equipe SESI Saúde</div>
          <div className="text-gray-500 text-[11px]">
            Orientações sobre PGR e PCMSO
          </div>
        </button>
        <button
          className={`px-3 py-3 text-xs text-left hover:bg-gray-50 ${
            activeChat === "suporte" ? "bg-blue-50" : ""
          }`}
          onClick={() => setActiveChat("suporte")}
        >
          <div className="font-semibold">Suporte Técnico InfoSesi</div>
          <div className="text-gray-500 text-[11px]">
            Dúvidas de acesso ao sistema
          </div>
        </button>
      </div>

      {/* área de chat */}
      <div className="flex-1 bg-white border rounded-lg flex flex-col">
        <div className="border-b px-3 py-2 text-xs flex justify-between items-center">
          <div>
            <div className="font-semibold">{current.name}</div>
            <div className="text-gray-500 text-[11px]">
              Canal oficial de atendimento
            </div>
          </div>
          <span className="text-[11px] text-gray-500">Online</span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 text-xs">
          {current.messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.from === "Cliente" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded px-3 py-2 ${
                  m.from === "Cliente"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="mb-1 text-[10px] opacity-80">
                  {m.from === "Cliente" ? "Você" : "SESI"}
                </div>
                <div className="text-[11px]">{m.text}</div>
                <div className="text-[9px] text-right opacity-70 mt-1">
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t px-3 py-2 flex items-center gap-2 text-xs">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 border rounded px-2 py-1"
          />
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded font-semibold hover:bg-blue-700"
            onClick={handleSend}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   /cliente/ajuda (simples)
   ========================= */

function ClientHelp() {
  return (
    <div className="space-y-3 text-sm">
      <h1 className="text-lg font-semibold">Ajuda rápida</h1>
      <div className="bg-white border rounded-lg p-3 text-xs space-y-2">
        <p>
          Em caso de dúvidas sobre NRs, PGR, PCMSO ou uso do sistema, fale com
          o consultor SESI ou com o Suporte Técnico pela área de Mensagens.
        </p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Prazos de implantação típicos: 30 a 45 dias úteis.</li>
          <li>Atualização de quadro de funcionários deve ser feita via Planilha M1.</li>
          <li>
            Laudos de Insalubridade e Periculosidade são conduzidos por equipe
            técnica habilitada.
          </li>
        </ul>
      </div>
    </div>
  );
}

/* =========================
   VISÃO 2 - ESQUELETO INTERNO SESI
   (apenas placeholder para manter as visões separadas)
   ========================= */

function SesiInternalView() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="max-w-6xl mx-auto py-10 px-4 text-sm">
        <h1 className="text-xl font-semibold mb-2">
          Visão SESI - Área interna
        </h1>
        <p className="text-gray-600 mb-4">
          Esta visão representa o ambiente interno do SESI para gestão de
          contratos, empresas e laudos. No MVP atual está simplificada.
        </p>
        <ul className="list-disc ml-5 text-xs space-y-1">
          <li>Lista de empresas clientes.</li>
          <li>Controle de status de PGR, PCMSO, laudos e exames.</li>
          <li>Alocação de consultores e agendas.</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          Você pode focar primeiro no Portal do Cliente em /cliente, e depois
          expandir esta visão para fluxos internos completos.
        </p>
      </div>
    </div>
  );
}

/* =========================
   APP PRINCIPAL E ROTAS
   ========================= */

export default function App() {
  const [leadData, setLeadData] = useState(null);
  const [clientAccount, setClientAccount] = useState(null);

  const clientContextValue = {
    leadData,
    setLeadData,
    clientAccount,
    setClientAccount,
  };

  return (
    <ClientContext.Provider value={clientContextValue}>
      <Routes>
        <Route path="/" element={<Navigate to="/cliente" />} />
        {/* Visão 1 - Portal do Cliente */}
        <Route path="/cliente" element={<ClientLanding />} />
        <Route path="/cliente/cadastro" element={<ClientSignup />} />
        <Route path="/cliente/login" element={<ClientLogin />} />

        <Route
          path="/cliente"
          element={
            <RequireClientAuth>
              <ClientLayout />
            </RequireClientAuth>
          }
        >
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="documentos" element={<ClientDocuments />} />
          <Route path="agendamentos" element={<ClientScheduling />} />
          <Route path="mensagens" element={<ClientMessages />} />
          <Route path="ajuda" element={<ClientHelp />} />
        </Route>

        {/* Visão 2 - Interna SESI (placeholder) */}
        <Route path="/sesi" element={<SesiInternalView />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/cliente" replace />} />
      </Routes>
    </ClientContext.Provider>
  );
}
