import type Dms from './Dms'

export default interface Point {
  uuid: string
  id: string
  angle: Dms
}
