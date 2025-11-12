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
            credentials: "include"
        })
        const data = await res.json();
        alert(data)
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "linear-gradient(180deg,#f8e4e6 0%, #cbe7e7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 8
            }}
        >
            <Box
                sx={{
                    bgcolor: "#fff",
                    borderRadius: 6,
                    boxShadow: 8,
                    p: { xs: 3, sm: 5 },
                    maxWidth: 520,
                    width: "100%"
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: "#9933ff", mb: 4, textAlign: "center" }}>
                        Escolha seu plano
                    </Typography>
                    <RadioGroup
                        value={selectedPlan}
                        onChange={e => setSelectedPlan(e.target.value)}
                        sx={{ flexDirection: 'column', gap: 3, mb: 4, alignItems: "center" }}
                    >
                        {plans.map(plan => (
                            <Card
                                key={plan.key}
                                variant="outlined"
                                sx={{
                                    minWidth: 220,
                                    borderRadius: 4,
                                    boxShadow: selectedPlan === plan.key ? 6 : 2,
                                    borderColor: selectedPlan === plan.key ? "#9933ff" : "#ccc",
                                    bgcolor: selectedPlan === plan.key ? "#f8e4e6" : "#fafafa",
                                    transition: "box-shadow 0.2s, border-color 0.2s"
                                }}
                            >
                                <CardContent>
                                    <FormControlLabel
                                        value={plan.key}
                                        control={<Radio sx={{ color: "#9933ff" }} />}
                                        label={
                                            <Box>
                                                <Typography variant="h6" sx={{ color: "#9933ff", fontWeight: 700 }}>
                                                    {plan.name} <span style={{ fontWeight: 400 }}>({plan.priceText})</span>
                                                </Typography>
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
                        ))}
                    </RadioGroup>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700, color: "#9933ff" }}>
                        Dados do cartão
                    </Typography>
                    <Box sx={{
                        mb: 4,
                        p: 2,
                        border: '2px solid #9933ff',
                        borderRadius: 3,
                        bgcolor: "#fafafa"
                    }}>
                        <CardElement />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="large"
                        sx={{
                            borderRadius: 3,
                            fontWeight: 700,
                            fontSize: 18,
                            px: 4,
                            py: 2,
                            boxShadow: 3,
                            textTransform: "none",
                            width: "100%"
                        }}
                    >
                        Pagar {plans.find(p => p.key === selectedPlan).priceText}
                    </Button>
                </form>
            </Box>
        </Box>
    );
}