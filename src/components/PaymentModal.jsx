"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { FaSpinner, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Stripe Public Key লোড করা
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// =========================================
// 1. Checkout Form Component
// =========================================
const CheckoutForm = ({ book, userEmail, closeModal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);

  // কম্পোনেন্ট লোড হলেই ব্যাকএন্ড থেকে Client Secret নিয়ে আসা
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deliveryFee: book.deliveryFee }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [book.deliveryFee]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    const toastId = toast.loading("Processing your payment...");

    // কার্ডের পেমেন্ট কনফার্ম করা
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: userEmail,
        },
      },
    });

    if (error) {
      toast.error(error.message, { id: toastId });
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      // পেমেন্ট সফল হলে ব্যাকএন্ডে ডেলিভারি ডেটা সেভ করা
      const deliveryData = {
        bookId: book._id,
        bookTitle: book.title,
        userEmail: userEmail,
        librarianEmail: book.librarianEmail,
        fee: book.deliveryFee,
        transactionId: paymentIntent.id,
        date: new Date(),
      };

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/deliveries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deliveryData),
        });

        const data = await res.json();
        if (data.success) {
          toast.success("Payment successful! Book requested.", { id: toastId });
          closeModal();
          router.refresh(); // পেজ রিফ্রেশ করে নতুন স্ট্যাটাস দেখানোর জন্য
        }
      } catch (err) {
        toast.error("Payment successful, but failed to save record.", { id: toastId });
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-sm">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#9e2146" },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className={`w-full py-3.5 rounded-xl text-white font-bold text-lg transition-all flex justify-center items-center gap-2 ${
          processing || !stripe || !clientSecret
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#6a46cd] hover:bg-purple-700 shadow-md hover:shadow-lg"
        }`}
      >
        {processing ? (
          <>
            <FaSpinner className="animate-spin" /> Processing...
          </>
        ) : (
          `Pay $${book.deliveryFee}`
        )}
      </button>
    </form>
  );
};

// =========================================
// 2. Main Modal Wrapper Component
// =========================================
export default function PaymentModal({ isOpen, closeModal, book, userEmail }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={closeModal} 
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Secure Checkout</h2>
          <p className="text-gray-500 mt-2 text-sm">
            Delivery fee for <span className="font-semibold text-gray-700">"{book.title}"</span>
          </p>
        </div>

        {/* Elements Provider দিয়ে CheckoutForm কে Wrap করা */}
        <Elements stripe={stripePromise}>
          <CheckoutForm book={book} userEmail={userEmail} closeModal={closeModal} />
        </Elements>
        
      </div>
    </div>
  );
}