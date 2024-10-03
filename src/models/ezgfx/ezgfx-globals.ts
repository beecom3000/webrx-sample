import type { SubShader } from '@/models/ezgl/sub-shader'

interface GlobalState {
  fSSC0: string | null,
  vSS: SubShader | null,
  fSSC1: string | null,
  fSS: SubShader | null,
  triangle: number[]
}

const ezgfxGlobals: GlobalState = {
  fSSC0: null,
  vSS: null,
  fSSC1: null,
  fSS: null,
  triangle: []
};

export default ezgfxGlobals;