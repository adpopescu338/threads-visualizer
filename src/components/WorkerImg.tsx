import { useRef, useEffect, useState } from 'react'
import type { CoreProps } from './Core'

export const WorkerImg: React.FC<
  Pick<CoreProps, 'lastWorkedOnTaskWithId' | 'tasks'>
> = ({ tasks, lastWorkedOnTaskWithId }) => {
  const task = tasks.find((task) => task.id === lastWorkedOnTaskWithId)

  const completionPercentage = !task
    ? 0
    : (task.completionUnits / task.duration) * 100

  // Use a ref to access the task element
  const imgRef = useRef<HTMLImageElement>(null)

  // Track the previous task ID to determine if the image is moving to a new task
  const [prevTaskId, setPrevTaskId] = useState<string | null>(null)

  // Default position styling
  const defaultPositioning = {
    top: '-10px', // Adjust this value to be closer to the core title
    left: '50%', // Center horizontally
    transform: 'translateX(-50%)',
    transition: 'top 0.1s, left 0.1s',
  } as const

  // Calculate the position of the task element
  useEffect(() => {
    if (!imgRef.current) return
    const imgElement = imgRef.current

    if (!task) {
      imgElement.style.top = defaultPositioning.top
      imgElement.style.left = defaultPositioning.left
      imgElement.style.transform = defaultPositioning.transform
      imgElement.style.transition = defaultPositioning.transition
      return
    }

    const taskElement = document.getElementById(task.id)!
    const taskRect = taskElement.getBoundingClientRect()
    const parentRect = taskElement.parentElement!.getBoundingClientRect()

    // Calculate the top position relative to the green div height
    const greenDivHeight = (taskRect.height * completionPercentage) / 100

    imgElement.style.top = `${
      taskRect.top - parentRect.top + taskRect.height - greenDivHeight - 55
    }px`
    imgElement.style.left = `${taskRect.left - parentRect.left - 30}px`
    imgElement.style.transform = 'none'

    // Set the transition durations
    imgElement.style.transition = `left 0.05s, top ${
      prevTaskId === task?.id ? '0.5s' : '0.05s'
    }`

    // Update the previous task ID
    setPrevTaskId(task.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id, completionPercentage, prevTaskId, tasks.length])

  return (
    <img
      ref={imgRef}
      src='/threads-visualizer/cpu-worker.png'
      alt='matrix'
      style={{
        position: 'absolute',
        width: '50px',
        top: defaultPositioning.top,
        left: defaultPositioning.left,
        transform: defaultPositioning.transform,
        transition: defaultPositioning.transition,
      }}
    />
  )
}

export default WorkerImg
