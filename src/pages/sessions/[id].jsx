import { useRouter } from 'next/router'

export default function SessionDetail() {
  const router = useRouter()
  const { id } = router.query

  return (
    <div>
      <h1>Session Detail</h1>
      {id && <p>Session ID: {id}</p>}
    </div>
  )
}

