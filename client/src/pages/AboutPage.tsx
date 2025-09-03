import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { UserJourney } from './UserJourney';

const About = () => {
    const [activeFeature, setActiveFeature] = useState(0);
  
    // Features data
    const features = [
        {
        title: "Freelancing Marketplace",
        description: "Say goodbye to freelance uncertainty. Our platform makes it simple to post and browse gigs, submit proposals, and track their status. All payments are secured with an on-chain escrow smart contract, guaranteeing you get paid for your work. It's the secure, transparent way to freelance.",
        icon: "👩‍💻"
        },
        {
        title: "Event Management",
        description: "Manage your events effortlessly with our platform. You can create and manage events, allowing attendees to register and mint NFT tickets for secure, verifiable admission. The intuitive admin dashboard and reminders ensure you have complete control and your event runs smoothly, from start to finish.",
        icon: "📅"
        },
        {
        title: "Real-time Community Chat",
        description: "Effortlessly communicate with your team, community, or friends. Our platform provides the flexibility of both public and private channels, as well as 1:1 direct messaging for more personal conversations. You can easily share files and images, and with a comprehensive media sharing and history feature, you'll never lose a link or an important photo again.",
        icon: "💬"
        },
        {
        title: "Web3 Integration",
        description: "Easily manage event ticketing with our integrated system. Users can securely log in via MetaMask wallet, and payments for tickets are handled transparently through an Escrow.sol smart contract. Once a purchase is complete, an ERC-721 token is minted, serving as a unique, verifiable, and non-fungible digital ticket.",
        icon: "🌐"
        }
    ];

    // Team data  (Random data)
    const teamMembers = [
        {
        name: "Alex Johnson",
        role: "CEO & Founder",
        bio: "Blockchain pioneer with 10+ years in decentralized systems",
        avatar: "👨‍💼"
        },
        {
        name: "Sam Chen",
        role: "CTO",
        bio: "Former Ethereum core developer and smart contract architect",
        avatar: "👩‍💻"
        },
        {
        name: "Taylor Williams",
        role: "Head of Community",
        bio: "Built Web3 communities with 100K+ members across multiple platforms",
        avatar: "👨‍🎤"
        }
    ];

    // Stats data (Random data)
    const stats = [
        { value: "50K+", label: "Active Users" },
        { value: "12K+", label: "Projects Completed" },
        { value: "200+", label: "Community Events" },
        { value: "30+", label: "Blockchains Supported" }
    ];

    // Auto-rotate features
    useEffect(() => {
        const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [features.length]);

    return (
    <>
        <div className="min-h-screen text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            W3nity <span className="text-indigo-400"> - Web3 + Unity</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            The unified platform where startups, developers, and communities connect, collaborate, and transact seamlessly - <br /> <span className='text-indigo-400 font-bold'>on-chain</span> or <span className='text-indigo-400 font-bold'>off-chain</span>.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
              <Link to="/community">Join Our Community</Link>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-indigo-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-indigo-400">{stat.value}</div>
                <div className="text-gray-300 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 mb-4">
                We're building the infrastructure for the decentralized future of work. Our platform eliminates barriers between talent, opportunities, and communities in the Web3 ecosystem.
              </p>
              <p className="text-lg text-gray-300">
                By integrating freelancing, events, and community engagement in one seamless experience, we're enabling the next generation of decentralized collaboration.
              </p>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="bg-gradient-to-br from-indigo-700/30 to-purple-700/30 rounded-2xl p-8 border border-indigo-500/30">
                <div className="text-5xl mb-4">🌐</div>
                <h3 className="text-xl font-bold mb-3">Decentralized by Design</h3>
                <p className="text-gray-300">
                  Our platform leverages blockchain technology to provide transparent, secure, and censorship-resistant collaboration tools.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              W3nity Features
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Everything you need to collaborate in the Web3 ecosystem
            </motion.p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                      activeFeature === index 
                        ? 'bg-indigo-700/40 border border-indigo-500' 
                        : 'bg-gray-800/50 hover:bg-gray-700/50'
                    }`}
                    onClick={() => setActiveFeature(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{feature.icon}</div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </div>
                    {/* <p className="mt-3 text-gray-300">{feature.description}</p> */}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="md:w-1/2 flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full max-w-md h-80">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0 bg-gradient-to-br from-indigo-700/30 to-purple-700/30 rounded-2xl p-8 border border-indigo-500/30 flex flex-col items-center justify-center text-center"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: activeFeature === index ? 1 : 0,
                      scale: activeFeature === index ? 1 : 0.95
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="text-6xl mb-4">{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              How It Works
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Seamlessly transition between on-chain and off-chain collaboration
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Your Wallet",
                description: "Link your Web3 wallet to access all platform features with a single identity."
              },
              {
                step: "02",
                title: "Create or Join",
                description: "Start a project, host an event, or join communities that match your interests."
              },
              {
                step: "03",
                title: "Collaborate & Transact",
                description: "Work together seamlessly with integrated tools for communication and payments."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-indigo-900/20 rounded-2xl p-8 border border-indigo-500/20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-indigo-400 mb-4">{step.step}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}
      
      {/* Explore user journey */}
      <UserJourney />

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Meet Our Team
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              The visionaries building the future of Web3 collaboration
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-indigo-900/20 rounded-2xl p-8 border border-indigo-500/20 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="text-6xl mx-auto mb-4">{member.avatar}</div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <div className="text-indigo-400 font-medium mb-3">{member.role}</div>
                <p className="text-gray-300">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Join the <span className="text-indigo-400">Web3 Revolution</span>?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Connect, collaborate, and transact seamlessly in the decentralized ecosystem.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 mr-4">
              <Link to="/register">Get Started</Link>
            </button>
          </motion.div>
        </div>
      </section>
    </div>
    </>
    )
}

export default About;