import { useState } from 'react'
import './MoodCheck.css'

interface MoodCheckProps {
  onMoodSelect: (mood: string) => void
  onClose: () => void
}

export function MoodCheck({ onMoodSelect, onClose }: MoodCheckProps) {
  const [selectedMood, setSelectedMood] = useState<string>('')

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😐', label: 'Neutral', value: 'neutral' },
    { emoji: '😔', label: 'Off/Sad', value: 'sad' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '🤗', label: 'Excited', value: 'excited' },
    { emoji: '😰', label: 'Stressed', value: 'stressed' }
  ]

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)
    onMoodSelect(mood)
    setTimeout(onClose, 1000) // Close after showing selection
  }

  return (
    <div className="mood-check-overlay" onClick={onClose}>
      <div className="mood-check-panel" onClick={e => e.stopPropagation()}>
        <h3>How are you feeling?</h3>
        <div className="mood-options">
          {moods.map(mood => (
            <button
              key={mood.value}
              className={`mood-option ${selectedMood === mood.value ? 'selected' : ''}`}
              onClick={() => handleMoodSelect(mood.value)}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>
        {selectedMood && (
          <div className="mood-confirmation">
            Thanks for sharing! 💛
          </div>
        )}
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  )
}
