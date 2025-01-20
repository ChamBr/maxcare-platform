import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Brush, Wrench, Percent, CheckCircle } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-primary block mb-2">Countertop</span>
                <span className="text-secondary">Insurance</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Protect your investment with our comprehensive warranty coverage for just
                <span className="text-primary font-bold text-2xl mx-2">$499</span>
                per year
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <CheckCircle className="text-primary h-6 w-6" />
                  <span className="text-gray-700">01 Caulcking/year</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <Brush className="text-primary h-6 w-6" />
                  <span className="text-gray-700">01 Cleaning/year</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <Shield className="text-primary h-6 w-6" />
                  <span className="text-gray-700">01 Sealant/year</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <Wrench className="text-primary h-6 w-6" />
                  <span className="text-gray-700">02 Small Repairs/year</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100 md:col-span-2">
                  <Percent className="text-primary h-6 w-6" />
                  <span className="text-gray-700">10% discount on new estimates</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/register")}
                  className="text-lg px-8"
                >
                  Get Protected Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/services")}
                  className="text-lg px-8"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 relative">
              <div className="relative w-full aspect-square rounded-full overflow-hidden border-8 border-white shadow-xl">
                <img
                  src="/lovable-uploads/c0209ddc-90f7-4b15-8d66-86dae7ebb3cc.png"
                  alt="Countertop Insurance"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Price Badge */}
              <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-6 shadow-lg">
                <div className="text-center">
                  <span className="block text-sm">Starting at</span>
                  <span className="block text-2xl font-bold">$499</span>
                  <span className="block text-xs">per year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;