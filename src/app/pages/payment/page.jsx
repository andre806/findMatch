'use client'
import PaymentForm from "@/app/components/payment/paymentForm"
import StripeProvider from "@/pages/api/payment/StripeProvider"
export default function Payment() {

    return(
        <div>
     
               <StripeProvider>
                <PaymentForm />
            </StripeProvider>
         
        </div>
    )
}