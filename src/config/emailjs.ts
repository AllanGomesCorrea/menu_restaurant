/**
 * Configuração do EmailJS
 * 
 * Para configurar:
 * 1. Acesse https://www.emailjs.com/
 * 2. Crie uma conta gratuita (200 emails/mês)
 * 3. Adicione um serviço de email (Gmail, Outlook, etc.)
 * 4. Crie um template de email
 * 5. Substitua as variáveis abaixo pelas suas credenciais
 * 
 * IMPORTANTE: Em produção, use variáveis de ambiente:
 * - VITE_EMAILJS_SERVICE_ID
 * - VITE_EMAILJS_TEMPLATE_ID
 * - VITE_EMAILJS_PUBLIC_KEY
 */

export const emailConfig = {
  // Credenciais do EmailJS - carregadas do arquivo .env.local
  // IMPORTANTE: Vite só expõe variáveis que começam com VITE_
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_id',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_id',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_key',
};

/**
 * Template de exemplo para configurar no EmailJS:
 * 
 * Nome do Template: Confirmação de Reserva - A Casa do Porco
 * 
 * Assunto: Confirmação de Reserva - A Casa do Porco 🍽️
 * 
 * Corpo do Email:
 * ───────────────────────────────────────────────────
 * Olá {{customer_name}},
 * 
 * Sua reserva foi confirmada com sucesso! 🎉
 * 
 * 📋 DETALHES DA RESERVA:
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 👤 Nome: {{customer_name}}
 * ✉️ E-mail: {{customer_email}}
 * 📞 Telefone: {{customer_phone}}
 * 
 * 📅 Data: {{booking_date}}
 * 📆 Dia da Semana: {{booking_day}}
 * ⏰ Horário: {{booking_time}}
 * 
 * 🏠 Ambiente: {{booking_environment}}
 * 👥 Número de Pessoas: {{booking_guests}}
 * 
 * {{#booking_observations}}
 * 📝 Observações: {{booking_observations}}
 * {{/booking_observations}}
 * 
 * ⚠️ IMPORTANTE:
 * • Chegue com 10 minutos de antecedência
 * • Em caso de imprevistos, entre em contato conosco
 * • Traga um documento de identificação
 * 
 * 📞 CONTATO:
 * Telefone: (11) 3258-2578
 * E-mail: eventos@acasadoporco.com.br
 * 
 * 📍 ENDEREÇO:
 * R. Araújo, 124 - República
 * São Paulo - SP
 * 
 * 🕐 HORÁRIO DE FUNCIONAMENTO:
 * Segunda a Sexta: 11h - 23h
 * Sábados e Domingos: 11h - 00h
 * 
 * Aguardamos você! 🍽️
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * A Casa do Porco
 * Um dos melhores restaurantes de São Paulo
 * ───────────────────────────────────────────────────
 * 
 * Variáveis do Template:
 * - customer_name: Nome do cliente
 * - customer_email: Email do cliente
 * - customer_phone: Telefone do cliente
 * - booking_date: Data da reserva formatada
 * - booking_day: Dia da semana
 * - booking_time: Horário da reserva
 * - booking_environment: Ambiente escolhido
 * - booking_guests: Número de pessoas
 * - booking_observations: Observações (opcional)
 */

