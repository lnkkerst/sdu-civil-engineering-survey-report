export function dms2Number(dms: Dms): number {
  return dms.degree + (dms.second / 60 + dms.minute) / 60
}

export function number2Dms(angle: number): Dms {
  const degree = Math.floor(angle)
  let remain = angle - degree
  remain *= 60
  const minute = Math.floor(remain)
  remain -= minute
  const second = remain * 60
  return {
    degree,
    minute,
    second,
  }
}
