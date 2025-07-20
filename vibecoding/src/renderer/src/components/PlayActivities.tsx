import { useState, useEffect } from 'react'
import './PlayActivities.css'

interface PlayActivitiesProps {
  onClose: () => void
}

export function PlayActivities({ onClose }: PlayActivitiesProps) {
  const [currentActivity, setCurrentActivity] = useState<'quote' | 'breathing' | 'mini-game' | null>(null)
  const [currentQuote, setCurrentQuote] = useState('')
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale')

  const quotes = [
    "You showed up today. That matters. 💛",
    "Small steps are still steps forward.",
    "Your energy is precious. Use it kindly.",
    "Progress isn't always visible, but it's always there.",
    "You're doing better than you think you are.",
    "Rest is productive too.",
    "Your feelings are valid, all of them.",
    "One moment at a time is enough."
  ]

  const activities = [
    { id: 'quote', emoji: '💭', label: 'Gentle Quote' },
    { id: 'breathing', emoji: '🫁', label: 'Breathing' },
    { id: 'mini-game', emoji: '🎯', label: 'Mini Focus' }
  ]

  useEffect(() => {
    if (currentActivity === 'breathing') {
      const breathingCycle = () => {
        setBreathingPhase('inhale')
        setTimeout(() => setBreathingPhase('hold'), 4000)
        setTimeout(() => setBreathingPhase('exhale'), 7000)
      }
      
      breathingCycle()
      const interval = setInterval(breathingCycle, 11000)
      return () => clearInterval(interval)
    }
    return undefined
  }, [currentActivity])

  const selectActivity = (activityId: string) => {
    setCurrentActivity(activityId as 'quote' | 'breathing' | 'mini-game')
    
    if (activityId === 'quote') {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setCurrentQuote(randomQuote)
    }
  }

  const renderActivity = () => {
    switch (currentActivity) {
      case 'quote':
        return (
          <div className="activity-content">
            <div className="quote-display">
              {currentQuote}
            </div>
            <button onClick={() => setCurrentActivity(null)} className="back-button">
              Choose Another
            </button>
          </div>
        )
        
      case 'breathing':
        return (
          <div className="activity-content">
            <div className="breathing-exercise">
              <div className={`breathing-circle ${breathingPhase}`}>
                <div className="breathing-text">
                  {breathingPhase === 'inhale' ? 'Breathe In' : 
                   breathingPhase === 'hold' ? 'Hold' : 'Breathe Out'}
                </div>
              </div>
            </div>
            <button onClick={() => setCurrentActivity(null)} className="back-button">
              Back
            </button>
          </div>
        )
        
      case 'mini-game':
        return (
          <div className="activity-content">
            <div className="mini-game">
              <p>🎯 Focus on this dot for 10 seconds</p>
              <div className="focus-dot"></div>
              <p className="mini-game-instruction">Just breathe and watch</p>
            </div>
            <button onClick={() => setCurrentActivity(null)} className="back-button">
              Back
            </button>
          </div>
        )
        
      default:
        return (
          <div className="activity-selection">
            <h3>Choose something gentle</h3>
            <div className="activity-options">
              {activities.map(activity => (
                <button
                  key={activity.id}
                  className="activity-option"
                  onClick={() => selectActivity(activity.id)}
                >
                  <span className="activity-emoji">{activity.emoji}</span>
                  <span className="activity-label">{activity.label}</span>
                </button>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="play-overlay" onClick={onClose}>
      <div className="play-panel" onClick={e => e.stopPropagation()}>
        {renderActivity()}
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  )
}
