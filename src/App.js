import React, { useState, useEffect } from 'react';
import { Trash2, Brain } from 'lucide-react';

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

    try {
      // Llamar a nuestro backend seguro en vez de Anthropic directamente
      // El backend está en /api/analyze (Vercel Serverless Function)
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medications: meds
        })
      });

      // Manejar errores de la API
      if (!response.ok) {
        // Si es desarrollo local, el endpoint no existe
        if (response.status === 404) {
          throw new Error('Backend no disponible en desarrollo local');
        }

        // Intentar parsear el error como JSON
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al generar el análisis');
        } catch (jsonError) {
          throw new Error('Error de comunicación con el backend');
        }
      }

      // El backend ya devuelve el JSON parseado y validado
      const parsedData = await response.json();

      setReportData(parsedData);
      setView('report');

    } catch (error) {
      console.error('Error al generar reporte:', error);

      // Mensaje más claro para desarrollo local
      const isDevelopment = window.location.hostname === 'localhost';
      const errorMessage = isDevelopment
        ? 'Desarrollo local: usando diálogo de ejemplo'
        : `${error.message} - Usando diálogo alternativo`;

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
    
    const skills = [
      { name: "Emotional Regulator", level: hasSSRI ? 4 : 3, color: "#60a5fa" },
      { name: "The Catastrophizer", level: 5, color: "#ef4444" },
      { name: "Executive Function", level: 2, color: "#8b5cf6" },
      { name: "The Body", level: 4, color: "#10b981" }
    ];
    
    const dialogue = [
      { 
        speaker: "Emotional Regulator", 
        text: `So we're taking ${meds.length} medication${meds.length > 1 ? 's' : ''} now. That's... actually kind of responsible.`, 
        color: "#60a5fa" 
      },
      { 
        speaker: "The Catastrophizer", 
        text: "But what if people find out? What if they think we're broken?", 
        color: "#ef4444" 
      },
      { 
        speaker: "Executive Function", 
        text: "Can we not do this right now? We've got a routine. We're showing up. That counts.", 
        color: "#8b5cf6" 
      },
      { 
        speaker: "The Body", 
        text: `The ${meds[0].name}... I can feel it working. Not in a bad way. Just... present.`, 
        color: "#10b981" 
      },
      {
        speaker: "Emotional Regulator",
        text: "Look, nobody's handing out medals for suffering without help. This is fine.",
        color: "#60a5fa"
      },
      {
        speaker: "The Catastrophizer",
        text: "I guess... I guess we're still here. That's something.",
        color: "#ef4444"
      }
    ];
    
    return {
      skills,
      dialogue,
      summary: "You're doing the work. The chemistry just makes it possible to show up. And showing up is half the battle."
    };
  };

  const getMedsByTime = (timeSlot) => {
    return meds.filter(med => med.time === timeSlot);
  };

  const timeIcons = {
    morning: '☀️',
    afternoon: '☁️',
    night: '🌙'
  };

  const timeLabels = {
    morning: 'Morning',
    afternoon: 'Afternoon', 
    night: 'Night'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-[#c9c9c9] font-serif flex items-center justify-center">
        <div className="text-[#7c7c7c]">Loading internal systems...</div>
      </div>
    );
  }

  if (thinking) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-[#c9c9c9] font-serif flex items-center justify-center p-8">
        <div className="max-w-2xl space-y-4">
          <div className="text-[#60a5fa] italic">LIMBIC SYSTEM — Analyzing chemical intervention...</div>
          <div className="text-[#ef4444] italic">ANXIETY — Oh god, what are they going to find out about us?</div>
          <div className="text-[#8b5cf6] italic">LOGIC — It's just data. Relax.</div>
          <div className="text-[#10b981] italic">THE BODY — I can feel something happening...</div>
          <div className="mt-6 text-center">
            <Brain className="w-8 h-8 text-[#7c7c7c] animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#c9c9c9] font-serif p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 border-b border-[#2a2a2a] pb-6">
          <h1 className="text-3xl sm:text-4xl mb-2 text-[#e8e8e8] tracking-tight">
            THE THOUGHT CABINET
          </h1>
          <div className="text-[#7c7c7c] text-sm italic">
            An Internal Dialogue About Your Medication
          </div>
        </div>

        {view === 'manager' ? (
          <div>
            <h2 className="text-xl text-[#e8e8e8] mb-4 border-l-2 border-[#60a5fa] pl-3">
              Document Your Chemical Assistance
            </h2>
            
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 mb-6">
              <input
                type="text"
                placeholder="Medication name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#2a2a2a] p-3 mb-3 text-[#c9c9c9] font-sans focus:outline-none focus:border-[#60a5fa] placeholder-[#4a4a4a]"
              />
              
              <input
                type="number"
                placeholder="Dosage (mg)"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#2a2a2a] p-3 mb-4 text-[#c9c9c9] font-sans focus:outline-none focus:border-[#60a5fa] placeholder-[#4a4a4a]"
              />
              
              <div className="mb-4">
                <div className="text-sm text-[#7c7c7c] mb-2 italic">When does this happen?</div>
                <div className="grid grid-cols-3 gap-2">
                  {['morning', 'afternoon', 'night'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`py-2 px-3 border text-sm ${
                        time === t 
                          ? 'border-[#60a5fa] bg-[#60a5fa] bg-opacity-10 text-[#60a5fa]' 
                          : 'border-[#2a2a2a] text-[#7c7c7c] hover:border-[#4a4a4a]'
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
                className="w-full bg-[#2a2a2a] text-[#e8e8e8] py-3 hover:bg-[#3a3a3a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-sans text-sm tracking-wide"
              >
                ADD TO REGIMEN
              </button>
            </div>

            <div className="mb-6">
              <div className="text-[#e8e8e8] mb-3 border-l-2 border-[#8b5cf6] pl-3">
                Current Regimen
              </div>
              {meds.length === 0 ? (
                <div className="text-[#7c7c7c] italic py-4 text-center border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                  No medications documented yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {meds.map(med => (
                    <div key={med.id} className="flex items-center justify-between bg-[#1a1a1a] border border-[#2a2a2a] p-4">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-lg">{timeIcons[med.time]}</span>
                        <div className="flex-1">
                          <div className="text-[#e8e8e8] font-sans">{med.name}</div>
                          <div className="text-[#7c7c7c] text-sm">{med.dosage}mg · {timeLabels[med.time]}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteMed(med.id)}
                        className="text-[#7c7c7c] hover:text-[#ef4444] transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {meds.length > 0 && (
              <button
                onClick={generateReport}
                className="w-full bg-[#8b5cf6] text-[#e8e8e8] py-4 hover:bg-[#7c3aed] transition-colors font-sans text-sm tracking-wide"
              >
                CONVENE THE INTERNAL COUNCIL
              </button>
            )}
          </div>
        ) : (
          <div>
            {error && (
              <div className="mb-4 p-3 border border-[#ef4444] bg-[#ef4444] bg-opacity-10 text-[#ef4444] text-sm">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <div className="text-[#e8e8e8] mb-4 border-l-2 border-[#60a5fa] pl-3">
                Active Internal Voices
              </div>
              <div className="grid grid-cols-2 gap-3">
                {reportData?.skills?.map((skill, idx) => (
                  <div key={idx} className="bg-[#1a1a1a] border border-[#2a2a2a] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-sans uppercase tracking-wide" style={{ color: skill.color }}>
                        {skill.name}
                      </span>
                      <span className="text-[#7c7c7c] text-sm">{skill.level}/6</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="h-1 flex-1"
                          style={{
                            backgroundColor: i < skill.level ? skill.color : '#2a2a2a'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 mb-6">
              <div className="text-[#e8e8e8] mb-4 text-center italic">Daily Protocol</div>
              
              {['morning', 'afternoon', 'night'].map(timeSlot => {
                const timeMeds = getMedsByTime(timeSlot);
                if (timeMeds.length === 0) return null;
                
                return (
                  <div key={timeSlot} className="mb-4 last:mb-0">
                    <div className="text-[#7c7c7c] mb-2 text-sm">
                      {timeIcons[timeSlot]} {timeLabels[timeSlot].toUpperCase()}
                    </div>
                    {timeMeds.map(med => (
                      <div key={med.id} className="ml-4 text-[#c9c9c9] text-sm mb-1">
                        → {med.name} {med.dosage}mg
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="border border-[#2a2a2a] bg-[#1a1a1a] p-6 mb-6">
              <div className="text-[#e8e8e8] mb-6 text-center italic border-b border-[#2a2a2a] pb-4">
                Internal Dialogue
              </div>
              
              <div className="space-y-4">
                {reportData?.dialogue?.map((line, idx) => (
                  <div key={idx} className="border-l-2 pl-4 py-2" style={{ borderColor: line.color }}>
                    <div className="text-sm font-sans uppercase tracking-wide mb-1" style={{ color: line.color }}>
                      {line.speaker}
                    </div>
                    <div className="text-[#c9c9c9] leading-relaxed">
                      {line.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {reportData?.summary && (
              <div className="bg-[#1a1a1a] border-2 border-[#60a5fa] p-6 mb-6">
                <div className="text-[#60a5fa] text-sm font-sans uppercase tracking-wide mb-3">YOU</div>
                <div className="text-[#e8e8e8] leading-relaxed italic">
                  {reportData.summary}
                </div>
              </div>
            )}

            <button
              onClick={() => setView('manager')}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#c9c9c9] py-3 hover:bg-[#2a2a2a] transition-colors font-sans text-sm tracking-wide"
            >
              ← RETURN TO DOCUMENTATION
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
