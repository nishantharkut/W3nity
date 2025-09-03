import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FlowItem = {
  title: string;
  steps: string[];
};

const userFlows: FlowItem[] = [
  {
    title: 'Decentralized Workstream',
    steps: [
      'Connect MetaMask',
      'Post Gig',
      'Submit Proposal',
      'Deposit ETH in Escrow',
      'Deliver Work & Release Payment',
    ],
  },
  {
    title: 'Community Event Lifecycle',
    steps: [
      'Create Event',
      'Register',
      'Mint NFT Ticket',
      'View/Manage Attendees',
    ],
  },
  {
    title: 'Communication Workflow',
    steps: [
      'Join Public/Private Channels',
      'Send Messages',
      'Share Files & Media',
    ],
  },
];

const flowVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
};

export const UserJourney = () => {
  const [openFlowIndex, setOpenFlowIndex] = useState<number | null>(null);

  const toggleFlow = (index: number) => {
    setOpenFlowIndex(openFlowIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto p-6 text-white my-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Explore User Journey</h2>
      <div className="space-y-4">
        {userFlows.map((flow, index) => (
          <div
            key={flow.title}
            className="border border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFlow(index)}
              className="w-full flex justify-between items-center px-6 py-4 bg-gray-800 hover:bg-gray-700 transition-colors duration-200 text-left"
            >
              <span className="text-lg font-semibold">{flow.title}</span>
              <motion.span
                animate={{ rotate: openFlowIndex === index ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▶
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {openFlowIndex === index && (
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={flowVariants}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="px-6 py-4 bg-gray-900 space-y-2"
                >
                  {flow.steps.map((step, stepIndex) => (
                    <li
                      key={stepIndex}
                      className="flex items-start space-x-2 text-sm"
                    >
                      <span className="text-green-400 font-bold">{stepIndex + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};
