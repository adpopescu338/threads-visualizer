import { Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

export type TaskProps = {
  duration: number
  index: number
  id: string
  completionUnits: number
  fatherPleaseEndMySuffering: () => void
}

const getRandomZerosAndOnes = (duration: number) =>
  '011010000100101101'.repeat(13).repeat(duration)

// a div filled with ones and zeros, and "Task {index}" as the text in the middle.
// for each completion unit, it's filled from the bottom up with a different color
// when the task is complete (completionUnits equals duration), the div should be filled with a single color, and show confetti
export const Task: React.FC<TaskProps> = ({
  duration,
  index,
  completionUnits,
  fatherPleaseEndMySuffering,
  id,
}) => {
  const completionPercentage = (completionUnits / duration) * 100
  const isComplete = completionUnits >= duration
  const [hidden, setHidden] = useState(false)

  const randomZerosAndOnes = useMemo(
    () => getRandomZerosAndOnes(duration),
    [duration]
  )

  useEffect(() => {
    if (isComplete) {
      setTimeout(() => {
        const elem = document.getElementById(id)
        if (!elem) return
        elem.style.boxShadow = 'green 0 0 30px'
      }, 500)
      setTimeout(() => {
        setHidden(true)
      }, 1000)
      setTimeout(() => {
        fatherPleaseEndMySuffering()
      }, 1500)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete])

  return (
    <div
      id={id}
      style={{
        width: '150px',
        height: 70 * duration + 'px',
        display: 'flex',
        position: 'relative',
        border: '1px solid black',
        borderRadius: '5px',
        backgroundSize: 'cover',
        overflow: 'hidden',
        opacity: hidden ? 0 : 1,
        wordBreak: 'break-word',
        color: 'green',
        backgroundColor: 'black',
        padding: '5px',
        transition: 'box-shadow 0.5s, opacity 0.5s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${completionPercentage}%`,
          background: 'green',
          transition: 'height 0.5s',
        }}
      />

      <Typography
        variant='h5'
        style={{
          padding: '5px',
          borderRadius: '5px',
          backgroundColor: 'white',
          color: 'black',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        Task {index + 1}
      </Typography>
      {randomZerosAndOnes}
    </div>
  )
}
