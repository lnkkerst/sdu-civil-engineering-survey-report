<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import type Dms from '~/types/bi-he-dao-xian-zuo-biao-ji-suan-biao/Dms'
import type Point from '~/types/bi-he-dao-xian-zuo-biao-ji-suan-biao/Point'
import { dms2Number } from '~/utils/convert'
import { prettifyDms } from '~/utils/format'

const table = ref()
const points = useStorage<Point[]>(
  'sdu-gccl-bi-he-dao-xian-zuo-biao-ji-suan-biao-points',
  [],
  localStorage,
)

const zhuanZheJiaoSum = computed(() => {
  if (!points.value.length)
    return 0

  return points.value
    .map(el => dms2Number(el.angle))
    .reduce((prev, cur) => prev + cur)
})

const distance = useStorage<number[]>(
  'sdu-gccl-bi-he-dao-xian-zuo-biao-ji-suan-biao-distance',
  [],
  localStorage,
)

const distanceSum = computed(() => {
  if (!distance.value.length)
    return 0

  return distance.value.reduce((x, y) => x + y)
})

const gaiZhengShu = computed(() => {
  const remain = 360 - zhuanZheJiaoSum.value
  return distance.value.map(val => (remain * val) / distanceSum.value)
})

const gaiZhengHouZhuanJiao = computed(() => {
  return points.value.map((point, index) => {
    return dms2Number(point.angle) + gaiZhengShu.value[index]
  })
})

const initDirectionAngle = useStorage<Dms>(
  'sdu-gccl-bi-he-dao-xian-zuo-biao-ji-suan-biao-init-direction-angle',
  {
    degree: 30,
    minute: 0,
    second: 0,
  },
  localStorage,
)

const initZuoBiao = useStorage<{ x: number; y: number }>(
  'sdu-gccl-bi-he-dao-xian-zuo-biao-ji-suan-biao-init-zuobiao',
  {
    x: 300000,
    y: 300000,
  },
  localStorage,
)

const directionAngle = computed(() => {
  const res: number[] = [dms2Number(initDirectionAngle.value)]
  for (let i = 0; i < points.value.length; ++i) {
    res.push(
      res[i] - gaiZhengHouZhuanJiao.value[(i + 1) % points.value.length] + 180,
    )
  }
  return res
})

const zuoBiaoZengLiang = computed(() => {
  return distance.value.map((val, index) => ({
    x: val * Math.cos((directionAngle.value[index] * Math.PI) / 180),
    y: val * Math.sin((directionAngle.value[index] * Math.PI) / 180),
  }))
})

const zuoBiaoZengLiangSum = computed(() => {
  if (zuoBiaoZengLiang.value.length) {
    return zuoBiaoZengLiang.value.reduce((prev, cur) => ({
      x: prev.x + cur.x,
      y: prev.y + cur.y,
    }))
  }
  else {
    return { x: 0, y: 0 }
  }
})

const gaiZhengHouZuoBiaoZengLiang = computed(() => {
  return distance.value.map((val, index) => ({
    x:
      zuoBiaoZengLiang.value[index].x
      + (zuoBiaoZengLiangSum.value.x * val) / distanceSum.value,
    y:
      zuoBiaoZengLiang.value[index].y
      + (zuoBiaoZengLiangSum.value.y / val) * distanceSum.value,
  }))
})

const zuoBiao = computed(() => {
  const res = [initZuoBiao.value]
  for (let i = 0; i < gaiZhengHouZuoBiaoZengLiang.value.length; ++i) {
    res.push({
      x: res[i].x + gaiZhengHouZuoBiaoZengLiang.value[i].x,
      y: res[i].y + gaiZhengHouZuoBiaoZengLiang.value[i].y,
    })
  }
  return res
})

function handleAdd() {
  points.value.push({
    uuid: uuid(),
    id: '',
    angle: {
      degree: Math.random() * 360,
      minute: Math.random() * 60,
      second: Math.random() * 60,
    },
  })
  distance.value.push(Math.random() * 10)
  nextTick(clearTableHover)
}

function handleDelete(index: number) {
  points.value.splice(index, 1)
  distance.value.splice(index, 1)
}

function clearTableHover() {
  table.value.querySelectorAll('tr').forEach((el: HTMLTableRowElement) => {
    el.classList.add('q-tr--no-hover')
  })
  table.value.querySelectorAll('td').forEach((el: HTMLElement) => {
    el.classList.add('q-td--no-hover')
  })
}

onMounted(() => {
  clearTableHover()
})
</script>

<template>
  <q-card overflow-x-auto>
    <div ref="table" relative>
      <q-markup-table separator="cell">
        <thead>
          <tr>
            <th
              v-for="th in [
                '点号',
                '转折角',
                '改正数',
                '改正后转折角',
                '方位角α',
                '边长',
              ]"
              :key="th"
              rowspan="2"
            >
              {{ th }}
            </th>
            <th colspan="2">
              坐标增量
            </th>
            <th colspan="2">
              改正后坐标增量
            </th>
            <th colspan="2">
              坐标
            </th>
            <th rowspan="2">
              操作
            </th>
          </tr>
          <tr>
            <th>Δx</th>
            <th>Δy</th>
            <th>Δx</th>
            <th>Δy</th>
            <th>x</th>
            <th>y</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(point, index) in points" :key="point.uuid">
            <tr h-10>
              <td rowspan="2" w="32">
                <q-input v-model="point.id" outlined dense />
              </td>
              <td rowspan="2" w="72">
                <div inline-block w="18">
                  <q-input
                    outlined
                    dense
                    :model-value="point.angle.degree"
                    @update:model-value="
                      (newValue:string) => {
                        point.angle.degree = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
                      }
                    "
                  />
                </div>
                °
                <div inline-block w="14">
                  <q-input
                    outlined
                    dense
                    :model-value="point.angle.minute"
                    @update:model-value="
                      (newValue:string) => {
                        point.angle.minute = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
                      }
                    "
                  />
                </div>
                ′
                <div inline-block w="14">
                  <q-input
                    outlined
                    dense
                    :model-value="point.angle.second"
                    @update:model-value="
                      (newValue:string) => {
                        point.angle.second = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
                      }
                    "
                  />
                </div>
                ″
              </td>
              <td rowspan="2">
                {{ prettifyDms(gaiZhengShu[index]) }}
              </td>
              <td rowspan="2">
                {{ prettifyDms(gaiZhengHouZhuanJiao[index]) }}
              </td>
              <template v-if="index === 0">
                <td v-for="_ in 6" :key="_" />
              </template>
              <template v-if="index === 0">
                <td rowspan="2" w="54">
                  <q-input
                    outlined
                    dense
                    :model-value="initZuoBiao.x"
                    @update:model-value="
                      (newValue:string) => {
                        initZuoBiao.x = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
                      }
                    "
                  />
                </td>
                <td rowspan="2" w="54">
                  <q-input
                    outlined
                    dense
                    :model-value="initZuoBiao.y"
                    @update:model-value="
                      (newValue:string) => {
                        initZuoBiao.y = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
                      }
                    "
                  />
                </td>
              </template>
              <template v-else>
                <td rowspan="2">
                  {{ zuoBiao[index].x.toFixed(5) }}
                </td>
                <td rowspan="2">
                  {{ zuoBiao[index].y.toFixed(5) }}
                </td>
              </template>
              <td rowspan="2">
                <q-btn
                  icon="delete"
                  color="negative"
                  round
                  @click="() => handleDelete(index)"
                />
              </td>
            </tr>
            <tr h-10>
              <td v-if="index === 0" rowspan="2" w="72">
                <div inline-block w="18">
                  <q-input
                    outlined
                    dense
                    :model-value="initDirectionAngle.degree"
                    @update:model-value="
                      (newValue:string) => {
                        initDirectionAngle.degree = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
                      }
                    "
                  />
                </div>
                °
                <div inline-block w="14">
                  <q-input
                    outlined
                    dense
                    :model-value="initDirectionAngle.minute"
                    @update:model-value="
                      (newValue:string) => {
                        initDirectionAngle.minute = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
                      }
                    "
                  />
                </div>
                ′
                <div inline-block w="14">
                  <q-input
                    outlined
                    dense
                    :model-value="initDirectionAngle.second"
                    @update:model-value="
                      (newValue:string) => {
                        initDirectionAngle.second = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
                      }
                    "
                  />
                </div>
                ″
              </td>
              <td v-else rowspan="2">
                {{ prettifyDms(directionAngle[index]) }}
              </td>
              <td rowspan="2" w="32">
                <q-input
                  outlined
                  dense
                  :model-value="distance[index]"
                  @update:model-value="
                    (newValue:string) => {
                      distance[index] = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
                    }
                  "
                />
              </td>
              <td rowspan="2">
                {{ zuoBiaoZengLiang[index].x.toFixed(5) }}
              </td>
              <td rowspan="2">
                {{ zuoBiaoZengLiang[index].y.toFixed(5) }}
              </td>
              <td rowspan="2">
                {{ gaiZhengHouZuoBiaoZengLiang[index].x.toFixed(5) }}
              </td>
              <td rowspan="2">
                {{ gaiZhengHouZuoBiaoZengLiang[index].y.toFixed(5) }}
              </td>
            </tr>
          </template>
          <tr h-10>
            <td rowspan="2">
              <q-btn round color="primary" icon="add" @click="handleAdd" />
            </td>
            <td v-for="_ in 3" :key="_" rowspan="2" />
          </tr>
          <tr h-10 />
          <tr h-10>
            <td rowspan="1">
              <span text-lg font-bold>Σ</span>
            </td>
            <td>{{ prettifyDms(zhuanZheJiaoSum) }}</td>
            <td>
              {{ prettifyDms(360 - zhuanZheJiaoSum) }}
            </td>
            <td>{{ prettifyDms(360) }}</td>
            <td />
            <td>{{ distanceSum.toFixed(5) }}</td>
            <td>{{ zuoBiaoZengLiangSum.x.toFixed(5) }}</td>
            <td>{{ zuoBiaoZengLiangSum.y.toFixed(5) }}</td>
          </tr>
          <tr h-10>
            <td colspan="13">
              fD =
              {{
                Math.sqrt(
                  Math.pow(zuoBiaoZengLiangSum.x, 2)
                    + Math.pow(zuoBiaoZengLiangSum.y, 2),
                ) / distanceSum
              }}
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </q-card>
</template>

<style scoped></style>
