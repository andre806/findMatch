'use client'
import PaymentForm from "@/app/components/payment/paymentForm"
import StripeProvider from "@/pages/api/payment/StripeProvider"
import RequireAuth from "@/app/services/VerificaLogado"
export default function Payment() {

    return(
        <div>
            <RequireAuth />
               <StripeProvider>
                <PaymentForm />
            </StripeProvider>
         
        </div>
    )
}