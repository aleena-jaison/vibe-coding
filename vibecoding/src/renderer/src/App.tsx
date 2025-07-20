import { useState, useEffect } from 'react'
import { MochiCharacter, MochiState } from './components/MochiCharacter'
import { MoodCheck } from './components/MoodCheck'
import { PlayActivities } from './components/PlayActivities'
import './App.css'

interface AppState {
  mochiState: MochiState
  message: string
  showMoodCheck: boolean
  showPlayActivities: boolean
  userIdleTime: number
  lastInteractionTime: number
}

function App(): React.JSX.Element {
  const [appState, setAppState] = useState<AppState>({
    mochiState: 'greeting',
    message: "Hello there! �",
    showMoodCheck: false,
    showPlayActivities: false,
    userIdleTime: 0,
    lastInteractionTime: Date.now()
  })

  // Initialize Mochi and set up event listeners
  useEffect(() => {
    // Report initial activity
    window.api?.reportActivity()

    // Listen for idle updates
    const handleIdleUpdate = (idleTime: number) => {
      setAppState(prev => {
        let newState = prev.mochiState
        let newMessage = prev.message

        if (idleTime > 180) { // 3 minutes - becomes sad
          newState = 'sad'
          newMessage = idleTime > 600 ? "I miss you... �" : "Feeling a bit lonely... 🥺"
        } else if (idleTime > 30) { // 30 seconds - becomes idle/restless
          newState = 'idle'
          newMessage = ""
        } else {
          newState = 'working'
          newMessage = ""
        }

        return {
          ...prev,
          userIdleTime: idleTime,
          mochiState: newState,
          message: newMessage
        }
      })
    }

    // Listen for system events
    const handleSystemEvent = (event: string) => {
      if (event === 'wake-up') {
        setAppState(prev => ({
          ...prev,
          mochiState: 'greeting',
          message: "Welcome back! �✨"
        }))
        
        // Reset to idle after greeting
        setTimeout(() => {
          setAppState(prev => ({
            ...prev,
            mochiState: 'idle',
            message: ""
          }))
        }, 3000)
      }
    }

    // Set up event listeners
    window.api?.onIdleUpdate(handleIdleUpdate)
    window.api?.onSystemEvent(handleSystemEvent)

    // Initial greeting timeout
    setTimeout(() => {
      setAppState(prev => ({
        ...prev,
        mochiState: 'idle',
        message: ""
      }))
    }, 4000)

    // Track mouse movement and clicks for activity
    const handleActivity = () => {
      window.api?.reportActivity()
      setAppState(prev => ({ ...prev, lastInteractionTime: Date.now() }))
    }

    document.addEventListener('mousemove', handleActivity)
    document.addEventListener('click', handleActivity)
    document.addEventListener('keypress', handleActivity)

    return () => {
      document.removeEventListener('mousemove', handleActivity)
      document.removeEventListener('click', handleActivity)
      document.removeEventListener('keypress', handleActivity)
    }
  }, [])

  // Handle Mochi click - show context menu
  const handleMochiClick = () => {
    // Report activity
    window.api?.reportActivity()
    
    // Celebrate the interaction!
    setAppState(prev => ({
      ...prev,
      mochiState: 'happy',
      message: "You showed up! ✨"
    }))

    // Show quick menu after celebration
    setTimeout(() => {
      setAppState(prev => ({
        ...prev,
        mochiState: 'happy',
        message: "",
        showMoodCheck: false,
        showPlayActivities: false
      }))
    }, 2000)
  }

  // Context menu handlers
  const showMoodDialog = () => {
    setAppState(prev => ({ ...prev, showMoodCheck: true }))
  }

  const showPlayDialog = () => {
    setAppState(prev => ({ ...prev, showPlayActivities: true }))
  }

  const handleMoodSelect = (mood: string) => {
    window.api?.updateMood(mood)
    
    // Update Mochi's response based on mood
    let response = ""
    let newState: MochiState = 'happy'
    
    switch (mood) {
      case 'sad':
        response = "I'm here with you 💛"
        newState = 'sad'
        break
      case 'happy':
        response = "That's wonderful! ✨"
        newState = 'happy'
        break
      case 'stressed':
        response = "Let's breathe together 🫁"
        newState = 'sad'
        break
      case 'tired':
        response = "Rest is okay too 😴"
        newState = 'idle'
        break
      default:
        response = "Thanks for sharing 💛"
        newState = 'happy'
    }

    setAppState(prev => ({
      ...prev,
      mochiState: newState,
      message: response,
      showMoodCheck: false
    }))

    // Clear message after some time
    setTimeout(() => {
      setAppState(prev => ({
        ...prev,
        message: ""
      }))
    }, 5000)
  }

  return (
    <div className="mochi-app">
      <div className="mochi-widget" onClick={handleMochiClick}>
        <MochiCharacter 
          state={appState.mochiState} 
          message={appState.message}
        />
      </div>
      
      {/* Context menu appears on click */}
      <div className="context-menu">
        <button className="menu-button" onClick={showMoodDialog}>
          💭 How are you?
        </button>
        <button className="menu-button" onClick={showPlayDialog}>
          🎯 Play something
        </button>
      </div>

      {appState.showMoodCheck && (
        <MoodCheck
          onMoodSelect={handleMoodSelect}
          onClose={() => setAppState(prev => ({ ...prev, showMoodCheck: false }))}
        />
      )}

      {appState.showPlayActivities && (
        <PlayActivities
          onClose={() => setAppState(prev => ({ ...prev, showPlayActivities: false }))}
        />
      )}
    </div>
  )
}

export default App
