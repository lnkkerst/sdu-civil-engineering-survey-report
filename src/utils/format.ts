import { number2Dms } from './convert'

export function prettifyDms(angle: Dms | number): string {
  if (typeof angle === 'number')
    angle = number2Dms(angle)

  return `${angle.degree}° ${angle.minute}′ ${angle.second.toFixed(0)}″`
}
