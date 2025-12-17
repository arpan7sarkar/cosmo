export function Footer() {
  return (
    <footer className="bg-cosmic-blue border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-starlight-white">
          <div>
            <h3 className="text-lg font-bold mb-4">Learn-Flow</h3>
            <p className="text-sm text-gray-400">
              Transforming the way you study with AI-powered planning and tutoring.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">Discord</a></li>
              <li><a href="#" className="hover:text-white">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Learn-Flow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
