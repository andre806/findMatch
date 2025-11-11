import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { RadioGroup, FormControlLabel, Radio, Card, CardContent, Typography, Button, Box } from '@mui/material';

const plans = [
    {
        key: 'premium',
        name: 'Premium',
        price: 1000,
        priceText: 'R$10',
        features: [
            'Curtidas ilimitadas',
            '3 SuperLikes ao dia',
            '2 direitos a chat ao dia',
            '3 rewinds ao dia',
            'Ver quem curtiu'
        ]
    },
    {
        key: 'gold',
        name: 'Gold',
        price: 4000,
        priceText: 'R$40',
        features: [
            'Curtidas ilimitadas',
            '10 SuperLikes ao dia',
            '10 chats ao dia',
            '5 rewinds ao dia',
            'Remoção de anúncios',
            'Ver quem curtiu'
        ]
    },
    {
        key: 'gigachad',
        name: 'Gigachad',
        price: 5000,
        priceText: 'R$50',
        features: [
            'Aparecer mais vezes para os perfis',
            'SuperLikes infinitos',
            'Chats infinitos',
            'Rewinds infinitos',
            'Remoção de anúncios',
            'Curtidas ilimitadas',
            'Ver quem curtiu',
            'Mais chances de dar match'
        ]
    }
];

export default function PaymentForm() {
    const url = process.env.NEXT_PUBLIC_URL;
    const elements = useElements();
    const stripe = useStripe();
    const [selectedPlan, setSelectedPlan] = useState('premium');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const element = elements.getElement(CardElement);
        const result = await stripe.createToken(element);
        if (result.error) {
            alert(result.error.message);
            return;
        }
        if (!result.token) {
            alert("Token não gerado. Verifique os dados do cartão.");
            return;
        }
        const planObj = plans.find(p => p.key === selectedPlan);
        const res = await fetch(`${url}payment/pagar`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ token: result.token.id, amount: planObj.price }),
            credentials:"include"
        })
        const data = await res.json();
        alert(data)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom>Escolha seu plano</Typography>
            <RadioGroup
                value={selectedPlan}
                onChange={e => setSelectedPlan(e.target.value)}
                sx={{ flexDirection: 'row', mb: 2 }}
            >
                {plans.map(plan => (
                    <Box key={plan.key} sx={{ mr: 2 }}>
                        <Card variant="outlined" sx={{ minWidth: 220 }}>
                            <CardContent>
                                <FormControlLabel
                                    value={plan.key}
                                    control={<Radio />}
                                    label={
                                        <Box>
                                            <Typography variant="h6">{plan.name} <span style={{ fontWeight: 400 }}>({plan.priceText})</span></Typography>
                                            <ul style={{ margin: 0, paddingLeft: 18 }}>
                                                {plan.features.map((f, i) => (
                                                    <li key={i} style={{ fontSize: 13 }}>{f}</li>
                                                ))}
                                            </ul>
                                        </Box>
                                    }
                                />
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </RadioGroup>
            <Typography variant="subtitle1" gutterBottom>Dados do cartão</Typography>
            <Box sx={{ mb: 2, p: 1, border: '1px solid #ccc', borderRadius: 2 }}>
                <CardElement />
            </Box>
            <Button type="submit" variant="contained" color="primary">
                Pagar {plans.find(p => p.key === selectedPlan).priceText}
            </Button>
        </form>
    )
}