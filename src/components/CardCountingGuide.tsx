import React, { useState } from 'react';
import { Calculator, TrendingUp, BookOpen } from 'lucide-react';

export const CardCountingGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'basics' | 'hiLo' | 'practice'>('basics');

  const hiLoValues = [
    { cards: '2, 3, 4, 5, 6', value: '+1', color: 'text-green-500' },
    { cards: '7, 8, 9', value: '0', color: 'text-gray-600' },
    { cards: '10, J, Q, K, A', value: '-1', color: 'text-red-500' },
  ];

  const renderBasics = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">What is Card Counting?</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Card counting is a strategy used to determine whether the remaining cards in the deck 
          are favorable to the player or the dealer. When more high cards remain, the player 
          has a statistical advantage.
        </p>
        <ul className="text-gray-700 space-y-2">
          <li>• High cards (10s, face cards, Aces) favor the player</li>
          <li>• Low cards (2-6) favor the dealer</li>
          <li>• Neutral cards (7-9) have minimal impact</li>
        </ul>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Why It Works</h3>
        <ul className="text-gray-700 space-y-2">
          <li>• More 21s (3:2 payout)</li>
          <li>• Better double down opportunities</li>
          <li>• Dealer busts more often on stiff hands</li>
          <li>• Insurance becomes profitable at high counts</li>
        </ul>
      </div>
    </div>
  );

  const renderHiLo = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Hi-Lo Card Values</h3>
        <div className="space-y-4">
          {hiLoValues.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-800 font-medium">{item.cards}</span>
              <span className={`text-2xl font-bold ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Running Count</h3>
          <p className="text-gray-700 text-sm mb-4">
            Add or subtract the Hi-Lo values as cards are dealt. This gives you the running count.
          </p>
          <div className="bg-white p-3 rounded border">
            <code className="text-green-400">
              Running Count = Previous Count + Card Value
            </code>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">True Count</h3>
          <p className="text-gray-700 text-sm mb-4">
            Divide the running count by the number of decks remaining to get the true count.
          </p>
          <div className="bg-white p-3 rounded border">
            <code className="text-blue-400">
              True Count = Running Count ÷ Decks Remaining
            </code>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Strategy Adjustments</h3>
        <div className="space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>True Count +1:</span>
            <span>Slight advantage</span>
          </div>
          <div className="flex justify-between">
            <span>True Count +2:</span>
            <span>Good advantage</span>
          </div>
          <div className="flex justify-between">
            <span>True Count +3:</span>
            <span>Strong advantage</span>
          </div>
          <div className="flex justify-between">
            <span>True Count +4 or higher:</span>
            <span>Maximum advantage</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPractice = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Practice Drills</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-gray-800 font-medium mb-2">1. Single Card Recognition</h4>
            <p className="text-gray-700 text-sm">
              Practice identifying Hi-Lo values of individual cards quickly and accurately.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-gray-800 font-medium mb-2">2. Running Count Practice</h4>
            <p className="text-gray-700 text-sm">
              Deal cards one at a time and maintain an accurate running count.
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-gray-800 font-medium mb-2">3. True Count Conversion</h4>
            <p className="text-gray-700 text-sm">
              Practice converting running counts to true counts with different deck estimates.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Notes</h3>
        <ul className="text-gray-700 space-y-2 text-sm">
          <li>• This is an educational training tool for learning strategy</li>
          <li>• Requires significant practice to master</li>
          <li>• Focus on accuracy over speed when learning</li>
          <li>• Mathematics and probability form the foundation</li>
          <li>• Master the technique through consistent practice</li>
        </ul>
      </div>
    </div>
  );

  const sections = [
    { id: 'basics' as const, icon: BookOpen, title: 'Basics', color: 'bg-green-600' },
    { id: 'hiLo' as const, icon: Calculator, title: 'Hi-Lo System', color: 'bg-green-600' },
    { id: 'practice' as const, icon: TrendingUp, title: 'Practice', color: 'bg-blue-600' },
  ];

  return (
    <div className="prose prose-invert max-w-none">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-3xl font-bold text-gray-800">Card Counting Guide</h2>
      </div>

      <div className="flex space-x-2 mb-8">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeSection === section.id
                ? `${section.color} text-white shadow-lg`
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <section.icon className="h-4 w-4" />
            <span>{section.title}</span>
          </button>
        ))}
      </div>

      <div className="bg-white/90 border border-gray-200 rounded-xl p-6">
        {activeSection === 'basics' && renderBasics()}
        {activeSection === 'hiLo' && renderHiLo()}
        {activeSection === 'practice' && renderPractice()}
      </div>
    </div>
  );
};