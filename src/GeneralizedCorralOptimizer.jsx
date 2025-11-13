import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Area, BarChart, Bar, Legend } from 'recharts';
import { BookCopy, Ruler, TrendingUp, Anchor, LayoutGrid, AlertTriangle } from 'lucide-react';

const GeneralizedCorralOptimizer = () => {
  const [numCorrals, setNumCorrals] = useState(1);
  const [width, setWidth] = useState(60); // 'x'
  const totalFence = 240;

  const verticalFences = numCorrals + 1;

  const maxValidWidth = useMemo(() => {
    return totalFence / verticalFences;
  }, [verticalFences, totalFence]);

  const length = totalFence - verticalFences * width;
  const totalArea = width * length;

  const optimalWidth = useMemo(() => {
    return 120 / verticalFences;
  }, [verticalFences]);

  const optimalLength = 120;

  const maxArea = useMemo(() => {
    return optimalWidth * optimalLength;
  }, [optimalWidth, optimalLength]);

  const maxAreaDataByN = useMemo(() => {
    const data = [];
    const P = totalFence;
    for (let n = 1; n <= 10; n++) {
      const verticalFences = n + 1;
      const optimalX = (P / 2) / verticalFences;
      const optimalY = P / 2;
      const maxArea = optimalX * optimalY;
      data.push({
        N: n,
        "Área Máxima": maxArea,
        "Ancho Óptimo (x)": optimalX,
        "Largo Óptimo (y)": optimalY
      });
    }
    return data;
  }, [totalFence]);

  useEffect(() => {
    setWidth(optimalWidth);
  }, [numCorrals, optimalWidth]);

  const chartData = useMemo(() => {
    const data = [];
    const step = maxValidWidth / 40;
    for (let w = 0; w <= maxValidWidth; w += step) {
      const l = totalFence - verticalFences * w;
      const a = w * l;
      data.push({ width: w, area: a });
    }
    data.push({ width: maxValidWidth, area: 0 });
    return data;
  }, [verticalFences, totalFence, maxValidWidth]);

  const scale = 3;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 rounded-xl shadow-lg font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <BookCopy className="w-8 h-8 text-teal-600" />
          Optimizador General de Corrales
        </h1>
        <p className="text-slate-600 mt-2">
          Tienes <strong>{totalFence} yardas</strong> de cerca. Elige cuántos corrales (N) quieres construir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
              <span>Número de Corrales (N): <span className="text-teal-600 font-bold text-lg">{numCorrals}</span></span>
              <span className="text-xs text-slate-400">Total Vallas Verticales: {verticalFences}</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={numCorrals}
              onChange={(e) => setNumCorrals(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
              <span>Ancho de cada sección (x): <span className="text-teal-600 font-bold text-lg">{width.toFixed(1)} yd</span></span>
              <span className="text-xs text-slate-400">Máx: {maxValidWidth.toFixed(1)} yd</span>
            </label>
            <input
              type="range"
              min="0"
              max={maxValidWidth}
              step="0.5"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                <div className="flex items-center gap-2 text-teal-800 mb-1">
                  <Ruler size={18} />
                  <span className="font-semibold">Largo Total (y)</span>
                </div>
                <div className="text-2xl font-bold text-teal-900">{length.toFixed(1)} yd</div>
                <div className="text-xs text-teal-600 mt-1">240 - {verticalFences}x</div>
              </div>

              <div className={`p-4 rounded-lg border transition-all duration-300 ${Math.abs(totalArea - maxArea) < 0.1 ? 'bg-green-100 border-green-300 ring-2 ring-green-400' : 'bg-amber-50 border-amber-100'}`}>
                <div className={`flex items-center gap-2 mb-1 ${Math.abs(totalArea - maxArea) < 0.1 ? 'text-green-800' : 'text-amber-800'}`}>
                  <TrendingUp size={18} />
                  <span className="font-semibold">Área Total</span>
                </div>
                <div className={`text-2xl font-bold ${Math.abs(totalArea - maxArea) < 0.1 ? 'text-green-900' : 'text-amber-900'}`}>
                  {totalArea.toLocaleString(undefined, {maximumFractionDigits: 0})} yd²
                </div>
                {Math.abs(totalArea - maxArea) < 0.1 && (
                  <div className="text-xs text-green-700 font-bold mt-1">¡MÁXIMO ALCANZADO!</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-64">
            <h3 className="text-sm font-semibold text-slate-500 mb-4 text-center">Área vs. Ancho (x) para N={numCorrals}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="width"
                  type="number"
                  domain={[0, maxValidWidth]}
                  label={{ value: 'x', position: 'insideBottom', offset: -5, fontSize: 12 }}
                  tick={{fontSize: 10}}
                  tickFormatter={(val) => val.toFixed(0)}
                />
                <YAxis
                  domain={[0, 'dataMax']}
                  label={{ value: 'Área', angle: -90, position: 'insideLeft', fontSize: 12 }}
                  tickFormatter={(val) => val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toFixed(0)}
                  tick={{fontSize: 10}}
                />
                <Tooltip
                  formatter={(value) => [`${value.toFixed(0)} yd²`, 'Área']}
                  labelFormatter={(label) => `Ancho (x): ${label.toFixed(1)} yd`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="area" stroke="#0d9488" fill="#ccfbf1" />
                <Line type="monotone" dataKey="area" stroke="#0f766e" strokeWidth={3} dot={false} />
                <ReferenceDot x={width} y={totalArea} r={6} fill="#ef4444" stroke="white" strokeWidth={2} />
                <ReferenceDot x={optimalWidth} y={maxArea} r={4} fill="#10b981" stroke="none" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-200 rounded-xl overflow-hidden relative flex flex-col shadow-inner border-4 border-slate-300 min-h-[400px]">
          {/* El Río */}
          <div className="h-16 bg-gradient-to-b from-cyan-500 to-blue-600 w-full relative shadow-md z-10">
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            </div>
            <div className="absolute bottom-2 right-4 text-white font-bold italic flex items-center gap-2 drop-shadow-md">
              <Anchor size={16} /> Río (Sin Cerca)
            </div>
          </div>

          <div className="flex-1 bg-[#d4e6c3] relative flex justify-center pt-0 p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#5f6f50 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div
              className="relative transition-all duration-300 ease-out flex flex-col items-center mt-0"
              style={{
                width: `${length * scale}px`,
                height: `${width * scale}px`,
                maxWidth: '100%',
                minWidth: '10px',
                minHeight: '10px'
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-stone-800 z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-stone-800 z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-800 z-10"></div>

              {Array(numCorrals - 1).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-1 bg-stone-800 z-10"
                  style={{
                    left: `${((i + 1) / numCorrals) * 100}%`
                  }}
                ></div>
              ))}

              <div className={`absolute inset-0 transition-colors duration-500 ${Math.abs(totalArea - maxArea) < 0.1 ? 'bg-emerald-400/50' : 'bg-emerald-500/40'}`}></div>

              <div className="absolute -bottom-6 text-xs font-bold text-stone-700 bg-white/80 px-2 rounded">y = {length.toFixed(0)}</div>
              <div className="absolute -left-8 text-xs font-bold text-stone-700 bg-white/80 px-1 rounded">x = {width.toFixed(0)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h4 className="font-bold mb-4 text-lg text-slate-700 text-center">Tabla de Resultados Óptimos</h4>
        <div className="flex justify-center">
          <div className="text-center bg-teal-50 text-teal-800 p-4 rounded-lg border-l-4 border-teal-500">
            <h5 className="font-bold text-xl">¡El Largo (y) Óptimo es Siempre {optimalLength} yardas!</h5>
            <p className="text-sm">La mitad de la cerca (120 yd) se usa para el lado largo. La otra mitad (120 yd) se divide entre las {verticalFences} vallas verticales (x).</p>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Corrales (N)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Vallas Vert. (N+1)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Ancho Óptimo (x)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Largo Óptimo (y)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Área Máxima</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
            {maxAreaDataByN.map((data) => {
              const isCurrent = data.N === numCorrals;
              return (
                <tr key={data.N} className={`transition-all ${isCurrent ? 'bg-teal-50' : 'hover:bg-slate-50'}`}>
                  <td className={`px-4 py-2 whitespace-nowaclassName text-sm font-medium ${isCurrent ? 'text-teal-700' : 'text-slate-900'}`}>{data.N}</td>
                  <td className={`px-4 py-2 whitespace-nowaclassName text-sm ${isCurrent ? 'text-teal-600' : 'text-slate-600'}`}>{data.N + 1}</td>
                  <td className={`px-4 py-2 whitespace-nowaclassName text-sm ${isCurrent ? 'text-teal-600' : 'text-slate-600'}`}>{`${data["Largo Óptimo (y)"]} / ${data.N + 1} = ${data["Ancho Óptimo (x)"].toFixed(2)} yd`}</td>
                  <td className={`px-4 py-2 whitespace-nowaclassName text-sm ${isCurrent ? 'text-teal-600' : 'text-slate-600'}`}>{data["Largo Óptimo (y)"]} yd</td>
                  <td className={`px-4 py-2 whitespace-nowaclassName text-sm font-bold ${isCurrent ? 'text-teal-700' : 'text-slate-900'}`}>{data["Área Máxima"].toFixed(0)} yd²</td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-8">
          <h4 className="font-bold mb-4 text-xl text-slate-800 text-center">Generalización Matemática (para cualquier Cerca P)</h4>
          <div className="flex flex-col lg:flex-row gap-8 items-start bg-slate-100 p-6 rounded-lg">
            <div className="flex-1 space-y-3">
              <p className="text-sm text-slate-700">Si P es la longitud total de la cerca y N es el número de corrales, las fórmulas generales son:</p>

              <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                <span className="text-xs text-slate-500">Restricción (Cerca)</span>
                <p className="font-mono text-sm text-indigo-600">P = (N+1)x + y</p>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                <span className="text-xs text-slate-500">Función de Área</span>
                <p className="font-mono text-sm text-indigo-600">A(x) = x(P - (N+1)x) = Px - (N+1)x^2</p>
              </div>

              <p className="text-sm text-slate-700 pt-2">Para encontrar el máximo, derivamos A(x) y la igualamos a cero:</p>

              <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
                <span className="text-xs text-slate-500">Derivada</span>
                <p className="font-mono text-sm text-indigo-600">A'(x) = P - 2(N+1)x = 0</p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded text-center">
                <span className="text-xs text-blue-800 font-semibold uppercase">Ancho Óptimo (w)</span>
                <p className="font-mono text-lg font-bold text-blue-900">w = P / (2(N+1))</p>
              </div>

              <p className="text-sm text-slate-700 pt-2">Lo más revelador es encontrar el largo óptimo y usando la mitad de la cerca P:</p>

              <div className="p-4 bg-green-50 border border-green-200 rounded text-center">
                <span className="text-xs text-green-800 font-semibold uppercase">Largo Óptimo (l)</span>
                <p className="font-mono text-lg font-bold text-green-900">l = P / 2</p>
                <p className="text-xs text-green-700">(¡Siempre es la mitad de la cerca total, sin importar N!)</p>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded text-center mt-4">
                <span className="text-xs text-teal-800 font-semibold uppercase">Fórmula del Área Máxima</span>
                <p className="font-mono text-lg font-bold text-teal-900">A = (P^2) / (4(N+1))</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GeneralizedCorralOptimizer;