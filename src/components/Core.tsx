import { useEffect, useState } from 'react'
import { TaskProps, Task } from './Task'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { WorkerImg } from './WorkerImg'

export type CoreProps = {
  tasks: TaskProps[]
  id: string
  parentPleaseKillMe: (coreId: string) => void
  removeTaskFromCore: (taskId: string) => void
  lastWorkedOnTaskWithId: string | null
}

const coreStyles = {
  padding: '10px',
  border: '1px solid black',
  borderRadius: '5px',
  display: 'flex',
  gap: '10px',
  flexDirection: 'column',
  position: 'relative',
  minWidth: '300px',
  minHeight: 287,
} as const

const deleteButtonContainerStyles = {
  position: 'absolute',
  top: -25,
  right: -25,
  padding: '10px',
} as const

export const Core: React.FC<
  CoreProps & {
    amITheLastCore: boolean
    index: number
  }
> = ({
  tasks: inputTasks,
  index,
  parentPleaseKillMe,
  lastWorkedOnTaskWithId,
  amITheLastCore,
  id,
}) => {
  const [tasks, setTasks] = useState<TaskProps[]>(inputTasks)

  useEffect(() => {
    setTasks(inputTasks)
  }, [inputTasks])

  return (
    <div
      style={{
        ...coreStyles,
        ...(tasks.length === 0 && {
          maxHeight: 287,
          height: 287,
        }),
      }}
    >
      {!amITheLastCore && (
        <div style={deleteButtonContainerStyles}>
          <IconButton onClick={() => parentPleaseKillMe(id)} color='error'>
            <CancelIcon />
          </IconButton>
        </div>
      )}
      <Typography textAlign='center'>Core {index + 1}</Typography>
      <div style={tasksContainerStyles}>
        {tasks.map((task) => (
          <Task {...task} key={task.id} />
        ))}
        <WorkerImg
          lastWorkedOnTaskWithId={lastWorkedOnTaskWithId}
          tasks={tasks}
        />
      </div>
    </div>
  )
}

const tasksContainerStyles = {
  display: 'flex',
  gap: '10px',
  padding: '10px',
  alignItems: 'center',
  flexDirection: 'column-reverse',
  minWidth: '342px',
  position: 'relative',
  paddingTop: 110,
} as const
