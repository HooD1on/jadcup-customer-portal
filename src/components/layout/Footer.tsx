export function Footer() {
  return (
    <footer className="bg-jade-950 text-jade-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-jade-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Jadcup</span>
            </div>
            <p className="text-sm text-jade-300 leading-relaxed">
              Premium custom packaging solutions for New Zealand businesses.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Products</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><span className="text-sm text-jade-300 hover:text-white cursor-pointer">Custom Cups</span></li>
              <li><span className="text-sm text-jade-300 hover:text-white cursor-pointer">Food Packaging</span></li>
              <li><span className="text-sm text-jade-300 hover:text-white cursor-pointer">Corrugated Boxes</span></li>
              <li><span className="text-sm text-jade-300 hover:text-white cursor-pointer">Accessories</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><span className="text-sm text-jade-300 hover:text-white cursor-pointer">About Us</span></li>
              <li><span className="text-sm text-jade-300 hover:text-white cursor-pointer">Contact Sales</span></li>
              <li><span className="text-sm text-jade-300 hover:text-white cursor-pointer">Customer Portal</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li className="text-sm text-jade-300">Auckland, New Zealand</li>
              <li className="text-sm text-jade-300">sales@jadcup.co.nz</li>
              <li className="text-sm text-jade-300">09 555 0100</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-jade-800 mt-10 pt-6 text-center">
          <p className="text-xs text-jade-400">&copy; 2026 Jadcup. All rights reserved. This is a prototype.</p>
        </div>
      </div>
    </footer>
  );
}
