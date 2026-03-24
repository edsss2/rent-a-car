const express = require('express');
const cors = require('cors');
const { DefaultAzureCredential } = require('@azure/identity');
const { ServiceBusClient } = require('@azure/service-bus');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/locacao', async (req, res) => {
    const { nome, email, modelo, ano, tempoAluguel } = req.body;
    const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;

    const mensagem = {
        nome,
        email,
        veiculo: { modelo, ano, tempoAluguel },
        data: new Date().toISOString()
    }

    try {
        const credential = new DefaultAzureCredential();
        const queueName = "fila-locacao-auto";
        const sbClient = new ServiceBusClient(connectionString);
        const sender = sbClient.createSender(queueName);
        const message = {
            body: mensagem,
            contentType: "application/json",
            label: "locacao"
        };

        await sender.sendMessages(message);
        await sender.close();
        await sbClient.close();

        res.status(201).json({ message: 'Locação de veículo enviada para a fila com sucesso!' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Erro ao enviar mensagem para o Service Bus' });
    }
    
});

app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
});
