import React, { useState, useEffect } from 'react'
import { supabase } from '../integrations/supabase/client'

interface DemoDataRow {
  name: string
  created_at: string
}

export default function DemoPage() {
  const [name, setName] = useState('')
  const [data, setData] = useState<DemoDataRow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: fetchedData, error } = await supabase
      .from('demo_data')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch Error:', error)
      alert('Failed to fetch data: ' + error.message)
    } else {
      setData(fetchedData || [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('demo_data')
      .insert([{ name }])

    if (error) {
      console.error('Insert Error:', error)
      alert('Insert failed: ' + error.message)
    } else {
      setName('')
      fetchData()
      alert('Data inserted successfully!')
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2>🚀 Supabase Demo</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Enter a name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: '0.5rem', width: '70%', marginRight: '0.5rem' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>

      <h3>Stored Data:</h3>
      {data.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <ul>
          {data.map((row, idx) => (
            <li key={idx}>
              {row.name} — {new Date(row.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
