import React, { useState, useEffect } from 'react';
import { Trash2, MessageCircle, ArrowLeft, Zap, ZapOff } from 'lucide-react';

function App() {
  const [view, setView] = useState('manager');
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('morning');

  // Feature flag: controla si usar API real o mock data
  const [useRealAPI, setUseRealAPI] = useState(() => {
    // En localStorage guardamos la preferencia para preview
    const saved = localStorage.getItem('mental-health-use-real-api');
    return saved !== null ? saved === 'true' : false;
  });

  // Detectar ambiente
  const getEnvironment = () => {
    // Método 1: Variable de entorno (más confiable)
    // En Vercel, configura REACT_APP_VERCEL_ENV en Settings > Environment Variables
    // con valor "production" para producción y "preview" para preview
    const vercelEnv = process.env.REACT_APP_VERCEL_ENV;
    if (vercelEnv === 'production') {
      return 'production';
    }
    if (vercelEnv === 'preview') {
      return 'preview';
    }

    // Método 2: Detección por hostname (fallback)
    const hostname = window.location.hostname;

    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'local';
    }

    // Vercel preview deployments tienen patrones específicos:
    // - xxx-git-branchname-username.vercel.app (git branch deployments)
    // - xxx-hash-username.vercel.app (commit deployments)
    // Production deployment es simplemente: xxx-username.vercel.app o dominio custom
    if (hostname.includes('vercel.app')) {
      // Si contiene '-git-' es un preview deployment de una branch
      if (hostname.includes('-git-')) {
        return 'preview';
      }
      // Si contiene un hash de commit (formato: xxx-[a-z0-9]{9}-username.vercel.app)
      // Lo detectamos por tener múltiples guiones
      const parts = hostname.split('.');
      const subdomain = parts[0]; // ej: "mental-health-app-abc123def-username"
      const dashCount = (subdomain.match(/-/g) || []).length;
      // Preview deployments suelen tener 3+ guiones, production solo 2 o menos
      if (dashCount >= 3) {
        return 'preview';
      }
      // Si no cumple los patrones de preview, es production
      return 'production';
    }

    // Dominio custom = production
    return 'production';
  };

  const environment = getEnvironment();
  const isLocal = environment === 'local';
  const isPreview = environment === 'preview';
  const isProduction = environment === 'production';

  // Toggle para cambiar entre API real y mock (solo en preview)
  const toggleAPIMode = () => {
    const newValue = !useRealAPI;
    setUseRealAPI(newValue);
    localStorage.setItem('mental-health-use-real-api', newValue.toString());
  };

  useEffect(() => {
    loadMeds();
  }, []);

  const loadMeds = async () => {
    try {
      const saved = localStorage.getItem('thought-cabinet-meds');
      if (saved) {
        setMeds(JSON.parse(saved));
      }
    } catch (error) {
      console.log('No saved meds found');
    } finally {
      setLoading(false);
    }
  };

  const saveMeds = (newMeds) => {
    try {
      localStorage.setItem('thought-cabinet-meds', JSON.stringify(newMeds));
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const addMed = () => {
    if (!name.trim() || !dosage || parseFloat(dosage) <= 0) return;

    const newMed = {
      id: Date.now().toString(),
      name: name.trim(),
      dosage: parseFloat(dosage),
      time
    };

    const newMeds = [...meds, newMed];
    setMeds(newMeds);
    saveMeds(newMeds);

    setName('');
    setDosage('');
    setTime('morning');
  };

  const deleteMed = (id) => {
    const newMeds = meds.filter(med => med.id !== id);
    setMeds(newMeds);
    saveMeds(newMeds);
  };

  const generateReport = async () => {
    setThinking(true);
    setError(null);

    // En local SIEMPRE usar fallback (no gastar tokens)
    if (isLocal) {
      console.log('🏠 Ambiente LOCAL: usando mock data');
      setTimeout(() => {
        setReportData(getFallbackData());
        setView('report');
        setThinking(false);
      }, 1500); // Simular delay de API
      return;
    }

    // En preview, respetar el toggle
    if (isPreview && !useRealAPI) {
      console.log('🔧 Preview con MOCK DATA activado');
      setTimeout(() => {
        setError('Preview Mode: Usando conversación de ejemplo (activa API real con el botón ⚡)');
        setReportData(getFallbackData());
        setView('report');
        setThinking(false);
      }, 1500);
      return;
    }

    // Usar API real (preview con toggle ON o producción)
    console.log(`🌐 Usando API REAL en ${environment}`);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medications: meds
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const parsedData = await response.json();
      setReportData(parsedData);
      setView('report');
      setError(null);

    } catch (error) {
      console.error('❌ Error al generar reporte:', error);

      const errorMessage = isProduction
        ? 'Error al conectar con el servidor. Usando conversación de ejemplo.'
        : `Error: ${error.message}. Usando conversación de ejemplo.`;

      setError(errorMessage);
      setReportData(getFallbackData());
      setView('report');
    } finally {
      setThinking(false);
    }
  };

  const getFallbackData = () => {
    const hasSSRI = meds.some(m => m.name.toLowerCase().includes('sertralin') ||
                                    m.name.toLowerCase().includes('fluoxetin') ||
                                    m.name.toLowerCase().includes('escitalopram'));

    const participants = [
      { id: 'tu', name: 'TÚ', color: '#4F46E5', emoji: '🧠' },
      { id: 'regulacion', name: 'REGULACIÓN EMOCIONAL', color: '#10b981', emoji: '🎯' },
      { id: 'alarma', name: 'SISTEMA DE ALARMA', color: '#ef4444', emoji: '🚨' },
      { id: 'cuerpo', name: 'CUERPO', color: '#06b6d4', emoji: '💪' }
    ];

    if (meds.length > 0) {
      participants.push({
        id: 'med1',
        name: `${meds[0].name.toUpperCase()} ${meds[0].dosage}MG`,
        color: '#8b5cf6',
        emoji: '💊'
      });
    }

    const messages = [
      {
        time: '8:45 AM',
        senderId: 'tu',
        text: 'wena cabros\ncómo va el día?',
        reactions: ['❤️']
      },
      {
        time: '8:47 AM',
        senderId: 'regulacion',
        text: 'buenos días\nbueno, más o menos jaja\ntomaste las pastillas?'
      },
      {
        time: '8:47 AM',
        senderId: 'tu',
        text: 'sip, recién'
      },
      {
        time: '8:48 AM',
        senderId: 'alarma',
        text: 'OYE PERO QUÉ PASA SI NO FUNCIONAN\nqué pasa si hoy es peor',
        reactions: ['😂']
      },
      {
        time: '8:49 AM',
        senderId: 'regulacion',
        text: 'ya po, cálmate\nsiempre dices lo mismo y siempre funciona\ndale tiempo'
      },
      {
        time: '11:32 AM',
        senderId: 'cuerpo',
        text: 'oye\nestoy sintiendo las pastillas trabajando\nse siente... bien?'
      },
      {
        time: '11:33 AM',
        senderId: 'med1',
        text: hasSSRI
          ? 'Hola! Soy la sertralina. Estoy trabajando en los receptores de serotonina ahora mismo 💙\nBloqueando la recaptación para que tengas más disponible'
          : `Hola, soy ${meds[0]?.name}. Estoy trabajando para ayudarte hoy 💙`
      },
      {
        time: '11:34 AM',
        senderId: 'tu',
        text: 'gracias pastilla\nte cacho el esfuerzo',
        reactions: ['❤️', '👍']
      },
      {
        time: '8:23 PM',
        senderId: 'regulacion',
        text: 'bueno\nllegamos al final del día\ny estamos bien'
      },
      {
        time: '8:24 PM',
        senderId: 'alarma',
        text: 'admito que hoy no estuvo tan terrible\ngracias a todos'
      },
      {
        time: '8:25 PM',
        senderId: 'tu',
        text: 'somos un equipo po\ngracias por cuidarme'
      }
    ];

    return {
      participants,
      messages
    };
  };

  const timeIcons = {
    morning: '☀️',
    afternoon: '☁️',
    night: '🌙'
  };

  const timeLabels = {
    morning: 'Mañana',
    afternoon: 'Tarde',
    night: 'Noche'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-[#1a1a2e] text-white flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (thinking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-[#1a1a2e] text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto">
            <MessageCircle className="w-full h-full text-purple-500 animate-pulse" />
          </div>
          <div className="space-y-3">
            <div className="text-lg font-medium">Generando conversación...</div>
            <div className="text-gray-400 text-sm">Tus aspectos mentales están conectándose</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-[#1a1a2e] text-white font-sans">
      <div className="max-w-2xl mx-auto">
        {view === 'manager' ? (
          // VISTA DE GESTIÓN DE MEDICAMENTOS
          <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="text-center py-8 space-y-2 relative">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Mental Health Check-In
              </h1>
              <div className="text-gray-400 text-sm">
                Una conversación honesta sobre tu medicación
              </div>

              {/* Debug Toggle - Solo visible en preview */}
              {isPreview && (
                <div className="absolute top-2 right-2">
                  <button
                    onClick={toggleAPIMode}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      useRealAPI
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
                        : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:bg-gray-700'
                    }`}
                    title={useRealAPI ? 'API Real activada - Click para desactivar' : 'Mock Data - Click para activar API real'}
                  >
                    {useRealAPI ? <Zap size={14} /> : <ZapOff size={14} />}
                    <span>{useRealAPI ? 'API Real' : 'Mock'}</span>
                  </button>
                  <div className="text-xs text-gray-500 mt-1 text-right">
                    Preview Mode
                  </div>
                </div>
              )}

              {/* Indicador de ambiente (solo para debugging) */}
              {!isProduction && (
                <div className="text-xs text-gray-500 mt-2">
                  🔧 Ambiente: {environment} {isLocal && '(siempre mock)'}
                </div>
              )}
            </div>

            {/* Agregar medicamento */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-lg font-semibold text-white">Agregar Medicamento</h2>

              <input
                type="text"
                placeholder="Nombre del medicamento"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />

              <input
                type="number"
                placeholder="Dosis (mg)"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />

              <div>
                <div className="text-sm text-gray-400 mb-3">¿Cuándo lo tomas?</div>
                <div className="grid grid-cols-3 gap-3">
                  {['morning', 'afternoon', 'night'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                        time === t
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-black/30 text-gray-400 hover:bg-black/50 border border-gray-700'
                      }`}
                    >
                      {timeIcons[t]} {timeLabels[t]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={addMed}
                disabled={!name.trim() || !dosage || parseFloat(dosage) <= 0}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Agregar
              </button>
            </div>

            {/* Lista de medicamentos */}
            <div className="space-y-3">
              <div className="text-white font-semibold px-2">
                Tu régimen actual
              </div>
              {meds.length === 0 ? (
                <div className="text-gray-400 text-center py-12 bg-[#2a2a2a] rounded-2xl">
                  No hay medicamentos agregados aún
                </div>
              ) : (
                <div className="space-y-3">
                  {meds.map(med => (
                    <div key={med.id} className="flex items-center justify-between bg-[#2a2a2a] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
                      <div className="flex items-center gap-4 flex-1">
                        <span className="text-2xl">{timeIcons[med.time]}</span>
                        <div className="flex-1">
                          <div className="text-white font-medium">{med.name}</div>
                          <div className="text-gray-400 text-sm">{med.dosage}mg · {timeLabels[med.time]}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteMed(med.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors p-2"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botón para generar conversación */}
            {meds.length > 0 && (
              <button
                onClick={generateReport}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all transform hover:scale-[1.02]"
              >
                💬 Ver Conversación
              </button>
            )}
          </div>
        ) : (
          // VISTA DE CONVERSACIÓN INSTAGRAM DM
          <div className="min-h-screen flex flex-col">
            {/* Header estilo Instagram */}
            <div className="bg-[#2a2a2a] border-b border-gray-800 p-4 flex items-center gap-3 sticky top-0 z-10 backdrop-blur-lg bg-opacity-95">
              <button
                onClick={() => setView('manager')}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div className="flex-1">
                <div className="font-semibold text-white">Mental Health Check-In</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Activo ahora
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Conversación */}
            <div className="flex-1 p-4 space-y-4 pb-20">
              {reportData?.messages?.map((msg, idx) => {
                const participant = reportData.participants.find(p => p.id === msg.senderId);
                const isUser = msg.senderId === 'tu';

                return (
                  <div
                    key={idx}
                    className={`flex gap-3 animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {/* Avatar */}
                    {!isUser && (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${participant?.color}40, ${participant?.color}80)`,
                          border: `2px solid ${participant?.color}`
                        }}
                      >
                        {participant?.emoji}
                      </div>
                    )}

                    <div className={`flex-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      {/* Nombre */}
                      {!isUser && (
                        <div className="text-xs font-medium px-3" style={{ color: participant?.color }}>
                          {participant?.name}
                        </div>
                      )}

                      {/* Mensaje */}
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-lg ${
                          isUser
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-sm'
                            : 'bg-[#2a2a2a] text-white rounded-tl-sm'
                        }`}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-line">
                          {msg.text}
                        </div>
                      </div>

                      {/* Reacciones */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex gap-1 px-2">
                          {msg.reactions.map((reaction, rIdx) => (
                            <span key={rIdx} className="text-sm">
                              {reaction}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      {msg.time && (
                        <div className="text-xs text-gray-500 px-3">
                          {msg.time}
                        </div>
                      )}
                    </div>

                    {/* Avatar usuario */}
                    {isUser && (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${participant?.color}40, ${participant?.color}80)`,
                          border: `2px solid ${participant?.color}`
                        }}
                      >
                        {participant?.emoji}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer con participantes */}
            <div className="bg-[#2a2a2a] border-t border-gray-800 p-4 space-y-3">
              <div className="text-xs text-gray-400 uppercase tracking-wide">Participantes</div>
              <div className="flex flex-wrap gap-2">
                {reportData?.participants?.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-black/30 rounded-full px-3 py-2 text-xs"
                  >
                    <span>{p.emoji}</span>
                    <span className="font-medium" style={{ color: p.color }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default App;
