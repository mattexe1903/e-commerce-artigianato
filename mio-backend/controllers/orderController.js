const orderService = require('../services/orderService');

const createOrder = async (req, res) => {
    const { addressId } = req.body;
    const userId = req.user.user_id;

    try {
        const result = await orderService.createOrderFromCart(userId, addressId);
        if (result.success) {
            res.status(201).json({ message: 'Ordine creato con successo', orderId: result.orderId });
        } else {
            res.status(400).json({ message: result.error });
        }
    } catch (error) {
        console.error('Errore nella creazione dell\'ordine:', error.message);
        res.status(500).json({ message: 'Errore interno del server' });
    }
}
module.exports = {
    createOrder
};