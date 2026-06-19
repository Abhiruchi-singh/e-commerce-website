import { FiTruck, FiSmartphone, FiCreditCard } from 'react-icons/fi';

export type PaymentMethod = 'COD' | 'UPI' | 'Card';

interface PaymentOption {
  value: PaymentMethod;
  label: string;
  desc: string;
  icon: typeof FiTruck;
}

const ALL_OPTIONS: PaymentOption[] = [
  { value: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives at your doorstep', icon: FiTruck },
  { value: 'UPI', label: 'UPI Payment', desc: 'Google Pay, PhonePe, Paytm & all UPI apps', icon: FiSmartphone },
  { value: 'Card', label: 'Card / Net Banking', desc: 'Debit, Credit cards & Net Banking', icon: FiCreditCard },
];

interface Props {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  razorpayEnabled: boolean;
}

export default function PaymentMethodSelector({ value, onChange, razorpayEnabled }: Props) {
  const options = razorpayEnabled ? ALL_OPTIONS : ALL_OPTIONS.filter((o) => o.value === 'COD');

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-dark-900">Payment Method</h3>
      {options.map((method) => {
        const Icon = method.icon;
        const selected = value === method.value;
        return (
          <label
            key={method.value}
            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selected ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-dark-200 hover:bg-dark-50'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.value}
              checked={selected}
              onChange={() => onChange(method.value)}
              className="accent-primary-600 mt-1"
            />
            <Icon className={`mt-0.5 shrink-0 ${selected ? 'text-primary-600' : 'text-dark-400'}`} size={20} />
            <div>
              <span className="font-medium block text-dark-900">{method.label}</span>
              <span className="text-sm text-dark-500">{method.desc}</span>
            </div>
          </label>
        );
      })}
      {!razorpayEnabled && (
        <p className="text-xs text-dark-500 bg-dark-50 rounded-lg p-3">
          Online payment (UPI / Card) ke liye server mein Razorpay keys add karein. Abhi sirf Cash on Delivery available hai.
        </p>
      )}
    </div>
  );
}
