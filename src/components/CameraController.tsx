import { useState } from 'react'
import { Mesh } from 'three'
import FollowCam from './FollowCam'
import FirstPersonCam from './FirstPersonCam'

type CameraControllerProps = {
  target: React.RefObject<Mesh | null>
}

export default function CameraController({ target }: CameraControllerProps) {
  const [isFirstPerson, setIsFirstPerson] = useState(false)

  return (
    <>
      <FollowCam target={target} enabled={!isFirstPerson} />
      <FirstPersonCam target={target} enabled={isFirstPerson} />
      
      {/* Camera toggle button */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsFirstPerson(!isFirstPerson)}
          style={{
            padding: '10px 20px',
            backgroundColor: isFirstPerson ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {isFirstPerson ? '1st Person' : '3rd Person'}
        </button>
      </div>
    </>
  )
}