import dynamic from 'next/dynamic'
import { useGameStore } from '../store/useGameStore'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false })

export default function Page() {
  const { status, gas, reset } = useGameStore()

  return (
    <div className='relative h-full w-full bg-black'>
      <div className='absolute left-10 top-10 z-10 text-white'>
        <h1 className='text-2xl font-bold'>OBJETIVO: COLETAR GASOLINA ({gas}/3)</h1>
      </div>

      {status === 'dead' && (
        <div className='absolute inset-0 z-50 flex flex-col items-center justify-center bg-red-900 bg-opacity-90 text-white'>
          <h1 className='text-6xl font-black'>VOCÊ FOI MORTO</h1>
          <button onClick={() => window.location.reload()} className='mt-8 bg-white px-8 py-3 text-black font-bold'>REINICIAR</button>
        </div>
      )}

      <div className='h-screen w-screen'>
        <Scene />
      </div>
    </div>
  )
}
