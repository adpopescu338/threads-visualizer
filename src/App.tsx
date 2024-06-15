import { useCallback, useEffect, useState } from 'react'
import { Core, CoreProps } from './components/Core'
import { TaskProps } from './components/Task'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { uuid } from './lib/uuid'

function App() {
  const [cores, setCores] = useState<
    Pick<CoreProps, 'tasks' | 'lastWorkedOnTaskWithId' | 'id'>[]
  >([])
  const [duration, setDuration] = useState(1)
  const [coresRef] = useAutoAnimate()

  useEffect(() => {
    setCores([
      {
        tasks: [],
        id: uuid(),
        lastWorkedOnTaskWithId: null,
      },
    ])
  }, [])

  const removeTaskFromCore = (coreId: string, taskId: string) => {
    setCores((cores) => {
      return cores.map((core) => {
        if (core.id === coreId) {
          core.tasks = core.tasks.filter((task) => task.id !== taskId)
        }
        return core
      })
    })
  }

  const addTask = async () => {
    // find the first core with the least amount of tasks, and add the new task to it
    const coreWithLeastTasks = cores.reduce((acc, core) => {
      if (core.tasks.length < acc.tasks.length) {
        return core
      }
      return acc
    }, cores[0])

    const taskIndex = cores.reduce((acc, core) => {
      return acc + core.tasks.length
    }, 0)

    const id = uuid()

    const newTask: TaskProps = {
      id,
      duration,
      index: taskIndex,
      completionUnits: 0,
      fatherPleaseEndMySuffering: (userDeletedMe?: boolean) => {
        if (userDeletedMe) {
          // remove the task from the core
          removeTaskFromCore(coreWithLeastTasks.id, id)
        }
        const thereAreIncompleteTasks = coreWithLeastTasks.tasks.some(
          (task) => task.completionUnits < task.duration
        )

        if (thereAreIncompleteTasks) return

        setTimeout(() => {
          setCores((cores) => {
            return cores.map((core) => {
              if (core.id !== coreWithLeastTasks.id) return core

              core.tasks = core.tasks.filter(
                (task) => task.completionUnits < task.duration
              )

              return core
            })
          })
        }, 500)
      },
    }

    coreWithLeastTasks.tasks.push(newTask)

    setCores([...cores])
  }

  const addCore = () => {
    setCores((cores) => {
      return [
        ...cores,
        {
          tasks: [],
          id: uuid(),
          lastWorkedOnTaskWithId: null,
        },
      ]
    })
  }

  const removeCore = useCallback((coreId: string) => {
    setCores((cores) => {
      return cores.filter((core) => core.id !== coreId)
    })
  }, [])

  const nextStep = () => {
    cores.forEach((core, coreI) => {
      console.group(`Core ${core.id} index ${coreI}`)
      if (core.tasks.length === 0) return

      let nextTask: TaskProps | undefined = undefined

      let indexOfPreviousTask = core.tasks.findIndex(
        (task) => task.id === core.lastWorkedOnTaskWithId
      )
      console.log({ indexOfPreviousTask })

      if (indexOfPreviousTask === core.tasks.length - 1) {
        console.log('indexOfPreviousTask === core.tasks.length - 1')
        indexOfPreviousTask = -1
      }

      for (let i = indexOfPreviousTask + 1; i < core.tasks.length; i++) {
        if (core.tasks[i].completionUnits < core.tasks[i].duration) {
          console.log('Found next task in for loop')
          nextTask = core.tasks[i]
          break
        }
      }

      if (!nextTask) {
        for (let i = 0; i <= indexOfPreviousTask; i++) {
          if (core.tasks[i].completionUnits < core.tasks[i].duration) {
            console.log('Found next task in for loop')
            nextTask = core.tasks[i]
            break
          }
        }
      }

      if (!nextTask) {
        console.log('No nextTask')
        console.groupEnd()
        return
      }

      console.log(JSON.stringify(nextTask, null, 2))

      core.lastWorkedOnTaskWithId = nextTask.id
      nextTask.completionUnits += 1
      console.groupEnd()
    })

    setCores([...cores])
  }

  const anyMoreTasks = cores.some((core) => core.tasks.length > 0)

  const autoPlay = async () => {
    const thereAreIncompleteTasks = () =>
      cores.some((core) =>
        core.tasks.some((task) => task.completionUnits < task.duration)
      )

    while (thereAreIncompleteTasks()) {
      nextStep()
      await pause(600)
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Stack direction='row' spacing={2}>
            <Button onClick={addCore} variant='contained'>
              Add Core
            </Button>
            <Button
              onClick={addTask}
              disabled={cores.length === 0}
              variant='contained'
            >
              Add Task
            </Button>
            <TextField
              size='small'
              label='Task Duration'
              type='number'
              value={duration}
              style={{
                maxWidth: '100px',
              }}
              InputProps={{
                inputProps: {
                  min: 1,
                },
              }}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </Stack>
        </div>
        <div>
          <Stack direction='row' spacing={2}>
            <Button
              onClick={nextStep}
              disabled={!anyMoreTasks}
              variant='contained'
            >
              Next Step
            </Button>
            <Button
              onClick={autoPlay}
              disabled={!anyMoreTasks}
              variant='contained'
            >
              Auto Play
            </Button>
          </Stack>
        </div>
      </div>
      <div
        style={{
          padding: '10px',
          marginTop: '50px',
        }}
      >
        <Typography variant='h4' textAlign='center'>
          CPU
        </Typography>
        <div style={coresContainerStyles} ref={coresRef}>
          {cores.map((core, i) => (
            <Core
              amITheLastCore={cores.length === 1}
              lastWorkedOnTaskWithId={core.lastWorkedOnTaskWithId}
              id={core.id}
              key={core.id}
              tasks={core.tasks}
              index={i}
              parentPleaseKillMe={removeCore}
              removeTaskFromCore={(taskId) =>
                removeTaskFromCore(core.id, taskId)
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const coresContainerStyles = {
  display: 'flex',
  gap: '10px',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  minHeight: '300px',
} as const

export default App

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))
