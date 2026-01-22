import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'

export const Route = createFileRoute('/_authenticated/judge-dashboard/')({
  component: Dashboard,
})

// function JudgeDashboard() {
//   const [challenges, setChallenges] = useState<any[]>([])

//   useEffect(() => {
//     getAssignedChallenges().then(setChallenges)
//   }, [])

//   return (
//     <div className="space-y-4 p-6">
//       <h1 className="text-2xl font-semibold">Dashboard</h1>

//       {challenges.length === 0 && (
//         <p className="text-muted-foreground">No assigned challenges</p>
//       )}

//       {challenges.map((c) => (
//         <Card key={c.id} className="p-4">
//           <div className="font-medium">{c.title}</div>
//           <div className="text-sm text-muted-foreground">
//             Status: {c.status}
//           </div>
//         </Card>
//       ))}
//     </div>
//   )
// }
