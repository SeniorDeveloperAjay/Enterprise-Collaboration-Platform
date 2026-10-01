import { useEffect, useMemo, useState } from "react"
import {
  FaPlay,
  FaPlus,
  FaTrash,
  FaRedo,
  FaClock,
  FaChartBar,
  FaInfoCircle,
  FaTasks,
  FaSyncAlt,
} from "react-icons/fa"

const API_URL = "https://enterprise-collaboration-backend.onrender.com" 
 
const initialProcesses = [ 
  { 
    id: "P1", 
    arrivalTime: 0, 
    burstTime: 5, 
    priority: 2, 
    queue: 1, 
    source: "Manual", 
  }, 
  { 
    id: "P2", 
    arrivalTime: 1, 
    burstTime: 3, 
    priority: 1, 
    queue: 2, 
    source: "Manual", 
  }, 
  { 
    id: "P3", 
    arrivalTime: 2, 
    burstTime: 8, 
    priority: 3, 
    queue: 1, 
    source: "Manual", 
  }, 
  { 
    id: "P4", 
    arrivalTime: 3, 
    burstTime: 4, 
    priority: 2, 
    queue: 2, 
    source: "Manual", 
  }, 
] 
 
function CPUScheduling() { 
  const [processes, setProcesses] = useState(initialProcesses) 
  const [algorithm, setAlgorithm] = useState("FCFS") 
  const [quantum, setQuantum] = useState(2) 
  const [result, setResult] = useState(null) 
 
  const [tasks, setTasks] = useState([]) 
  const [taskLoading, setTaskLoading] = useState(false) 
  const [taskMessage, setTaskMessage] = useState("") 
 
  const [newProcess, setNewProcess] = useState({ 
    arrivalTime: 0, 
    burstTime: 5, 
    priority: 1, 
    queue: 1, 
  }) 
 
  const algorithms = [ 
    "FCFS", 
    "SJF (Non-Preemptive)", 
    "SJF (Preemptive / SRTF)", 
    "Priority (Non-Preemptive)", 
    "Priority (Preemptive)", 
    "Round Robin", 
    "Multilevel Queue", 
    "Multilevel Feedback Queue", 
  ] 
 
  /* -------------------- TASK INTEGRATION -------------------- */ 
 
  const fetchTasks = async () => { 
    try { 
      setTaskLoading(true) 
      setTaskMessage("") 
 
      const response = await fetch(`${API_URL}/api/tasks`) 
 
      if (!response.ok) { 
        throw new Error("Failed to fetch tasks") 
      } 
 
      const data = await response.json() 
      setTasks(data.tasks || []) 
    } catch (error) { 
      setTaskMessage("Unable to connect to Enterprise Tasks.") 
    } finally { 
      setTaskLoading(false) 
    } 
  } 
 
  useEffect(() => { 
    fetchTasks() 
  }, []) 
 
  const importTasksAsProcesses = () => { 
    if (tasks.length === 0) { 
      setTaskMessage("No enterprise tasks available to import.") 
      return 
    } 
 
    const existingTaskIds = new Set( 
      processes 
        .filter((process) => process.taskId) 
        .map((process) => process.taskId) 
    ) 
 
    const importedProcesses = tasks 
      .filter((task) => !existingTaskIds.has(task.taskId)) 
      .map((task, index) => { 
        const priorityText = String( 
          task.priority || "Medium" 
        ).toLowerCase() 
 
        let priority = 5 
        let burstTime = 6 
 
        if (priorityText === "high") { 
          priority = 2 
          burstTime = 4 
        } else if (priorityText === "low") { 
          priority = 8 
          burstTime = 8 
        } 
 
        return { 
          id: `T${index + 1}-${String(task.taskId || "TASK").slice(-4)}`, 
          arrivalTime: index, 
          burstTime, 
          priority, 
          queue: priorityText === "high" ? 1 : 2, 
          source: "Enterprise Task", 
          taskId: task.taskId, 
          taskTitle: task.title, 
          assignedTo: task.assignedTo, 
          department: task.department, 
          taskPriority: task.priority, 
          taskStatus: task.status, 
        } 
      }) 
 
    if (importedProcesses.length === 0) { 
      setTaskMessage("All enterprise tasks are already imported.") 
      return 
    } 
 
    setProcesses((current) => [ 
      ...current, 
      ...importedProcesses, 
    ]) 
 
    setResult(null) 
 
    setTaskMessage( 
      `${importedProcesses.length} enterprise task process${ 
        importedProcesses.length > 1 ? "es" : "" 
      } imported successfully.` 
    ) 
  } 
 
  /* -------------------- PROCESS MANAGEMENT -------------------- */ 
 
  const addProcess = () => { 
    const nextNumber = 
      processes.length === 0 
        ? 1 
        : Math.max( 
            ...processes.map((p) => { 
              const match = String(p.id).match(/\d+/) 
              return match ? Number(match[0]) : 0 
            }) 
          ) + 1 
 
    const process = { 
      id: `P${nextNumber}`, 
      arrivalTime: Math.max( 
        0, 
        Number(newProcess.arrivalTime) 
      ), 
      burstTime: Math.max( 
        1, 
        Number(newProcess.burstTime) 
      ), 
      priority: Math.max( 
        1, 
        Number(newProcess.priority) 
      ), 
      queue: Number(newProcess.queue), 
      source: "Manual", 
    } 
 
    setProcesses((current) => [...current, process]) 
    setResult(null) 
  } 
 
  const deleteProcess = (id) => { 
    setProcesses((current) => 
      current.filter((process) => process.id !== id) 
    ) 
 
    setResult(null) 
  } 
 
  const resetProcesses = () => { 
    setProcesses(initialProcesses) 
    setResult(null) 
    setTaskMessage("") 
  } 
 
  const updateProcess = (id, field, value) => { 
    setProcesses((current) => 
      current.map((process) => 
        process.id === id 
          ? { 
              ...process, 
              [field]: Number(value), 
            } 
          : process 
      ) 
    ) 
 
    setResult(null) 
  } 
 
  /* -------------------- METRICS -------------------- */ 
 
  const calculateMetrics = ( 
    completedProcesses, 
    gantt 
  ) => { 
    const finalProcesses = completedProcesses.map( 
      (process) => { 
        const completionTime = Number( 
          process.completionTime ?? 0 
        ) 
 
        const turnaroundTime = 
          completionTime - process.arrivalTime 
 
        const waitingTime = 
          turnaroundTime - process.burstTime 
 
        const responseTime = 
          Number(process.firstStart ?? 0) - 
          process.arrivalTime 
 
        return { 
          ...process, 
          completionTime, 
          turnaroundTime, 
          waitingTime: Math.max(0, waitingTime), 
          responseTime: Math.max(0, responseTime), 
        } 
      } 
    ) 
 
    const average = (field) => 
      finalProcesses.length === 0 
        ? "0.00" 
        : ( 
            finalProcesses.reduce( 
              (sum, process) => 
                sum + Number(process[field] || 0), 
              0 
            ) / finalProcesses.length 
          ).toFixed(2) 
 
    return { 
      processes: finalProcesses, 
      gantt: mergeGantt(gantt), 
      averages: { 
        completionTime: average("completionTime"), 
        turnaroundTime: average("turnaroundTime"), 
        waitingTime: average("waitingTime"), 
        responseTime: average("responseTime"), 
      }, 
    } 
  } 
 
  /* -------------------- FCFS -------------------- */ 
 
  const runFCFS = (input) => { 
    const sorted = [...input].sort( 
      (a, b) => 
        a.arrivalTime - b.arrivalTime 
    ) 
 
    let time = 0 
    const gantt = [] 
    const completed = [] 
 
    sorted.forEach((process) => { 
      if (time < process.arrivalTime) { 
        gantt.push({ 
          id: "Idle", 
          start: time, 
          end: process.arrivalTime, 
        }) 
 
        time = process.arrivalTime 
      } 
 
      const start = time 
      const end = time + process.burstTime 
 
      gantt.push({ 
        id: process.id, 
        start, 
        end, 
      }) 
 
      completed.push({ 
        ...process, 
        firstStart: start, 
        completionTime: end, 
      }) 
 
      time = end 
    }) 
 
    return calculateMetrics(completed, gantt) 
  } 
 
  /* -------------------- SJF -------------------- */ 
 
  const runSJF = (input, preemptive = false) => { 
    if (preemptive) { 
      return runSRTF(input) 
    } 
 
    let time = 0 
    let completedCount = 0 
 
    const remaining = input.map((p) => ({ 
      ...p, 
      completed: false, 
    })) 
 
    const gantt = [] 
    const completed = [] 
 
    while ( 
      completedCount < remaining.length 
    ) { 
      const available = remaining.filter( 
        (p) => 
          !p.completed && 
          p.arrivalTime <= time 
      ) 
 
      if (available.length === 0) { 
        const next = remaining 
          .filter((p) => !p.completed) 
          .sort( 
            (a, b) => 
              a.arrivalTime - b.arrivalTime 
          )[0] 
 
        gantt.push({ 
          id: "Idle", 
          start: time, 
          end: next.arrivalTime, 
        }) 
 
        time = next.arrivalTime 
        continue 
      } 
 
      available.sort((a, b) => { 
        if (a.burstTime !== b.burstTime) { 
          return a.burstTime - b.burstTime 
        } 
 
        return a.arrivalTime - b.arrivalTime 
      }) 
 
      const selected = available[0] 
 
      const start = time 
      const end = time + selected.burstTime 
 
      gantt.push({ 
        id: selected.id, 
        start, 
        end, 
      }) 
 
      selected.completed = true 
 
      completed.push({ 
        ...selected, 
        firstStart: start, 
        completionTime: end, 
      }) 
 
      time = end 
      completedCount++ 
    } 
 
    return calculateMetrics( 
      completed, 
      gantt 
    ) 
  } 
 
  /* -------------------- SRTF -------------------- */ 
 
  const runSRTF = (input) => { 
    const remaining = input.map((p) => ({ 
      ...p, 
      remainingTime: p.burstTime, 
      firstStart: null, 
      completionTime: null, 
    })) 
 
    let time = 0 
    let completedCount = 0 
 
    const gantt = [] 
 
    let previousProcess = null 
    let segmentStart = 0 
 
    while ( 
      completedCount < remaining.length 
    ) { 
      const available = remaining.filter( 
        (p) => 
          p.arrivalTime <= time && 
          p.remainingTime > 0 
      ) 
 
      if (available.length === 0) { 
        const nextArrival = Math.min( 
          ...remaining 
            .filter( 
              (p) => p.remainingTime > 0 
            ) 
            .map((p) => p.arrivalTime) 
        ) 
 
        if (previousProcess !== "Idle") { 
          if (previousProcess !== null) { 
            gantt.push({ 
              id: previousProcess, 
              start: segmentStart, 
              end: time, 
            }) 
          } 
 
          segmentStart = time 
          previousProcess = "Idle" 
        } 
 
        time = nextArrival 
        continue 
      } 
 
      available.sort((a, b) => { 
        if ( 
          a.remainingTime !== 
          b.remainingTime 
        ) { 
          return ( 
            a.remainingTime - 
            b.remainingTime 
          ) 
        } 
 
        return ( 
          a.arrivalTime - 
          b.arrivalTime 
        ) 
      }) 
 
      const selected = available[0] 
 
      if (selected.firstStart === null) { 
        selected.firstStart = time 
      } 
 
      if ( 
        previousProcess !== selected.id 
      ) { 
        if (previousProcess !== null) { 
          gantt.push({ 
            id: previousProcess, 
            start: segmentStart, 
            end: time, 
          }) 
        } 
 
        segmentStart = time 
        previousProcess = selected.id 
      } 
 
      selected.remainingTime-- 
      time++ 
 
      if (selected.remainingTime === 0) { 
        selected.completionTime = time 
        completedCount++ 
      } 
    } 
 
    if (previousProcess !== null) { 
      gantt.push({ 
        id: previousProcess, 
        start: segmentStart, 
        end: time, 
      }) 
    } 
 
    return calculateMetrics( 
      remaining, 
      gantt 
    ) 
  } 
 
  /* -------------------- PRIORITY -------------------- */ 
 
  const runPriority = ( 
    input, 
    preemptive = false 
  ) => { 
    if (preemptive) { 
      return runPriorityPreemptive(input) 
    } 
 
    let time = 0 
    let completedCount = 0 
 
    const remaining = input.map((p) => ({ 
      ...p, 
      completed: false, 
    })) 
 
    const gantt = [] 
    const completed = [] 
 
    while ( 
      completedCount < remaining.length 
    ) { 
      const available = remaining.filter( 
        (p) => 
          !p.completed && 
          p.arrivalTime <= time 
      ) 
 
      if (available.length === 0) { 
        const next = remaining 
          .filter((p) => !p.completed) 
          .sort( 
            (a, b) => 
              a.arrivalTime - b.arrivalTime 
          )[0] 
 
        gantt.push({ 
          id: "Idle", 
          start: time, 
          end: next.arrivalTime, 
        }) 
 
        time = next.arrivalTime 
        continue 
      } 
 
      available.sort((a, b) => { 
        if (a.priority !== b.priority) { 
          return a.priority - b.priority 
        } 
 
        return ( 
          a.arrivalTime - 
          b.arrivalTime 
        ) 
      }) 
 
      const selected = available[0] 
 
      const start = time 
      const end = 
        time + selected.burstTime 
 
      gantt.push({ 
        id: selected.id, 
        start, 
        end, 
      }) 
 
      selected.completed = true 
 
      completed.push({ 
        ...selected, 
        firstStart: start, 
        completionTime: end, 
      }) 
 
      time = end 
      completedCount++ 
    } 
 
    return calculateMetrics( 
      completed, 
      gantt 
    ) 
  } 
 
  /* -------------------- PRIORITY PREEMPTIVE -------------------- */ 
 
  const runPriorityPreemptive = ( 
    input 
  ) => { 
    const remaining = input.map((p) => ({ 
      ...p, 
      remainingTime: p.burstTime, 
      firstStart: null, 
      completionTime: null, 
    })) 
 
    let time = 0 
    let completedCount = 0 
 
    const gantt = [] 
 
    let previousProcess = null 
    let segmentStart = 0 
 
    while ( 
      completedCount < remaining.length 
    ) { 
      const available = remaining.filter( 
        (p) => 
          p.arrivalTime <= time && 
          p.remainingTime > 0 
      ) 
 
      if (available.length === 0) { 
        const nextArrival = Math.min( 
          ...remaining 
            .filter( 
              (p) => p.remainingTime > 0 
            ) 
            .map((p) => p.arrivalTime) 
        ) 
 
        if (previousProcess !== "Idle") { 
          if (previousProcess !== null) { 
            gantt.push({ 
              id: previousProcess, 
              start: segmentStart, 
              end: time, 
            }) 
          } 
 
          segmentStart = time 
          previousProcess = "Idle" 
        } 
 
        time = nextArrival 
        continue 
      } 
 
      available.sort((a, b) => { 
        if (a.priority !== b.priority) { 
          return ( 
            a.priority - b.priority 
          ) 
        } 
 
        return ( 
          a.arrivalTime - 
          b.arrivalTime 
        ) 
      }) 
 
      const selected = available[0] 
 
      if (selected.firstStart === null) { 
        selected.firstStart = time 
      } 
 
      if ( 
        previousProcess !== selected.id 
      ) { 
        if (previousProcess !== null) { 
          gantt.push({ 
            id: previousProcess, 
            start: segmentStart, 
            end: time, 
          }) 
        } 
 
        segmentStart = time 
        previousProcess = selected.id 
      } 
 
      selected.remainingTime-- 
      time++ 
 
      if (selected.remainingTime === 0) { 
        selected.completionTime = time 
        completedCount++ 
      } 
    } 
 
    if (previousProcess !== null) { 
      gantt.push({ 
        id: previousProcess, 
        start: segmentStart, 
        end: time, 
      }) 
    } 
 
    return calculateMetrics( 
      remaining, 
      gantt 
    ) 
  } 
 
  /* -------------------- ROUND ROBIN -------------------- */ 
 
  const runRoundRobin = (input) => { 
    const sorted = [...input].sort( 
      (a, b) => 
        a.arrivalTime - b.arrivalTime 
    ) 
 
    const remaining = sorted.map((p) => ({ 
      ...p, 
      remainingTime: p.burstTime, 
      firstStart: null, 
      completionTime: null, 
    })) 
 
    const queue = [] 
    const gantt = [] 
 
    let time = 0 
    let index = 0 
    let completedCount = 0 
 
    while ( 
      completedCount < remaining.length 
    ) { 
      while ( 
        index < remaining.length && 
        remaining[index].arrivalTime <= time 
      ) { 
        queue.push(remaining[index]) 
        index++ 
      } 
 
      if (queue.length === 0) { 
        time = 
          remaining[index].arrivalTime 
        continue 
      } 
 
      const current = queue.shift() 
 
      if (current.firstStart === null) { 
        current.firstStart = time 
      } 
 
      const executionTime = Math.min( 
        quantum, 
        current.remainingTime 
      ) 
 
      const start = time 
 
      time += executionTime 
      current.remainingTime -= 
        executionTime 
 
      gantt.push({ 
        id: current.id, 
        start, 
        end: time, 
      }) 
 
      while ( 
        index < remaining.length && 
        remaining[index].arrivalTime <= time 
      ) { 
        queue.push(remaining[index]) 
        index++ 
      } 
 
      if (current.remainingTime > 0) { 
        queue.push(current) 
      } else { 
        current.completionTime = time 
        completedCount++ 
      } 
    } 
 
    return calculateMetrics( 
      remaining, 
      gantt 
    ) 
  } 
 
  /* -------------------- MULTILEVEL QUEUE -------------------- */ 
 
  const runMLQ = (input) => { 
    const queue1 = input.filter( 
      (p) => p.queue === 1 
    ) 
 
    const queue2 = input.filter( 
      (p) => p.queue === 2 
    ) 
 
    const first = runFCFS(queue1) 
 
    const second = 
      runRoundRobinForMLQ(queue2) 
 
    const offset = 
      first.gantt.length > 0 
        ? first.gantt[ 
            first.gantt.length - 1 
          ].end 
        : 0 
 
    const secondGantt = 
      second.gantt.map((g) => ({ 
        ...g, 
        start: g.start + offset, 
        end: g.end + offset, 
      })) 
 
    const allGantt = [ 
      ...first.gantt, 
      ...secondGantt, 
    ] 
 
    const combined = input.map((p) => { 
      const source = 
        first.processes.find( 
          (x) => x.id === p.id 
        ) || 
        second.processes.find( 
          (x) => x.id === p.id 
        ) 
 
      return { 
        ...p, 
        firstStart: 
          source?.firstStart ?? 0, 
        completionTime: 
          source?.completionTime ?? 0, 
      } 
    }) 
 
    return calculateMetrics( 
      combined, 
      allGantt 
    ) 
  } 
 
  const runRoundRobinForMLQ = ( 
    input 
  ) => { 
    if (input.length === 0) { 
      return { 
        processes: [], 
        gantt: [], 
      } 
    } 
 
    const sorted = [...input].sort( 
      (a, b) => 
        a.arrivalTime - b.arrivalTime 
    ) 
 
    const remaining = sorted.map((p) => ({ 
      ...p, 
      remainingTime: p.burstTime, 
      firstStart: null, 
      completionTime: null, 
    })) 
 
    const queue = [] 
 
    let time = 0 
    let index = 0 
    let completedCount = 0 
 
    const gantt = [] 
 
    while ( 
      completedCount < remaining.length 
    ) { 
      while ( 
        index < remaining.length && 
        remaining[index].arrivalTime <= time 
      ) { 
        queue.push(remaining[index]) 
        index++ 
      } 
 
      if (queue.length === 0) { 
        time = 
          remaining[index].arrivalTime 
        continue 
      } 
 
      const current = queue.shift() 
 
      if (current.firstStart === null) { 
        current.firstStart = time 
      } 
 
      const execute = Math.min( 
        quantum, 
        current.remainingTime 
      ) 
 
      const start = time 
 
      time += execute 
      current.remainingTime -= execute 
 
      gantt.push({ 
        id: current.id, 
        start, 
        end: time, 
      }) 
 
      while ( 
        index < remaining.length && 
        remaining[index].arrivalTime <= time 
      ) { 
        queue.push(remaining[index]) 
        index++ 
      } 
 
      if (current.remainingTime > 0) { 
        queue.push(current) 
      } else { 
        current.completionTime = time 
        completedCount++ 
      } 
    } 
 
    return calculateMetrics( 
      remaining, 
      gantt 
    ) 
  } 
 
  /* -------------------- MLFQ -------------------- */ 
 
  const runMLFQ = (input) => { 
    const sorted = [...input] 
      .sort( 
        (a, b) => 
          a.arrivalTime - b.arrivalTime 
      ) 
      .map((p) => ({ 
        ...p, 
        remainingTime: p.burstTime, 
        firstStart: null, 
        completionTime: null, 
      })) 
 
    const q1 = [] 
    const q2 = [] 
    const q3 = [] 
 
    let time = 0 
    let index = 0 
    let completedCount = 0 
 
    const gantt = [] 
 
    while ( 
      completedCount < sorted.length 
    ) { 
      while ( 
        index < sorted.length && 
        sorted[index].arrivalTime <= time 
      ) { 
        q1.push(sorted[index]) 
        index++ 
      } 
 
      if ( 
        q1.length === 0 && 
        q2.length === 0 && 
        q3.length === 0 
      ) { 
        time = 
          sorted[index].arrivalTime 
        continue 
      } 
 
      let current 
      let queueNumber 
 
      if (q1.length > 0) { 
        current = q1.shift() 
        queueNumber = 1 
      } else if (q2.length > 0) { 
        current = q2.shift() 
        queueNumber = 2 
      } else { 
        current = q3.shift() 
        queueNumber = 3 
      } 
 
      if (current.firstStart === null) { 
        current.firstStart = time 
      } 
 
      let execute 
 
      if (queueNumber === 1) { 
        execute = Math.min( 
          2, 
          current.remainingTime 
        ) 
      } else if (queueNumber === 2) { 
        execute = Math.min( 
          4, 
          current.remainingTime 
        ) 
      } else { 
        execute = current.remainingTime 
      } 
 
      const start = time 
 
      time += execute 
      current.remainingTime -= execute 
 
      gantt.push({ 
        id: current.id, 
        start, 
        end: time, 
      }) 
 
      while ( 
        index < sorted.length && 
        sorted[index].arrivalTime <= time 
      ) { 
        q1.push(sorted[index]) 
        index++ 
      } 
 
      if (current.remainingTime > 0) { 
        if (queueNumber === 1) { 
          q2.push(current) 
        } else { 
          q3.push(current) 
        } 
      } else { 
        current.completionTime = time 
        completedCount++ 
      } 
    } 
 
    return calculateMetrics( 
      sorted, 
      gantt 
    ) 
  } 
 
  /* -------------------- GANTT MERGE -------------------- */ 
 
  const mergeGantt = (gantt) => { 
    if (gantt.length === 0) { 
      return [] 
    } 
 
    const merged = [ 
      { ...gantt[0] }, 
    ] 
 
    for (let i = 1; i < gantt.length; i++) { 
      const last = 
        merged[merged.length - 1] 
 
      const current = gantt[i] 
 
      if ( 
        last.id === current.id && 
        last.end === current.start 
      ) { 
        last.end = current.end 
      } else { 
        merged.push({ 
          ...current, 
        }) 
      } 
    } 
 
    return merged 
  } 
 
  /* -------------------- RUN SCHEDULING -------------------- */ 
 
  const runScheduling = () => { 
    if (processes.length === 0) { 
      return 
    } 
 
    let schedulingResult 
 
    switch (algorithm) { 
      case "FCFS": 
        schedulingResult = 
          runFCFS(processes) 
        break 
 
      case "SJF (Non-Preemptive)": 
        schedulingResult = 
          runSJF(processes, false) 
        break 
 
      case "SJF (Preemptive / SRTF)": 
        schedulingResult = 
          runSJF(processes, true) 
        break 
 
      case "Priority (Non-Preemptive)": 
        schedulingResult = 
          runPriority(processes, false) 
        break 
 
      case "Priority (Preemptive)": 
        schedulingResult = 
          runPriority(processes, true) 
        break 
 
      case "Round Robin": 
        schedulingResult = 
          runRoundRobin(processes) 
        break 
 
      case "Multilevel Queue": 
        schedulingResult = 
          runMLQ(processes) 
        break 
 
      case "Multilevel Feedback Queue": 
        schedulingResult = 
          runMLFQ(processes) 
        break 
 
      default: 
        schedulingResult = 
          runFCFS(processes) 
    } 
 
    setResult(schedulingResult) 
  } 
 
  const totalBurst = useMemo( 
    () => 
      processes.reduce( 
        (sum, process) => 
          sum + Number(process.burstTime), 
        0 
      ), 
    [processes] 
  ) 
 
  const taskProcessCount = processes.filter( 
    (process) => 
      process.source === "Enterprise Task" 
  ).length 
 
  return ( 
    <div className="min-h-screen bg-gray-50 p-4 md:p-6"> 
      <div className="mx-auto max-w-7xl space-y-6"> 
 
        {/* HEADER */} 
        <div> 
          <h1 className="text-3xl font-bold text-gray-800"> 
            CPU Scheduling 
          </h1> 
 
          <p className="mt-2 text-gray-500"> 
            Interactive CPU scheduling simulator 
            connected with Enterprise Task processes. 
          </p> 
        </div> 
 
        {/* INFORMATION */} 
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5"> 
          <div className="flex gap-3"> 
            <FaInfoCircle className="mt-1 text-blue-600" /> 
 
            <div> 
              <h2 className="font-semibold text-blue-800"> 
                Scheduling Simulator 
              </h2> 
 
              <p className="mt-1 text-sm leading-6 text-blue-700"> 
                Add processes manually or import 
                Enterprise Tasks as simulated CPU 
                processes. Select a scheduling algorithm 
                and run the simulation. 
              </p> 
            </div> 
          </div> 
        </div> 
 
        {/* ENTERPRISE TASK INTEGRATION */} 
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> 
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"> 
            <div> 
              <div className="flex items-center gap-2"> 
                <FaTasks className="text-blue-600" /> 
 
                <h2 className="text-xl font-semibold text-gray-800"> 
                  Enterprise Task Integration 
                </h2> 
              </div> 
 
              <p className="mt-1 text-sm text-gray-500"> 
                Import tasks from the Enterprise Collaboration 
                Platform into the CPU scheduling simulator. 
              </p> 
            </div> 
 
            <div className="flex flex-wrap gap-2"> 
              <button 
                onClick={fetchTasks} 
                disabled={taskLoading} 
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60" 
              > 
                <FaSyncAlt 
                  className={ 
                    taskLoading 
                      ? "animate-spin" 
                      : "" 
                  } 
                /> 
 
                {taskLoading 
                  ? "Refreshing..." 
                  : "Refresh Tasks"} 
              </button> 
 
              <button 
                onClick={importTasksAsProcesses} 
                disabled={tasks.length === 0} 
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400" 
              > 
                <FaTasks /> 
                Import Tasks 
              </button> 
            </div> 
          </div> 
 
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3"> 
            <IntegrationCard 
              title="Available Tasks" 
              value={tasks.length} 
            /> 
 
            <IntegrationCard 
              title="Imported Processes" 
              value={taskProcessCount} 
            /> 
 
            <IntegrationCard 
              title="Total CPU Processes" 
              value={processes.length} 
            /> 
          </div> 
 
          {taskMessage && ( 
            <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700"> 
              {taskMessage} 
            </div> 
          )} 
        </div> 
 
        {/* ALGORITHM SELECTION */} 
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> 
          <h2 className="mb-4 text-xl font-semibold text-gray-800"> 
            Select Scheduling Algorithm 
          </h2> 
 
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4"> 
            {algorithms.map((item) => ( 
              <button 
                key={item} 
                onClick={() => { 
                  setAlgorithm(item) 
                  setResult(null) 
                }} 
                className={`rounded-xl border p-4 text-left transition ${ 
                  algorithm === item 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/40" 
                }`} 
              > 
                <div className="font-semibold"> 
                  {item} 
                </div> 
              </button> 
            ))} 
          </div> 
 
          {algorithm === "Round Robin" && ( 
            <div className="mt-4 max-w-xs"> 
              <label className="mb-2 block text-sm font-medium text-gray-700"> 
                Time Quantum 
              </label> 
 
              <input 
                type="number" 
                min="1" 
                value={quantum} 
                onChange={(e) => 
                  setQuantum( 
                    Math.max( 
                      1, 
                      Number(e.target.value) 
                    ) 
                  ) 
                } 
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" 
              /> 
            </div> 
          )} 
        </div> 
 
        {/* ADD PROCESS */} 
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> 
          <h2 className="mb-4 text-xl font-semibold text-gray-800"> 
            Add Process 
          </h2> 
 
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4"> 
            <InputField 
              label="Arrival Time" 
              type="number" 
              min="0" 
              value={newProcess.arrivalTime} 
              onChange={(e) => 
                setNewProcess({ 
                  ...newProcess, 
                  arrivalTime: e.target.value, 
                }) 
              } 
            /> 
 
            <InputField 
              label="Burst Time" 
              type="number" 
              min="1" 
              value={newProcess.burstTime} 
              onChange={(e) => 
                setNewProcess({ 
                  ...newProcess, 
                  burstTime: e.target.value, 
                }) 
              } 
            /> 
 
            <InputField 
              label="Priority" 
              type="number" 
              min="1" 
              value={newProcess.priority} 
              onChange={(e) => 
                setNewProcess({ 
                  ...newProcess, 
                  priority: e.target.value, 
                }) 
              } 
            /> 
 
            <div> 
              <label className="mb-2 block text-sm text-gray-600"> 
                Queue 
              </label> 
 
              <select 
                value={newProcess.queue} 
                onChange={(e) => 
                  setNewProcess({ 
                    ...newProcess, 
                    queue: Number( 
                      e.target.value 
                    ), 
                  }) 
                } 
                className="w-full rounded-lg border border-gray-300 px-3 py-2" 
              > 
                <option value={1}> 
                  Queue 1 
                </option> 
 
                <option value={2}> 
                  Queue 2 
                </option> 
              </select> 
            </div> 
          </div> 
 
          <button 
            onClick={addProcess} 
            className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700" 
          > 
            <FaPlus /> 
            Add Process 
          </button> 
        </div> 
 
        {/* PROCESS TABLE */} 
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> 
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"> 
            <div> 
              <h2 className="text-xl font-semibold text-gray-800"> 
                Process Input 
              </h2> 
 
              <p className="mt-1 text-sm text-gray-500"> 
                Total burst time: {totalBurst} units 
              </p> 
            </div> 
 
            <button 
              onClick={resetProcesses} 
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50" 
            > 
              <FaRedo /> 
              Reset 
            </button> 
          </div> 
 
          <div className="overflow-x-auto"> 
            <table className="w-full min-w-[1050px] border-collapse"> 
              <thead> 
                <tr className="border-b bg-gray-50 text-left text-sm text-gray-600"> 
                  <th className="p-3"> 
                    Process 
                  </th> 
 
                  <th className="p-3"> 
                    Source 
                  </th> 
 
                  <th className="p-3"> 
                    Arrival 
                  </th> 
 
                  <th className="p-3"> 
                    Burst 
                  </th> 
 
                  <th className="p-3"> 
                    Priority 
                  </th> 
 
                  <th className="p-3"> 
                    Queue 
                  </th> 
 
                  <th className="p-3"> 
                    Task / Employee 
                  </th> 
 
                  <th className="p-3"> 
                    Action 
                  </th> 
                </tr> 
              </thead> 
 
              <tbody> 
                {processes.map((process) => ( 
                  <tr 
                    key={process.id} 
                    className="border-b last:border-0 hover:bg-gray-50" 
                  > 
                    <td className="p-3 font-semibold text-blue-600"> 
                      {process.id} 
                    </td> 
 
                    <td className="p-3"> 
                      {process.source === 
                      "Enterprise Task" ? ( 
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700"> 
                          Enterprise Task 
                        </span> 
                      ) : ( 
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"> 
                          Manual 
                        </span> 
                      )} 
                    </td> 
 
                    <td className="p-3"> 
                      <input 
                        type="number" 
                        min="0" 
                        value={ 
                          process.arrivalTime 
                        } 
                        onChange={(e) => 
                          updateProcess( 
                            process.id, 
                            "arrivalTime", 
                            e.target.value 
                          ) 
                        } 
                        className="w-20 rounded border border-gray-300 px-2 py-1" 
                      /> 
                    </td> 
 
                    <td className="p-3"> 
                      <input 
                        type="number" 
                        min="1" 
                        value={ 
                          process.burstTime 
                        } 
                        onChange={(e) => 
                          updateProcess( 
                            process.id, 
                            "burstTime", 
                            e.target.value 
                          ) 
                        } 
                        className="w-20 rounded border border-gray-300 px-2 py-1" 
                      /> 
                    </td> 
 
                    <td className="p-3"> 
                      <input 
                        type="number" 
                        min="1" 
                        value={ 
                          process.priority 
                        } 
                        onChange={(e) => 
                          updateProcess( 
                            process.id, 
                            "priority", 
                            e.target.value 
                          ) 
                        } 
                        className="w-20 rounded border border-gray-300 px-2 py-1" 
                      /> 
                    </td> 
 
                    <td className="p-3"> 
                      <select 
                        value={ 
                          process.queue 
                        } 
                        onChange={(e) => 
                          updateProcess( 
                            process.id, 
                            "queue", 
                            e.target.value 
                          ) 
                        } 
                        className="rounded border border-gray-300 px-2 py-1" 
                      > 
                        <option value={1}> 
                          Queue 1 
                        </option> 
 
                        <option value={2}> 
                          Queue 2 
                        </option> 
                      </select> 
                    </td> 
 
                    <td className="max-w-[220px] p-3"> 
                      {process.source === 
                      "Enterprise Task" ? ( 
                        <div> 
                          <div className="truncate font-medium text-gray-800"> 
                            {process.taskTitle} 
                          </div> 
 
                          <div className="text-xs text-gray-500"> 
                            {process.assignedTo} 
                          </div> 
                        </div> 
                      ) : ( 
                        <span className="text-gray-400"> 
                          — 
                        </span> 
                      )} 
                    </td> 
 
                    <td className="p-3"> 
                      <button 
                        onClick={() => 
                          deleteProcess( 
                            process.id 
                          ) 
                        } 
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50" 
                        title="Delete Process" 
                      > 
                        <FaTrash /> 
                      </button> 
                    </td> 
                  </tr> 
                ))} 
              </tbody> 
            </table> 
          </div> 
 
          {processes.length === 0 && ( 
            <div className="py-8 text-center text-gray-500"> 
              No processes available. Add or import 
              processes to continue. 
            </div> 
          )} 
 
          <button 
            onClick={runScheduling} 
            disabled={ 
              processes.length === 0 
            } 
            className="mt-5 flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400" 
          > 
            <FaPlay /> 
            Run {algorithm} 
          </button> 
        </div> 
 
        {/* RESULTS */} 
        {result && ( 
          <> 
            {/* GANTT */} 
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> 
              <div className="mb-5 flex items-center gap-2"> 
                <FaChartBar className="text-blue-600" /> 
 
                <h2 className="text-xl font-semibold text-gray-800"> 
                  Gantt Chart 
                </h2> 
              </div> 
 
              <div className="overflow-x-auto pb-3"> 
                <div className="flex min-w-max"> 
                  {result.gantt.map( 
                    (block, index) => { 
                      const duration = 
                        block.end - 
                        block.start 
 
                      return ( 
                        <div 
                          key={`${block.id}-${index}`} 
                          className={`flex h-20 flex-col items-center justify-center border border-white px-5 ${ 
                            block.id === 
                            "Idle" 
                              ? "bg-gray-300 text-gray-700" 
                              : "bg-blue-500 text-white" 
                          }`} 
                          style={{ 
                            minWidth: `${Math.max( 
                              duration * 55, 
                              75 
                            )}px`, 
                          }} 
                        > 
                          <span className="font-bold"> 
                            {block.id} 
                          </span> 
 
                          <span className="text-xs"> 
                            {block.start} -{" "} 
                            {block.end} 
                          </span> 
                        </div> 
                      ) 
                    } 
                  )} 
                </div> 
              </div> 
            </div> 
 
            {/* METRICS */} 
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4"> 
              <MetricCard 
                title="Avg Completion Time" 
                value={ 
                  result.averages 
                    .completionTime 
                } 
                icon={<FaClock />} 
              /> 
 
              <MetricCard 
                title="Avg Turnaround Time" 
                value={ 
                  result.averages 
                    .turnaroundTime 
                } 
                icon={<FaClock />} 
              /> 
 
              <MetricCard 
                title="Avg Waiting Time" 
                value={ 
                  result.averages 
                    .waitingTime 
                } 
                icon={<FaClock />} 
              /> 
 
              <MetricCard 
                title="Avg Response Time" 
                value={ 
                  result.averages 
                    .responseTime 
                } 
                icon={<FaClock />} 
              /> 
            </div> 
 
            {/* DETAILED RESULTS */} 
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> 
              <h2 className="mb-4 text-xl font-semibold text-gray-800"> 
                Scheduling Results 
              </h2> 
 
              <div className="overflow-x-auto"> 
                <table className="w-full min-w-[900px] border-collapse"> 
                  <thead> 
                    <tr className="border-b bg-gray-50 text-left text-sm text-gray-600"> 
                      <th className="p-3"> 
                        Process 
                      </th> 
 
                      <th className="p-3"> 
                        AT 
                      </th> 
 
                      <th className="p-3"> 
                        BT 
                      </th> 
 
                      <th className="p-3"> 
                        Priority 
                      </th> 
 
                      <th className="p-3"> 
                        CT 
                      </th> 
 
                      <th className="p-3"> 
                        TAT 
                      </th> 
 
                      <th className="p-3"> 
                        WT 
                      </th> 
 
                      <th className="p-3"> 
                        RT 
                      </th> 
                    </tr> 
                  </thead> 
 
                  <tbody> 
                    {result.processes.map( 
                      (process) => ( 
                        <tr 
                          key={process.id} 
                          className="border-b last:border-0" 
                        > 
                          <td className="p-3 font-semibold text-blue-600"> 
                            {process.id} 
                          </td> 
 
                          <td className="p-3"> 
                            { 
                              process.arrivalTime 
                            } 
                          </td> 
 
                          <td className="p-3"> 
                            { 
                              process.burstTime 
                            } 
                          </td> 
 
                          <td className="p-3"> 
                            { 
                              process.priority 
                            } 
                          </td> 
 
                          <td className="p-3"> 
                            { 
                              process.completionTime 
                            } 
                          </td> 
 
                          <td className="p-3"> 
                            { 
                              process.turnaroundTime 
                            } 
                          </td> 
 
                          <td className="p-3"> 
                            { 
                              process.waitingTime 
                            } 
                          </td> 
 
                          <td className="p-3"> 
                            { 
                              process.responseTime 
                            } 
                          </td> 
                        </tr> 
                      ) 
                    )} 
                  </tbody> 
                </table> 
              </div> 
            </div> 
 
            {/* FORMULAS */} 
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> 
              <h2 className="mb-4 text-xl font-semibold text-gray-800"> 
                Scheduling Metrics 
              </h2> 
 
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2"> 
                <Formula 
                  title="Completion Time (CT)" 
                  text="Time at which a process finishes execution." 
                /> 
 
                <Formula 
                  title="Turnaround Time (TAT)" 
                  text="TAT = CT − Arrival Time" 
                /> 
 
                <Formula 
                  title="Waiting Time (WT)" 
                  text="WT = TAT − Burst Time" 
                /> 
 
                <Formula 
                  title="Response Time (RT)" 
                  text="RT = First CPU Start Time − Arrival Time" 
                /> 
              </div> 
            </div> 
          </> 
        )} 
 
        {/* ALGORITHM DESCRIPTION */} 
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> 
          <h2 className="mb-4 text-xl font-semibold text-gray-800"> 
            Current Algorithm 
          </h2> 
 
          <AlgorithmDescription 
            algorithm={algorithm} 
          /> 
        </div> 
 
        {/* EDUCATIONAL NOTE */} 
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5"> 
          <div className="flex gap-3"> 
            <FaInfoCircle className="mt-1 text-amber-600" /> 
 
            <div> 
              <h2 className="font-semibold text-amber-800"> 
                Educational Simulation 
              </h2> 
 
              <p className="mt-1 text-sm leading-6 text-amber-700"> 
                Enterprise Tasks are converted into 
                simulated processes for demonstrating 
                CPU scheduling concepts. This does not 
                execute real operating-system processes. 
              </p> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
  ) 
} 
 
/* -------------------- SMALL COMPONENTS -------------------- */ 
 
function InputField({ 
  label, 
  type, 
  min, 
  value, 
  onChange, 
}) { 
  return ( 
    <div> 
      <label className="mb-2 block text-sm text-gray-600"> 
        {label} 
      </label> 
 
      <input 
        type={type} 
        min={min} 
        value={value} 
        onChange={onChange} 
        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500" 
      /> 
    </div> 
  ) 
} 
 
function IntegrationCard({ 
  title, 
  value, 
}) { 
  return ( 
    <div className="rounded-xl bg-gray-50 p-4"> 
      <div className="text-sm text-gray-500"> 
        {title} 
      </div> 
 
      <div className="mt-1 text-2xl font-bold text-gray-800"> 
        {value} 
      </div> 
    </div> 
  ) 
} 
 
function MetricCard({ 
  title, 
  value, 
  icon, 
}) { 
  return ( 
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"> 
      <div className="mb-3 flex items-center gap-2 text-blue-600"> 
        {icon} 
 
        <span className="text-sm font-medium text-gray-500"> 
          {title} 
        </span> 
      </div> 
 
      <div className="text-3xl font-bold text-gray-800"> 
        {value} 
      </div> 
    </div> 
  ) 
} 
 
function Formula({ 
  title, 
  text, 
}) { 
  return ( 
    <div className="rounded-xl bg-gray-50 p-4"> 
      <h3 className="font-semibold text-gray-800"> 
        {title} 
      </h3> 
 
      <p className="mt-1 text-sm text-gray-600"> 
        {text} 
      </p> 
    </div> 
  ) 
} 
 
function AlgorithmDescription({ 
  algorithm, 
}) { 
  const descriptions = { 
    FCFS: 
      "First Come First Serve executes processes in the order in which they arrive. It is simple and non-preemptive.", 
 
    "SJF (Non-Preemptive)": 
      "Shortest Job First selects the available process with the smallest burst time. Once selected, the process runs until completion.", 
 
    "SJF (Preemptive / SRTF)": 
      "Shortest Remaining Time First is the preemptive version of SJF. The process with the smallest remaining execution time receives the CPU.", 
 
    "Priority (Non-Preemptive)": 
      "The available process with the highest priority is selected. In this simulator, priority number 1 represents the highest priority.", 
 
    "Priority (Preemptive)": 
      "The CPU can be taken from the current process when another process with a higher priority arrives.", 
 
    "Round Robin": 
      "Round Robin gives every ready process a fixed time quantum and repeatedly cycles through the ready queue.", 
 
    "Multilevel Queue": 
      "Processes are divided into separate queues. Queue 1 uses FCFS and Queue 2 uses Round Robin in this educational simulation.", 
 
    "Multilevel Feedback Queue": 
      "Processes can move between queues based on CPU usage. Higher queues receive shorter time slices while lower queues receive longer execution periods.", 
  } 
 
  return ( 
    <p className="leading-7 text-gray-600"> 
      {descriptions[algorithm]} 
    </p> 
  ) 
} 
 
export default CPUScheduling                