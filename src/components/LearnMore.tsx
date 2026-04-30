import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Globe, Calendar, Shield, Users } from 'lucide-react';

export const LearnMore: React.FC<{ onRegister: () => void }> = ({ onRegister }) => {
  const benefits = [
    {
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      title: "Reach Customers Worldwide",
      description: "Expand your practice beyond local boundaries. Connect with clients globally who are seeking your specialized cupping therapy services."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      title: "10X Your Service",
      description: "Leverage our platform's tools to streamline your workflow, allowing you to focus more on patient care and significantly increase your service capacity."
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-500" />,
      title: "Automate Management",
      description: "Say goodbye to manual scheduling and administrative headaches. Our automated booking and management system handles the logistics for you."
    },
    {
      icon: <Shield className="w-8 h-8 text-yellow-500" />,
      title: "Secure & Trusted",
      description: "Join a verified network of professionals. We ensure secure transactions and maintain a trusted environment for both practitioners and clients."
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      title: "Wider Audience",
      description: "Tap into our growing community of users actively looking for holistic health solutions and cupping therapy."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-teal-500" />,
      title: "Simplify Workday",
      description: "Effortlessly manage appointments, client records, and payments all in one centralized, easy-to-use dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-36 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-6"
          >
            Take Your Practice to the Next Level
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Join the world’s leading network to automate your management, reach a wider audience, and simplify your workday effortlessly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-blue-50 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-blue-900 mb-3">What are the requirements to become a practitioner?</h3>
              <p className="text-gray-600">To join Cupping Connect, you must provide valid certification or licensing in your respective field (Acupuncture, Massage, or Al Hijamah), proof of identity, and agree to uphold our professional standards of care and hygiene.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-blue-900 mb-3">How does the payout system work?</h3>
              <p className="text-gray-600">We use Stripe Connect Express for secure, automated payouts. Once you complete a session, your earnings are routed directly to your connected personal or business bank account. You can track all your earnings and payouts directly from your Practitioner Dashboard.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-blue-900 mb-3">What commission does Cupping Connect charge?</h3>
              <p className="text-gray-600">Cupping Connect charges an 8% platform fee. You keep the remaining 92% of your session charge. This fee covers payment processing, platform maintenance, marketing, and the tools provided to manage your practice.</p>
            </motion.div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-900 rounded-3xl p-12 text-center text-white shadow-xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of practitioners who are already growing their practice with Cupping Connect.
          </p>
          <button 
            onClick={onRegister}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-12 py-5 rounded-full transition-all shadow-lg text-xl transform hover:scale-105"
          >
            Register as Provider Now
          </button>
        </motion.div>
      </div>
    </div>
  );
};
