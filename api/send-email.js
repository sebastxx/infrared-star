import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, source, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const data = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>', // Cambiar esto a tu dominio verificado cuando pases a producción
            to: ['delivered@resend.dev'], // Cambiar esto a tu email real para recibir las consultas
            subject: `Nueva consulta de ${name} desde Portafolio`,
            html: `
        <h1>Nueva consulta de contacto</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No especificado'}</p>
        <p><strong>Conocido por:</strong> ${source}</p>
        <hr />
        <h3>Mensaje:</h3>
        <p>${message}</p>
      `,
        });

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error enviando el correo' });
    }
}
