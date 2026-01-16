"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Conexión a Supabase (usará las claves que pondremos en el paso 3)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const [estado, setEstado] = useState<string>("Esperando datos...");
  const [fecha, setFecha] = useState<string>("");

  // Función que va a buscar el dato a la base de datos
  const consultarEstado = async () => {
    try {
      // Pide el último registro de la tabla 'sensor_events'
      const { data, error } = await supabase
        .from("sensor_events")
        .select("*")
        .order("created_at", { ascending: false }) // Ordenar por fecha (el más nuevo primero)
        .limit(1); // Traer solo 1

      if (data && data.length > 0) {
        setEstado(data[0].status); 
        // Formatear la fecha para que se lea bien
        const fechaLegible = new Date(data[0].created_at).toLocaleString('es-CL');
        setFecha(fechaLegible);
      }
    } catch (err) {
      console.error("Error conectando:", err);
    }
  };

  // Esto hace que la página se actualice sola cada 2 segundos
  useEffect(() => {
    consultarEstado(); // Ejecutar al abrir
    const intervalo = setInterval(consultarEstado, 2000); // Repetir cada 2 seg
    return () => clearInterval(intervalo);
  }, []);

  // Definir colores: Rojo si está 'abierto', Verde si está 'cerrado'
  const esAlerta = estado.toLowerCase() === "abierto";
  const colorFondo = esAlerta ? "bg-red-600" : "bg-green-600";
  const texto = esAlerta ? "¡ALERTA! PUERTA ABIERTA" : "SISTEMA SEGURO";

  return (
    <main className={`flex min-h-screen flex-col items-center justify-center p-10 transition-colors duration-500 ${colorFondo}`}>
      
      {/* Tarjeta Central */}
      <div className="bg-white/90 backdrop-blur rounded-3xl p-10 shadow-2xl text-center max-w-md w-full border-4 border-white/50">
        
        <h2 className="text-gray-500 text-sm font-bold tracking-widest uppercase mb-4">
          Estado del Sensor IoT
        </h2>

        <div className="mb-8">
           <h1 className={`text-4xl font-black ${esAlerta ? 'text-red-600' : 'text-green-700'}`}>
             {texto}
           </h1>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-600 text-sm">Último evento registrado:</p>
          <p className="text-xl font-mono font-bold text-gray-800 mt-1">
            {fecha || "--:--"}
          </p>
        </div>

      </div>

      <div className="mt-10 text-white/80 text-sm font-mono">
        Conectado a Supabase + ESP32 S3
      </div>

    </main>
  );
}
