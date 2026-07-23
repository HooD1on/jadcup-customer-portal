import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Truck, Clock, CreditCard, ShieldCheck, Package } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { mockProductHighlights } from '../../mocks/data';

const benefits = [
  {
    icon: ShoppingBagIcon,
    title: 'View Your Orders',
    description: 'See order status and history for all your Jadcup orders in one place.',
  },
  {
    icon: CreditCardIcon,
    title: 'Account Balance',
    description: 'Check your current account balance at a glance.',
  },
  {
    icon: TruckIcon,
    title: 'Delivery Information',
    description: 'View delivery details and dates for your orders.',
  },
  {
    icon: ShieldIcon,
    title: 'Secure Access',
    description: 'Your account data is protected and accessible only to you.',
  },
];

function ShoppingBagIcon() { return <Package className="text-jade-600" size={28} />; }
function CreditCardIcon() { return <CreditCard className="text-jade-600" size={28} />; }
function TruckIcon() { return <Truck className="text-jade-600" size={28} />; }
function ShieldIcon() { return <ShieldCheck className="text-jade-600" size={28} />; }

export function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="bg-gradient-to-br from-jade-900 via-jade-800 to-jade-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6">
              Premium Custom Packaging for Your Business
            </h1>
            <p className="text-lg sm:text-xl text-jade-200 mb-8 leading-relaxed max-w-2xl">
              From branded cups to corrugated shipping boxes, Jadcup delivers high-quality
              packaging solutions tailored to New Zealand businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/apply">
                <Button size="lg" variant="light" className="w-full sm:w-auto">
                  Apply for an Account
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-jade-400 text-white hover:bg-jade-800 active:bg-jade-700">
                  Customer Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dev-only preview entry */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-sm text-amber-800">
            <span className="font-mono text-xs bg-amber-100 border border-amber-300 rounded px-1.5 py-0.5 mr-2">DEV</span>
            Preview the authenticated customer experience with mock data.
          </p>
          <Link to="/dashboard" className="no-underline">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white">
              Preview Customer Portal <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>

      {/* About Jadcup */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Your Trusted Packaging Partner
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Jadcup has been providing custom packaging solutions to businesses across New Zealand.
              Whether you need branded paper cups for your cafe, food-grade containers for your
              restaurant, or custom corrugated boxes for shipping, we deliver quality products
              on time, every time.
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-jade-600" /> Custom Branding</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-jade-600" /> Fast Turnaround</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-jade-600" /> NZ Wide Delivery</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-jade-600" /> Competitive Pricing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Our Product Range
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Quality packaging products designed and manufactured to your specifications.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProductHighlights.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-(--radius-card) shadow-(--shadow-card) overflow-hidden hover:shadow-(--shadow-card-hover) transition-shadow"
              >
                <div className="aspect-[3/2] bg-jade-50 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <Package className="text-jade-300" size={48} />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Benefits */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Customer Portal Benefits
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Manage your Jadcup account online with our self-service customer portal.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center p-6 rounded-(--radius-card) bg-jade-50/50 border border-jade-100">
                <div className="w-14 h-14 rounded-full bg-jade-100 flex items-center justify-center mx-auto mb-4">
                  <Icon />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-jade-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-jade-200 max-w-xl mx-auto mb-8">
            Contact our sales team to discuss your packaging requirements, or apply for a
            customer account to start ordering online.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/apply">
              <Button size="lg" variant="light" className="w-full sm:w-auto">
                Apply for an Account
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-jade-400 text-white hover:bg-jade-700 active:bg-jade-600">
              <Clock size={18} />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
