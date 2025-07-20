import { useState, useEffect } from 'react'
import './MochiCharacter.css'

export type MochiState = 'idle' | 'happy' | 'working' | 'sad' | 'greeting'

interface MochiCharacterProps {
  state: MochiState
  message?: string
}

export function MochiCharacter({ state, message }: MochiCharacterProps) {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)

  // Simulate eye movement and blinking
  useEffect(() => {
    const moveEyes = () => {
      setEyePosition({
        x: Math.random() * 4 - 2,
        y: Math.random() * 2 - 1
      })
    }

    const blink = () => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 150)
    }

    const eyeMovementInterval = setInterval(moveEyes, 2000 + Math.random() * 3000)
    const blinkInterval = setInterval(blink, 3000 + Math.random() * 4000)

    return () => {
      clearInterval(eyeMovementInterval)
      clearInterval(blinkInterval)
    }
  }, [])

  const getCharacterClass = () => {
    return `mochi-character ${state} ${isBlinking ? 'blinking' : ''}`
  }

  const getEmoji = () => {
    switch (state) {
      case 'happy':
        return '✨'
      case 'working':
        return '💻'
      case 'sad':
        return '�'
      case 'greeting':
        return '👋'
      default:
        return '�'
    }
  }

  return (
    <div className={getCharacterClass()}>
      <div className="panda-container">
        {/* Panda Head */}
        <div className="panda-head">
          {/* Ears */}
          <div className="ear left-ear" />
          <div className="ear right-ear" />
          
          {/* Eyes */}
          <div className="eye-patch left-eye-patch">
            <div 
              className="eye left-eye"
              style={{
                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
              }}
            />
          </div>
          <div className="eye-patch right-eye-patch">
            <div 
              className="eye right-eye"
              style={{
                transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`
              }}
            />
          </div>
          
          {/* Nose */}
          <div className="nose" />
          
          {/* Mouth */}
          <div className="mouth" />
        </div>
        
        {/* Panda Body */}
        <div className="panda-body">
          {/* Arms */}
          <div className="arm left-arm" />
          <div className="arm right-arm" />
          
          {/* Laptop in arms (only when working) */}
          {state === 'working' && (
            <div className="laptop">💻</div>
          )}
          
          {/* Belly */}
          <div className="panda-belly" />
        </div>
        
        {/* Legs */}
        <div className="panda-legs">
          <div className="leg left-leg" />
          <div className="leg right-leg" />
        </div>
        
        {/* Status indicator for non-working states */}
        {state !== 'working' && (
          <div className="emoji-overlay">{getEmoji()}</div>
        )}
      </div>
      
      {message && (
        <div className="speech-bubble">
          {message}
        </div>
      )}
    </div>
  )
}
