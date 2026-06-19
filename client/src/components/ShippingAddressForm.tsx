import type { ShippingAddress } from '../types';

interface Props {
  value: ShippingAddress;
  onChange: (field: keyof ShippingAddress, value: string) => void;
  compact?: boolean;
}

export default function ShippingAddressForm({ value, onChange, compact }: Props) {
  const field = (name: keyof ShippingAddress, label: string, spanFull = false) => (
    <div className={spanFull ? 'sm:col-span-2' : ''}>
      <label className="block text-sm font-medium mb-1 text-dark-700">{label}</label>
      <input
        name={name}
        value={value[name]}
        onChange={(e) => onChange(name, e.target.value)}
        required
        className="input-field"
      />
    </div>
  );

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <h3 className="font-bold text-dark-900">Delivery Address</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field('fullName', 'Full Name', true)}
        {field('street', 'Street Address', true)}
        {field('city', 'City')}
        {field('state', 'State')}
        {field('zipCode', 'PIN Code')}
        {field('country', 'Country')}
        {field('phone', 'Phone Number', true)}
      </div>
    </div>
  );
}
