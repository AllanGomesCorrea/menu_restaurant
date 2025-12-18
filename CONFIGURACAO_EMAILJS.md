# 📧 Configuração do EmailJS - Envio de Confirmações de Reserva

Este guia mostra como configurar o EmailJS para enviar emails de confirmação de reserva automaticamente.

## 🚀 Passo a Passo

### 1️⃣ Criar Conta no EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em **"Sign Up"**
3. Crie sua conta gratuita
4. Confirme seu email

**Plano Gratuito:** 200 emails/mês

---

### 2️⃣ Adicionar Serviço de Email

1. No dashboard, vá em **"Email Services"**
2. Clique em **"Add New Service"**
3. Escolha seu provedor:
   - **Gmail** (recomendado para teste)
   - Outlook
   - Yahoo
   - Outro
4. Conecte sua conta de email
5. Copie o **Service ID** que será gerado

**Exemplo:** `service_abc123`

---

### 3️⃣ Criar Template de Email

1. Vá em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Configure o template:

#### **Nome do Template:**
```
Confirmação de Reserva - A Casa do Porco
```

#### **Para (To Email):**
```
{{customer_email}}
```

#### **Assunto (Subject):**
```
Confirmação de Reserva - A Casa do Porco 🍽️
```

#### **Corpo do Email (Content):**
```html
Olá {{customer_name}},

Sua reserva foi confirmada com sucesso! 🎉

📋 DETALHES DA RESERVA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nome: {{customer_name}}
✉️ E-mail: {{customer_email}}
📞 Telefone: {{customer_phone}}

📅 Data: {{booking_date}}
📆 Dia da Semana: {{booking_day}}
⏰ Horário: {{booking_time}}

🏠 Ambiente: {{booking_environment}}
👥 Número de Pessoas: {{booking_guests}}

📝 Observações: {{booking_observations}}

⚠️ IMPORTANTE:
• Chegue com 10 minutos de antecedência
• Em caso de imprevistos, entre em contato conosco
• Traga um documento de identificação

📞 CONTATO:
Telefone: (11) 3258-2578
E-mail: eventos@acasadoporco.com.br

📍 ENDEREÇO:
R. Araújo, 124 - República
São Paulo - SP

🕐 HORÁRIO DE FUNCIONAMENTO:
Segunda a Sexta: 11h - 23h
Sábados e Domingos: 11h - 00h

Aguardamos você! 🍽️

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A Casa do Porco
Um dos melhores restaurantes de São Paulo
```

4. Clique em **"Save"**
5. Copie o **Template ID**

**Exemplo:** `template_xyz789`

---

### 4️⃣ Obter Public Key

1. Vá em **"Account"** → **"General"**
2. Encontre **"Public Key"**
3. Copie a chave

**Exemplo:** `user_AbCdEfGhIjKlMnOp`

---

### 5️⃣ Configurar as Credenciais no Projeto

#### **Opção A: Variáveis de Ambiente** (Recomendado)

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=user_AbCdEfGhIjKlMnOp
```

#### **Opção B: Editar Diretamente** (Para Desenvolvimento)

Edite o arquivo `src/config/emailjs.ts`:

```typescript
export const emailConfig = {
  serviceId: 'service_abc123',      // Seu Service ID
  templateId: 'template_xyz789',     // Seu Template ID
  publicKey: 'user_AbCdEfGhIjKlMnOp' // Sua Public Key
};
```

**⚠️ IMPORTANTE:** Não commite suas credenciais no Git!

---

### 6️⃣ Testar o Envio

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse: http://localhost:5173/reservas

3. Preencha o formulário de reserva:
   - Nome
   - Email (use seu email real para teste)
   - Telefone
   - Data
   - Horário
   - Ambiente
   - Número de pessoas

4. Clique em **"Confirmar Reserva"**

5. Verifique:
   - Console do navegador (deve mostrar "✅ Email enviado com sucesso!")
   - Sua caixa de entrada (pode levar alguns segundos)
   - Spam/Lixo eletrônico (caso não apareça na caixa principal)

---

## 🔍 Solução de Problemas

### Email não chega:

1. **Verifique o spam/lixo eletrônico**
2. **Confira as credenciais** em `src/config/emailjs.ts`
3. **Teste no dashboard do EmailJS:**
   - Vá em "Email Templates"
   - Clique no seu template
   - Clique em "Test It"
4. **Verifique o console do navegador** para erros

### Erros comuns:

#### ❌ "Service ID is required"
- Você não configurou as credenciais
- Verifique `src/config/emailjs.ts`

#### ❌ "Template ID is required"
- O template não foi criado ou ID está errado

#### ❌ "Public Key is required"
- A Public Key não foi configurada

#### ❌ "Failed to send email"
- Verifique se o serviço de email está ativo no EmailJS
- Teste o template manualmente no dashboard

---

## 📊 Monitoramento

No dashboard do EmailJS você pode:
- Ver todos os emails enviados
- Taxa de entrega
- Erros e falhas
- Uso do plano (emails restantes)

Acesse: https://dashboard.emailjs.com/

---

## 🎯 Próximos Passos (Opcional)

### Enviar cópia para o restaurante:

Adicione um segundo template no EmailJS para notificar o restaurante:

```typescript
// Após enviar para o cliente
await emailjs.send(
  emailConfig.serviceId,
  'template_restaurante', // Novo template
  {
    ...emailData,
    to_email: 'eventos@acasadoporco.com.br'
  },
  emailConfig.publicKey
);
```

### Personalizar o email:

- Adicione o logo do restaurante
- Formate com HTML/CSS
- Adicione botões de ação
- Inclua um código de confirmação

---

## 📝 Variáveis do Template

O sistema envia estas variáveis para o EmailJS:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `customer_name` | Nome do cliente | João Silva |
| `customer_email` | Email do cliente | joao@email.com |
| `customer_phone` | Telefone do cliente | (11) 98765-4321 |
| `booking_date` | Data da reserva | 20 de dezembro de 2025 |
| `booking_day` | Dia da semana | sábado |
| `booking_time` | Horário | 19:00 |
| `booking_environment` | Ambiente escolhido | Salão (Ambiente Interno) |
| `booking_guests` | Número de pessoas | 2 pessoas |
| `booking_observations` | Observações | Nenhuma observação |

---

## ✅ Pronto!

Agora seu sistema de reservas envia emails de confirmação automaticamente! 🎉

**Dúvidas?** Consulte a documentação oficial: https://www.emailjs.com/docs/

