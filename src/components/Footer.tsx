export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Security
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="/privacy"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Privacy Policy
                </a>
              </li>
              {/* <li>
                <a
                  href="/security"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Security Measures
                </a>
              </li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Trust & Safety
            </h3>
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-green-600">🔒 SSL Secured</span>
              <span className="text-gray-500">|</span>
              <span className="text-blue-600">Google OAuth</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
