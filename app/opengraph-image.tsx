import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Preview 1200x630 para compartir el link por WhatsApp / redes.
export const alt = '¡Caso Resuelto! · Detectives de 5.º B — Centro de Formación Integral';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'nodejs';

async function leerComoDataUrl(archivo: string, mime: string): Promise<string | null> {
    try {
        const datos = await readFile(join(process.cwd(), 'public', archivo));
        return `data:${mime};base64,${datos.toString('base64')}`;
    } catch {
        return null;
    }
}

export default async function OpengraphImage() {
    const [foto, sello] = await Promise.all([
        leerComoDataUrl('foto.jpg', 'image/jpeg'),
        leerComoDataUrl('estampilla.png', 'image/png'),
    ]);

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    padding: '40px',
                    background: 'linear-gradient(135deg, #fff7ec, #f2d9c2)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        height: '100%',
                        background: '#fffdf9',
                        border: '3px solid #edd5be',
                        borderRadius: '32px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '520px',
                            height: '100%',
                            background: '#f6ebd9',
                            padding: '28px',
                        }}
                    >
                        {foto ? (
                            <div
                                style={{
                                    display: 'flex',
                                    width: '464px',
                                    height: '464px',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    border: '8px solid #ffffff',
                                }}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={foto}
                                    alt=""
                                    width={448}
                                    height={448}
                                    style={{ width: '448px', height: '448px', objectFit: 'cover' }}
                                />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', fontSize: '48px', fontWeight: 700, color: '#9c511e' }}>
                                5.º B
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            flex: 1,
                            gap: '18px',
                            padding: '44px 44px 44px 36px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignSelf: 'flex-start',
                                fontSize: '20px',
                                fontWeight: 700,
                                letterSpacing: '3px',
                                color: '#9c511e',
                                background: '#faecd9',
                                border: '2px dashed #dca574',
                                padding: '8px 18px',
                                borderRadius: '999px',
                            }}
                        >
                            INFORME DE LOS DETECTIVES · 5.º B
                        </div>

                        <div style={{ display: 'flex', fontSize: '72px', fontWeight: 800, color: '#d9480f', lineHeight: 1.05 }}>
                            ¡CASO RESUELTO!
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                fontSize: '28px',
                                fontWeight: 600,
                                color: '#3b2210',
                                background: '#fff4e6',
                                border: '3px dashed #f59f00',
                                borderRadius: '16px',
                                padding: '16px 20px',
                                lineHeight: 1.3,
                            }}
                        >
                            ¡Lo lograron! Descubrieron todos los misterios y encontraron la salida.
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: '30px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    background: 'linear-gradient(135deg, #f77f00, #d62828)',
                                    padding: '14px 30px',
                                    borderRadius: '999px',
                                }}
                            >
                                ¡MISIÓN CUMPLIDA!
                            </div>
                            {sello ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={sello} alt="" width={80} height={108} style={{ width: '80px', height: '108px', objectFit: 'contain' }} />
                            ) : null}
                        </div>

                        <div style={{ display: 'flex', fontSize: '26px', fontWeight: 700, color: '#c92a2a' }}>
                            Centro de Formación Integral · ¡5.º B!
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
