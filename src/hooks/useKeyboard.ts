import { useEffect, useState } from 'react'

type Keys = {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
}

const keyMap: Record<string, keyof Keys> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
}

export default function useKeyboard() {
  const [keys, setKeys] = useState<Keys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      const key = keyMap[e.code]
      if (key) setKeys((state) => ({ ...state, [key]: true }))
    }

    const upHandler = (e: KeyboardEvent) => {
      const key = keyMap[e.code]
      if (key) setKeys((state) => ({ ...state, [key]: false }))
    }

    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [])

  return keys
}
