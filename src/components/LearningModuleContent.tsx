import React from 'react';
import { Spade, Heart, Diamond, Club } from 'lucide-react';

interface LearningModuleContentProps {
  moduleId: string;
  themeClasses: {
    text: string;
    textSecondary: string;
    surface: string;
    border: string;
  };
}

export const LearningModuleContent: React.FC<LearningModuleContentProps> = ({ moduleId, themeClasses }) => {
  const renderContent = () => {
    switch (moduleId) {
      case 'basics-intro':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Welcome to Blackjack!</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                Blackjack is a card game where the goal is to get a hand value as close to 21 as possible without going over,
                while beating the dealer's hand.
              </p>
              <ul className={`${themeClasses.textSecondary} space-y-2`}>
                <li>• Cards 2-10 are worth their face value</li>
                <li>• Face cards (J, Q, K) are worth 10</li>
                <li>• Aces are worth 1 or 11 (whichever is better)</li>
                <li>• The dealer must hit on 16 and stand on 17</li>
              </ul>
            </div>
          </div>
        );

      case 'card-values':
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Understanding Card Values</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center shadow-sm">
                <Spade className="h-8 w-8 text-black mx-auto mb-2" />
                <div className="text-2xl font-bold text-black mb-1">A</div>
                <div className="text-sm text-gray-600">1 or 11</div>
              </div>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center shadow-sm">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" fill="currentColor" />
                <div className="text-2xl font-bold text-red-600 mb-1">K</div>
                <div className="text-sm text-gray-600">10</div>
              </div>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center shadow-sm">
                <Diamond className="h-8 w-8 text-red-600 mx-auto mb-2" fill="currentColor" />
                <div className="text-2xl font-bold text-red-600 mb-1">7</div>
                <div className="text-sm text-gray-600">7</div>
              </div>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center shadow-sm">
                <Club className="h-8 w-8 text-black mx-auto mb-2" />
                <div className="text-2xl font-bold text-black mb-1">2</div>
                <div className="text-sm text-gray-600">2</div>
              </div>
            </div>
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6 mt-6`}>
              <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Calculating Hand Totals</h4>
              <p className={`${themeClasses.textSecondary} mb-3`}>
                Simply add up all card values. Aces count as 11 unless that would bust your hand, then they count as 1.
              </p>
              <div className="space-y-2">
                <p className={themeClasses.textSecondary}>Example: K + 7 = 17</p>
                <p className={themeClasses.textSecondary}>Example: A + 9 = 20 (soft)</p>
                <p className={themeClasses.textSecondary}>Example: A + 6 + 5 = 12 (Ace now counts as 1)</p>
              </div>
            </div>
          </div>
        );

      case 'dealer-rules':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>How the Dealer Plays</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                The dealer follows strict rules with no decisions to make:
              </p>
              <ul className={`${themeClasses.textSecondary} space-y-3`}>
                <li><strong className={themeClasses.text}>Must hit on 16 or less:</strong> The dealer has no choice and must take another card</li>
                <li><strong className={themeClasses.text}>Must stand on 17 or more:</strong> The dealer cannot take more cards</li>
                <li><strong className={themeClasses.text}>One card hidden:</strong> During play, one dealer card is face-down until all players finish</li>
              </ul>
            </div>
          </div>
        );

      case 'basic-strategy-intro':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>What is Basic Strategy?</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                Basic strategy is a mathematically optimal way to play every hand in 21. It's based on millions of computer simulations
                and tells you the best decision for every possible combination of your hand and the dealer's up card.
              </p>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                Using basic strategy is the mathematically optimal way to play 21, helping you make the best decision in every situation.
              </p>
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  Key Point: Basic strategy is not about card counting - it's simply the mathematically correct play for each situation.
                </p>
              </div>
            </div>
          </div>
        );

      case 'hard-hands':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Playing Hard Hands</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                A hard hand is any hand that doesn't contain an Ace (or contains an Ace counted as 1). These are the most common hands you'll encounter.
              </p>
              <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Key Rules for Hard Hands:</h4>
              <ul className={`${themeClasses.textSecondary} space-y-2`}>
                <li>• Always hit on 8 or less</li>
                <li>• Always stand on 17 or more</li>
                <li>• Hit on 12-16 vs dealer 7 or higher</li>
                <li>• Stand on 12-16 vs dealer 2-6</li>
                <li>• Double on 10-11 vs dealer 2-9</li>
              </ul>
            </div>
          </div>
        );

      case 'soft-hands':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Playing Soft Hands</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                A soft hand contains an Ace counted as 11. Soft hands are powerful because you can't bust by taking one more card.
              </p>
              <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Key Rules for Soft Hands:</h4>
              <ul className={`${themeClasses.textSecondary} space-y-2`}>
                <li>• Always hit soft 17 or less</li>
                <li>• Always stand on soft 19 or more</li>
                <li>• Double soft 13-18 vs dealer 5-6</li>
                <li>• Soft 18 is tricky: Hit vs 9-A, stand vs 2-8</li>
              </ul>
            </div>
          </div>
        );

      case 'pairs':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Splitting Pairs</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                When you're dealt a pair, you have the option to split them into two separate hands.
              </p>
              <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Splitting Strategy:</h4>
              <ul className={`${themeClasses.textSecondary} space-y-2`}>
                <li>• Always split Aces and 8s</li>
                <li>• Never split 10s, 5s, or 4s</li>
                <li>• Split 2s, 3s, 6s, 7s, 9s vs weak dealer cards (2-6)</li>
              </ul>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 font-medium">
                  Remember: Splitting Aces and 8s is the most important splitting rule to memorize!
                </p>
              </div>
            </div>
          </div>
        );

      case 'counting-intro':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Introduction to Card Counting</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                Card counting is a strategy used to determine when the player has an advantage. It's not about memorizing every card,
                but keeping a running tally of high vs low cards that have been played.
              </p>
              <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>How It Works:</h4>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                When more high cards (10s and Aces) remain in the deck, the player has an advantage. When more low cards remain,
                the dealer has an advantage. By tracking this, you can understand when conditions are favorable or unfavorable.
              </p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 font-medium">
                  Note: This is an educational training tool. Card counting is a skill that demonstrates mathematical principles and requires practice.
                </p>
              </div>
            </div>
          </div>
        );

      case 'hi-lo-system':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>The Hi-Lo Counting System</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                Hi-Lo is the most popular and easy-to-learn card counting system. Each card is assigned a value:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-green-800 mb-2">+1</div>
                  <div className="text-sm text-green-700">2, 3, 4, 5, 6</div>
                  <div className="text-xs text-green-600 mt-2">Low Cards</div>
                </div>
                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-gray-800 mb-2">0</div>
                  <div className="text-sm text-gray-700">7, 8, 9</div>
                  <div className="text-xs text-gray-600 mt-2">Neutral</div>
                </div>
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-red-800 mb-2">-1</div>
                  <div className="text-sm text-red-700">10, J, Q, K, A</div>
                  <div className="text-xs text-red-600 mt-2">High Cards</div>
                </div>
              </div>
              <p className={`${themeClasses.textSecondary}`}>
                Keep a running count by adding or subtracting these values as cards are dealt. A positive count means more high cards remain,
                giving you an advantage.
              </p>
            </div>
          </div>
        );

      case 'true-count':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>True Count Conversion</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                The running count needs to be adjusted based on how many decks remain unplayed. This adjusted count is called the "true count."
              </p>
              <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Formula:</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                <p className="text-blue-900 font-mono text-center text-lg">
                  True Count = Running Count ÷ Decks Remaining
                </p>
              </div>
              <p className={`${themeClasses.textSecondary} mb-4`}>Example: If your running count is +6 and there are 3 decks left, your true count is +2.</p>
              <p className={`${themeClasses.textSecondary}`}>
                The true count is more accurate for strategic decisions because it accounts for deck penetration.
              </p>
            </div>
          </div>
        );


      case 'strategy-practice':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Strategy Practice Scenarios</h3>
              <p className={`${themeClasses.textSecondary} mb-6`}>
                Test your basic strategy knowledge with these common scenarios:
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold mb-2">Scenario 1: Hard 16 vs Dealer 7</p>
                  <p className={`${themeClasses.textSecondary} mb-3`}>You have 10-6 (hard 16) and dealer shows 7</p>
                  <p className="text-blue-800 font-medium">Correct Play: HIT</p>
                  <p className={`${themeClasses.textSecondary} text-sm mt-2`}>Dealer's 7 is strong (hits on 16, stands on 17+). You must take the risk.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold mb-2">Scenario 2: Soft 17 vs Dealer 6</p>
                  <p className={`${themeClasses.textSecondary} mb-3`}>You have A-6 (soft 17) and dealer shows 6</p>
                  <p className="text-blue-800 font-medium">Correct Play: DOUBLE DOWN</p>
                  <p className={`${themeClasses.textSecondary} text-sm mt-2`}>Dealer has a weak card. Double your advantage with soft hands.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold mb-2">Scenario 3: Pair of 8s vs Dealer 10</p>
                  <p className={`${themeClasses.textSecondary} mb-3`}>You have 8-8 and dealer shows 10</p>
                  <p className="text-blue-800 font-medium">Correct Play: SPLIT</p>
                  <p className={`${themeClasses.textSecondary} text-sm mt-2`}>Always split 8s. Two 18s is much better than 16.</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold mb-2">Scenario 4: Hard 11 vs Dealer 5</p>
                  <p className={`${themeClasses.textSecondary} mb-3`}>You have 6-5 (hard 11) and dealer shows 5</p>
                  <p className="text-blue-800 font-medium">Correct Play: DOUBLE DOWN</p>
                  <p className={`${themeClasses.textSecondary} text-sm mt-2`}>Dealer has weak card (5). Maximize gains when odds favor you.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'hard-hands-quiz':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Hard Hands - Key Decisions</h3>
              <p className={`${themeClasses.textSecondary} mb-6`}>
                Master these critical hard hand decisions:
              </p>

              <div className="space-y-4">
                <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4`}>
                  <p className="font-semibold mb-2">Hard 12-16 (Stiff Hands)</p>
                  <p className={`${themeClasses.textSecondary} mb-3`}>These hands have highest bust risk when hitting</p>
                  <ul className={`${themeClasses.textSecondary} space-y-1 text-sm`}>
                    <li>• vs Dealer 2-6: STAND (dealer likely to bust)</li>
                    <li>• vs Dealer 7-A: HIT (dealer probably has 17+)</li>
                  </ul>
                </div>

                <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4`}>
                  <p className="font-semibold mb-2">Hard 17+ (Pat Hands)</p>
                  <p className={`${themeClasses.textSecondary} mb-3`}>Good hands - usually don't hit</p>
                  <ul className={`${themeClasses.textSecondary} space-y-1 text-sm`}>
                    <li>• Hard 17 or more: ALWAYS STAND</li>
                    <li>• Exception: Soft 17 vs 6 = Double (not a true 17)</li>
                  </ul>
                </div>

                <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4`}>
                  <p className="font-semibold mb-2">Doubling Down</p>
                  <p className={`${themeClasses.textSecondary} mb-3`}>Only double when you have a significant advantage</p>
                  <ul className={`${themeClasses.textSecondary} space-y-1 text-sm`}>
                    <li>• Hard 10 vs Dealer 2-9: DOUBLE</li>
                    <li>• Hard 11 vs Dealer 2-10: DOUBLE</li>
                    <li>• Hard 9 vs Dealer 3-6: DOUBLE</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'running-count':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Running Count Practice</h3>
              <p className={`${themeClasses.textSecondary} mb-6`}>
                Learn to mentally track the running count in real-time:
              </p>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 font-semibold mb-2">Key Values to Remember</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-green-800">2-6: +1</div>
                    <div className="text-gray-800">7-9: 0</div>
                    <div className="text-red-800">10-A: -1</div>
                  </div>
                </div>

                <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4`}>
                  <p className="font-semibold mb-3">Practice Example 1</p>
                  <p className={`${themeClasses.textSecondary} mb-2`}>Cards dealt in order: 5, K, 3, 7, 10, 2</p>
                  <div className="space-y-1 text-sm">
                    <p className={themeClasses.textSecondary}>• See 5: +1 (count = 1)</p>
                    <p className={themeClasses.textSecondary}>• See K: -1 (count = 0)</p>
                    <p className={themeClasses.textSecondary}>• See 3: +1 (count = 1)</p>
                    <p className={themeClasses.textSecondary}>• See 7: 0 (count = 1)</p>
                    <p className={themeClasses.textSecondary}>• See 10: -1 (count = 0)</p>
                    <p className="font-semibold text-green-700 mt-2">• See 2: +1 (count = 1)</p>
                  </div>
                </div>

                <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4`}>
                  <p className="font-semibold mb-3">Practice Example 2</p>
                  <p className={`${themeClasses.textSecondary} mb-2`}>Cards dealt in order: A, 6, 9, Q, 4, 8</p>
                  <div className="space-y-1 text-sm">
                    <p className={themeClasses.textSecondary}>• See A: -1 (count = -1)</p>
                    <p className={themeClasses.textSecondary}>• See 6: +1 (count = 0)</p>
                    <p className={themeClasses.textSecondary}>• See 9: 0 (count = 0)</p>
                    <p className={themeClasses.textSecondary}>• See Q: -1 (count = -1)</p>
                    <p className={themeClasses.textSecondary}>• See 4: +1 (count = 0)</p>
                    <p className="font-semibold text-blue-700 mt-2">• See 8: 0 (count = 0)</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-900 font-semibold mb-2">Pro Tips</p>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Group cards mentally: "5-6 is +2, 10-K is -2"</li>
                    <li>• Practice with card apps to build speed</li>
                    <li>• Start slow, accuracy before speed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'counting-quiz':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Card Counting Mastery</h3>
              <p className={`${themeClasses.textSecondary} mb-6`}>
                Comprehensive card counting knowledge check:
              </p>

              <div className="space-y-4">
                <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4`}>
                  <p className="font-semibold mb-2">Running Count vs True Count</p>
                  <p className={`${themeClasses.textSecondary} mb-3 text-sm`}>
                    Running count is raw tally. True count accounts for deck penetration.
                  </p>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">True Count = Running Count ÷ Decks Remaining</p>
                </div>

                <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4`}>
                  <p className="font-semibold mb-2">Betting Spread</p>
                  <p className={`${themeClasses.textSecondary} mb-2 text-sm`}>
                    In training, understand how count influences decisions:
                  </p>
                  <ul className={`${themeClasses.textSecondary} space-y-1 text-sm`}>
                    <li>• Positive count: More high cards remain (player advantage)</li>
                    <li>• Negative count: More low cards remain (dealer advantage)</li>
                    <li>• Use true count for most accurate decisions</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 font-semibold mb-2">Practical Counting Situations</p>
                  <ul className="text-sm text-green-800 space-y-2">
                    <li>• Running count +8, 4 decks left → True count +2 (favorable)</li>
                    <li>• Running count -6, 3 decks left → True count -2 (unfavorable)</li>
                    <li>• Running count 0 = neutral shoe</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'deviations':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Strategy Deviations</h3>
              <p className={`${themeClasses.textSecondary} mb-6`}>
                Advanced plays when count is extreme:
              </p>

              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-900 font-semibold mb-2">High Count Deviations (Positive True Count)</p>
                  <ul className="text-sm text-red-800 space-y-2">
                    <li>• At +3+: Take Insurance (rare in balanced shoe)</li>
                    <li>• At +2+: Hit 12 vs 3 (instead of stand)</li>
                    <li>• At +1+: Stand 16 vs 10 (instead of hit)</li>
                    <li>• At +1+: Double 11 vs Ace</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold mb-2">Low Count Deviations (Negative True Count)</p>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>• At -2-: Hit 12 vs 4 (instead of stand)</li>
                    <li>• At -2-: Hit 13 vs 3 (instead of stand)</li>
                    <li>• At -2-: Stand 16 vs 9 (instead of hit)</li>
                  </ul>
                </div>

                <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4`}>
                  <p className="font-semibold mb-2">Why Deviations Matter</p>
                  <p className={`${themeClasses.textSecondary} text-sm`}>
                    Deviations maximize profit in favorable counts and minimize losses in unfavorable counts.
                    They're the difference between basic strategy and advanced counting strategy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bankroll-management':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Training Management</h3>
              <p className={`${themeClasses.textSecondary} mb-4`}>
                Tips for effective 21 training and skill development:
              </p>
              <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Training Principles:</h4>
              <ul className={`${themeClasses.textSecondary} space-y-2 mb-6`}>
                <li>• Set practice goals: accuracy first, speed second</li>
                <li>• Practice consistently to build muscle memory</li>
                <li>• Review mistakes to learn from them</li>
                <li>• Track your progress with the Stats feature</li>
                <li>• Take breaks to maintain focus and prevent burnout</li>
              </ul>

              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 font-semibold mb-2">Strategy Training Path</p>
                  <ol className="text-sm text-green-800 space-y-1">
                    <li>1. Master basic strategy (hard hands first)</li>
                    <li>2. Learn soft hand play</li>
                    <li>3. Master pair splitting</li>
                    <li>4. Practice full games</li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900 font-semibold mb-2">Counting Training Path</p>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Memorize Hi-Lo values</li>
                    <li>2. Practice running count accuracy</li>
                    <li>3. Learn true count calculation</li>
                    <li>4. Practice in live games</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        );

      case 'final-exam':
        return (
          <div className="space-y-6">
            <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Final Mastery Exam</h3>
              <p className={`${themeClasses.textSecondary} mb-6`}>
                Test your comprehensive 21 mastery:
              </p>

              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-900 font-semibold mb-2">Exam Structure</p>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• 20 mixed strategy and counting questions</li>
                    <li>• Covers all previously learned material</li>
                    <li>• 80% score or higher = Mastery achieved</li>
                    <li>• Difficulty: Expert level</li>
                  </ul>
                </div>

                <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-4`}>
                  <p className="font-semibold mb-2">You Will Be Tested On:</p>
                  <ul className={`${themeClasses.textSecondary} space-y-1 text-sm`}>
                    <li>✓ Basic strategy for all hand types</li>
                    <li>✓ Dealer play rules and procedures</li>
                    <li>✓ Card counting mechanics (Hi-Lo)</li>
                    <li>✓ Running and true count calculation</li>
                    <li>✓ Strategy deviations based on count</li>
                    <li>✓ Training management and best practices</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-900 font-semibold mb-2">After Passing</p>
                  <p className="text-sm text-green-800 mb-2">
                    You'll have mastered the fundamental mathematical and strategic principles of 21!
                  </p>
                  <p className="text-sm text-green-700 font-medium">
                    Ready to challenge yourself in the Play section with live games.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={`${themeClasses.surface} border ${themeClasses.border} rounded-lg p-6`}>
            <p className={themeClasses.textSecondary}>Module content coming soon...</p>
          </div>
        );
    }
  };

  return <div className="prose max-w-none mb-8">{renderContent()}</div>;
};
