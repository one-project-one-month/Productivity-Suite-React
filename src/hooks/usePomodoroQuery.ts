
import { fetchPomodoroSession } from "@/service/PomodoroService"
import { useQuery } from "@tanstack/react-query"

export const usePomodoroQuery = () => {
  return useQuery({
    queryKey : ['pomodoro'],
    queryFn: fetchPomodoroSession
  })
}
