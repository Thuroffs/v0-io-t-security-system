import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const estadoRecibido = body.status; // "abierto" o "cerrado"

    // Conectamos con Supabase usando tu LLAVE MAESTRA (Service Role)
    // Esto permite escribir en la base de datos sin iniciar sesión
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    // Insertamos el evento en la tabla 'sensor_events'
    const { error } = await supabase
      .from('sensor_events')
      .insert([
        { status: estadoRecibido }
      ]);

    if (error) {
      console.error("Error Supabase:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, saved: estadoRecibido });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error procesando solicitud' }, { status: 500 });
  }
}
