import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Shield, CreditCard, Lock } from 'lucide-react';

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const paymentUrl = searchParams.get('url');

  useEffect(() => {
    if (!paymentUrl) {
      navigate('/');
    }
  }, [paymentUrl, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <img src="/aceso.svg" alt="Aceso Logo" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secure Payment</h1>
          <p className="text-gray-600">Complete your payment securely with Pesapal</p>
        </div>

        {/* Security Badges */}
        <div className="flex justify-center gap-6 mb-6 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-5 w-5 text-green-600" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lock className="h-5 w-5 text-green-600" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="h-5 w-5 text-green-600" />
            <span>Multiple Payment Options</span>
          </div>
        </div>

        {/* Payment Frame Container */}
        <Card className="shadow-2xl border-2 border-green-100 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Pesapal Secure Payment Gateway
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative">
            {/* Loading Overlay */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading secure payment form...</p>
                </div>
              </div>
            )}

            {/* Pesapal iFrame */}
            <iframe
              src={paymentUrl || ''}
              width="100%"
              height="700px"
              scrolling="auto"
              frameBorder="0"
              onLoad={() => setLoading(false)}
              className="rounded-b-lg"
              title="Pesapal Payment"
            />
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600 animate-fade-in">
          <p className="mb-2">
            Your payment is processed securely by Pesapal. We never store your card details.
          </p>
          <p className="text-xs text-gray-500">
            Powered by Pesapal • Aceso Health Solutions © 2025
          </p>
        </div>

        {/* Accepted Payment Methods */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-sm text-gray-600 mb-3">We Accept:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">M-Pesa</div>
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">Visa</div>
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">Mastercard</div>
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm border">Airtel Money</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
